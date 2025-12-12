"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardController = exports.WIZARD_INPUT_COMPONENT_WIDTH = void 0;
// +-----------------------------------------------------------------------------------
//  <copyright file=wizardController.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file builds and activates the wizard.
// ------------------------------------------------------------------------------------
const azdata = require("azdata");
const vscode = require("vscode");
const stateMachine_1 = require("../models/stateMachine");
const constants = require("../constants/strings");
const telemetry_1 = require("../telemetry");
const assessmentParameterPage_1 = require("./assessmentParameterPage");
const viewAssessmentResultsPage_1 = require("./viewAssessmentResultsPage");
const migrationMapping_1 = require("./migrationMapping");
const targetSelectionPage_1 = require("./targetSelectionPage");
const targetMigrationServicePage_1 = require("./targetMigrationServicePage");
const summaryPage_1 = require("./summaryPage");
const schemaMigrationPage_1 = require("./schemaMigrationPage");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
const utils_1 = require("../common/utils");
const common_1 = require("../contracts/common");
const confirmSettings_1 = require("../dialogs/confirmSettings");
exports.WIZARD_INPUT_COMPONENT_WIDTH = '600px';
class WizardController {
    _extensionContext;
    _model;
    _serviceContextChangedEvent;
    _view;
    _statusBarContainer;
    _hostName;
    _wizardObject;
    _disposables = [];
    _connectionProfile;
    constructor(_extensionContext, _model, _serviceContextChangedEvent, _view, _statusBarContainer) {
        this._extensionContext = _extensionContext;
        this._model = _model;
        this._serviceContextChangedEvent = _serviceContextChangedEvent;
        this._view = _view;
        this._statusBarContainer = _statusBarContainer;
    }
    async openWizard() {
        const api = (await vscode.extensions.getExtension("Microsoft.net-6-runtime" /* netRuntime.extension.name */)?.activate());
        if (api) {
            this._extensionContext.subscriptions.push(this._model);
            await this.createWizard(this._model);
        }
    }
    async createWizard(stateModel) {
        this._hostName = (await stateModel.getSourceConnectionProfile()).serverName;
        this._connectionProfile = await stateModel.getSourceConnectionProfile();
        if (this._hostName) {
            this._wizardObject = this._hostName.includes("amazonaws.com")
                ? azdata.window.createWizard(constants.WIZARD_TITLE(this._hostName, "AWS DocumentDB"), 'MigrationWizard', 'wide')
                : azdata.window.createWizard(constants.WIZARD_TITLE(this._hostName, "MongoDB"), 'MigrationWizard', 'wide');
        }
        this._wizardObject.generateScriptButton.enabled = false;
        this._wizardObject.generateScriptButton.hidden = true;
        this._wizardObject.nextButton.enabled = false;
        this._wizardObject.nextButton.position = 'left';
        this._wizardObject.doneButton.enabled = false;
        this._wizardObject.doneButton.hidden = true;
        this._wizardObject.doneButton.label = constants.START_MIGRATION_TEXT;
        this._wizardObject.doneButton.position = 'left';
        this._wizardObject.backButton.position = 'left';
        this._wizardObject.cancelButton.position = 'left';
        const assessmentParameterPage = new assessmentParameterPage_1.AssessmentParameterPage(this._wizardObject, stateModel, this._connectionProfile);
        const viewAssessmentResultsPage = new viewAssessmentResultsPage_1.ViewAssessmentResultsPage(this._wizardObject, stateModel, this._connectionProfile);
        const migrationMappingPage = new migrationMapping_1.MigrationMappingPage(this._wizardObject, stateModel);
        const targetSelectionPage = new targetSelectionPage_1.TargetSelectionPage(this._wizardObject, stateModel);
        const targetDataMigrationServiceSelectionPage = new targetMigrationServicePage_1.TargetMigrationServicePage(this._wizardObject, stateModel);
        const summaryPage = new summaryPage_1.SummaryPage(this._wizardObject, stateModel);
        const schemaMigrationPage = new schemaMigrationPage_1.SchemaMigrationPage(this._wizardObject, stateModel);
        const pages = [
            assessmentParameterPage,
            viewAssessmentResultsPage,
            targetSelectionPage,
            migrationMappingPage,
            targetDataMigrationServiceSelectionPage,
            summaryPage,
            schemaMigrationPage
        ];
        this._wizardObject.pages = pages.map(p => p.getwizardPage());
        const wizardSetupPromises = [];
        wizardSetupPromises.push(...pages.map(p => p.registerWizardContent()));
        wizardSetupPromises.push(this._wizardObject.open());
        this._model.extensionContext.subscriptions.push(this._wizardObject.onPageChanged(async (pageChangeInfo) => {
            const newPage = pageChangeInfo.newPage;
            const lastPage = pageChangeInfo.lastPage;
            this.sendPageButtonClickEvent(pageChangeInfo).catch(e => (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MigrationWizardController, 'AssessmentWizardLaunch', { errorCode: 'Unknown Exception', errorType: '' }));
            await pages[lastPage]?.onPageLeave(pageChangeInfo);
            await pages[newPage]?.onPageEnter(pageChangeInfo);
        }));
        this._wizardObject.registerNavigationValidator(async (validator) => true);
        await Promise.all(wizardSetupPromises);
        this._disposables.push(this._wizardObject.doneButton.onClick(async (e) => {
            const telemetryProps = stateModel.getDefaultTelemetryProps();
            telemetryProps[telemetry_1.TelemetryPropNames.MigrationMode] = stateMachine_1.MigrationMode[stateModel.dataMigrationMode];
            // target details
            telemetryProps[telemetry_1.TelemetryPropNames.TargetAccount] = (0, utils_1.parseMongoConnectionString)(stateModel.targetConnectionString)?.options.server;
            telemetryProps[telemetry_1.TelemetryPropNames.TargetResourceGroup] = stateModel.resourceGroup.name;
            telemetryProps[telemetry_1.TelemetryPropNames.TargetSubscription] = stateModel.targetSubscription.id;
            // migration service details
            telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceSubscription] = stateModel.dataMigrationServiceSubscription.id;
            telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceResourceGroup] = stateModel.dataMigrationServiceResourceGroup.name;
            telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = (0, utils_1.getServiceNameFromAzureResourceId)(stateModel.dataMigrationService?.id ?? "");
            if (stateModel.targetOffering === common_1.EnumTargetOffering.CosmosDBMongovCore) {
                const confirmSettings = new confirmSettings_1.ConfirmSettings(this._model);
                const confirmSettingsDialog = await confirmSettings.openDialog();
                this._disposables.push(confirmSettingsDialog.okButton.onClick(async (e) => {
                    try {
                        await stateModel.startDataMigration(telemetryProps);
                        await this.updateServiceContext(stateModel, this._serviceContextChangedEvent);
                        vscode.window.showInformationMessage("Data Migration started successfully");
                    }
                    catch (e) {
                        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TriggerDataMigrationFailed, telemetryProps, {});
                        (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MigrationWizardController, telemetry_1.TelemetryAction.TriggerDataMigrationFailed, { error: e });
                        const statusBar = (0, utils_1.createStatusBar)(this._view, this._disposables, this._extensionContext, this._statusBarContainer);
                        await statusBar.showError(constants.WIZARD_START_MIGRATION_ERROR_TITLE, constants.WIZARD_START_MIGRATION_ERROR_LABEL, e.message);
                    }
                }));
            }
        }));
        this._disposables.push(this._wizardObject.cancelButton.onClick(e => {
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationWizardController, telemetry_1.TelemetryAction.CancelMigrationWizard, {}, {});
        }));
        this._disposables.push(this._wizardObject.backButton.onClick(e => {
            this._wizardObject.cancelButton.hidden = false;
        }));
    }
    async updateServiceContext(stateModel, serviceContextChangedEvent) {
        return await migrationLocalStorage_1.MigrationLocalStorage.saveMigrationServiceContext({
            azureAccount: stateModel.azureAccount,
            tenant: stateModel.azureTenant,
            subscription: stateModel.dataMigrationServiceSubscription,
            resourceGroup: stateModel.dataMigrationServiceResourceGroup,
            migrationService: stateModel.dataMigrationService,
        }, serviceContextChangedEvent);
    }
    async sendPageButtonClickEvent(pageChangeInfo) {
        const buttonPressed = pageChangeInfo.newPage > pageChangeInfo.lastPage ? telemetry_1.TelemetryAction.WizardNext : telemetry_1.TelemetryAction.WizardBack;
        const pageTitle = this._wizardObject.pages[pageChangeInfo.lastPage]?.title;
        console.log("Page navigation " + buttonPressed + " " + pageTitle);
    }
}
exports.WizardController = WizardController;
//# sourceMappingURL=wizardController.js.map