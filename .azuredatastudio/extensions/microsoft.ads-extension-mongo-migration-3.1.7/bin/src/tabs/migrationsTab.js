"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=migrationsTab.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the migrations tab of the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationsTab = exports.MigrationsTabId = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const parentTab_1 = require("./parentTab");
const styles = require("../constants/styles");
const constants = require("../constants/strings");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const migrationDetails_1 = require("../summary/migrationDetails");
const utils_1 = require("../common/utils");
const telemetry_1 = require("../telemetry");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
const selectMigrationServiceDialog_1 = require("../dialogs/selectMigrationServiceDialog");
const serviceHelper_1 = require("../services/serviceHelper");
const azure_1 = require("../services/azure");
const strings_1 = require("../constants/strings");
const TableColumns = {
    migrationName: 'migrationName',
    status: 'status',
    targetServer: 'TargetServer',
    duration: 'duration',
    startTime: 'startTime',
    endTime: 'endTime',
};
exports.MigrationsTabId = 'MigrationsTab';
const refreshFrequencyMs = 15000;
class MigrationsTab extends parentTab_1.ParentTab {
    _migrations;
    _filteredMigrations;
    _autoRefreshHandle;
    _migrationsListTable;
    _disposables = [];
    _rootContainer;
    _toolbarContainer;
    _searchAndSortContainer;
    _noMigrationsImage;
    _noMigrationsText;
    _newMigration;
    _refreshLoader;
    _deleteButton;
    _infoPanel;
    _migrationTitle;
    _migrationsContainer;
    _migrationDetailsContainer;
    _serviceContextButton;
    _searchBox;
    _statusDropdown;
    _columnSortDropdown;
    _columnSortCheckbox;
    _migrationDetails;
    isRefreshing = false;
    _isShowingMigrationDetails = false;
    _statusDropdownValues = [
        { displayName: constants.STATUS_ALL, name: serviceHelper_1.AdsMigrationStatus.ALL },
        { displayName: constants.STATUS_ONGOING, name: serviceHelper_1.AdsMigrationStatus.ONGOING },
        { displayName: constants.STATUS_COMPLETING, name: serviceHelper_1.AdsMigrationStatus.COMPLETING },
        { displayName: constants.STATUS_SUCCEEDED, name: serviceHelper_1.AdsMigrationStatus.SUCCEEDED },
        { displayName: constants.STATUS_FAILED, name: serviceHelper_1.AdsMigrationStatus.FAILED }
    ];
    constructor(extensionContext, serviceContextChangedEvent, migrationDetailsPerMigrationService) {
        super(extensionContext, serviceContextChangedEvent, constants.MIGRATIONS, exports.MigrationsTabId, migrationDetailsPerMigrationService);
        this._serviceContextChangedEvent = serviceContextChangedEvent;
    }
    async tabContent(view) {
        this._rootContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '100%',
            height: '100%',
        }).component();
        this._toolbarContainer = await this.createToolbar();
        this._searchAndSortContainer = await this.createSearchAndSortContainer();
        this._migrationsContainer = await this.createMigrationsListContainer(view);
        this._rootContainer.addItem(this._toolbarContainer, {
            flex: '0 0 auto', CSSStyles: {
                'border-top': '2px solid rgb(221, 221, 221)'
            }
        });
        this._rootContainer.addItem(this._searchAndSortContainer, {
            flex: '0 0 auto', CSSStyles: {
                'margin': '5px'
            }
        });
        this._rootContainer.addItem(this._migrationsContainer);
        this._infoPanel = await this.createInfoPanel(view);
        this._migrationDetails = new migrationDetails_1.MigrationDetails(view, this.statusBar, this._context, this._statusBarContainer);
        this._migrationDetailsContainer = await this._migrationDetails.create();
        await this._infoPanel.updateCssStyles({
            'display': 'none'
        });
        await this._migrationDetailsContainer.updateCssStyles({
            'display': 'none'
        });
        this._rootContainer.addItem(this._infoPanel, { flex: `0 0 10px` });
        this._rootContainer.addItem(this._migrationDetailsContainer);
        this._disposables.push(this._view.onClosed(() => {
            clearInterval(this._autoRefreshHandle);
            this._disposables.forEach(d => { d.dispose(); });
        }));
        return this._rootContainer;
    }
    filterMigrations(migrations, migrationStatusFilter, textFilter) {
        let filteredMigrations = migrations;
        if (textFilter) {
            const filter = textFilter.toLowerCase();
            filteredMigrations = filteredMigrations.filter(migration => migration.name?.toLowerCase().includes(filter)
                || (0, serviceHelper_1.getMigrationStatus)(migration)?.toLowerCase().includes(filter)
                || migration.properties.targetMongoConnection.host?.toLowerCase().includes(filter)
                || (0, serviceHelper_1.getMigrationDuration)(migration.properties.startedOn, migration.properties.endedOn)?.toLowerCase().includes(filter)
                || (0, utils_1.formatDate)(migration.properties.startedOn)?.toLowerCase().includes(filter)
                || (0, utils_1.formatDate)(migration.properties.endedOn)?.toLowerCase().includes(filter));
        }
        switch (migrationStatusFilter) {
            case serviceHelper_1.AdsMigrationStatus.ALL:
                return filteredMigrations;
            case serviceHelper_1.AdsMigrationStatus.ONGOING:
                return filteredMigrations.filter(value => {
                    const status = (0, serviceHelper_1.getMigrationStatus)(value);
                    return status === constants.MigrationState.InProgress
                        || status === constants.MigrationState.Creating;
                });
            case serviceHelper_1.AdsMigrationStatus.SUCCEEDED:
                return filteredMigrations.filter(value => (0, serviceHelper_1.getMigrationStatus)(value) === constants.MigrationState.Succeeded);
            case serviceHelper_1.AdsMigrationStatus.FAILED:
                return filteredMigrations.filter(value => (0, serviceHelper_1.getMigrationStatus)(value) === constants.MigrationState.Failed);
            // Todo: status COMPLETING?
            //case AdsMigrationStatus.COMPLETING:
        }
        return filteredMigrations;
    }
    createSelectMigrationComponent() {
        const checkBoxComponent = this._view.modelBuilder.checkBox()
            .withProps({
            label: "",
            checked: false,
            CSSStyles: { 'margin-left': '15px' },
        })
            .component();
        checkBoxComponent.onChanged(() => {
            this._deleteButton.enabled = this.enableDeleteButton();
        });
        return checkBoxComponent;
    }
    enableDeleteButton() {
        if (this._migrationsListTable.dataValues) {
            for (const row of this._migrationsListTable.dataValues) {
                if (row[2].value.checked === true) {
                    return true;
                }
            }
        }
        return false;
    }
    createMigrationHyperlink(migrationName, migrationId) {
        const migrationHyperlink = this._view.modelBuilder.hyperlink().withProps({
            label: migrationName,
            url: '',
            CSSStyles: { 'text-decoration': 'none' }
        }).component();
        migrationHyperlink.onDidClick(async () => {
            this.statusBar.clearError();
            await this.showMigration(migrationId, migrationName);
        });
        return migrationHyperlink;
    }
    async deleteMigrations() {
        const selectedMigrationIds = [];
        let inProgressMigrationsCount = 0;
        for (let i = 0; i < this._filteredMigrations.length; i++) {
            if (this._migrationsListTable.dataValues
                && this._migrationsListTable.dataValues[i][2].value.checked === true) {
                selectedMigrationIds.push(this._migrationsListTable.dataValues[i][0].value);
                if (this._migrationsListTable.dataValues[i][1].value) {
                    inProgressMigrationsCount++;
                }
            }
        }
        let response;
        if (inProgressMigrationsCount > 0) {
            response = await vscode.window.showWarningMessage(constants.WARNING_FORCE_DELETE_MIGRATIONS(inProgressMigrationsCount, selectedMigrationIds.length), { modal: true }, constants.FORCE_DELETE);
        }
        else {
            response = await vscode.window.showInformationMessage(constants.WARNING_DELETE_MIGRATIONS(selectedMigrationIds.length), { modal: true }, constants.YES);
        }
        if (response === constants.YES || response === constants.FORCE_DELETE) {
            let failed = false;
            const errorMessages = [];
            const migrationServiceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
            await Promise.all(selectedMigrationIds.map(async (migrationId) => {
                const migration = this._migrations.find(m => m.id === migrationId);
                const telemetryProps = {};
                telemetryProps[telemetry_1.TelemetryPropNames.MigrationName] = migration?.name ?? '';
                telemetryProps[telemetry_1.TelemetryPropNames.MigrationOperationId] = migration?.properties?.migrationOperationId ?? '';
                telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = migrationServiceContext.migrationService?.name ?? '';
                telemetryProps[telemetry_1.TelemetryPropNames.MigrationMode] = migration?.properties?.mode ?? '';
                telemetryProps[telemetry_1.TelemetryPropNames.MigrationStatus] = migration?.properties?.migrationStatus ?? '';
                try {
                    await (0, azure_1.deleteCosmosMongoMigration)(migrationServiceContext.azureAccount, migrationServiceContext.subscription, migrationId, (inProgressMigrationsCount > 0) /*forceDelete*/);
                    (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationsTab, telemetry_1.TelemetryAction.DeleteMigrationSucceeded, telemetryProps, {});
                }
                catch (e) {
                    failed = true;
                    errorMessages.push(e.message);
                    (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MigrationsTab, telemetry_1.TelemetryAction.DeleteMigrationFailed, { error: e });
                    (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationsTab, telemetry_1.TelemetryAction.DeleteMigrationFailed, telemetryProps, {});
                }
            }));
            if (failed) {
                const errorMessage = errorMessages.join('\n');
                const statusBar = (0, utils_1.createStatusBar)(this._view, this._disposables, this._context, this._statusBarContainer);
                await statusBar.showError(constants.MIGRATION_DELETE_ERROR, constants.MIGRATION_DELETE_ERROR, errorMessage);
            }
            else {
                vscode.window.showInformationMessage(constants.MIGRATION_DELETE_SUCCESS);
            }
            await this.refresh();
        }
    }
    async clearMigrations() {
        await this._migrationsListTable.setDataValues([]);
    }
    async refresh() {
        if (this.isRefreshing ||
            this._refreshLoader === undefined) {
            return;
        }
        try {
            this.isRefreshing = true;
            this._refreshLoader.loading = true;
            await this._migrationsListTable.updateProperty('data', []);
            this._migrations = await (0, migrationLocalStorage_1.getMongoMigrations)();
            if (this._migrations !== undefined) {
                this.logMigrationDetailsAsync(this._migrations);
            }
            else {
                const telemetryProps = {};
                const serviceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
                telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceSubscription] = serviceContext.migrationService.properties.subscriptionId;
                telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = serviceContext.migrationService.name;
                telemetryProps[telemetry_1.TelemetryPropNames.ErrorMessage] = constants.EMPTY_MIGRATIONS_ERROR_MESSAGE;
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationsTab, telemetry_1.TelemetryAction.AutoRefresh, telemetryProps, {});
            }
            await this.populateMigrations();
            if ((0, utils_1.isAutoRefreshRequired)(this._migrations)) {
                this.setAutoRefresh(refreshFrequencyMs);
            }
            else {
                clearInterval(this._autoRefreshHandle);
            }
            this.statusBar.clearError();
        }
        catch (e) {
            await this.statusBar.showError(constants.DASHBOARD_REFRESH_MIGRATIONS_ERROR_TITLE, constants.DASHBOARD_REFRESH_MIGRATIONS_ERROR_LABEL, e.message);
        }
        finally {
            this._refreshLoader.loading = false;
            this.isRefreshing = false;
        }
    }
    async populateMigrations() {
        this._filteredMigrations = this.filterMigrations(this._migrations, this._statusDropdown.value.name, this._searchBox.value);
        this._searchBox.ariaLabel = constants.FILTER_RESULTS_FOUND(this._filteredMigrations.length);
        if (this._filteredMigrations.length > 0) {
            this.sortMigrations(this._filteredMigrations, this._columnSortDropdown.value.name, this._columnSortCheckbox.checked === true);
            // TODO, add correct data values from migrations response
            const data = this._filteredMigrations.map(r => {
                const inProgress = (!(r.properties.migrationStatus === strings_1.MigrationState.Succeeded ||
                    r.properties.migrationStatus === strings_1.MigrationState.Failed ||
                    r.properties.migrationStatus === strings_1.MigrationState.Canceled));
                return [
                    { value: r.id },
                    { value: inProgress },
                    { value: this.createSelectMigrationComponent() },
                    { value: this.createMigrationHyperlink(r.name, r.id) },
                    { value: r.properties.mode },
                    { value: this.getMigrationStatus(r, this._view) },
                    { value: r.properties.targetMongoConnection.host },
                    { value: (0, utils_1.formatDate)(r.properties.startedOn) },
                    { value: (0, serviceHelper_1.getMigrationDuration)(r.properties.startedOn, r.properties.endedOn) },
                    { value: (0, utils_1.formatDate)(r.properties.endedOn) }
                ];
            });
            this._deleteButton.enabled = false;
            await this._migrationsListTable.setDataValues(data);
            await this._migrationsListTable.updateCssStyles({
                'display': 'block'
            });
            await this._noMigrationsImage.updateCssStyles({
                'display': 'none'
            });
            await this._noMigrationsText.updateCssStyles({
                'display': 'none'
            });
        }
        else {
            await this._migrationsListTable.updateCssStyles({
                'display': 'none'
            });
            await this._noMigrationsImage.updateCssStyles({
                'display': 'block'
            });
            await this._noMigrationsText.updateCssStyles({
                'display': 'block'
            });
        }
    }
    onTabChanged(visible) {
        this.setOrClearAutoRefresh(!visible);
        if (this._isShowingMigrationDetails) {
            this._migrationDetails.updateErrorDetails(visible);
        }
    }
    setOrClearAutoRefresh(clearInterval) {
        if (this._isShowingMigrationDetails) {
            this._migrationDetails.setOrClearAutoRefresh(clearInterval);
        }
        else {
            if (clearInterval || !(0, utils_1.isAutoRefreshRequired)(this._migrations)) {
                this.setAutoRefresh(-1);
            }
            else {
                this.setAutoRefresh(refreshFrequencyMs);
            }
        }
    }
    sortMigrations(migrations, columnName, ascending) {
        const sortDir = ascending ? -1 : 1;
        switch (columnName) {
            case TableColumns.migrationName:
                migrations.sort((m1, m2) => (0, utils_1.stringCompare)(m1.name, m2.name, sortDir));
                return;
            case TableColumns.status:
                migrations.sort((m1, m2) => (0, utils_1.stringCompare)((0, serviceHelper_1.getMigrationStatus)(m1), (0, serviceHelper_1.getMigrationStatus)(m2), sortDir));
                return;
            case TableColumns.targetServer:
                migrations.sort((m1, m2) => (0, utils_1.stringCompare)(m1.properties.targetMongoConnection.host, m2.properties.targetMongoConnection.host, sortDir));
                return;
            case TableColumns.duration:
                migrations.sort((m1, m2) => {
                    if (!m1.properties.startedOn) {
                        return sortDir;
                    }
                    else if (!m2.properties.startedOn) {
                        return -sortDir;
                    }
                    const m1_duration = m1.properties.endedOn.getTime() - m1.properties.startedOn.getTime();
                    const m2_duration = m2.properties.endedOn.getTime() - m2.properties.startedOn.getTime();
                    return m1_duration > m2_duration ? -sortDir : sortDir;
                });
                return;
            case TableColumns.startTime:
                migrations.sort((m1, m2) => {
                    if (!m1.properties.startedOn) {
                        return sortDir;
                    }
                    else if (!m2.properties.startedOn) {
                        return -sortDir;
                    }
                    return new Date(m1.properties.startedOn) > new Date(m2.properties.startedOn) ? -sortDir : sortDir;
                });
                return;
            case TableColumns.endTime:
                migrations.sort((m1, m2) => {
                    if (!m1.properties.endedOn) {
                        return sortDir;
                    }
                    else if (!m2.properties.endedOn) {
                        return -sortDir;
                    }
                    return new Date(m1.properties.endedOn) > new Date(m2.properties.endedOn) ? -sortDir : sortDir;
                });
                return;
        }
    }
    getMigrationStatus(migration, view) {
        const statusImageSize = 14;
        const imageCellStyles = { 'margin': '3px 3px 0 0', 'padding': '0' };
        const statusCellStyles = { 'margin': '0', 'padding': '0' };
        const iconText = view.modelBuilder
            .divContainer()
            .withItems([
            // stage status icon
            view.modelBuilder.image()
                .withProps({
                iconPath: (0, serviceHelper_1.getMigrationStatusImage)(migration),
                iconHeight: statusImageSize,
                iconWidth: statusImageSize,
                height: statusImageSize,
                width: statusImageSize,
                CSSStyles: imageCellStyles
            })
                .component(),
            // stage status text
            view.modelBuilder.text().withProps({
                value: (0, serviceHelper_1.getMigrationStatusString)(migration),
                height: statusImageSize,
                CSSStyles: statusCellStyles,
            }).component()
        ])
            .withProps({ CSSStyles: statusCellStyles, display: 'inline-flex' })
            .component();
        return iconText;
    }
    setAutoRefresh(interval) {
        clearInterval(this._autoRefreshHandle);
        if (interval !== -1) {
            this._autoRefreshHandle = setInterval(async () => { await this.refresh(); }, interval);
        }
    }
    async showMigrations() {
        await this._infoPanel.updateCssStyles({
            'display': 'none'
        });
        await this._migrationDetailsContainer.updateCssStyles({
            'display': 'none'
        });
        await this._toolbarContainer.updateCssStyles({
            'display': 'flex'
        });
        await this._searchAndSortContainer.updateCssStyles({
            'display': 'flex'
        });
        await this._migrationsContainer.updateCssStyles({
            'display': 'flex'
        });
        await this.populateMigrations();
    }
    async createMigrationsListContainer(view) {
        const migrationsContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '850px',
            justifyContent: 'flex-start',
        }).withProps({
            CSSStyles: {
                'padding': '16px'
            }
        }).component();
        this._noMigrationsImage = view.modelBuilder.image().withProps({
            iconPath: iconPathHelper_1.IconPathHelper.blankCanvas,
            iconHeight: 100,
            iconWidth: 100,
            width: 96,
            height: 96,
            CSSStyles: {
                'opacity': '50%',
                'margin': '5% auto',
                'filter': 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                'display': 'none'
            }
        }).component();
        this._noMigrationsText = view.modelBuilder.text().withProps({
            value: constants.NO_MIGRATIONS,
            width: 210,
            height: 34,
            CSSStyles: {
                ...styles.NOTE_CSS,
                'margin': 'auto',
                'text-align': 'center',
                'display': 'none'
            }
        }).component();
        this.createMigrationsListTable();
        await this.refresh();
        migrationsContainer.addItem(this._migrationsListTable);
        migrationsContainer.addItems([this._noMigrationsImage, this._noMigrationsText]);
        return migrationsContainer;
    }
    async createInfoPanel(view) {
        const titleCSS = {
            'font-weight': '500',
            'margin-block-start': '0px',
            'margin-block-end': '0px',
            'font-size': '17px',
            'padding-left': '10px'
        };
        this._migrationTitle = view.modelBuilder.text().withProps({
            value: '',
            CSSStyles: titleCSS
        }).component();
        const allMigrationsBackLink = view.modelBuilder.hyperlink().withProps({
            label: constants.RETURN_MIGRATIONS,
            ariaLabel: constants.RETURN_MIGRATIONS,
            url: '',
            CSSStyles: { 'text-decoration': 'none', 'width': '150px' }
        }).component();
        allMigrationsBackLink.onDidClick(async () => {
            this.statusBar.clearError();
            this._migrationDetails.updateErrorDetails(false /*visible*/);
            this._migrationDetails.setOrClearAutoRefresh(true /*clearInterval*/);
            this._isShowingMigrationDetails = false;
            this.setOrClearAutoRefresh(false /*clearInterval*/);
            await this.showMigrations();
        });
        const infoPanel = view.modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'row'
        }).withProps({
            CSSStyles: {
                'margin': '8px',
                'margin-left': '11px'
            }
        }).component();
        infoPanel.addItem(allMigrationsBackLink, { flex: '0 0 auto' });
        infoPanel.addItem(this._migrationTitle);
        return infoPanel;
    }
    async showMigration(migrationId, migrationName) {
        this._isShowingMigrationDetails = true;
        this.setAutoRefresh(-1);
        await this._toolbarContainer.updateCssStyles({
            'display': 'none'
        });
        await this._searchAndSortContainer.updateCssStyles({
            'display': 'none'
        });
        await this._migrationsContainer.updateCssStyles({
            'display': 'none'
        });
        this._migrationTitle.value = migrationName;
        await this._migrationDetails.clear();
        await this._infoPanel.updateCssStyles({
            'display': 'flex'
        });
        await this._migrationDetailsContainer.updateCssStyles({
            'display': 'flex'
        });
        await this._migrationDetails.showMigrationDetails(migrationId);
    }
    createMigrationsListTable() {
        const rowCssStyle = {
            'border': 'none',
            'text-align': 'left',
            'box-shadow': 'inset 0px -1px 0px #F3F2F1',
            'font-size': '13px',
            'line-height': '18px',
            'padding': '7px 5px',
            'margin': '0px',
        };
        const headerCssStyles = {
            'border': 'none',
            'text-align': 'left',
            'box-shadow': 'inset 0px -1px 0px #F3F2F1',
            'font-weight': 'bold',
            'padding-left': '5px',
            'padding-right': '5px',
            'font-size': '13px',
            'line-height': '18px'
        };
        this._migrationsListTable = this._view.modelBuilder.declarativeTable().withProps({
            ariaLabel: constants.MIGRATIONS,
            width: 1130,
            CSSStyles: {
                'table-layout': 'fixed',
                'border': 'none',
            },
            columns: [
                {
                    displayName: "",
                    valueType: azdata.DeclarativeDataType.string,
                    width: 0,
                    isReadOnly: true,
                    hidden: true
                },
                {
                    displayName: "",
                    valueType: azdata.DeclarativeDataType.boolean,
                    width: 0,
                    isReadOnly: true,
                    hidden: true
                },
                {
                    displayName: "",
                    valueType: azdata.DeclarativeDataType.component,
                    width: 50,
                    isReadOnly: true,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                },
                {
                    displayName: constants.MIGRATION_NAME_LABEL,
                    valueType: azdata.DeclarativeDataType.component,
                    width: 200,
                    isReadOnly: true,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                },
                {
                    displayName: constants.MIGRATION_MODE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 150,
                    isReadOnly: true,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                },
                {
                    displayName: constants.STATUS,
                    valueType: azdata.DeclarativeDataType.component,
                    width: 150,
                    isReadOnly: true,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                },
                {
                    displayName: constants.AZURE_TARGET,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 300,
                    isReadOnly: true,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                },
                {
                    displayName: constants.START_TIME,
                    width: 150,
                    isReadOnly: true,
                    valueType: azdata.DeclarativeDataType.string,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                },
                {
                    displayName: constants.DURATION,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 120,
                    isReadOnly: true,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                },
                {
                    displayName: constants.END_TIME,
                    width: 150,
                    isReadOnly: true,
                    valueType: azdata.DeclarativeDataType.string,
                    headerCssStyles: headerCssStyles,
                    rowCssStyles: rowCssStyle
                }
            ],
            data: []
        }).component();
    }
    async createToolbar() {
        const iconSize = 16;
        const btnHeight = '26px';
        this._newMigration = this._view.modelBuilder.button()
            .withProps({
            label: constants.NEW_MIGRATION,
            ariaLabel: constants.NEW_MIGRATION,
            iconPath: iconPathHelper_1.IconPathHelper.add,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(this._newMigration.onDidClick(async () => {
            await this.launchMigrationWizard();
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
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationsTab, telemetry_1.TelemetryAction.Refresh, {}, {});
        }));
        this._deleteButton = this._view.modelBuilder.button()
            .withProps({
            label: constants.DELETE,
            ariaLabel: constants.DELETE,
            iconPath: iconPathHelper_1.IconPathHelper.delete,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._deleteButton.enabled = false;
        this._disposables.push(this._deleteButton.onDidClick(async () => {
            await this.deleteMigrations();
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MigrationsTab, telemetry_1.TelemetryAction.DeleteMigrations, {}, {});
        }));
        this._refreshLoader = this._view.modelBuilder.loadingComponent()
            .withItem(refreshButton)
            .withProps({
            loading: false,
            CSSStyles: { 'height': '8px', 'margin-top': '6px' }
        }).component();
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
        return this._view.modelBuilder.toolbarContainer()
            .withToolbarItems([
            { component: this._newMigration },
            { component: this._refreshLoader },
            { component: this._deleteButton },
            { component: supportButton },
            { component: feedbackButton }
        ]).component();
    }
    async updateServiceButtonContext(button) {
        const label = await (0, migrationLocalStorage_1.getSelectedServiceStatus)();
        await button.updateProperty('label', '');
        await button.updateProperty('title', '');
        await button.updateProperty('label', label);
        await button.updateProperty('title', label);
    }
    async createSearchAndSortContainer() {
        this._searchBox = this._view.modelBuilder.inputBox()
            .withProps({
            stopEnterPropagation: true,
            placeHolder: constants.SEARCH_FOR_MIGRATIONS,
            width: '200px',
        }).component();
        this._disposables.push(this._searchBox.onTextChanged(async () => await this.populateMigrations()));
        const serviceContextLabel = await (0, migrationLocalStorage_1.getSelectedServiceStatus)();
        this._serviceContextButton = this._view.modelBuilder.button()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.migrationService,
            iconHeight: 22,
            iconWidth: 22,
            label: serviceContextLabel,
            title: serviceContextLabel,
            width: 230,
        })
            .component();
        this._disposables.push(this._serviceContextButton.onDidClick(async () => {
            const dialog = new selectMigrationServiceDialog_1.SelectMigrationServiceDialog(this._serviceContextChangedEvent);
            await dialog.initialize();
        }));
        this._disposables.push(this._serviceContextChangedEvent.event(async () => {
            await this.updateServiceButtonContext(this._serviceContextButton);
            await this.clearMigrations();
            await this.refresh();
        }));
        await this.updateServiceButtonContext(this._serviceContextButton);
        const statusLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.STATUS_LABEL,
            CSSStyles: {
                'font-size': '13px',
                'font-weight': '600',
                'margin': '3px 0 0 0',
            },
        }).component();
        this._statusDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.MIGRATION_STATUS_FILTER,
            values: this._statusDropdownValues,
            width: '150px',
            fireOnTextChange: true,
            value: this._statusDropdownValues[0],
        }).component();
        this._disposables.push(this._statusDropdown.onValueChanged(async () => await this.populateMigrations()));
        const statusContainer = this._view.modelBuilder.flexContainer()
            .withLayout({
            alignContent: 'center',
            alignItems: 'center',
        }).withProps({ CSSStyles: { 'margin-left': '10px' } })
            .component();
        statusContainer.addItem(statusLabel, { flex: '0' });
        statusContainer.addItem(this._statusDropdown, { flex: '0', CSSStyles: { 'margin-left': '5px' } });
        const sortLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.SORT_LABEL,
            ariaLabel: constants.SORT_LABEL,
            CSSStyles: {
                'font-size': '13px',
                'font-weight': '600',
                'margin': '3px 0 0 0',
            },
        }).component();
        this._columnSortDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            editable: false,
            ariaLabel: constants.SORT_DROPDOWN,
            width: 120,
            CSSStyles: { 'margin-left': '5px' },
            value: { name: TableColumns.startTime, displayName: constants.START_TIME },
            values: [
                { name: TableColumns.migrationName, displayName: constants.MIGRATION_NAME_LABEL },
                { name: TableColumns.status, displayName: constants.STATUS_COLUMN },
                { name: TableColumns.targetServer, displayName: constants.AZURE_TARGET },
                { name: TableColumns.duration, displayName: constants.DURATION },
                { name: TableColumns.startTime, displayName: constants.START_TIME },
                { name: TableColumns.endTime, displayName: constants.END_TIME },
            ],
        })
            .component();
        this._disposables.push(this._columnSortDropdown.onValueChanged(async () => await this.populateMigrations()));
        this._columnSortCheckbox = this._view.modelBuilder.checkBox()
            .withProps({
            label: constants.ASCENDING_LABEL,
            checked: false,
            CSSStyles: { 'margin-left': '15px' },
        })
            .component();
        this._disposables.push(this._columnSortCheckbox.onChanged(async () => await this.populateMigrations()));
        const columnSortContainer = this._view.modelBuilder.flexContainer()
            .withItems([sortLabel, this._columnSortDropdown])
            .withProps({
            CSSStyles: {
                'justify-content': 'left',
                'align-items': 'center',
                'padding': '0px',
                'display': 'flex',
                'flex-direction': 'row',
            },
        }).component();
        columnSortContainer.addItem(this._columnSortCheckbox, { flex: '0 0 auto' });
        const flexContainer = this._view.modelBuilder.flexContainer()
            .withProps({
            width: '100%',
            CSSStyles: {
                'justify-content': 'left',
                'align-items': 'center',
                'padding': '0px',
                'display': 'flex',
                'flex-direction': 'row',
                'flex-flow': 'wrap',
            },
        }).component();
        flexContainer.addItem(this._searchBox, { flex: '0', CSSStyles: { 'margin-left': '10px' } });
        flexContainer.addItem(this._serviceContextButton, { flex: '0', CSSStyles: { 'margin-left': '10px' } });
        flexContainer.addItem(statusContainer, { flex: '0', CSSStyles: { 'margin-left': '10px' } });
        flexContainer.addItem(columnSortContainer, { flex: '0', CSSStyles: { 'margin-left': '10px' } });
        const container = this._view.modelBuilder.flexContainer()
            .withProps({ width: '100%' })
            .component();
        container.addItem(flexContainer);
        return container;
    }
}
exports.MigrationsTab = MigrationsTab;
//# sourceMappingURL=migrationsTab.js.map