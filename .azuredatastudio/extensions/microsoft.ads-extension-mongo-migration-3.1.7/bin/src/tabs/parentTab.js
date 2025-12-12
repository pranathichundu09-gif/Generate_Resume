"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=parentTab.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the parent tab class for dashboard and assessments tabs.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentTab = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
const stateMachine_1 = require("../models/stateMachine");
const wizardController_1 = require("../wizard/wizardController");
const strings_1 = require("../constants/strings");
const telemetry_1 = require("../telemetry");
const utils_1 = require("../common/utils");
class ParentTab {
    title;
    content;
    id;
    _context;
    _stateModel;
    _serviceContextChangedEvent;
    _migrationDetailsPerMigrationService;
    _view;
    extensionContext;
    statusBar;
    _statusBarContainer;
    constructor(extensionContext, serviceContextChangedEvent, title, id, migrationDetailsPerMigrationService = new Map()) {
        this.title = title;
        this.id = id;
        this._context = extensionContext;
        this.extensionContext = extensionContext;
        this._serviceContextChangedEvent = serviceContextChangedEvent;
        this._migrationDetailsPerMigrationService = migrationDetailsPerMigrationService;
    }
    dispose() {
        //empty
    }
    async Create(view, migrationsTab, dashboardTab, statusBar, statusBarContainer) {
        if (statusBar !== undefined) {
            this.statusBar = statusBar;
        }
        if (statusBarContainer !== undefined) {
            this._statusBarContainer = statusBarContainer;
        }
        this._view = view;
        this.content = await this.tabContent(view, migrationsTab, dashboardTab);
        return this;
    }
    async logMigrationDetailsAsync(migrations) {
        try {
            if (migrations && migrations.length > 0) {
                for (const migration of migrations) {
                    if (migration !== undefined && migration.properties !== undefined) {
                        const migrationService = migration.properties.migrationService;
                        const migrationServiceDetails = this._migrationDetailsPerMigrationService.get(migrationService) ?? new Map();
                        const curMigrationDetails = {};
                        curMigrationDetails[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = (0, utils_1.getServiceNameFromAzureResourceId)(migrationService);
                        curMigrationDetails[telemetry_1.TelemetryPropNames.MigrationOperationId] = migration.properties.migrationOperationId;
                        curMigrationDetails[telemetry_1.TelemetryPropNames.MigrationName] = migration.name;
                        curMigrationDetails[telemetry_1.TelemetryPropNames.MigrationKind] = migration.properties.kind;
                        curMigrationDetails[telemetry_1.TelemetryPropNames.ProvisioningState] = migration.properties.provisioningState;
                        curMigrationDetails[telemetry_1.TelemetryPropNames.MigrationStatus] = migration.properties.migrationStatus;
                        // we are sanitizing the date strings to ensure that they don't contain any illegal characters
                        // which would get the fields redacted from the telemetry row
                        curMigrationDetails[telemetry_1.TelemetryPropNames.StartedOn] = (0, utils_1.sanitizeDateString)((0, utils_1.formatDate)(migration.properties.startedOn));
                        curMigrationDetails[telemetry_1.TelemetryPropNames.EndedOn] = (0, utils_1.sanitizeDateString)((0, utils_1.formatDate)(migration.properties.endedOn));
                        if (migration.properties.collectionList !== undefined && migration.properties.collectionList.length > 0) {
                            curMigrationDetails[telemetry_1.TelemetryPropNames.TotalCollectionCount] = migration.properties.collectionList.length.toString();
                            let initialSourceDocCount = 0;
                            let bulkCopyProcessedDocCount = 0;
                            let cdcProcessedDocCount = 0;
                            let cutoverProcessedDocCount = 0;
                            migration.properties.collectionList.forEach(c => {
                                if (c && c.migrationProgressDetails) {
                                    if (migration.properties.mode !== constants.ONLINE || c.migrationRunFsmState === 'MonitorBulkCopyPipelinesRun') {
                                        if (c.migrationProgressDetails.sourceDocumentCount) {
                                            initialSourceDocCount += c.migrationProgressDetails.sourceDocumentCount;
                                        }
                                        if (c.migrationProgressDetails.processedDocumentCount) {
                                            bulkCopyProcessedDocCount += c.migrationProgressDetails.processedDocumentCount;
                                        }
                                    }
                                    else if (c.migrationRunFsmState === 'MonitorCdcPipelinesRun') {
                                        if (c.migrationProgressDetails.processedDocumentCount) {
                                            cdcProcessedDocCount += c.migrationProgressDetails.processedDocumentCount;
                                        }
                                    }
                                    else if (c.migrationRunFsmState === 'MonitorCutoverPipelinesRun') {
                                        if (c.migrationProgressDetails.processedDocumentCount) {
                                            cutoverProcessedDocCount += c.migrationProgressDetails.processedDocumentCount;
                                        }
                                    }
                                }
                            });
                            curMigrationDetails[telemetry_1.TelemetryPropNames.IntialSourceDocCount] = initialSourceDocCount.toString();
                            curMigrationDetails[telemetry_1.TelemetryPropNames.BulkCopyProcessedDocCount] = bulkCopyProcessedDocCount.toString();
                            curMigrationDetails[telemetry_1.TelemetryPropNames.CdcProcessedDocCount] = cdcProcessedDocCount.toString();
                            curMigrationDetails[telemetry_1.TelemetryPropNames.CutoverProcessedDocCount] = cutoverProcessedDocCount.toString();
                        }
                        const migrationName = migration.name;
                        const prevMigrationProvisioningState = migrationServiceDetails.get(migrationName)?.provisioningState ?? "";
                        const prevMigrationStatus = migrationServiceDetails.get(migrationName)?.migrationStatus ?? "";
                        if ((prevMigrationProvisioningState !== curMigrationDetails.provisioningState && curMigrationDetails.provisioningState === strings_1.MigrationState.Failed)
                            || (prevMigrationStatus !== curMigrationDetails.migrationStatus
                                && (curMigrationDetails.migrationStatus === strings_1.MigrationState.Succeeded
                                    || curMigrationDetails.migrationStatus === strings_1.MigrationState.Canceled
                                    || curMigrationDetails.migrationStatus === strings_1.MigrationState.Failed))) {
                            await (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MongoMigrationDashboard, telemetry_1.TelemetryAction.LogMigrations, curMigrationDetails, {});
                        }
                        migrationServiceDetails.set(migrationName, curMigrationDetails);
                        this._migrationDetailsPerMigrationService.set(migrationService, migrationServiceDetails);
                    }
                }
            }
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MongoMigrationDashboard, telemetry_1.TelemetryAction.LogMigrationDetailsFailed, { error: e });
        }
    }
    async launchMigrationWizard() {
        const activeConnection = await azdata.connection.getCurrentConnection();
        const connectionId = activeConnection.connectionId;
        this._stateModel = new stateMachine_1.MigrationStateModel(this._context, connectionId);
        this._context.subscriptions.push(this._stateModel);
        this._stateModel.sourceConnectionString = await this._stateModel.getSourceConnectionString();
        const wizardController = new wizardController_1.WizardController(this._context, this._stateModel, this._serviceContextChangedEvent, this._view, this._statusBarContainer);
        await wizardController.openWizard();
    }
}
exports.ParentTab = ParentTab;
//# sourceMappingURL=parentTab.js.map