"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=mongoMigrationDashboard.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the dashboard of the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardTab = exports.DashboardTabId = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const styles = require("../constants/styles");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const parentTab_1 = require("./parentTab");
const constants = require("../constants/strings");
const utils_1 = require("../common/utils");
const migrationsTab_1 = require("./migrationsTab");
const extension_1 = require("../extension");
const telemetry_1 = require("../telemetry");
const localizationFile_1 = require("../localizationFile");
const constants_1 = require("../constants");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
const selectMigrationServiceDialog_1 = require("../dialogs/selectMigrationServiceDialog");
const styles_1 = require("../constants/styles");
const serviceHelper_1 = require("../services/serviceHelper");
exports.DashboardTabId = 'MainTab';
const maxWidth = 800;
const refreshFrequencyMs = 15000;
class DashboardTab extends parentTab_1.ParentTab {
    _autoRefreshHandle;
    _disposables = [];
    _assessmentId;
    _assessmentName;
    newAssessmentButtonMetadata;
    _migrationsTab;
    _selectServiceText;
    _refreshButton;
    _migrationMappingTable;
    _migrationStatusCardLoadingContainer;
    _migrationStatusCardsContainer;
    _migrations;
    isRefreshing = false;
    constructor(extensionContext, serviceContextChangedEvent, migrationDetailsPerMigrationService) {
        super(extensionContext, serviceContextChangedEvent, constants.DASHBOARD, exports.DashboardTabId, migrationDetailsPerMigrationService);
        this._serviceContextChangedEvent = serviceContextChangedEvent;
    }
    async tabContent(view, migrationsTab) {
        if (migrationsTab !== undefined) {
            this._migrationsTab = migrationsTab;
        }
        const container = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '100%',
            height: '100%'
        }).component();
        container.addItem(await this.createToolbar(view), {
            flex: '0 0 auto', CSSStyles: {
                'border-top': '2px solid rgb(221, 221, 221)'
            }
        });
        const header = this.createHeader(view);
        // Files need to have the vscode-file scheme to be loaded by ADS
        const watermarkUri = vscode.Uri.file(iconPathHelper_1.IconPathHelper.dashboardBackground.light).with({ scheme: 'vscode-file' });
        container.addItem(header, {
            CSSStyles: {
                'background-image': `
						url(${watermarkUri}),
						linear-gradient(0deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 60%)
					`,
                'background-repeat': 'no-repeat',
                'background-position': '92% 100%',
                'margin-bottom': '20px',
            }
        });
        const tasksContainer = await this.createTasks(view);
        header.addItem(tasksContainer, {
            CSSStyles: {
                'width': `${maxWidth}px`,
                'margin': '24px'
            }
        });
        container.addItem(await this.createFooter(view), {
            CSSStyles: {
                'margin': '0 24px'
            }
        });
        this._disposables.push(this._view.onClosed(() => {
            clearInterval(this._autoRefreshHandle);
            this._disposables.forEach(d => { d.dispose(); });
        }));
        return container;
    }
    // Creates primary buttons on the dashboard
    createTaskButton(view, taskMetaData) {
        const maxHeight = 84;
        const maxWidth = 270;
        const buttonContainer = view.modelBuilder.button().withProps({
            buttonType: azdata.ButtonType.Informational,
            description: taskMetaData.description,
            height: maxHeight,
            iconHeight: 32,
            iconPath: taskMetaData.iconPath,
            iconWidth: 32,
            label: taskMetaData.title,
            title: taskMetaData.title,
            width: maxWidth,
            CSSStyles: {
                'border': '1px solid',
                'display': 'flex',
                'flex-direction': 'column',
                'justify-content': 'flex-start',
                'border-radius': '4px',
                'transition': 'all .5s ease',
            }
        }).component();
        this._disposables.push(buttonContainer.onDidClick(async () => {
            await this.launchMigrationWizard();
        }));
        return view.modelBuilder.divContainer().withItems([buttonContainer]).component();
    }
    createMigrationHyperlink(migrationName, migrationId) {
        const migrationHyperlink = this._view.modelBuilder.hyperlink().withProps({
            label: migrationName,
            url: '',
            CSSStyles: { 'text-decoration': 'none' }
        }).component();
        migrationHyperlink.onDidClick(() => {
            this._migrationsTab.showMigration(migrationId, migrationName);
            extension_1.tabMap.get(this)?.selectTab(migrationsTab_1.MigrationsTabId);
        });
        return migrationHyperlink;
    }
    async createFooter(view) {
        const footerContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'row',
            width: '500px',
            justifyContent: 'flex-start'
        }).component();
        const statusContainer = await this._createMigrationStatusContainer(view);
        const videoLinksContainer = this.createSupportContainer(view);
        footerContainer.addItem(statusContainer);
        footerContainer.addItem(videoLinksContainer, {
            CSSStyles: {
                'padding-left': '8px',
            }
        });
        return footerContainer;
    }
    async _createMigrationStatusContainer(view) {
        const statusContainer = view.modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'column',
            width: '400px',
            height: '436px',
            justifyContent: 'flex-start',
        })
            .withProps({
            CSSStyles: {
                'border': '1px solid rgba(0, 0, 0, 0.1)',
                'padding': '10px',
            }
        })
            .component();
        const statusContainerTitle = view.modelBuilder.text()
            .withProps({
            value: constants.VIEW_MIGRATIONS_STATUS_TITLE,
            width: '100%',
            CSSStyles: { ...styles.SECTION_HEADER_CSS }
        }).component();
        this._refreshButton = view.modelBuilder.button()
            .withProps({
            label: constants.REFRESH,
            iconPath: iconPathHelper_1.IconPathHelper.refresh,
            iconHeight: 16,
            iconWidth: 16,
            width: 70,
            CSSStyles: { 'float': 'right' }
        }).component();
        const statusHeadingContainer = view.modelBuilder.flexContainer()
            .withItems([
            statusContainerTitle,
            this._refreshButton,
        ]).withLayout({
            alignContent: 'center',
            alignItems: 'center',
            flexFlow: 'row',
        }).component();
        this._disposables.push(this._refreshButton.onDidClick(async () => {
            await this.refresh();
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MongoMigrationDashboard, telemetry_1.TelemetryAction.Refresh, {}, {});
        }));
        const buttonContainer = view.modelBuilder.flexContainer()
            .withProps({
            CSSStyles: {
                'justify-content': 'left'
            },
        })
            .component();
        buttonContainer.addItem(await this._createServiceSelector(view));
        const header = view.modelBuilder.flexContainer()
            .withItems([statusHeadingContainer, buttonContainer])
            .withLayout({ flexFlow: 'column', })
            .component();
        this._selectServiceText = view.modelBuilder.text()
            .withProps({
            value: constants.MIGRATION_STATUS_SELECT_SERVICE_TEXT,
            CSSStyles: {
                'font-size': '12px',
                'margin': '10px',
                'font-weight': '350',
                'text-align': 'center',
                'display': 'none'
            }
        }).component();
        this._migrationMappingTable = this._view.modelBuilder
            .declarativeTable()
            .withProps({
            ariaLabel: constants.DATABASES_TABLE_TILE,
            width: 400,
            CSSStyles: {
                "table-layout": "fixed",
                "border": "none",
            },
            columns: [
                {
                    displayName: constants.MIGRATION_NAME_LABEL,
                    valueType: azdata.DeclarativeDataType.component,
                    width: 200,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                    rowCssStyles: styles_1.styleLeft
                },
                {
                    displayName: constants.MIGRATION_STATUS_LABEL,
                    valueType: azdata.DeclarativeDataType.component,
                    width: 200,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                    rowCssStyles: styles_1.styleLeft
                },
            ],
        })
            .component();
        this._migrationStatusCardsContainer = view.modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'column',
            height: '272px',
        })
            .withProps({ CSSStyles: { 'overflow': 'hidden auto' } })
            .component();
        await this._updateSummaryStatus();
        this._migrationStatusCardsContainer.addItem(this._migrationMappingTable, { flex: '0 0 auto' });
        this._migrationStatusCardLoadingContainer = view.modelBuilder.loadingComponent()
            .withItem(this._migrationStatusCardsContainer)
            .component();
        this._migrationStatusCardLoadingContainer.loading = false;
        statusContainer.addItem(header, { CSSStyles: { 'margin-bottom': '10px' } });
        statusContainer.addItem(this._selectServiceText, {});
        statusContainer.addItem(this._migrationStatusCardLoadingContainer, {});
        await this._updateMigrations();
        return statusContainer;
    }
    async _createServiceSelector(view) {
        const serviceContextLabel = constants.SELECT_MIGRATION_SERVICE;
        const serviceContextButton = view.modelBuilder.button()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.migrationService,
            iconHeight: 22,
            iconWidth: 22,
            label: serviceContextLabel,
            title: serviceContextLabel,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'margin': '4px 0',
                'text-align': 'left',
            },
        })
            .component();
        this._disposables.push(serviceContextButton.onDidClick(async () => {
            const dialog = new selectMigrationServiceDialog_1.SelectMigrationServiceDialog(this._serviceContextChangedEvent);
            await dialog.initialize();
        }));
        this._disposables.push(this._serviceContextChangedEvent.event(async (e) => {
            await this.updateServiceButtonContext(serviceContextButton);
            await this.refresh();
        }));
        await this.updateServiceButtonContext(serviceContextButton);
        return serviceContextButton;
    }
    async refresh() {
        if (this.isRefreshing || this._migrationStatusCardLoadingContainer === undefined) {
            return;
        }
        try {
            this.isRefreshing = true;
            this._refreshButton.enabled = false;
            this._migrationStatusCardLoadingContainer.loading = true;
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
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MongoMigrationDashboard, telemetry_1.TelemetryAction.AutoRefresh, telemetryProps, {});
            }
            this._migrations.sort((m1, m2) => {
                if (!m1.properties.startedOn) {
                    return 1;
                }
                else if (!m2.properties.startedOn) {
                    return -1;
                }
                return new Date(m1.properties.startedOn) > new Date(m2.properties.startedOn) ? -1 : 1;
            });
            const migrationMappingTableValues = [];
            for (let i = 0; i < this._migrations.length; i++) {
                const textComponent = this._view.modelBuilder.text()
                    .withProps({
                    value: (0, serviceHelper_1.getMigrationStatusString)(this._migrations[i]),
                    title: this._migrations[i].properties.migrationStatus,
                    width: '300px',
                    CSSStyles: {
                        'font-size': '13px',
                        'line-height': '18px',
                        'margin': '2px 15px 2px 0',
                        'overflow': 'hidden',
                        'text-overflow': 'ellipsis',
                        'display': 'inline-block',
                        'float': 'left',
                        'white-space': 'nowrap',
                    }
                }).component();
                const statusImageSize = 14;
                const iconComponent = this._view.modelBuilder.image()
                    .withProps({
                    iconPath: (0, serviceHelper_1.getMigrationStatusImage)(this._migrations[i]),
                    iconHeight: statusImageSize,
                    iconWidth: statusImageSize,
                    height: statusImageSize,
                    width: statusImageSize,
                    title: this._migrations[i].properties.migrationStatus,
                    CSSStyles: {
                        'margin': '4px 4px 0 0',
                        'padding': '0'
                    }
                }).component();
                const iconTextComponent = this._view.modelBuilder.flexContainer()
                    .withItems([iconComponent, textComponent])
                    .withProps({
                    CSSStyles: {
                        'margin': '0',
                        'padding': '0',
                        'height': '18px',
                    },
                    display: 'inline-flex'
                }).component();
                migrationMappingTableValues.push([
                    {
                        value: this.createMigrationHyperlink(this._migrations[i].name, this._migrations[i].id)
                    },
                    {
                        value: iconTextComponent
                    }
                ]);
            }
            this._migrationMappingTable.setDataValues(migrationMappingTableValues);
            this._migrationMappingTable.display = '';
            await this._updateSummaryStatus();
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
            this._migrationStatusCardLoadingContainer.loading = false;
            this._refreshButton.enabled = true;
            this.isRefreshing = false;
        }
    }
    onTabChanged(visible) {
        this.setOrClearAutoRefresh(!visible);
    }
    setOrClearAutoRefresh(clearInterval) {
        if (clearInterval || !(0, utils_1.isAutoRefreshRequired)(this._migrations)) {
            this.setAutoRefresh(-1);
        }
        else {
            this.setAutoRefresh(refreshFrequencyMs);
        }
    }
    async createTasks(view) {
        const tasksContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'row',
            width: '100%',
        }).component();
        this.newAssessmentButtonMetadata = {
            title: constants.RUN_NEW_MIGRATION,
            description: constants.NEW_ASSESSMENT_DESCRIPTION,
            iconPath: iconPathHelper_1.IconPathHelper.mongoAssessmentLogo,
            command: ''
        };
        const assessmentButton = this.createTaskButton(view, this.newAssessmentButtonMetadata);
        assessmentButton.ariaRole = 'button';
        tasksContainer.addItems([assessmentButton], {});
        return tasksContainer;
    }
    setAutoRefresh(interval) {
        clearInterval(this._autoRefreshHandle);
        if (interval !== -1) {
            this._autoRefreshHandle = setInterval(async () => { await this.refresh(); }, interval);
        }
    }
    createHeader(view) {
        const header = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: maxWidth,
        }).component();
        const titleComponent = view.modelBuilder.text().withProps({
            value: constants.EXTENSION_NAME,
            width: '750px',
            CSSStyles: {
                ...styles.DASHBOARD_TITLE_CSS
            }
        }).component();
        const descriptionComponent = view.modelBuilder.text().withProps({
            value: constants.EXTENSION_DESCRIPTION,
            CSSStyles: {
                ...styles.NOTE_CSS
            }
        }).component();
        header.addItems([titleComponent, descriptionComponent], {
            CSSStyles: {
                'width': `${maxWidth}px`,
                'padding-left': '24px'
            }
        });
        return header;
    }
    async createToolbar(view) {
        const iconSize = 16;
        const btnHeight = '26px';
        const newMigrationButton = view.modelBuilder.button()
            .withProps({
            label: constants.NEW_MIGRATION,
            ariaRole: 'button',
            iconPath: iconPathHelper_1.IconPathHelper.add,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(newMigrationButton.onDidClick(async () => {
            await this.launchMigrationWizard();
        }));
        const supportButton = view.modelBuilder.button()
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
        const feedbackButton = view.modelBuilder.button()
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
        return view.modelBuilder.toolbarContainer()
            .withToolbarItems([
            { component: newMigrationButton },
            { component: supportButton },
            { component: feedbackButton }
        ]).component();
    }
    createSupportContainer(view) {
        const supportContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '400px',
            height: '300px',
            justifyContent: 'flex-start',
        }).withProps({
            CSSStyles: {
                'border': '1px solid rgba(0, 0, 0, 0.1)',
                'padding': '10px'
            }
        }).component();
        const titleComponent = view.modelBuilder.text().withProps({
            value: (0, localizationFile_1.localize)('mongo.migration.help', "Help Articles"),
            CSSStyles: {
                ...styles.SECTION_HEADER_CSS
            }
        }).component();
        supportContainer.addItems([titleComponent], {
            CSSStyles: {
                'margin-bottom': '16px'
            }
        });
        const links = [{
                title: constants.PRE_MIGRATE_MONGO,
                description: constants.PRE_MIGRATE_MONGO_DES,
                link: constants_1.preMigrationDocumentation
            },
            {
                title: constants.MIGRATE_COSMOS,
                description: constants.MIGRATE_COSMOS_DES,
                link: constants_1.mongoMigrationDocumentation
            },
            {
                title: constants.MIGRATION_FAQ_TITLE,
                description: constants.MIGRATION_FAQ,
                link: constants_1.migrationFaqDocumentation
            },
            {
                title: constants.DATA_ASSESSMENT_TITLE,
                description: constants.DATA_ASSESSMENT_DES,
                link: constants_1.dataAssessmentDocumentation
            }];
        supportContainer.addItems(links.map(l => this.createLink(view, l)), {
            CSSStyles: {
                'margin-bottom': '8px'
            }
        });
        return supportContainer;
    }
    createLink(view, linkMetaData) {
        const maxWidth = 400;
        const labelsContainer = view.modelBuilder.flexContainer().withProps({
            CSSStyles: {
                'flex-direction': 'column',
                'width': `${maxWidth}px`,
                'justify-content': 'flex-start'
            }
        }).component();
        const linkContainer = view.modelBuilder.flexContainer().withProps({
            CSSStyles: {
                'flex-direction': 'row',
                'width': `${maxWidth + 10}px`,
                'justify-content': 'flex-start',
                'margin-bottom': '4px'
            }
        }).component();
        const descriptionComponent = view.modelBuilder.text().withProps({
            value: linkMetaData.description,
            width: maxWidth,
            CSSStyles: {
                ...styles.NOTE_CSS
            }
        }).component();
        const linkComponent = view.modelBuilder.hyperlink().withProps({
            label: linkMetaData.title || '',
            url: linkMetaData.link || '',
            showLinkIcon: true,
            CSSStyles: {
                ...styles.BODY_CSS
            }
        }).component();
        linkContainer.addItem(linkComponent);
        labelsContainer.addItems([linkContainer, descriptionComponent]);
        return labelsContainer;
    }
    async _updateSummaryStatus() {
        const serviceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
        const isContextValid = (0, migrationLocalStorage_1.isServiceContextValid)(serviceContext);
        await this._selectServiceText.updateCssStyles({ 'display': isContextValid ? 'none' : 'block' });
        await this._migrationStatusCardsContainer.updateCssStyles({ 'visibility': isContextValid ? 'visible' : 'hidden' });
        this._refreshButton.enabled = isContextValid;
    }
    async updateServiceButtonContext(button) {
        const label = await (0, migrationLocalStorage_1.getSelectedServiceStatus)();
        await button.updateProperty('label', '');
        await button.updateProperty('title', '');
        await button.updateProperty('label', label);
        await button.updateProperty('title', label);
    }
    async _updateMigrations() {
        const serviceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
        if ((0, migrationLocalStorage_1.isServiceContextValid)(serviceContext)) {
            await this.refresh();
        }
    }
}
exports.DashboardTab = DashboardTab;
//# sourceMappingURL=mongoMigrationDashboard.js.map