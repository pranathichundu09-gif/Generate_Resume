"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationMappingPage = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
const styles = require("../constants/styles");
const migrationWizardPage_1 = require("../models/migrationWizardPage");
const stateMachine_1 = require("../models/stateMachine");
const styles_1 = require("../constants/styles");
const extension_1 = require("../extension");
const utils_1 = require("../common/utils");
const common_1 = require("../contracts/common");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const getExistingSchema_1 = require("../contracts/migration/getExistingSchema");
const telemetry_1 = require("../telemetry");
class MigrationMappingPage extends migrationWizardPage_1.MigrationWizardPage {
    _view;
    _container;
    _migrationMappingTable;
    _schemaLoadingInProgressContainer;
    _isSchemaLoaded = false;
    constructor(wizard, migrationStateModel) {
        super(wizard, azdata.window.createWizardPage(constants.MIGRATION_MAPPING_TITLE), migrationStateModel);
    }
    async registerContent(view) {
        this._view = view;
        this._container = this._view.modelBuilder.flexContainer()
            .withLayout({ height: '100%', flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin-left': '30px' } })
            .component();
        this._schemaLoadingInProgressContainer = this._view.modelBuilder.flexContainer()
            .withLayout({ height: '100%', flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin-left': '30px' } })
            .component();
        this._schemaLoadingInProgressContainer.addItem(this.createSchemaLoadingProgress(), { flex: '0 0 auto' });
        this._schemaLoadingInProgressContainer.addItem(this.createSchemaLoadingInfo(), { flex: '0 0 auto' });
        this._container.addItem(this._schemaLoadingInProgressContainer), { flex: '0 0 auto' };
        this.createMigrationMappingTable();
        await this._view.initializeModel(this._container);
    }
    createMigrationMappingTable() {
        this._migrationMappingTable = this._view.modelBuilder
            .declarativeTable()
            .withProps({
            ariaLabel: constants.DATABASES_TABLE_TILE,
            width: 750,
            CSSStyles: {
                "table-layout": "fixed",
                "border": "none",
                cursor: "pointer",
            },
            columns: [
                {
                    displayName: "",
                    valueType: azdata.DeclarativeDataType.component,
                    width: 20,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                    rowCssStyles: styles_1.styleLeft
                },
                {
                    displayName: constants.MIGRATION_SOURCE_NAME,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 250,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                    rowCssStyles: {
                        border: "none",
                        'font-size': '13px',
                        'line-height': '18px',
                        'margin': '2px 15px 2px 0',
                        'overflow': 'hidden',
                        'text-overflow': 'ellipsis',
                        'display': 'inline-block',
                        'float': 'left',
                        'white-space': 'nowrap'
                    }
                },
                {
                    displayName: constants.MIGRATION_ACTION,
                    valueType: azdata.DeclarativeDataType.category,
                    width: 150,
                    isReadOnly: true,
                    categoryValues: [
                        { name: stateMachine_1.MigrationMapping.Migrate, displayName: stateMachine_1.MigrationMapping.Migrate },
                        { name: stateMachine_1.MigrationMapping.Skip, displayName: stateMachine_1.MigrationMapping.Skip }
                    ],
                    headerCssStyles: styles_1.headerLeft,
                    rowCssStyles: styles_1.styleLeft,
                },
                {
                    displayName: "",
                    valueType: azdata.DeclarativeDataType.component,
                    width: 20,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                    rowCssStyles: styles_1.styleLeft
                },
                {
                    displayName: constants.MIGRATION_TARGET_NAME,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 250,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                    rowCssStyles: {
                        border: "none",
                        'font-size': '13px',
                        'line-height': '18px',
                        'margin': '2px 15px 2px 0',
                        'overflow': 'hidden',
                        'text-overflow': 'ellipsis',
                        'display': 'inline-block',
                        'float': 'left',
                        'white-space': 'nowrap'
                    }
                },
            ],
        })
            .component();
        this._migrationMappingTable.onDataChanged(() => {
            this.wizard.message = { text: '' };
        });
    }
    createSchemaLoadingProgress() {
        const schemaLoadingComponent = this._view.modelBuilder.loadingComponent()
            .component();
        const schemaLoadingProgressText = this._view.modelBuilder.text()
            .withProps({
            value: constants.SCHEMA_LOADING_IN_PROGRESS,
            ariaLabel: constants.SCHEMA_LOADING_IN_PROGRESS,
            CSSStyles: {
                ...styles.PAGE_TITLE_CSS,
                'margin-right': '20px'
            }
        }).component();
        const schemaLoadingContainer = this._view.modelBuilder.flexContainer()
            .withLayout({
            height: '100%',
            flexFlow: 'row',
            alignItems: 'center'
        }).component();
        schemaLoadingContainer.addItem(schemaLoadingProgressText, { flex: '0 0 auto' });
        schemaLoadingContainer.addItem(schemaLoadingComponent, { flex: '0 0 auto' });
        return schemaLoadingContainer;
    }
    createSchemaLoadingInfo() {
        const schemaLoadingInfo = this._view.modelBuilder.text()
            .withProps({
            value: constants.SCHEMA_LOADING_INFO,
            CSSStyles: {
                ...styles.BODY_CSS,
                'width': '660px'
            }
        }).component();
        return schemaLoadingInfo;
    }
    async onPageEnter(pageChangeInfo) {
        // If entered this page using previous button, 
        // don't query schema and update table, use existing values in table.
        if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
            return;
        }
        this._isSchemaLoaded = false;
        this.wizard.registerNavigationValidator((pageChangeInfo) => {
            this.wizard.message = { text: '' };
            if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
                return this._isSchemaLoaded;
            }
            let navigateForward = false;
            this._migrationMappingTable.dataValues?.forEach((row) => {
                if (row[2].value === "Migrate") {
                    navigateForward = true;
                }
            });
            if (this._migrationMappingTable.dataValues && this._migrationMappingTable.dataValues?.length > 0
                && !navigateForward) {
                this.wizard.message = {
                    text: constants.NO_MIGRATE_ERROR
                };
            }
            return (this._isSchemaLoaded && navigateForward);
        });
        const migrationMappingTableValues = [];
        this._container.clearItems();
        this._container.addItem(this._schemaLoadingInProgressContainer, { flex: '0 0 auto' });
        await this._migrationMappingTable.setDataValues([]);
        const sourceMongoConnectionInformation = {
            connectionString: this.migrationStateModel.sourceConnectionString,
            host: "",
            port: 0,
            userName: "",
            password: "",
            useSsl: false
        };
        const targetMongoConnectionInformation = {};
        if (this.migrationStateModel.targetConnectionString) {
            targetMongoConnectionInformation.connectionString = this.migrationStateModel.targetConnectionString;
        }
        else {
            const isvCore = this.migrationStateModel.targetOffering === common_1.EnumTargetOffering.CosmosDBMongovCore;
            const server = (0, utils_1.buildCosmosServerName)(this.migrationStateModel.targetCosmosInstance.name, isvCore);
            targetMongoConnectionInformation.connectionString = (0, utils_1.buildCosmosMongoConnectionString)(server, isvCore, this.migrationStateModel.targetUserName, this.migrationStateModel.targetPassword, "", "");
            this.migrationStateModel.targetConnectionString = targetMongoConnectionInformation.connectionString;
        }
        let sourceSchemaResponse = {};
        let targetSchemaResponse = {};
        try {
            sourceSchemaResponse = await (0, extension_1.getExistingSchema)(sourceMongoConnectionInformation, this.migrationStateModel.selectedSourceDatabasesForMapping);
            targetSchemaResponse = await (0, extension_1.getExistingSchema)(targetMongoConnectionInformation, []);
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MigrationMappingPage, telemetry_1.TelemetryAction.GetSchemaFailed, { error: e });
        }
        const targetNamespaces = new Set();
        if (targetSchemaResponse !== null && targetSchemaResponse.body !== null) {
            targetSchemaResponse.body.databases.forEach((databaseMetadata) => {
                databaseMetadata.collections.forEach((collectionMetadata) => {
                    targetNamespaces.add(databaseMetadata.databaseName + "." + collectionMetadata.collectionName);
                });
            });
        }
        const cappedCollections = new Set();
        if (sourceSchemaResponse !== null && sourceSchemaResponse.body !== null) {
            sourceSchemaResponse.body.databases.forEach((databaseMetadata) => {
                databaseMetadata.collections.forEach((collectionMetadata) => {
                    if (collectionMetadata.collectionType !== getExistingSchema_1.EnumCollectionType.timeseries &&
                        collectionMetadata.collectionType !== getExistingSchema_1.EnumCollectionType.view &&
                        collectionMetadata.collectionType !== getExistingSchema_1.EnumCollectionType.clustered) {
                        this.migrationStateModel.selectedNamespacetoActionMapping.set(databaseMetadata.databaseName + "." + collectionMetadata.collectionName, stateMachine_1.MigrationMapping.Migrate);
                    }
                    if (collectionMetadata.collectionType === getExistingSchema_1.EnumCollectionType.capped) {
                        cappedCollections.add(databaseMetadata.databaseName + "." + collectionMetadata.collectionName);
                    }
                });
            });
            this.migrationStateModel.selectedNamespacetoActionMapping.forEach((action, namespace) => {
                const statusImageSize = 14;
                const sourceIconComponent = this._view.modelBuilder.image()
                    .withProps({
                    iconPath: iconPathHelper_1.IconPathHelper.warning,
                    iconHeight: statusImageSize,
                    iconWidth: statusImageSize,
                    height: statusImageSize,
                    width: statusImageSize,
                    title: constants.MIGRATING_CAPPED_COLLECTION(namespace),
                    CSSStyles: {
                        'margin': '4px 4px 0 0',
                        'padding': '0'
                    }
                }).component();
                const sourceWarningComponent = this._view.modelBuilder.flexContainer()
                    .withProps({
                    CSSStyles: {
                        'margin': '0',
                        'padding': '0',
                        'height': '18px',
                    },
                    display: 'inline-flex'
                }).component();
                const targetIconComponent = this._view.modelBuilder.image()
                    .withProps({
                    iconPath: iconPathHelper_1.IconPathHelper.warning,
                    iconHeight: statusImageSize,
                    iconWidth: statusImageSize,
                    height: statusImageSize,
                    width: statusImageSize,
                    title: constants.MIGRATION_MAPPING_EXISTS(namespace),
                    CSSStyles: {
                        'margin': '4px 4px 0 0',
                        'padding': '0'
                    }
                }).component();
                const targetWarningComponent = this._view.modelBuilder.flexContainer()
                    .withProps({
                    CSSStyles: {
                        'margin': '0',
                        'padding': '0',
                        'height': '18px',
                    },
                    display: 'inline-flex'
                }).component();
                let migrationAction = stateMachine_1.MigrationMapping.Migrate;
                if (cappedCollections.has(namespace)) {
                    sourceWarningComponent.addItem(sourceIconComponent);
                    migrationAction = stateMachine_1.MigrationMapping.Skip;
                }
                if (targetNamespaces.has(namespace)) {
                    targetWarningComponent.addItem(targetIconComponent);
                    migrationAction = stateMachine_1.MigrationMapping.Skip;
                }
                migrationMappingTableValues.push([
                    {
                        value: sourceWarningComponent
                    },
                    {
                        value: namespace
                    },
                    {
                        value: migrationAction
                    },
                    {
                        value: targetWarningComponent
                    },
                    {
                        value: namespace
                    }
                ]);
            });
            await this._migrationMappingTable.setDataValues(migrationMappingTableValues);
            this._container.clearItems();
            this._container.addItem(this._migrationMappingTable);
            this._isSchemaLoaded = true;
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationMappingPage, telemetry_1.TelemetryAction.GetSchemaSucceeded, this.migrationStateModel.getDefaultTelemetryProps(), {});
        }
        else if (sourceSchemaResponse !== null && sourceSchemaResponse.error !== null) {
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.MIGRATION_MAPPING_ERROR_TITLE,
                description: constants.MIGRATION_MAPPING_ERROR(sourceSchemaResponse.error.errorMessage),
            };
            this._container.clearItems();
            this._isSchemaLoaded = false;
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MigrationMappingPage, telemetry_1.TelemetryAction.GetSchemaFailed, { errorCode: sourceSchemaResponse.error.errorCode, errorType: sourceSchemaResponse.error.errorMessage });
        }
    }
    async onPageLeave(pageChangeInfo) {
        // If navigating to previous page, clear all selection
        if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
            this.migrationStateModel.selectedNamespacetoActionMapping.clear();
            return;
        }
        this._migrationMappingTable.dataValues?.forEach((row) => {
            const migrationAction = (row[2].value === "Migrate") ? stateMachine_1.MigrationMapping.Migrate : stateMachine_1.MigrationMapping.Skip;
            this.migrationStateModel.selectedNamespacetoActionMapping.set(row[1].value.toString(), migrationAction);
        });
        this.publishSelectedCollectionStats();
    }
    publishSelectedCollectionStats() {
        let selectedCollectionCount = 0;
        this.migrationStateModel.selectedNamespacetoActionMapping.forEach((value, key) => {
            if (value === stateMachine_1.MigrationMapping.Migrate) {
                selectedCollectionCount += 1;
            }
        });
        const telemetryMeasures = {};
        telemetryMeasures[telemetry_1.TelemetryMeasureNames.TotalCollectionCount] = this.migrationStateModel.selectedNamespacetoActionMapping.size;
        telemetryMeasures[telemetry_1.TelemetryMeasureNames.SelectedCollectionCount] = selectedCollectionCount;
        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationMappingPage, telemetry_1.TelemetryAction.MigrationMappingInfo, this.migrationStateModel.getDefaultTelemetryProps(), telemetryMeasures);
    }
}
exports.MigrationMappingPage = MigrationMappingPage;
//# sourceMappingURL=migrationMapping.js.map