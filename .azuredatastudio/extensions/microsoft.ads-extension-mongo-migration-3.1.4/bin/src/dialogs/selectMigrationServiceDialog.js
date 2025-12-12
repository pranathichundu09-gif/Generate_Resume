"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectMigrationServiceDialog = exports.BODY_CSS = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
const styles = require("../constants/styles");
const constants = require("../constants/strings");
const servicehelper = require("../services/serviceHelper");
const telemetry_1 = require("../telemetry");
const CONTROL_MARGIN = '20px';
const INPUT_COMPONENT_WIDTH = '100%';
const STYLE_HIDE = { 'display': 'none' };
const STYLE_ShOW = { 'display': 'inline' };
exports.BODY_CSS = {
    'font-size': '13px',
    'line-height': '18px',
    'margin': '4px 0',
};
const LABEL_CSS = {
    ...styles.LABEL_CSS,
    'margin': '0 0 0 0',
    'font-weight': '600',
};
const DROPDOWN_CSS = {
    'margin': '-1em 0 0 0',
};
const TENANT_DROPDOWN_CSS = {
    'margin': '1em 0 0 0',
};
class SelectMigrationServiceDialog {
    onServiceContextChanged;
    _dialog;
    _view;
    _disposables = [];
    _serviceContext;
    _azureAccounts;
    _accountTenants;
    _subscriptions;
    _resourceGroups;
    _migrationServices;
    _azureAccountsDropdown;
    _accountTenantDropdown;
    _accountTenantFlexContainer;
    _azureSubscriptionDropdown;
    _azureResourceGroupDropdown;
    _azureServiceDropdownLabel;
    _azureServiceDropdown;
    _deleteButton;
    constructor(onServiceContextChanged) {
        this.onServiceContextChanged = onServiceContextChanged;
        this._dialog = azdata.window.createModelViewDialog(constants.MIGRATION_SERVICE_SELECT_TITLE, 'SelectMigrationServiceDialog', 460, 'normal');
    }
    async initialize() {
        this._serviceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
        this._dialog.registerContent(async (view) => {
            this._disposables.push(view.onClosed(e => {
                this._disposables.forEach(d => { try {
                    d.dispose();
                }
                catch { /* continue regardless of error*/ } });
            }));
            await this.registerContent(view);
        });
        this._dialog.okButton.label = constants.MIGRATION_SERVICE_SELECT_APPLY_LABEL;
        this._dialog.okButton.position = 'left';
        this._dialog.cancelButton.position = 'left';
        this._deleteButton = azdata.window.createButton(constants.MIGRATION_SERVICE_CLEAR, 'right');
        this._disposables.push(this._deleteButton.onClick(async (value) => {
            await migrationLocalStorage_1.MigrationLocalStorage.saveMigrationServiceContext({}, this.onServiceContextChanged);
            azdata.window.closeDialog(this._dialog);
        }));
        this._dialog.customButtons = [this._deleteButton];
        azdata.window.openDialog(this._dialog);
    }
    async registerContent(view) {
        this._view = view;
        const flexContainer = this._view.modelBuilder
            .flexContainer()
            .withItems([
            this._createHeading(),
            this._createAzureAccountsDropdown(),
            this._createAzureTenantContainer(),
            this._createServiceSelectionContainer(),
        ])
            .withLayout({ flexFlow: 'column' })
            .withProps({ CSSStyles: { 'padding': CONTROL_MARGIN } })
            .component();
        await this._view.initializeModel(flexContainer);
        await this._populateAzureAccountsDropdown();
    }
    _createHeading() {
        return this._view.modelBuilder.text()
            .withProps({
            value: constants.MIGRATION_SERVICE_SELECT_HEADING,
            CSSStyles: { ...styles.BODY_CSS }
        }).component();
    }
    _createAzureAccountsDropdown() {
        const azureAccountLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.ACCOUNTS_SELECTION_PAGE_TITLE,
            requiredIndicator: true,
            CSSStyles: { ...LABEL_CSS }
        }).component();
        this._azureAccountsDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.ACCOUNTS_SELECTION_PAGE_TITLE,
            width: INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_AN_ACCOUNT,
            CSSStyles: { ...DROPDOWN_CSS },
        }).component();
        this._disposables.push(this._azureAccountsDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedAccount = this._azureAccounts.find(account => account.displayInfo.displayName === value);
                this._serviceContext.azureAccount = selectedAccount
                    ? servicehelper.deepClone(selectedAccount)
                    : undefined;
            }
            else {
                this._serviceContext.azureAccount = undefined;
            }
            await servicehelper.clearDropDown(this._accountTenantDropdown);
            await this._populateTentantsDropdown();
        }));
        const linkAccountButton = this._view.modelBuilder.hyperlink()
            .withProps({
            label: constants.ACCOUNT_LINK_BUTTON_LABEL,
            url: '',
            CSSStyles: { ...styles.BODY_CSS },
        }).component();
        this._disposables.push(linkAccountButton.onDidClick(async (event) => {
            await vscode.commands.executeCommand('workbench.actions.modal.linkedAccount');
            await this._populateAzureAccountsDropdown();
        }));
        return this._view.modelBuilder.flexContainer()
            .withLayout({ flexFlow: 'column' })
            .withItems([
            azureAccountLabel,
            this._azureAccountsDropdown,
            linkAccountButton,
        ]).component();
    }
    _createAzureTenantContainer() {
        const azureTenantDropdownLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.AZURE_TENANT,
            CSSStyles: { ...LABEL_CSS, ...TENANT_DROPDOWN_CSS },
        }).component();
        this._accountTenantDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.AZURE_TENANT,
            width: INPUT_COMPONENT_WIDTH,
            editable: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_A_TENANT,
        }).component();
        this._disposables.push(this._accountTenantDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedTenant = this._accountTenants.find(tenant => tenant.displayName === value);
                this._serviceContext.tenant = selectedTenant
                    ? servicehelper.deepClone(selectedTenant)
                    : undefined;
            }
            else {
                this._serviceContext.tenant = undefined;
            }
            await servicehelper.clearDropDown(this._azureSubscriptionDropdown);
            await this._populateSubscriptionDropdown();
        }));
        this._accountTenantFlexContainer = this._view.modelBuilder.flexContainer()
            .withLayout({ flexFlow: 'column' })
            .withItems([
            azureTenantDropdownLabel,
            this._accountTenantDropdown,
        ])
            .withProps({ CSSStyles: { ...STYLE_HIDE, } })
            .component();
        return this._accountTenantFlexContainer;
    }
    _createServiceSelectionContainer() {
        const subscriptionDropdownLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.SUBSCRIPTION,
            description: constants.DMS_SUBSCRIPTION_INFO,
            requiredIndicator: true,
            CSSStyles: { ...LABEL_CSS }
        }).component();
        this._azureSubscriptionDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.SUBSCRIPTION,
            width: INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_A_SUBSCRIPTION,
            CSSStyles: { ...DROPDOWN_CSS },
        }).component();
        this._disposables.push(this._azureSubscriptionDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedSubscription = this._subscriptions.find(subscription => `${subscription.name} - ${subscription.id}` === value);
                this._serviceContext.subscription = selectedSubscription
                    ? servicehelper.deepClone(selectedSubscription)
                    : undefined;
            }
            else {
                this._serviceContext.subscription = undefined;
            }
            await servicehelper.clearDropDown(this._azureResourceGroupDropdown);
            await this._populateResourceGroupDropdown();
        }));
        const azureResourceGroupLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.RESOURCE_GROUP,
            description: constants.DMS_RESOURCE_GROUP_INFO,
            requiredIndicator: true,
            CSSStyles: { ...LABEL_CSS }
        }).component();
        this._azureResourceGroupDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.RESOURCE_GROUP,
            width: INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_A_RESOURCE_GROUP,
            CSSStyles: { ...DROPDOWN_CSS },
        }).component();
        this._disposables.push(this._azureResourceGroupDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedResourceGroup = this._resourceGroups.find(rg => rg.name === value);
                this._serviceContext.resourceGroup = selectedResourceGroup
                    ? servicehelper.deepClone(selectedResourceGroup)
                    : undefined;
            }
            else {
                this._serviceContext.resourceGroup = undefined;
            }
            await servicehelper.clearDropDown(this._azureServiceDropdown);
            this._populateMigrationServiceDropdown();
        }));
        this._azureServiceDropdownLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.MIGRATION_SERVICE_SELECT_SERVICE_LABEL,
            description: constants.TARGET_RESOURCE_INFO,
            requiredIndicator: true,
            CSSStyles: { ...LABEL_CSS }
        }).component();
        this._azureServiceDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.MIGRATION_SERVICE_SELECT_SERVICE_LABEL,
            width: INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_A_SERVICE,
            CSSStyles: { ...DROPDOWN_CSS },
        }).component();
        this._disposables.push(this._azureServiceDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedDms = this._migrationServices.find(dms => dms.name === value);
                this._serviceContext.migrationService = selectedDms
                    ? servicehelper.deepClone(selectedDms)
                    : undefined;
            }
            else {
                this._serviceContext.migrationService = undefined;
            }
            await this._updateButtonState();
        }));
        this._disposables.push(this._dialog.okButton.onClick(async (value) => await migrationLocalStorage_1.MigrationLocalStorage.saveMigrationServiceContext(this._serviceContext, this.onServiceContextChanged)));
        return this._view.modelBuilder.flexContainer()
            .withItems([
            subscriptionDropdownLabel,
            this._azureSubscriptionDropdown,
            azureResourceGroupLabel,
            this._azureResourceGroupDropdown,
            this._azureServiceDropdownLabel,
            this._azureServiceDropdown,
        ]).withLayout({ flexFlow: 'column' })
            .component();
    }
    async _updateButtonState() {
        this._dialog.okButton.enabled = this._serviceContext.migrationService !== undefined;
    }
    async _populateAzureAccountsDropdown() {
        try {
            this._azureAccountsDropdown.loading = true;
            await servicehelper.clearDropDown(this._azureAccountsDropdown);
            this._azureAccounts = await servicehelper.getAzureAccounts();
            this._azureAccountsDropdown.values = await servicehelper.getAzureAccountsDropdownValues(this._azureAccounts);
            servicehelper.selectDefaultDropdownValue(this._azureAccountsDropdown, this._serviceContext.azureAccount?.displayInfo?.userId, false);
        }
        catch (err) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SelectMigrationServiceDialog, telemetry_1.TelemetryAction.PopulateAzureAccountsFailed, { error: err });
            void vscode.window.showErrorMessage(constants.SELECT_ACCOUNT_ERROR, err.message);
        }
        finally {
            this._azureAccountsDropdown.loading = false;
        }
    }
    async _populateTentantsDropdown() {
        try {
            this._accountTenantDropdown.loading = true;
            this._accountTenants = servicehelper.getAzureTenants(this._serviceContext.azureAccount);
            this._accountTenantDropdown.values = servicehelper.getAzureTenantsDropdownValues(this._accountTenants);
            await this._accountTenantFlexContainer.updateCssStyles(this._accountTenants.length > 1
                ? STYLE_ShOW
                : STYLE_HIDE);
            servicehelper.selectDefaultDropdownValue(this._accountTenantDropdown, this._serviceContext.tenant?.id, false);
        }
        catch (error) {
            void vscode.window.showErrorMessage(constants.SELECT_TENANT_ERROR, error.message);
        }
        finally {
            this._accountTenantDropdown.loading = false;
        }
    }
    async _populateSubscriptionDropdown() {
        try {
            this._azureSubscriptionDropdown.loading = true;
            this._subscriptions = await servicehelper.getAzureSubscriptions(this._serviceContext.azureAccount, this._serviceContext.tenant?.id);
            this._azureSubscriptionDropdown.values = await servicehelper.getAzureSubscriptionsDropdownValues(this._subscriptions);
            servicehelper.selectDefaultDropdownValue(this._azureSubscriptionDropdown, this._serviceContext.subscription?.id, false);
        }
        catch (err) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SelectMigrationServiceDialog, telemetry_1.TelemetryAction.PopulateAzureSubscriptionsFailed, { error: err });
            void vscode.window.showErrorMessage(constants.SELECT_SUBSCRIPTION_ERROR, err.message);
        }
        finally {
            this._azureSubscriptionDropdown.loading = false;
        }
    }
    async _populateResourceGroupDropdown() {
        try {
            this._azureResourceGroupDropdown.loading = true;
            this._migrationServices = await servicehelper.getAzureDataMigrationServices(this._serviceContext.azureAccount, this._serviceContext.subscription);
            this._resourceGroups = servicehelper.getServiceResourceGroups(this._migrationServices);
            this._azureResourceGroupDropdown.values = servicehelper.getResourceDropdownValues(this._resourceGroups, constants.RESOURCE_GROUP_NOT_FOUND);
            servicehelper.selectDefaultDropdownValue(this._azureResourceGroupDropdown, this._serviceContext.resourceGroup?.id, false);
        }
        catch (err) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SelectMigrationServiceDialog, telemetry_1.TelemetryAction.PopulateMigrationServicesFailed, { error: err });
            void vscode.window.showErrorMessage(constants.SELECT_RESOURCE_GROUP_ERROR, err.message);
        }
        finally {
            this._azureResourceGroupDropdown.loading = false;
        }
    }
    _populateMigrationServiceDropdown() {
        try {
            this._azureServiceDropdown.loading = true;
            this._azureServiceDropdown.values = servicehelper.getAzureResourceDropdownValuesFromResourceGroup(this._migrationServices, this._serviceContext.resourceGroup?.name, constants.MIGRATION_SERVICE_NOT_FOUND_ERROR);
            servicehelper.selectDefaultDropdownValue(this._azureServiceDropdown, this._serviceContext?.migrationService?.id, false);
        }
        catch (error) {
            void vscode.window.showErrorMessage(constants.SELECT_SERVICE_ERROR, error.message);
        }
        finally {
            this._azureServiceDropdown.loading = false;
        }
    }
}
exports.SelectMigrationServiceDialog = SelectMigrationServiceDialog;
//# sourceMappingURL=selectMigrationServiceDialog.js.map