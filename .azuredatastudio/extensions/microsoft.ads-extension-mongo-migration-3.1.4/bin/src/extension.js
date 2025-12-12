"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=extension.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file builds and activates the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.migrateNonUniqueIndex = exports.getExistingSchema = exports.migrateSchema = exports.getCombinedAssessmentReport = exports.getAssessmentReport = exports.cancelAssessment = exports.deleteAssessment = exports.startAssessment = exports.checkPrerequisite = exports.getInstanceSummary = exports.getAssessmentDetails = exports.getAssessments = exports.getAllAssessments = exports.activate = exports.backendService = exports.tabMap = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// The module 'azdata' contains the Azure Data Studio extensibility API
// This is a complementary set of APIs that add SQL / Data-specific functionality to the app
// Import the module and reference it with the alias azdata in your code below
const azdata = require("azdata");
const path = require("path");
const loc = require("./constants/strings");
const constants = require("./constants");
const dataprotocol_client_1 = require("dataprotocol-client");
const vscode_languageclient_1 = require("vscode-languageclient");
const logger_1 = require("./logger");
const localizationFile_1 = require("./localizationFile");
const assessment_extension_1 = require("./assessment-extension");
const mongoMigrationDashboard_1 = require("./tabs/mongoMigrationDashboard");
const migrationsTab_1 = require("./tabs/migrationsTab");
const iconPathHelper_1 = require("./constants/iconPathHelper");
const client_error_handler_1 = require("./client-error-handler");
const extensionInfo_1 = require("./extensionInfo");
const utils_1 = require("./common/utils");
const help_1 = require("./dialogs/help");
const feedback_1 = require("./dialogs/feedback");
const telemetryNotification_1 = require("./contracts/telemetryNotification");
const telemetry_1 = require("./telemetry");
const config_1 = require("./config/config");
const migrationLocalStorage_1 = require("./models/migrationLocalStorage");
const DashboardStatusBar_1 = require("./dialogs/DashboardStatusBar");
const schemaMigrationService_1 = require("./services/schemaMigrationService");
const allAssessments_1 = require("./tabs/allAssessments");
const tabName = 'mongo-dashboard';
let isActivated = false;
exports.tabMap = new Map();
class MongoMigration {
    context;
    toDispose = [];
    _config;
    _statusBar;
    _assessmentsTab;
    _migrationDetailsPerMigrationService = new Map();
    constructor(context) {
        this.context = context;
        iconPathHelper_1.IconPathHelper.setExtensionContext(context);
        this._config = new config_1.Config();
    }
    async start() {
        //empty
    }
    async registerModelViewProvider() {
        azdata.ui.registerModelViewProvider(tabName, async (view) => {
            const statusBarContainer = view.modelBuilder.flexContainer()
                .withLayout({ flexFlow: 'column' })
                .component();
            const serviceContextChangedEvent = new vscode.EventEmitter();
            this.context.subscriptions.push(serviceContextChangedEvent);
            const statusInfoBox = this.createStatusInfoBox(view);
            migrationLocalStorage_1.MigrationLocalStorage.setExtensionContext(this.context);
            this._assessmentsTab = new allAssessments_1.AllAssessmentsTab(this.context, serviceContextChangedEvent);
            const allAssessmentsTab = await this._assessmentsTab.Create(view);
            const migrationsTab = new migrationsTab_1.MigrationsTab(this.context, serviceContextChangedEvent, this._migrationDetailsPerMigrationService);
            const mainTab = new mongoMigrationDashboard_1.DashboardTab(this.context, serviceContextChangedEvent, this._migrationDetailsPerMigrationService);
            const allMigrationsTab = await migrationsTab.Create(view, migrationsTab, mainTab, this._statusBar, statusBarContainer);
            const dashboardTab = await mainTab.Create(view, migrationsTab, mainTab, this._statusBar, statusBarContainer);
            this.toDispose.push(mainTab);
            this.toDispose.push(migrationsTab);
            this.toDispose.push(this._assessmentsTab);
            const tabbedPanel = view.modelBuilder.tabbedPanel()
                .withTabs([dashboardTab, allMigrationsTab, allAssessmentsTab])
                .withLayout({ showIcon: true, alwaysShowTabs: true })
                .component();
            exports.tabMap.set(mainTab, tabbedPanel);
            const disposables = [];
            disposables.push(tabbedPanel.onTabChanged(async (tabId) => {
                await this._statusBar.clearError();
                mainTab.onTabChanged(tabId === mongoMigrationDashboard_1.DashboardTabId);
                migrationsTab.onTabChanged(tabId === migrationsTab_1.MigrationsTabId);
            }));
            const flexContainer = view.modelBuilder.flexContainer()
                .withLayout({ flexFlow: 'column' })
                .withItems([statusBarContainer, statusInfoBox, tabbedPanel])
                .component();
            await view.initializeModel(flexContainer);
        });
    }
    getAllAssessments() {
        return this._assessmentsTab.getAllAssessments();
    }
    async registerCommands() {
        const commandDisposables = [
            azdata.tasks.registerTask('mongo.sendfeedback', async () => {
                const feedback = new feedback_1.Feedback();
                feedback.openDialog();
            }),
            azdata.tasks.registerTask('mongo.settings', async () => {
                // Settings removed
            }),
            azdata.tasks.registerTask('mongo.support', async () => {
                const helpAndSupportDialog = new help_1.HelpAndSupportDialog();
                helpAndSupportDialog.openDialog();
            }),
            azdata.tasks.registerTask('mongo.migration.progress', async () => {
                (0, utils_1.openCalloutDialog)('', '', loc.ASSESSMENT_PROGRESS);
            })
        ];
        this.context.subscriptions.push(...commandDisposables);
    }
    async loadConfig() {
        await this._config.load();
    }
    createStatusInfoBox(view) {
        const statusInfoBox = view.modelBuilder.infoBox()
            .withProps({
            style: 'error',
            text: '',
            clickableButtonAriaLabel: loc.VIEW_ERROR_DETAILS,
            announceText: true,
            isClickable: true,
            display: 'none',
            CSSStyles: { 'font-size': '14px', 'display': 'none', },
        }).component();
        this._statusBar = new DashboardStatusBar_1.DashboardStatusBar(this.context, statusInfoBox);
        this.toDispose.push(statusInfoBox.onDidClick(async (e) => await this._statusBar.openErrorDialog()));
        return statusInfoBox;
    }
}
let mongoMigration;
let extension;
let schemaMigrationService;
/**
 * ADS calls this function to activate our extension.
 * See package.json: activationEvents to see when that might
 * happen. Extensions are lazy loaded.
 *
 * See also: https://code.visualstudio.com/docs/extensionAPI/activation-events
 *
 */
async function activate(context) {
    if (isActivated) {
        return;
    }
    const netRuntimeService = vscode.extensions.getExtension("Microsoft.net-6-runtime" /* netRuntime.extension.name */)?.exports;
    if (!netRuntimeService) {
        logger_1.logger.logError(".NET 6 Runtime extension is missing");
        throw new Error((0, localizationFile_1.localize)("extension.missingDependency.netcore6runtime", ".NET 6 Runtime extension is not found. Please install the extension and try again."));
    }
    extension = await createExtension(netRuntimeService, context);
    mongoMigration = new MongoMigration(context);
    await mongoMigration.registerCommands();
    await mongoMigration.registerModelViewProvider();
    await mongoMigration.loadConfig();
    isActivated = true;
}
exports.activate = activate;
async function createExtension(netRuntimeService, context) {
    exports.backendService = await launchServiceClient(await netRuntimeService.getDotnetPath(), path.join(__dirname, "../service/MongoAssessmentExtensionService.dll"), context);
    try {
        exports.backendService.onNotification(telemetryNotification_1.telemetryNotificationType, (params) => {
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.TelemetryNotification, telemetry_1.TelemetryAction.LogAssessments, params, {});
        });
    }
    catch (e) {
        logger_1.logger.logException("Could not send telemetry event." + e);
    }
    schemaMigrationService = new schemaMigrationService_1.SchemaMigrationService(exports.backendService);
    return new assessment_extension_1.AssessmentExtension(exports.backendService, context);
}
/**
 * Launches the JSON-RPC backend for this extension.
 *
 * @param dotnetPath Path to the 'dotnet' executable.
 * @param backendPath Path to the app that acts as a backend service for the extension.
 * @param context The VSCode extension context.
 */
async function launchServiceClient(dotnetPath, backendPath, context) {
    const backendService = new dataprotocol_client_1.SqlOpsDataClient(constants.serviceName, getServerOptions(dotnetPath, backendPath), getClientOptions());
    // Register backend service for disposal when extension is deactivated
    context.subscriptions.push(backendService.start());
    // Log message once backend service starts
    await backendService
        .onReady()
        .then(() => logger_1.logger.logInfo(`Extension '${constants.extensionName}' has been activated`));
    return backendService;
}
/**
 * Gets options for the JSON-RPC backend.
 *
 * @param dotnetPath Path to the 'dotnet' executable.
 * @param backendPath Path to the app that acts as a backend service for the extension.
 */
function getServerOptions(dotnetPath, backendPath) {
    return {
        command: dotnetPath,
        args: ["exec", backendPath, extensionInfo_1.ExtensionInfo.getInstance().getExtensionVersion(), extensionInfo_1.ExtensionInfo.getInstance().getSessionId()],
        transport: vscode_languageclient_1.TransportKind.stdio
    };
}
/**
* Gets options for the JSON-RPC frontend.
*/
function getClientOptions() {
    return {
        providerId: constants.PROVIDER_ID,
        outputChannel: logger_1.logger.outputChannel,
        errorHandler: new client_error_handler_1.ClientErrorHandler(constants.serviceName, logger_1.logger),
        features: []
    };
}
function getAllAssessments() {
    return mongoMigration.getAllAssessments();
}
exports.getAllAssessments = getAllAssessments;
async function getAssessments(connectionProfile) {
    const assessmentsList = await extension.getAllAssessments(connectionProfile);
    return assessmentsList;
}
exports.getAssessments = getAssessments;
async function getAssessmentDetails(assessmentId, assessmentName, connectionProfile) {
    const response = await extension.getAssessmentDetails(assessmentId, assessmentName, connectionProfile);
    return response;
}
exports.getAssessmentDetails = getAssessmentDetails;
async function getInstanceSummary(assessmentId, assessmentName, connectionProfile) {
    const response = await extension.getInstanceSummary(assessmentId, assessmentName, connectionProfile);
    return response;
}
exports.getInstanceSummary = getInstanceSummary;
async function checkPrerequisite(connectionProfile, assessmentId) {
    return await extension.checkPrerequisite(connectionProfile, assessmentId);
}
exports.checkPrerequisite = checkPrerequisite;
async function startAssessment(startAssessmentParameters, connectionProfile, migrationsTab, dashboardTab) {
    return await extension.startAssessment(startAssessmentParameters, connectionProfile, migrationsTab, dashboardTab);
}
exports.startAssessment = startAssessment;
async function deleteAssessment(connectionProfile, assessmentId) {
    await extension.deleteAssessment(assessmentId, connectionProfile);
}
exports.deleteAssessment = deleteAssessment;
async function cancelAssessment(assessmentId) {
    await extension.cancelAssessment(assessmentId);
}
exports.cancelAssessment = cancelAssessment;
async function getAssessmentReport(assessmentId, assessmentName, assessmentType, connectionProfile) {
    const response = await extension.getAssessmentReport(assessmentId, assessmentName, assessmentType, connectionProfile);
    return response;
}
exports.getAssessmentReport = getAssessmentReport;
async function getCombinedAssessmentReport(assessmentId, assessmentName, connectionProfile) {
    const response = await extension.getCombinedAssessmentReport(assessmentId, assessmentName, connectionProfile);
    return response;
}
exports.getCombinedAssessmentReport = getCombinedAssessmentReport;
async function migrateSchema(migrateSchemaMappingRequest) {
    const response = await schemaMigrationService.migrateSchema(migrateSchemaMappingRequest);
    return response;
}
exports.migrateSchema = migrateSchema;
async function getExistingSchema(mongoConnectionInformation, databases) {
    const response = await schemaMigrationService.getExistingSchema(mongoConnectionInformation, databases);
    return response;
}
exports.getExistingSchema = getExistingSchema;
async function migrateNonUniqueIndex(migrateNonUniqueIndex) {
    const response = await schemaMigrationService.migrateNonUniqueIndex(migrateNonUniqueIndex);
    return response;
}
exports.migrateNonUniqueIndex = migrateNonUniqueIndex;
// this method is called when your extension is deactivated
function deactivate() {
    logger_1.logger.logInfo(`Extension '${constants.extensionName}' has been deactivated`);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map