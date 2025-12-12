"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetSelectionPage = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const os_1 = require("os");
const migrationWizardPage_1 = require("../models/migrationWizardPage");
const constants = require("../constants/strings");
const styles = require("../constants/styles");
const wizardController_1 = require("./wizardController");
const servicehelper = require("../services/serviceHelper");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
const common_1 = require("../contracts/common");
const utils_1 = require("../common/utils");
const telemetry_1 = require("../telemetry");
const uuid_1 = require("uuid");
class TargetSelectionPage extends migrationWizardPage_1.MigrationWizardPage {
    _view;
    _disposables = [];
    _pageDescription;
    _azureAccountsDropdown;
    _accountTenantDropdown;
    _accountTenantFlexContainer;
    _azureSubscriptionDropdown;
    _azureResourceGroupLabel;
    _azureResourceGroupDropdown;
    _azureResourceDropdownLabel;
    _azureResourceDropdown;
    _resourceSelectionContainer;
    _resourceAuthenticationContainer;
    _connectionParametersRadioButton;
    _connectionStringRadioButton;
    _connectionCredentialContainer;
    _connectionStringContainer;
    _connectionTestContainer;
    _targetUserNameInputBox;
    _targetPasswordInputBox;
    _targetConnectionStringInputBox;
    _testConnectionButton;
    _connectionResultsInfoBox;
    _migrationTargetOffering;
    _serviceContext;
    _connectionSuccessful = false;
    constructor(wizard, migrationStateModel) {
        super(wizard, azdata.window.createWizardPage(constants.AZURE_TARGET_PAGE_TITLE), migrationStateModel);
    }
    async registerContent(view) {
        this._view = view;
        this._serviceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
        this._pageDescription = this._view.modelBuilder.text()
            .withProps({
            value: constants.AZURE_TARGET_PAGE_DESCRIPTION(),
            CSSStyles: { ...styles.BODY_CSS, 'margin': '0' }
        }).component();
        const form = this._view.modelBuilder.formContainer()
            .withFormItems([
            { component: this._pageDescription },
            { component: this.createAzureAccountsDropdown() },
            { component: this.createAzureTenantContainer() },
            { component: this.createTargetDropdownContainer() },
        ]).withProps({
            CSSStyles: { 'padding-top': '0' }
        }).component();
        this._disposables.push(this._view.onClosed(e => {
            this._disposables.forEach(d => {
                // eslint-disable-next-line no-empty
                try {
                    d.dispose();
                }
                catch {
                }
            });
        }));
        await this._view.initializeModel(form);
    }
    async onPageEnter(pageChangeInfo) {
        this.migrationStateModel.targetConnectionString = this._targetConnectionStringInputBox.value;
        this.migrationStateModel.targetUserName = this._targetUserNameInputBox.value;
        this.migrationStateModel.targetPassword = this._targetPasswordInputBox.value;
        this.updateNextButton();
        await servicehelper.updateControlDisplay(this._connectionResultsInfoBox, false);
        this.wizard.registerNavigationValidator((pageChangeInfo) => {
            this.wizard.message = { text: '' };
            if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
                return true;
            }
            const errors = [];
            if (!this.migrationStateModel.azureAccount) {
                errors.push(constants.INVALID_ACCOUNT_ERROR);
            }
            if (!this.migrationStateModel.targetSubscription ||
                this._azureSubscriptionDropdown.value?.displayName === constants.NO_SUBSCRIPTIONS_FOUND) {
                errors.push(constants.INVALID_SUBSCRIPTION_ERROR);
            }
            if (!this.migrationStateModel.resourceGroup ||
                this._azureResourceGroupDropdown.value?.displayName === constants.RESOURCE_GROUP_NOT_FOUND) {
                errors.push(constants.INVALID_RESOURCE_GROUP_ERROR);
            }
            const resourceDropdownValue = this._azureResourceDropdown.value?.displayName;
            switch (this.migrationStateModel.targetOffering) {
                case common_1.EnumTargetOffering.CosmosDBMongoRU: {
                    const targetRU = this.migrationStateModel.targetCosmosInstance;
                    if (!targetRU || resourceDropdownValue === constants.NO_RU_INSTANCE_FOUND) {
                        errors.push(constants.INVALID_RU_INSTANCE_ERROR);
                    }
                    break;
                }
                case common_1.EnumTargetOffering.CosmosDBMongovCore: {
                    const targetvCore = this.migrationStateModel.targetCosmosInstance;
                    if (!targetvCore || resourceDropdownValue === constants.NO_VCORE_INSTANCE_FOUND) {
                        errors.push(constants.INVALID_VCORE_INSTANCE_ERROR);
                    }
                    break;
                }
            }
            if (errors.length > 0) {
                this.wizard.message = {
                    text: errors.join(os_1.EOL),
                    level: azdata.window.MessageLevel.Error
                };
                return false;
            }
            return true;
        });
        if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
            return;
        }
        switch (this.migrationStateModel.targetOffering) {
            case common_1.EnumTargetOffering.CosmosDBMongoRU:
                this._pageDescription.value = constants.AZURE_TARGET_PAGE_DESCRIPTION(constants.AZURE_TARGET_RU_OFFERING);
                this._azureResourceDropdownLabel.value = constants.AZURE_TARGET_RU_OFFERING;
                this._azureResourceDropdown.ariaLabel = constants.AZURE_TARGET_RU_OFFERING;
                break;
            case common_1.EnumTargetOffering.CosmosDBMongovCore:
                this._pageDescription.value = constants.AZURE_TARGET_PAGE_DESCRIPTION(constants.AZURE_TARGET_VCORE_OFFERING);
                this._azureResourceDropdownLabel.value = constants.AZURE_TARGET_VCORE_OFFERING;
                this._azureResourceDropdown.ariaLabel = constants.AZURE_TARGET_VCORE_OFFERING;
                break;
        }
        if (this._migrationTargetOffering !== this.migrationStateModel.targetOffering) {
            // if the user had previously selected values on this page, then went back to change the migration target platform
            // and came back, forcibly reload the location/resource group/resource values since they will now be different
            this._migrationTargetOffering = this.migrationStateModel.targetOffering;
            this._targetPasswordInputBox.value = '';
            this.migrationStateModel.dataMigrationServices = undefined;
            this.migrationStateModel.azureAccount = undefined;
            this.migrationStateModel.azureTenant = undefined;
            this.migrationStateModel.targetSubscription = undefined;
            this.migrationStateModel.resourceGroup = undefined;
            this.migrationStateModel.targetCosmosInstance = undefined;
            await servicehelper.clearDropDown(this._azureAccountsDropdown);
            await servicehelper.clearDropDown(this._accountTenantDropdown);
            await servicehelper.clearDropDown(this._azureSubscriptionDropdown);
            await servicehelper.clearDropDown(this._azureResourceGroupDropdown);
            await servicehelper.clearDropDown(this._azureResourceDropdown);
        }
        await this.populateAzureAccountsDropdown();
        await this.populateTenantsDropdown();
        await this.populateSubscriptionDropdown();
        await this.populateResourceGroupDropdown();
        await this.populateResourceInstanceDropdown();
    }
    async onPageLeave(pageChangeInfo) {
        this.wizard.registerNavigationValidator(pageChangeInfo => true);
        this.wizard.message = { text: '' };
        if (pageChangeInfo.newPage > pageChangeInfo.lastPage) {
            const telemetryProps = this.migrationStateModel.getDefaultTelemetryProps();
            telemetryProps[telemetry_1.TelemetryPropNames.TargetAccount] = this._azureResourceDropdown.value?.displayName;
            telemetryProps[telemetry_1.TelemetryPropNames.TargetResourceGroup] = this.migrationStateModel.resourceGroup.name;
            telemetryProps[telemetry_1.TelemetryPropNames.TargetSubscription] = this.migrationStateModel.targetSubscription.id;
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.TargetSelectionPage, telemetry_1.TelemetryAction.TargetSelectionInfo, telemetryProps, {});
        }
    }
    createAzureAccountsDropdown() {
        const azureAccountLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.ACCOUNTS_SELECTION_PAGE_TITLE,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS, 'margin-top': '-1em' }
        }).component();
        this._azureAccountsDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.ACCOUNTS_SELECTION_PAGE_TITLE,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_AN_ACCOUNT,
            CSSStyles: { 'margin-top': '-1em' },
        }).component();
        this._disposables.push(this._azureAccountsDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedAccount = this.migrationStateModel.azureAccounts?.find(account => account.displayInfo.displayName === value);
                this.migrationStateModel.azureAccount = (selectedAccount)
                    ? servicehelper.deepClone(selectedAccount)
                    : undefined;
            }
            else {
                this.migrationStateModel.azureAccount = undefined;
            }
            await servicehelper.clearDropDown(this._accountTenantDropdown);
            await this.populateTenantsDropdown();
        }));
        const linkAccountButton = this._view.modelBuilder.hyperlink()
            .withProps({
            label: constants.ACCOUNT_LINK_BUTTON_LABEL,
            url: '',
            CSSStyles: { ...styles.BODY_CSS }
        })
            .component();
        this._disposables.push(linkAccountButton.onDidClick(async (event) => {
            await vscode.commands.executeCommand('workbench.actions.modal.linkedAccount');
            await this.populateAzureAccountsDropdown();
            this.wizard.message = { text: '' };
            await this._azureAccountsDropdown.validate();
        }));
        return this._view.modelBuilder.flexContainer()
            .withLayout({ flexFlow: 'column' })
            .withItems([
            azureAccountLabel,
            this._azureAccountsDropdown,
            linkAccountButton
        ])
            .component();
    }
    createAzureTenantContainer() {
        const azureTenantDropdownLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.AZURE_TENANT,
            CSSStyles: { ...styles.LABEL_CSS }
        }).component();
        this._accountTenantDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.AZURE_TENANT,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            editable: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_A_TENANT
        }).component();
        this._disposables.push(this._accountTenantDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedTenant = this.migrationStateModel.accountTenants?.find(tenant => tenant.displayName === value);
                this.migrationStateModel.azureTenant = selectedTenant
                    ? servicehelper.deepClone(selectedTenant)
                    : undefined;
            }
            else {
                this.migrationStateModel.azureTenant = undefined;
            }
            await servicehelper.clearDropDown(this._azureSubscriptionDropdown);
            await this.populateSubscriptionDropdown();
        }));
        this._accountTenantFlexContainer = this._view.modelBuilder.flexContainer()
            .withLayout({ flexFlow: 'column' })
            .withItems([
            azureTenantDropdownLabel,
            this._accountTenantDropdown
        ])
            .withProps({ CSSStyles: { 'display': 'none' } })
            .component();
        return this._accountTenantFlexContainer;
    }
    createTargetDropdownContainer() {
        const subscriptionDropdownLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.SUBSCRIPTION,
            description: constants.TARGET_SUBSCRIPTION_INFO,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS, }
        }).component();
        this._azureSubscriptionDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.SUBSCRIPTION,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_A_SUBSCRIPTION,
            CSSStyles: { 'margin-top': '-1em' },
        }).component();
        this._disposables.push(this._azureSubscriptionDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined' && value !== constants.NO_SUBSCRIPTIONS_FOUND) {
                const selectedSubscription = this.migrationStateModel.subscriptions?.find(subscription => `${subscription.name} - ${subscription.id}` === value);
                this.migrationStateModel.targetSubscription = (selectedSubscription)
                    ? servicehelper.deepClone(selectedSubscription)
                    : undefined;
            }
            else {
                this.migrationStateModel.targetSubscription = undefined;
            }
            await servicehelper.clearDropDown(this._azureResourceGroupDropdown);
            await this.populateResourceGroupDropdown();
        }));
        this._resourceSelectionContainer = this._createResourceDropdowns();
        this._resourceAuthenticationContainer = this._createResourceAuthenticationContainer();
        return this._view.modelBuilder.flexContainer()
            .withItems([
            subscriptionDropdownLabel,
            this._azureSubscriptionDropdown,
            this._resourceSelectionContainer,
            this._resourceAuthenticationContainer
        ])
            .withLayout({ flexFlow: 'column' })
            .component();
    }
    _createResourceAuthenticationContainer() {
        const connectionTypeLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.TARGET_CONNECTION_TYPE,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS, 'margin-top': '-1em' }
        }).component();
        const connectionTypeRadioButtons = this._createConnectionTypeRadioButtons();
        this._connectionCredentialContainer = this._createConnectionCredentialContainer();
        this._connectionStringContainer = this._createConnectionStringContainer();
        // test connection button
        this._testConnectionButton = this._view.modelBuilder.button()
            .withProps({
            enabled: false,
            label: constants.TEST_CONNECTION,
            width: '120px',
        }).component();
        this._connectionResultsInfoBox = this._view.modelBuilder.infoBox()
            .withProps({
            style: 'success',
            text: '',
            announceText: true,
            CSSStyles: { 'display': 'none' },
        })
            .component();
        const connectionButtonLoadingContainer = this._view.modelBuilder.loadingComponent()
            .withItem(this._testConnectionButton)
            .withProps({ loading: false })
            .component();
        this._disposables.push(this._testConnectionButton.onDidClick(async (value) => {
            this.wizard.message = { text: '' };
            let server = "";
            let isServer = false;
            try {
                if (this.migrationStateModel.targetOffering === common_1.EnumTargetOffering.CosmosDBMongovCore) {
                    const targetDatabaseServer = this.migrationStateModel.targetCosmosInstance;
                    const connectionInfo = (0, utils_1.parseMongoConnectionString)(targetDatabaseServer.properties.connectionString);
                    server = connectionInfo?.options.server;
                    isServer = true;
                }
                else {
                    const targetDatabaseServer = this.migrationStateModel.targetCosmosInstance;
                    server = targetDatabaseServer.properties.documentEndpoint;
                }
                const connectionProfile = {
                    serverName: server,
                    userName: this.migrationStateModel.targetUserName,
                    authenticationType: "SqlLogin",
                    savePassword: true,
                    saveProfile: false,
                    options: {
                        isServer: isServer
                    },
                    providerName: "COSMOSDB_MONGO",
                    id: (0, uuid_1.v4)(),
                    azureAccount: this.migrationStateModel.azureAccount.key.accountId,
                    azureTenantId: this.migrationStateModel.azureTenant.id,
                    azureResourceId: this.migrationStateModel.targetCosmosInstance.id,
                    password: this.migrationStateModel.targetPassword
                };
                if (this.migrationStateModel.targetConnectionString) {
                    const connectionInfo = (0, utils_1.parseMongoConnectionString)(this.migrationStateModel.targetConnectionString);
                    if (!this.migrationStateModel.targetConnectionString.includes(this.migrationStateModel.targetCosmosInstance.name)) {
                        throw new Error("selected target server and connection string doesn't have same host name");
                    }
                    connectionProfile.userName = connectionInfo?.options.user;
                    connectionProfile.password = connectionInfo?.options.password;
                    connectionProfile.options.isServer = connectionInfo?.options.isServer;
                }
                connectionButtonLoadingContainer.loading = true;
                await servicehelper.updateControlDisplay(this._connectionResultsInfoBox, false);
                this._targetUserNameInputBox.enabled = false;
                this._targetPasswordInputBox.enabled = false;
                this._targetConnectionStringInputBox.enabled = false;
                const response = await azdata.connection.connect(connectionProfile, false, false);
                if (!response.connected) {
                    throw new Error(response.errorMessage);
                }
                this._connectionSuccessful = true;
                await servicehelper.updateControlDisplay(this._connectionResultsInfoBox, true);
                this.updateNextButton();
            }
            catch (error) {
                const e = error;
                this.wizard.message = {
                    level: azdata.window.MessageLevel.Error,
                    text: constants.AZURE_TARGET_CONNECTION_ERROR_TITLE,
                    description: constants.COSMOS_TARGET_CONNECTION_ERROR(e.message),
                };
            }
            finally {
                this._targetUserNameInputBox.enabled = true;
                this._targetPasswordInputBox.enabled = true;
                this._targetConnectionStringInputBox.enabled = true;
                connectionButtonLoadingContainer.loading = false;
            }
        }));
        this._connectionTestContainer = this._view.modelBuilder.flexContainer()
            .withItems([
            connectionButtonLoadingContainer,
            this._connectionResultsInfoBox
        ], { flex: '0 0 auto' })
            .withLayout({
            flexFlow: 'row',
            alignContent: 'center',
            alignItems: 'center',
        })
            .withProps({ CSSStyles: { 'margin': '15px 0 0 0' } })
            .component();
        return this._view.modelBuilder.flexContainer()
            .withItems([
            connectionTypeLabel,
            connectionTypeRadioButtons,
            this._connectionStringContainer,
            this._connectionTestContainer
        ])
            .withLayout({ flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin': '15px 0 0 0' } })
            .component();
    }
    updateTestConnectionButton() {
        if (this._connectionStringRadioButton.checked) {
            this._targetUserNameInputBox.value = "";
            this._targetPasswordInputBox.value = "";
            this._testConnectionButton.enabled = (this.migrationStateModel.targetCosmosInstance !== undefined &&
                this._targetConnectionStringInputBox.valid);
        }
        else {
            this._targetConnectionStringInputBox.value = "";
            this._testConnectionButton.enabled = (this.migrationStateModel.targetCosmosInstance !== undefined &&
                this._targetUserNameInputBox.valid && this._targetPasswordInputBox.value !== undefined);
        }
    }
    updateNextButton() {
        if (this._connectionSuccessful) {
            this.wizard.pages[this.wizard.currentPage + 1].enabled = true;
            this.wizard.nextButton.enabled = true;
        }
        else {
            this.wizard.pages[this.wizard.currentPage + 1].enabled = false;
            this.wizard.nextButton.enabled = false;
        }
    }
    _createConnectionStringContainer() {
        const targetConnectionStringLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.TARGET_CONNECTION_STRING,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS, 'margin-top': '-1em' }
        }).component();
        this._targetConnectionStringInputBox = this._view.modelBuilder.inputBox()
            .withProps({
            width: '300px',
            inputType: 'text',
            placeHolder: constants.TARGET_CONNECTION_STRING_PLACEHOLDER,
            required: true,
            CSSStyles: { 'margin-top': '-1em' },
        }).component();
        this._disposables.push(this._targetConnectionStringInputBox.onTextChanged(async (value) => {
            await servicehelper.updateControlDisplay(this._connectionResultsInfoBox, false);
            this._connectionSuccessful = false;
            this.updateNextButton();
            this.migrationStateModel.targetConnectionString = value ?? '';
            this.updateTestConnectionButton();
        }));
        return this._view.modelBuilder.flexContainer().withItems([
            targetConnectionStringLabel,
            this._targetConnectionStringInputBox,
        ]).withLayout({ flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin': '15px 0 0 0' } }).component();
    }
    _createConnectionCredentialContainer() {
        // target user name
        const targetUserNameLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.TARGET_USERNAME_LABEL,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS, 'margin-top': '-1em' }
        }).component();
        this._targetUserNameInputBox = this._view.modelBuilder.inputBox()
            .withProps({
            width: '300px',
            inputType: 'text',
            placeHolder: constants.TARGET_USERNAME_PLACEHOLDER,
            required: true,
            CSSStyles: { 'margin-top': '-1em' },
        }).component();
        this._disposables.push(this._targetUserNameInputBox.onTextChanged(async (value) => {
            await servicehelper.updateControlDisplay(this._connectionResultsInfoBox, false);
            this._connectionSuccessful = false;
            this.updateNextButton();
            this.migrationStateModel.targetUserName = value ?? '';
            this.updateTestConnectionButton();
        }));
        // target password
        const targetPasswordLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.TARGET_PASSWORD_LABEL,
            requiredIndicator: true,
            title: '',
            CSSStyles: { ...styles.LABEL_CSS, 'margin-top': '-1em' }
        }).component();
        this._targetPasswordInputBox = this._view.modelBuilder.inputBox()
            .withProps({
            width: '300px',
            inputType: 'password',
            placeHolder: constants.TARGET_PASSWORD_PLACEHOLDER,
            required: false,
            CSSStyles: { 'margin-top': '-1em' },
        }).component();
        this._disposables.push(this._targetPasswordInputBox.onTextChanged(async (value) => {
            await servicehelper.updateControlDisplay(this._connectionResultsInfoBox, false);
            this._connectionSuccessful = false;
            this.updateNextButton();
            this.migrationStateModel.targetPassword = value ?? '';
            this.updateTestConnectionButton();
        }));
        return this._view.modelBuilder.flexContainer().withItems([
            targetUserNameLabel,
            this._targetUserNameInputBox,
            targetPasswordLabel,
            this._targetPasswordInputBox
        ]).withLayout({ flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin': '15px 0 0 0' } }).component();
    }
    _createConnectionTypeRadioButtons() {
        this._connectionStringRadioButton = this._view.modelBuilder.radioButton()
            .withProps({
            name: 'connectionString',
            label: constants.TARGET_CONNECTION_STRING,
            checked: true
        }).component();
        this._connectionParametersRadioButton = this._view.modelBuilder.radioButton()
            .withProps({
            name: 'connectionParameters',
            label: constants.TARGET_CONNECTION_PARAMETERS,
        }).component();
        this._connectionStringRadioButton.onDidClick(() => {
            this._connectionParametersRadioButton.checked = false;
            this._resourceAuthenticationContainer.removeItem(this._connectionCredentialContainer);
            this._resourceAuthenticationContainer.removeItem(this._connectionTestContainer);
            this._resourceAuthenticationContainer.addItem(this._connectionStringContainer);
            this._resourceAuthenticationContainer.addItem(this._connectionTestContainer);
            this.migrationStateModel.targetUserName = "";
            this.migrationStateModel.targetPassword = "";
        });
        this._connectionParametersRadioButton.onDidClick(() => {
            this._connectionStringRadioButton.checked = false;
            this._resourceAuthenticationContainer.removeItem(this._connectionStringContainer);
            this._resourceAuthenticationContainer.removeItem(this._connectionTestContainer);
            this._resourceAuthenticationContainer.addItem(this._connectionCredentialContainer);
            this._resourceAuthenticationContainer.addItem(this._connectionTestContainer);
            this.migrationStateModel.targetConnectionString = "";
        });
        const flexRadioButtonsModel = this._view.modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'row',
        }).withItems([
            this._connectionStringRadioButton, this._connectionParametersRadioButton
        ]).component();
        return flexRadioButtonsModel;
    }
    _createResourceDropdowns() {
        this._azureResourceGroupLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.RESOURCE_GROUP,
            description: constants.TARGET_RESOURCE_GROUP_INFO,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS }
        }).component();
        this._azureResourceGroupDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.RESOURCE_GROUP,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_A_RESOURCE_GROUP,
            CSSStyles: { 'margin-top': '-1em' },
        }).component();
        this._disposables.push(this._azureResourceGroupDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined' && value !== constants.RESOURCE_GROUP_NOT_FOUND) {
                const selectedResourceGroup = this.migrationStateModel.resourceGroups?.find(rg => rg.name === value);
                this.migrationStateModel.resourceGroup = (selectedResourceGroup)
                    ? servicehelper.deepClone(selectedResourceGroup)
                    : undefined;
            }
            else {
                this.migrationStateModel.resourceGroup = undefined;
            }
            await servicehelper.clearDropDown(this._azureResourceDropdown);
            await this.populateResourceInstanceDropdown();
        }));
        this._azureResourceDropdownLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.AZURE_TARGET_RU_OFFERING,
            description: constants.TARGET_RESOURCE_INFO,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS }
        }).component();
        this._azureResourceDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.AZURE_TARGET_RU_OFFERING,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            placeholder: constants.SELECT_SERVICE_PLACEHOLDER,
            CSSStyles: { 'margin-top': '-1em' },
            loading: false,
        }).component();
        this._disposables.push(this._azureResourceDropdown.onValueChanged(async (value) => {
            await servicehelper.updateControlDisplay(this._connectionResultsInfoBox, false);
            this._connectionSuccessful = false;
            this.updateNextButton();
            const isRuTarget = this.migrationStateModel.targetOffering === common_1.EnumTargetOffering.CosmosDBMongoRU;
            if (value && value !== 'undefined' &&
                value !== constants.NO_RU_INSTANCE_FOUND &&
                value !== constants.NO_VCORE_INSTANCE_FOUND) {
                switch (this.migrationStateModel.targetOffering) {
                    case common_1.EnumTargetOffering.CosmosDBMongoRU:
                        {
                            const selectedRuInstance = this.migrationStateModel.targetCosmosMongoRuInstances?.find(ru => ru.name === value
                                || constants.UNAVAILABLE_TARGET_PREFIX(ru.name) === value);
                            if (selectedRuInstance) {
                                this.migrationStateModel.targetCosmosInstance = servicehelper.deepClone(selectedRuInstance);
                                this.wizard.message = { text: '' };
                            }
                        }
                        break;
                    case common_1.EnumTargetOffering.CosmosDBMongovCore:
                        {
                            const selectedvCoreInstance = this.migrationStateModel.targetCosmosMongovCoreInstances?.find(mi => mi.name === value ||
                                constants.UNAVAILABLE_TARGET_PREFIX(mi.name) === value);
                            if (selectedvCoreInstance) {
                                this.migrationStateModel.targetCosmosInstance = servicehelper.deepClone(selectedvCoreInstance);
                                this.wizard.message = { text: '' };
                            }
                        }
                        break;
                }
                await this._validateFields();
                this.updateTestConnectionButton();
            }
            else {
                this.migrationStateModel.targetCosmosInstance = undefined;
                if (isRuTarget) {
                    this._targetUserNameInputBox.value = '';
                }
            }
            this.migrationStateModel.dataMigrationServices = undefined;
            if (isRuTarget) {
                this._targetUserNameInputBox.value = this.migrationStateModel.targetCosmosInstance?.name;
            }
        }));
        return this._view.modelBuilder.flexContainer()
            .withItems([
            this._azureResourceGroupLabel,
            this._azureResourceGroupDropdown,
            this._azureResourceDropdownLabel,
            this._azureResourceDropdown
        ])
            .withLayout({ flexFlow: 'column' })
            .component();
    }
    async populateAzureAccountsDropdown() {
        try {
            this._azureAccountsDropdown.loading = true;
            this.migrationStateModel.azureAccounts = await servicehelper.getAzureAccounts();
            const accountId = this.migrationStateModel.azureAccount?.displayInfo?.userId ??
                this._serviceContext?.azureAccount?.displayInfo?.userId;
            this._azureAccountsDropdown.values = await servicehelper.getAzureAccountsDropdownValues(this.migrationStateModel.azureAccounts);
            servicehelper.selectDefaultDropdownValue(this._azureAccountsDropdown, accountId, false);
            const selectedAccount = this.migrationStateModel.azureAccounts?.find(account => account.displayInfo.displayName === this._azureAccountsDropdown.value.displayName);
            this.migrationStateModel.azureAccount = (selectedAccount)
                ? servicehelper.deepClone(selectedAccount)
                : undefined;
        }
        catch (err) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.TargetSelectionPage, telemetry_1.TelemetryAction.PopulateAzureAccountsFailed, { error: err });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.AZURE_ACCOUNTS_GET_UNEXPECTED_FAILURE
            };
        }
        finally {
            this._azureAccountsDropdown.loading = false;
        }
    }
    async populateTenantsDropdown() {
        try {
            this._accountTenantDropdown.loading = true;
            if (!servicehelper.isAccountTokenStale(this.migrationStateModel.azureAccount) &&
                this.migrationStateModel.azureAccount?.properties?.tenants?.length > 0) {
                this.migrationStateModel.accountTenants = servicehelper.getAzureTenants(this.migrationStateModel.azureAccount);
                const tenantId = this.migrationStateModel.azureTenant?.id;
                this._accountTenantDropdown.values = servicehelper.getAzureTenantsDropdownValues(this.migrationStateModel.accountTenants);
                servicehelper.selectDefaultDropdownValue(this._accountTenantDropdown, tenantId, true);
                const selectedTenant = this.migrationStateModel.accountTenants?.find(tenant => tenant.displayName === this._accountTenantDropdown.value.displayName);
                this.migrationStateModel.azureTenant = selectedTenant
                    ? servicehelper.deepClone(selectedTenant)
                    : undefined;
            }
            await this._azureAccountsDropdown.validate();
        }
        finally {
            this._accountTenantDropdown.loading = false;
            await this._accountTenantFlexContainer.updateCssStyles(this.migrationStateModel.azureAccount?.properties?.tenants?.length > 1
                ? { 'display': 'inline' }
                : { 'display': 'none' });
        }
    }
    async populateSubscriptionDropdown() {
        try {
            this._azureSubscriptionDropdown.loading = true;
            this.migrationStateModel.subscriptions = await servicehelper.getAzureSubscriptions(this.migrationStateModel.azureAccount, this.migrationStateModel.azureTenant?.id);
            const subscriptionId = this.migrationStateModel.targetSubscription?.id ??
                this._serviceContext?.subscription?.id;
            this._azureSubscriptionDropdown.values = await servicehelper.getAzureSubscriptionsDropdownValues(this.migrationStateModel.subscriptions);
            servicehelper.selectDefaultDropdownValue(this._azureSubscriptionDropdown, subscriptionId, false);
            const selectedSubscription = this.migrationStateModel.subscriptions?.find(subscription => `${subscription.name} - ${subscription.id}` === this._azureSubscriptionDropdown.value.displayName);
            this.migrationStateModel.targetSubscription = (selectedSubscription)
                ? servicehelper.deepClone(selectedSubscription)
                : undefined;
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.TargetSelectionPage, telemetry_1.TelemetryAction.PopulateAzureSubscriptionsFailed, { error: e });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.AZURE_SUBSCRIPTIONS_GET_UNEXPECTED_FAILURE
            };
        }
        finally {
            this._azureSubscriptionDropdown.loading = false;
        }
    }
    async populateResourceGroupDropdown() {
        try {
            this._azureResourceGroupDropdown.loading = true;
            switch (this.migrationStateModel.targetOffering) {
                case common_1.EnumTargetOffering.CosmosDBMongoRU:
                    this.migrationStateModel.targetCosmosMongoRuInstances = await servicehelper.getAvailableCosmosMongoRuInstances(this.migrationStateModel.azureAccount, this.migrationStateModel.targetSubscription);
                    this.migrationStateModel.resourceGroups = servicehelper.getServiceResourceGroups(this.migrationStateModel.targetCosmosMongoRuInstances);
                    break;
                case common_1.EnumTargetOffering.CosmosDBMongovCore:
                    this.migrationStateModel.targetCosmosMongovCoreInstances = await servicehelper.getAvailableCosmosMongovCoreInstances(this.migrationStateModel.azureAccount, this.migrationStateModel.targetSubscription);
                    this.migrationStateModel.resourceGroups = servicehelper.getServiceResourceGroups(this.migrationStateModel.targetCosmosMongovCoreInstances);
                    break;
            }
            const resourceGroupId = this.migrationStateModel.resourceGroup?.id;
            this._azureResourceGroupDropdown.values = servicehelper.getResourceDropdownValues(this.migrationStateModel.resourceGroups, constants.RESOURCE_GROUP_NOT_FOUND);
            servicehelper.selectDefaultDropdownValue(this._azureResourceGroupDropdown, resourceGroupId, false);
            const selectedResourceGroup = this.migrationStateModel.resourceGroups?.find(rg => rg.name === this._azureResourceGroupDropdown.value.displayName);
            this.migrationStateModel.resourceGroup = (selectedResourceGroup)
                ? servicehelper.deepClone(selectedResourceGroup)
                : undefined;
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.TargetSelectionPage, telemetry_1.TelemetryAction.PopulateResourceGroupsFailed, { error: e });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.TARGET_INSTANCES_GET_UNEXPECTED_FAILURE
            };
        }
        finally {
            this._azureResourceGroupDropdown.loading = false;
        }
    }
    async populateResourceInstanceDropdown() {
        try {
            this._azureResourceDropdown.loading = true;
            const targetName = this.migrationStateModel.migrationTargetServerName;
            switch (this.migrationStateModel.targetOffering) {
                case common_1.EnumTargetOffering.CosmosDBMongoRU:
                    this._azureResourceDropdown.values = await servicehelper.getCosmosRuInstancesDropdownValues(this.migrationStateModel.targetCosmosMongoRuInstances, this.migrationStateModel.resourceGroup);
                    break;
                case common_1.EnumTargetOffering.CosmosDBMongovCore:
                    this._azureResourceDropdown.values = await servicehelper.getCosmosvCoreInstancesDropdownValues(this.migrationStateModel.targetCosmosMongovCoreInstances, this.migrationStateModel.resourceGroup);
                    break;
            }
            servicehelper.selectDefaultDropdownValue(this._azureResourceDropdown, targetName, true);
            switch (this.migrationStateModel.targetOffering) {
                case common_1.EnumTargetOffering.CosmosDBMongoRU:
                    {
                        const selectedRuInstance = this.migrationStateModel.targetCosmosMongoRuInstances?.find(ru => ru.name === this._azureResourceDropdown.value.displayName
                            || constants.UNAVAILABLE_TARGET_PREFIX(ru.name) === this._azureResourceDropdown.value.displayName);
                        if (selectedRuInstance) {
                            this.migrationStateModel.targetCosmosInstance = servicehelper.deepClone(selectedRuInstance);
                            this.wizard.message = { text: '' };
                        }
                    }
                    break;
                case common_1.EnumTargetOffering.CosmosDBMongovCore:
                    {
                        const selectedvCoreInstance = this.migrationStateModel.targetCosmosMongovCoreInstances?.find(mi => mi.name === this._azureResourceDropdown.value.displayName ||
                            constants.UNAVAILABLE_TARGET_PREFIX(mi.name) === this._azureResourceDropdown.value.displayName);
                        if (selectedvCoreInstance) {
                            this.migrationStateModel.targetCosmosInstance = servicehelper.deepClone(selectedvCoreInstance);
                            this.wizard.message = { text: '' };
                        }
                    }
                    break;
            }
        }
        finally {
            this._azureResourceDropdown.loading = false;
        }
    }
    async _validateFields() {
        await this._azureAccountsDropdown.validate();
        await this._accountTenantDropdown.validate();
        await this._azureSubscriptionDropdown.validate();
        await this._azureResourceGroupDropdown.validate();
        await this._azureResourceDropdown.validate();
        await this._targetPasswordInputBox.validate();
        await this._targetUserNameInputBox.validate();
    }
}
exports.TargetSelectionPage = TargetSelectionPage;
//# sourceMappingURL=targetSelectionPage.js.map