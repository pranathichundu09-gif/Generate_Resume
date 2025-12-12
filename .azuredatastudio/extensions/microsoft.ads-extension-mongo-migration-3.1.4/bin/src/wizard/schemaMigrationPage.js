"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaMigrationPage = void 0;
const azdata = require("azdata");
const migrationWizardPage_1 = require("../models/migrationWizardPage");
const constants = require("../constants/strings");
const styles = require("../constants/styles");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const extension_1 = require("../extension");
const migrateSchemaNotification_1 = require("../contracts/migration/migrateSchemaNotification");
const migrateNonUniqueIndexNotification_1 = require("../contracts/migration/migrateNonUniqueIndexNotification");
const telemetry_1 = require("../telemetry");
class SchemaMigrationPage extends migrationWizardPage_1.MigrationWizardPage {
    _view;
    _rootContainer;
    _disposables = [];
    _schemaMigrationInProgressComponent;
    _schemaMigrationInfo;
    _schemaMigrationLoader;
    _schemaMigrationProgress;
    _progressContainer;
    _schemaMigrationResultTable;
    _isSchemaMigrationInProgress = true;
    constructor(wizard, migrationStateModel) {
        super(wizard, azdata.window.createWizardPage(constants.CREATE_SCHEMA_TITLE), migrationStateModel);
    }
    async registerContent(view) {
        this._view = view;
        this._schemaMigrationInProgressComponent = this._view.modelBuilder.flexContainer()
            .withLayout({ height: '100%', flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin-left': '30px' } })
            .component();
        this._schemaMigrationInProgressComponent.addItem(this.createSchemaMigrationProgress(), { flex: '0 0 auto' });
        this._schemaMigrationInProgressComponent.addItem(await this.createSchemaMigrationInfo(), { flex: '0 0 auto' });
        this._rootContainer = this._view.modelBuilder.flexContainer()
            .withLayout({ height: '100%', flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin-left': '30px' } }).component();
        this._disposables.push(this._view.onClosed(e => this._disposables.forEach(d => {
            // eslint-disable-next-line no-empty
            try {
                d.dispose();
            }
            catch {
            }
        })));
        await view.initializeModel(this._rootContainer);
    }
    async createSchemaMigrationInfo() {
        this._schemaMigrationInfo = this._view.modelBuilder.text()
            .withProps({
            value: constants.SCHEMA_MIGRATION_IN_PROGRESS_CONTENT(this.migrationStateModel.targetNamespacesForMigration.length, this.migrationStateModel.targetNamespacesForMigration.length),
            CSSStyles: {
                ...styles.BODY_CSS,
                'width': '660px'
            }
        }).component();
        return this._schemaMigrationInfo;
    }
    createSchemaMigrationProgress() {
        this._schemaMigrationLoader = this._view.modelBuilder.loadingComponent()
            .component();
        this._schemaMigrationProgress = this._view.modelBuilder.text()
            .withProps({
            value: "",
            ariaLabel: "",
            CSSStyles: {
                ...styles.PAGE_TITLE_CSS,
                'margin-right': '20px'
            }
        }).component();
        this._progressContainer = this._view.modelBuilder.flexContainer()
            .withLayout({
            height: '100%',
            flexFlow: 'row',
            alignItems: 'center'
        }).component();
        this._progressContainer.addItem(this._schemaMigrationProgress, { flex: '0 0 auto' });
        this._progressContainer.addItem(this._schemaMigrationLoader, { flex: '0 0 auto' });
        return this._progressContainer;
    }
    async onPageEnter(pageChangeInfo) {
        this.wizard.doneButton.hidden = true;
        this.wizard.doneButton.enabled = false;
        this._isSchemaMigrationInProgress = true;
        this._schemaMigrationInfo.updateProperties({
            value: constants.SCHEMA_MIGRATION_IN_PROGRESS_CONTENT(this.migrationStateModel.selectedSourceDatabasesForMapping.length, this.migrationStateModel.targetNamespacesForMigration.length)
        });
        this.wizard.registerNavigationValidator(async (pageChangeInfo) => {
            this.wizard.message = { text: '' };
            if (pageChangeInfo.newPage < pageChangeInfo.lastPage && this._isSchemaMigrationInProgress) {
                return false;
            }
            return true;
        });
        this._rootContainer.addItem(this._schemaMigrationInProgressComponent, { flex: '0 0 auto' });
        await this.startSchemaMigration();
    }
    async onPageLeave(pageChangeInfo) {
        this.wizard.registerNavigationValidator(pageChangeInfo => true);
        this.wizard.message = { text: '' };
        this._rootContainer.clearItems();
    }
    async startSchemaMigration() {
        try {
            const response = await this.migrationStateModel.startSchemaMigration();
            if (response.error) {
                this._rootContainer.clearItems();
                this.wizard.message = {
                    level: azdata.window.MessageLevel.Error,
                    text: response.error.errorMessage
                };
                this._isSchemaMigrationInProgress = false;
            }
            else if (response.body && !response.body.migrateSchemaStarted) {
                this._rootContainer.clearItems();
                this._rootContainer.addItem(this.createSchemaMigrationErrorList(response.body.schemaValidationErrors));
                this._isSchemaMigrationInProgress = false;
            }
            extension_1.backendService.onNotification(migrateSchemaNotification_1.migrateSchemaNotificationType, (params) => {
                if (params.body === null && params.error !== null) {
                    const schemaMigrationError = params.error;
                    this._rootContainer.clearItems();
                    this.wizard.message = {
                        level: azdata.window.MessageLevel.Error,
                        text: schemaMigrationError.errorMessage
                    };
                    this._isSchemaMigrationInProgress = false;
                    (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.SchemaMigrationFailed, { errorCode: schemaMigrationError.errorCode, errorType: schemaMigrationError.errorMessage });
                    return;
                }
                this._rootContainer.addItem(this.createSchemaMigrationResponseTable(params.body));
                this._schemaMigrationInfo.value = constants.INDEX_MIGRATION_IN_PROGRESS_CONTENT;
                this.startNonUniqueIndexMigration();
            });
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.SchemaMigrationStarted, this.migrationStateModel.getDefaultTelemetryProps(), {});
            //	await this.updateServiceContext(stateModel, this._serviceContextChangedEvent);
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.StartSchemaMigrationFailed, { error: e });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.SCHEMA_MIGRATION_START_UNEXPECTED_FAILURE
            };
        }
    }
    async startNonUniqueIndexMigration() {
        try {
            const response = await this.migrationStateModel.startNonUniqueIndexMigration();
            if (response.error) {
                this._isSchemaMigrationInProgress = false;
                this.wizard.message = {
                    level: azdata.window.MessageLevel.Error,
                    text: response.error.errorMessage
                };
            }
            else if (response.body && !response.body.migrateNonUniqueIndexesStarted) {
                this._rootContainer.clearItems();
                this.wizard.message = {
                    level: azdata.window.MessageLevel.Error,
                    text: "Error in non unique index migration"
                };
                this._isSchemaMigrationInProgress = false;
            }
            extension_1.backendService.onNotification(migrateNonUniqueIndexNotification_1.migrateNonUniqueIndexNotificationType, (params) => {
                if (params.body === null && params.error !== null) {
                    const indexMigrationError = params.error;
                    this._rootContainer.clearItems();
                    this.wizard.message = {
                        level: azdata.window.MessageLevel.Error,
                        text: params.error.errorMessage
                    };
                    this._isSchemaMigrationInProgress = false;
                    (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.SchemaMigrationFailed, { errorCode: indexMigrationError.errorCode, errorType: indexMigrationError.errorMessage });
                    return;
                }
                this._rootContainer.removeItem(this._schemaMigrationInProgressComponent);
                try {
                    this.updateNonUniqueIndexResult(params.body);
                }
                catch (e) {
                    (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.NonUniqueIndexMigrationFailed, { error: e });
                }
                this.wizard.message = {
                    level: azdata.window.MessageLevel.Information,
                    text: "Schema Migration successful"
                };
                this._isSchemaMigrationInProgress = false;
                this.wizard.doneButton.hidden = false;
                this.wizard.doneButton.enabled = true;
            });
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.StartNonUniqueIndexMigrationSucceeded, this.migrationStateModel.getDefaultTelemetryProps(), {});
            //	await this.updateServiceContext(stateModel, this._serviceContextChangedEvent);
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.StartNonUniqueIndexMigrationFailed, { error: e });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.INDEX_MIGRATION_START_UNEXPECTED_FAILURE
            };
        }
    }
    updateNonUniqueIndexResult(nonUniqueIndexMigrationResult) {
        const migrationResultTableValues = [];
        let numOfFailedIndexes = 0;
        this._schemaMigrationResultTable.dataValues?.forEach((row) => {
            const targetCollectionNamespace = row[0].value.toString().split("."); // index 0 is namespace
            let failedIndexes = row[3].value; // index 3 is failed indexes
            nonUniqueIndexMigrationResult.collectionMigrationResults.forEach((collectionMigrationResult) => {
                if (targetCollectionNamespace[0] === collectionMigrationResult.targetDatabaseName &&
                    targetCollectionNamespace[1] === collectionMigrationResult.targetCollectionName &&
                    collectionMigrationResult.failedIndexes && collectionMigrationResult.failedIndexes.length > 0) {
                    failedIndexes = row[2].value ? row[2].value.toString() + "," + collectionMigrationResult.failedIndexes.join(",") :
                        collectionMigrationResult.failedIndexes.join(",");
                }
                numOfFailedIndexes += collectionMigrationResult.failedIndexes.length;
            });
            migrationResultTableValues.push([
                {
                    value: row[0].value
                },
                {
                    value: row[1].value
                },
                {
                    value: failedIndexes
                }
            ]);
        });
        const telemetryMeasures = {};
        telemetryMeasures[telemetry_1.TelemetryMeasureNames.FailedIndexMigrationCount] = numOfFailedIndexes;
        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.IndexMigrationInfo, this.migrationStateModel.getDefaultTelemetryProps(), telemetryMeasures);
        this._schemaMigrationResultTable.setDataValues(migrationResultTableValues);
    }
    createSchemaMigrationResponseTable(schemaMigrationResult) {
        this._schemaMigrationResultTable = this._view.modelBuilder
            .declarativeTable()
            .withProps({
            width: 750,
            CSSStyles: {
                "table-layout": "fixed",
                "border": "none",
                cursor: "pointer",
            },
            columns: [
                {
                    displayName: "Name",
                    valueType: azdata.DeclarativeDataType.string,
                    width: 250,
                    isReadOnly: true,
                    headerCssStyles: styles.headerLeft,
                    rowCssStyles: styles.styleLeft
                },
                {
                    displayName: "Status",
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    headerCssStyles: styles.headerLeft,
                    rowCssStyles: styles.styleLeft
                },
                {
                    displayName: "Response message",
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    headerCssStyles: styles.headerLeft,
                    rowCssStyles: styles.styleLeft
                },
                {
                    displayName: "Failed Indexes",
                    valueType: azdata.DeclarativeDataType.string,
                    width: 250,
                    isReadOnly: true,
                    headerCssStyles: styles.headerLeft,
                    rowCssStyles: styles.styleLeft
                },
            ],
        })
            .component();
        const dataValues = [];
        let failedCollectionMigrationCount = 0;
        schemaMigrationResult.collectionMigrationResults.forEach((collectionMigrationResult) => {
            dataValues.push([
                {
                    value: collectionMigrationResult.targetDatabaseName + "." + collectionMigrationResult.targetCollectionName
                },
                {
                    value: collectionMigrationResult.status
                },
                {
                    value: collectionMigrationResult.errorMsg
                },
                {
                    value: (collectionMigrationResult.failedIndexes && collectionMigrationResult.failedIndexes.length > 0) ?
                        collectionMigrationResult.failedIndexes.join(",") : ""
                }
            ]);
            if (collectionMigrationResult.status !== migrateSchemaNotification_1.ResponseStatus.Success) {
                failedCollectionMigrationCount += 1;
            }
        });
        this._schemaMigrationResultTable.setDataValues(dataValues);
        const telemetryMeasures = {};
        telemetryMeasures[telemetry_1.TelemetryMeasureNames.FailedCollectionMigrationCount] = failedCollectionMigrationCount;
        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SchemaMigrationPage, telemetry_1.TelemetryAction.SchemaMigrationSucceeded, this.migrationStateModel.getDefaultTelemetryProps(), telemetryMeasures);
        return this._schemaMigrationResultTable;
    }
    createSchemaMigrationErrorList(errorList) {
        const errorListOptions = errorList.map((v, index) => {
            return {
                alwaysShowTabs: true,
                id: index.toString(),
                label: v.errorMessage,
                icon: iconPathHelper_1.IconPathHelper.error
            };
        });
        const errorListView = this._view.modelBuilder.listView().withProps({
            options: errorListOptions
        }).component();
        return errorListView;
    }
}
exports.SchemaMigrationPage = SchemaMigrationPage;
//# sourceMappingURL=schemaMigrationPage.js.map