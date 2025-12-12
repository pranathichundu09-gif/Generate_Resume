"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=migrationDetails.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file builds migration details view.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationDetails = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const constants = require("../constants/strings");
const azure_1 = require("../services/azure");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
const utils_1 = require("../common/utils");
const serviceHelper_1 = require("../services/serviceHelper");
const strings_1 = require("../constants/strings");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const completeCutoverDialog_1 = require("../dialogs/completeCutoverDialog");
const telemetry_1 = require("../telemetry");
const refreshFrequencyMs = 15000;
let isOpen = true;
const DefaultValue = '--';
class MigrationDetails {
    _view;
    _statusBar;
    _context;
    _statusBarContainer;
    _collectionStatusTable;
    _migration;
    _migrationServiceContext;
    _container;
    _refreshLoader;
    _toolBarContainer;
    _completeCutoverButton;
    _cancelButton;
    _sourceServer;
    _targetServer;
    _status;
    _duration;
    _migrationMode;
    _startTime;
    _autoRefreshHandle;
    _disposables = [];
    _isRefreshing = false;
    _migrationId;
    _migrationErrorStatusBar;
    constructor(_view, _statusBar, _context, _statusBarContainer) {
        this._view = _view;
        this._statusBar = _statusBar;
        this._context = _context;
        this._statusBarContainer = _statusBarContainer;
        migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext().then((migrationServiceContext) => {
            this._migrationServiceContext = migrationServiceContext;
        });
    }
    rowCssStyle = {
        'border': 'none',
        'text-align': 'left',
        'box-shadow': 'inset 0px -1px 0px #F3F2F1',
        'font-size': '13px',
        'line-height': '18px',
        'padding': '7px 5px',
        'margin': '0px',
    };
    headerCssStyles = {
        'border': 'none',
        'text-align': 'left',
        'box-shadow': 'inset 0px -1px 0px #F3F2F1',
        'font-weight': 'bold',
        'padding-left': '5px',
        'padding-right': '5px',
        'font-size': '13px',
        'line-height': '18px'
    };
    async create() {
        this._container = this._view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '850px',
            justifyContent: 'flex-start',
        }).component();
        this._collectionStatusTable = this.createCollectionStatustable();
        this._container.addItem(await this.createToolbar());
        this._container.addItem(await this.createMigrationSummary());
        this._container.addItem(this._view.modelBuilder.separator().component());
        this._container.addItem(this._collectionStatusTable);
        this._migrationErrorStatusBar = (0, utils_1.createStatusBar)(this._view, this._disposables, this._context, this._statusBarContainer);
        this._disposables.push(this._view.onClosed(() => {
            clearInterval(this._autoRefreshHandle);
            this._disposables.forEach(d => { d.dispose(); });
        }));
        return this._container;
    }
    async createToolbar() {
        const iconSize = 16;
        const btnHeight = '26px';
        this._completeCutoverButton = this._view.modelBuilder.button()
            .withProps({
            label: constants.CUTOVER,
            ariaLabel: constants.CUTOVER,
            iconPath: iconPathHelper_1.IconPathHelper.completeCutover,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(this._completeCutoverButton.onDidClick(async () => {
            this.refresh();
            const completeCutoverDialog = new completeCutoverDialog_1.CompleteCutoverDialog();
            completeCutoverDialog.completeCutover(this._migration, this._context, this._statusBarContainer, this._view);
        }));
        const refreshButton = this._view.modelBuilder.button()
            .withProps({
            label: constants.REFRESH,
            ariaLabel: constants.REFRESH,
            iconPath: iconPathHelper_1.IconPathHelper.refresh,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(refreshButton.onDidClick(async () => {
            await this.refresh();
        }));
        this._refreshLoader = this._view.modelBuilder.loadingComponent()
            .withItem(refreshButton)
            .withProps({
            loading: false,
            CSSStyles: { 'height': '8px', 'margin-top': '6px' }
        }).component();
        this._cancelButton = this._view.modelBuilder.button()
            .withProps({
            label: constants.CANCEL,
            ariaLabel: constants.CANCEL,
            iconPath: iconPathHelper_1.IconPathHelper.cancel,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(this._cancelButton.onDidClick(async () => {
            await this.cancelMigration();
            const telemetryProps = {};
            telemetryProps[telemetry_1.TelemetryPropNames.MigrationName] = this._migration.name;
            telemetryProps[telemetry_1.TelemetryPropNames.MigrationOperationId] = this._migration.properties.migrationOperationId;
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationDetailsPage, telemetry_1.TelemetryAction.CancelMigration, telemetryProps, {});
        }));
        const supportButton = this._view.modelBuilder.button()
            .withProps({
            label: constants.HELP_SUPPORT,
            ariaRole: 'button',
            iconPath: iconPathHelper_1.IconPathHelper.supportRequest,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(supportButton.onDidClick(async () => {
            await vscode.commands.executeCommand('mongo.support');
        }));
        const feedbackButton = this._view.modelBuilder.button()
            .withProps({
            label: constants.FEEDBACK,
            ariaRole: 'button',
            iconPath: iconPathHelper_1.IconPathHelper.sendFeedback,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(feedbackButton.onDidClick(async () => {
            await vscode.commands.executeCommand('mongo.sendfeedback');
        }));
        this._toolBarContainer = this._view.modelBuilder.toolbarContainer()
            .withToolbarItems([
            { component: this._refreshLoader },
            { component: this._cancelButton },
            { component: supportButton },
            { component: feedbackButton }
        ]).component();
        return this._toolBarContainer;
    }
    //Function that return summary container with heading and form with fields.
    async createMigrationSummary() {
        const summaryRootContainer = this._view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
        }).withProps({
            CSSStyles: {
                padding: '15px'
            }
        }).component();
        const headingContainer = this._view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'row',
        }).component();
        const openclose = this._view.modelBuilder.button().withProps({
            iconPath: iconPathHelper_1.IconPathHelper.expandButtonOpen,
            iconHeight: 8,
            iconWidth: 8,
            height: 18,
            width: 6,
            ariaLabel: constants.EXPANDED + constants.ESSENTIALS
        }).component();
        const essentials = this._view.modelBuilder.text().withProps({
            value: constants.ESSENTIALS,
            height: 18,
            CSSStyles: {
                'font-size': '13px',
                'height': '16px',
                'line-height': '16px',
                'margin': '0px',
                'font-weight': '600'
            },
        }).component();
        headingContainer.addItem(openclose, { flex: 'none' });
        headingContainer.addItem(essentials);
        summaryRootContainer.addItem(headingContainer);
        const summaryContainer = await this.createMigrationSummaryComponent();
        openclose.onDidClick(() => {
            if (!isOpen) {
                openclose.iconPath = iconPathHelper_1.IconPathHelper.expandButtonOpen;
                openclose.ariaLabel = constants.EXPANDED + constants.ASSESSMENT_SUMMARY;
                isOpen = true;
                summaryRootContainer.addItem(summaryContainer);
            }
            else {
                openclose.iconPath = iconPathHelper_1.IconPathHelper.expandButtonClosed;
                openclose.ariaLabel = constants.COLLAPSED + constants.ASSESSMENT_SUMMARY;
                isOpen = false;
                summaryRootContainer.removeItem(summaryContainer);
            }
        });
        summaryRootContainer.addItem(summaryContainer);
        return summaryRootContainer;
    }
    // Function that returns summary component with form.
    async createMigrationSummaryComponent() {
        const summaryContainer = this._view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
        }).component();
        this._sourceServer = this.createLabelContainer(constants.SOURCE_SERVER_INSTANCE, '');
        this._targetServer = this.createLabelContainer(constants.TARGET_SERVER, '');
        this._status = this.createLabelContainer(constants.STATUS, '');
        this._duration = this.createLabelContainer(constants.DURATION, '');
        this._migrationMode = this.createLabelContainer(constants.MIGRATION_MODE_LABEL, '');
        this._startTime = this.createLabelContainer(constants.START_TIME, '');
        summaryContainer.addItem(this._view.modelBuilder.flexContainer().withItems([this._sourceServer.flexContainer, this._targetServer.flexContainer]).withLayout({
            flexFlow: 'row',
        }).component());
        summaryContainer.addItem(this._view.modelBuilder.flexContainer().withItems([this._migrationMode.flexContainer, this._status.flexContainer]).withLayout({
            flexFlow: 'row',
        }).component());
        summaryContainer.addItem(this._view.modelBuilder.flexContainer().withItems([this._startTime.flexContainer, this._duration.flexContainer]).withLayout({
            flexFlow: 'row',
        }).component());
        return summaryContainer;
    }
    createLabelContainer(title, value) {
        const maxWidth = 410;
        const labelsContainer = this._view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'row',
            width: maxWidth,
            height: '28px',
        }).component();
        const labelComponent = this._view.modelBuilder.text().withProps({
            value: title,
            width: 160,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'margin': '0px',
                'padding': '5px 0'
            }
        }).component();
        const colonComponent = this._view.modelBuilder.text().withProps({
            value: ':',
            width: '15px',
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'margin': '0px',
                'text-align': 'center',
                'padding': '5px 0'
            }
        }).component();
        const labelComponentValue = this._view.modelBuilder.text().withProps({
            value: value,
            width: 340,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'margin': '0px',
                'padding': '5px 0',
                'text-overflow': 'ellipsis',
                'overflow': 'hidden',
                'display': 'inline-block',
                'white-space': 'nowrap',
            },
        }).component();
        labelsContainer.addItems([labelComponent, colonComponent, labelComponentValue], {
            flex: '0 0 auto',
            CSSStyles: {
                'text-overflow': 'ellipsis',
                'overflow': 'hidden',
            }
        });
        return { flexContainer: labelsContainer, valueComponent: labelComponentValue };
    }
    //Function that creates stage status table.
    createCollectionStatustable() {
        const collectionStatusTable = this._view.modelBuilder.declarativeTable().withProps({
            ariaLabel: constants.STAGE_TABLE_HEADER,
            columns: [],
            data: [],
            width: 1200,
            CSSStyles: {
                'margin-left': '41px',
                'margin-top': '16px',
                'table-layout': 'fixed',
                'border': 'none',
                'display': 'block'
            }
        }).component();
        return collectionStatusTable;
    }
    async cancelMigration() {
        const response = await vscode.window.showWarningMessage(constants.WARNING_CANCEL_MIGRATIONS, { modal: true }, constants.YES, constants.NO);
        if (response === constants.YES) {
            const telemetryProps = {};
            telemetryProps[telemetry_1.TelemetryPropNames.MigrationName] = this._migration.name;
            telemetryProps[telemetry_1.TelemetryPropNames.MigrationOperationId] = this._migration.properties.migrationOperationId;
            try {
                const migrationServiceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
                await (0, azure_1.cancelCosmosMongovCoreMigration)(migrationServiceContext.azureAccount, migrationServiceContext.subscription, this._migrationId);
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationDetailsPage, telemetry_1.TelemetryAction.CancelMigrationSucceeded, telemetryProps, {});
                vscode.window.showInformationMessage(constants.MIGRATION_CANCEL_SUCCESS);
            }
            catch (e) {
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MigrationDetailsPage, telemetry_1.TelemetryAction.CancelMigrationFailed, { error: e });
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationDetailsPage, telemetry_1.TelemetryAction.CancelMigrationFailed, telemetryProps, {});
                const statusBar = (0, utils_1.createStatusBar)(this._view, this._disposables, this._context, this._statusBarContainer);
                await statusBar.showError(constants.MIGRATION_CANCEL_ERROR, constants.MIGRATION_CANCEL_ERROR, e.message);
            }
            await this.refresh();
        }
    }
    async populateContainer() {
        //  const migrationServiceContext = await MigrationLocalStorage.getMigrationServiceContext();
        try {
            this._migration = await (0, azure_1.getMigrationDetails)(this._migrationServiceContext.azureAccount, this._migrationServiceContext.subscription, this._migrationId);
            await this.populateMigrationDetails();
            this._statusBar.clearError();
        }
        catch (e) {
            await this._statusBar.showError(constants.MIGRATION_STATUS_REFRESH_ERROR, constants.MIGRATION_STATUS_REFRESH_ERROR, e.message);
        }
    }
    async clear() {
        this._sourceServer.valueComponent.value = '';
        this._targetServer.valueComponent.value = '';
        this._status.valueComponent.value = '';
        this._duration.valueComponent.value = '';
        this._migrationMode.valueComponent.value = '';
        this._startTime.valueComponent.value = '';
        await this._collectionStatusTable.setDataValues([]);
    }
    async showMigrationDetails(migrationId) {
        this._migrationId = migrationId;
        await this.refresh();
    }
    async updateErrorDetails(visible) {
        if (visible && this._migration.properties.migrationStatus === strings_1.MigrationState.Failed && this._migration.properties.migrationFailureError.code) {
            await this._migrationErrorStatusBar.showError(constants.MIGRATION_ERROR, constants.MIGRATION_ERROR, this._migration.properties.migrationFailureError.message);
        }
        else {
            this._migrationErrorStatusBar.clearError();
        }
    }
    async populateMigrationDetails() {
        this._sourceServer.valueComponent.value = this._migration.properties.sourceMongoConnection.host;
        this._targetServer.valueComponent.value = this._migration.properties.targetMongoConnection.host;
        this._status.valueComponent.value = (0, serviceHelper_1.getMigrationStatusString)(this._migration);
        this._duration.valueComponent.value = (0, serviceHelper_1.getMigrationDuration)(this._migration.properties.startedOn, this._migration.properties.endedOn);
        this._migrationMode.valueComponent.value = this._migration.properties.mode;
        this._startTime.valueComponent.value = (0, utils_1.formatDate)(this._migration.properties.startedOn);
        await this.updateErrorDetails(true /*visible*/);
        if (this._migration.properties.mode === constants.ONLINE) {
            this._collectionStatusTable.columns = [
                {
                    displayName: constants.DATABASE_NAME,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.COLLECTION_NAME,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.MIGRATION_STATUS,
                    valueType: azdata.DeclarativeDataType.component,
                    width: 180,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.DOCUMENTS_MIGRATED_ONLINE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.PERCENTAGE_COMPLETION_COLUMN_ONLINE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 120,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.DURATION_ONLINE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 120,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.REPLICATION_GAP,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.REPLICATION_CHANGES_REPLAYED,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 120,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                }
            ];
        }
        else {
            this._collectionStatusTable.columns = [
                {
                    displayName: constants.DATABASE_NAME,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.COLLECTION_NAME,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.MIGRATION_STATUS,
                    valueType: azdata.DeclarativeDataType.component,
                    width: 150,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.DOCUMENTS_MIGRATED_OFFLINE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 120,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.PERCENTAGE_COMPLETION_COLUMN_OFFLINE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 120,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                },
                {
                    displayName: constants.DURATION,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 120,
                    isReadOnly: true,
                    rowCssStyles: this.rowCssStyle,
                    headerCssStyles: this.headerCssStyles
                }
            ];
        }
        this._container.addItem(this._collectionStatusTable);
        const collectionsMap = new Map();
        this._migration.properties.collectionList.forEach(c => {
            const key = c.sourceDatabase + '.' + c.sourceCollection;
            if (!collectionsMap.has(key)) {
                collectionsMap.set(key, {
                    databaseName: c.sourceDatabase,
                    collectionName: c.sourceCollection,
                });
            }
            if (c.migrationProgressDetails) {
                const row = collectionsMap.get(key);
                if (this._migration.properties.mode !== constants.ONLINE || c.migrationRunFsmState === 'MonitorBulkCopyPipelinesRun') {
                    row.bulkCopyStatus = c.migrationProgressDetails.migrationStatus;
                    row.intialSourceDocCount = c.migrationProgressDetails.sourceDocumentCount;
                    row.intialProcessedDocCount = c.migrationProgressDetails.processedDocumentCount;
                    row.duration = c.migrationProgressDetails.durationInSeconds;
                }
                else if (c.migrationRunFsmState === 'MonitorCdcPipelinesRun') {
                    row.cdcStatus = c.migrationProgressDetails.migrationStatus;
                    row.cdcReplicationGap = c.migrationProgressDetails.replicationGapInSeconds;
                    row.cdcMetricsPublishTimeStamp = c.migrationProgressDetails.metricsPublishTimeStamp;
                    if (c.migrationProgressDetails.processedDocumentCount !== undefined && !isNaN(c.migrationProgressDetails.processedDocumentCount)) {
                        // if(row.replicationChanges) {
                        //     row.replicationChanges += c.migrationProgressDetails.processedDocumentCount;
                        // }
                        // else {
                        //     row.replicationChanges = c.migrationProgressDetails.processedDocumentCount;
                        // }
                        // Todo : delete below block and uncomment above block to add DCD changes once the issue that CDC changes are already
                        // added in the cutover changes is resolved on DMS
                        if (!row.replicationChanges) {
                            row.replicationChanges = c.migrationProgressDetails.processedDocumentCount;
                        }
                    }
                }
                else if (c.migrationRunFsmState === 'MonitorCutoverCdcPipelinesRun') {
                    row.cutoverStatus = c.migrationProgressDetails.migrationStatus;
                    row.cutoverReplicationGap = c.migrationProgressDetails.replicationGapInSeconds;
                    if (c.migrationProgressDetails.processedDocumentCount !== undefined && !isNaN(c.migrationProgressDetails.processedDocumentCount)) {
                        // if(row.replicationChanges) {
                        //     row.replicationChanges += c.migrationProgressDetails.processedDocumentCount;
                        // }
                        // else {
                        //     row.replicationChanges = c.migrationProgressDetails.processedDocumentCount;
                        // }
                        // Todo : delete below line and uncomment above block once the issue that CDC changes are already
                        // added in the cutover changes is resolved on DMS
                        row.replicationChanges = c.migrationProgressDetails.processedDocumentCount;
                    }
                }
            }
        });
        if (collectionsMap.size > 0) {
            const data = [];
            collectionsMap.forEach(r => {
                let collectionStatus = r.bulkCopyStatus ?? '';
                if (this._migration.properties.migrationStatus === strings_1.MigrationState.Failed) {
                    collectionStatus = strings_1.CollectionState.Failed;
                }
                else if (this._migration.properties.mode === constants.ONLINE) {
                    if (r.cutoverStatus === strings_1.CollectionState.Failed) {
                        collectionStatus = strings_1.CollectionState.Failed;
                    }
                    else if (r.cutoverStatus === strings_1.CollectionState.Completed) {
                        collectionStatus = strings_1.CollectionState.Completed;
                    }
                    else if (r.cutoverStatus) {
                        collectionStatus = strings_1.CollectionStateOnline.ReplicationInProgress;
                    }
                    else if (r.cdcStatus === strings_1.CollectionState.Failed) {
                        collectionStatus = strings_1.CollectionState.Failed;
                    }
                    else if (r.cdcStatus === strings_1.CollectionState.Completed || r.cdcStatus === strings_1.CollectionState.InProgress) {
                        collectionStatus = strings_1.CollectionStateOnline.ReplicationInProgress;
                    }
                    else if (r.cdcStatus) {
                        collectionStatus = strings_1.CollectionStateOnline.ReplicationWaiting;
                    }
                    else if (r.bulkCopyStatus === strings_1.CollectionState.Failed) {
                        collectionStatus = strings_1.CollectionState.Failed;
                    }
                    else if (r.bulkCopyStatus === strings_1.CollectionState.Completed) {
                        collectionStatus = strings_1.CollectionStateOnline.ReplicationWaiting;
                    }
                    else if (r.bulkCopyStatus == strings_1.CollectionState.NotStarted) {
                        collectionStatus = strings_1.CollectionState.NotStarted;
                    }
                    else if (r.bulkCopyStatus) {
                        collectionStatus = strings_1.CollectionStateOnline.InitialLoadInProgress;
                    }
                }
                else {
                    if (collectionStatus === strings_1.CollectionState.InProgress) {
                        if (this._migration.properties.migrationStatus === strings_1.MigrationState.Succeeded
                            && r.intialProcessedDocCount && r.intialSourceDocCount
                            && r.intialProcessedDocCount == r.intialSourceDocCount) {
                            collectionStatus = strings_1.CollectionState.Completed;
                        }
                    }
                }
                let collectionPercentage;
                if (r.intialProcessedDocCount === undefined || isNaN(r.intialProcessedDocCount)
                    || r.intialSourceDocCount === undefined || isNaN(r.intialSourceDocCount)) {
                    collectionPercentage = DefaultValue;
                }
                else {
                    let percentage = r.intialSourceDocCount === 0
                        ? ((collectionStatus === strings_1.CollectionState.Completed || this._migration.properties.mode === constants.ONLINE) ? 100 : 0)
                        : (100 * r.intialProcessedDocCount) / r.intialSourceDocCount;
                    if (percentage > 100) {
                        percentage = 100;
                    }
                    percentage = Math.round(percentage * 100) / 100;
                    collectionPercentage = percentage.toString();
                }
                const duration = (r.duration === undefined || isNaN(r.duration))
                    ? DefaultValue : (0, serviceHelper_1.convertDurationToString)(1000 * r.duration);
                const collectionRows = [
                    { value: r.databaseName },
                    { value: r.collectionName },
                    { value: this.getCollectionStatus(collectionStatus) },
                    { value: r.intialProcessedDocCount ? r.intialProcessedDocCount : 0 },
                    { value: collectionPercentage },
                    { value: duration },
                ];
                if (this._migration.properties.mode === constants.ONLINE) {
                    let replicationGap = DefaultValue;
                    if (r.cutoverReplicationGap !== undefined && !isNaN(r.cutoverReplicationGap)) {
                        replicationGap = (0, serviceHelper_1.convertDurationToString)(r.cutoverReplicationGap * 1000);
                    }
                    else if (r.cdcMetricsPublishTimeStamp && r.cdcReplicationGap !== undefined && !isNaN(r.cdcReplicationGap)) {
                        const timeNow = new Date();
                        const metricsPulishTime = new Date(r.cdcMetricsPublishTimeStamp * 1000);
                        const gapMs = r.cdcReplicationGap * 1000 + (timeNow.getTime() - metricsPulishTime.getTime());
                        replicationGap = (0, serviceHelper_1.convertDurationToString)(gapMs);
                    }
                    if (this._migration.properties.mode === constants.ONLINE) {
                        collectionRows.push({ value: replicationGap }, { value: (r.replicationChanges === undefined || isNaN(r.replicationChanges)) ? DefaultValue : r.replicationChanges.toString() });
                    }
                }
                data.push(collectionRows);
            });
            await this._collectionStatusTable.setDataValues(data);
        }
        else {
            await this._collectionStatusTable.setDataValues([]);
        }
        if (this.isAutoRefreshRequired()) {
            this.setAutoRefresh(refreshFrequencyMs);
        }
        else {
            clearInterval(this._autoRefreshHandle);
        }
    }
    isAutoRefreshRequired() {
        return (!(this._migration !== undefined && this._migration.properties !== undefined &&
            (this._migration.properties.migrationStatus === strings_1.MigrationState.Succeeded ||
                this._migration.properties.migrationStatus === strings_1.MigrationState.Failed ||
                this._migration.properties.migrationStatus === strings_1.MigrationState.Canceled)));
    }
    setOrClearAutoRefresh(clearInterval) {
        if (clearInterval || !this.isAutoRefreshRequired()) {
            this.setAutoRefresh(-1);
        }
        else {
            this.setAutoRefresh(refreshFrequencyMs);
        }
    }
    getCollectionStatus(collectionStatus) {
        const statusImageSize = 14;
        const imageCellStyles = { 'margin': '3px 3px 0 0', 'padding': '0' };
        const statusCellStyles = { 'margin': '0', 'padding': '0' };
        const iconText = this._view.modelBuilder
            .divContainer()
            .withItems([
            // stage status icon
            this._view.modelBuilder.image()
                .withProps({
                iconPath: (0, serviceHelper_1.getCollectionStatusImage)(collectionStatus),
                iconHeight: statusImageSize,
                iconWidth: statusImageSize,
                height: statusImageSize,
                width: statusImageSize,
                CSSStyles: imageCellStyles
            })
                .component(),
            // stage status text
            this._view.modelBuilder.text().withProps({
                value: (0, serviceHelper_1.getCollectionStatusString)(collectionStatus),
                height: statusImageSize,
                CSSStyles: statusCellStyles,
            }).component()
        ])
            .withProps({ CSSStyles: statusCellStyles, display: 'inline-flex' })
            .component();
        return iconText;
    }
    //Function called when refresh button is clicked
    async refresh() {
        if (this._isRefreshing || this._refreshLoader === undefined) {
            return;
        }
        this._isRefreshing = true;
        this._refreshLoader.loading = true;
        this._completeCutoverButton.enabled = false;
        this._cancelButton.enabled = false;
        await this._container.updateCssStyles({
            'margin': '0px'
        });
        await this.populateContainer();
        if (this._migration.properties.mode === constants.ONLINE) {
            this._toolBarContainer.insertItem(this._completeCutoverButton, 0);
        }
        this._completeCutoverButton.enabled = (this._migration.properties.migrationStatus === 'ReadyForCutover');
        this._cancelButton.enabled = (this._migration.properties.migrationStatus !== 'Succeeded' &&
            this._migration.properties.migrationStatus !== 'Failed' &&
            this._migration.properties.migrationStatus !== 'Canceled' &&
            this._migration.properties.migrationStatus !== 'Canceling');
        this._refreshLoader.loading = false;
        this._isRefreshing = false;
    }
    setAutoRefresh(interval) {
        clearInterval(this._autoRefreshHandle);
        if (interval !== -1) {
            this._autoRefreshHandle = setInterval(async () => { await this.refresh(); }, interval);
        }
    }
}
exports.MigrationDetails = MigrationDetails;
//# sourceMappingURL=migrationDetails.js.map