"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetMigrationServicePage = void 0;
const azdata = require("azdata");
const migrationWizardPage_1 = require("../models/migrationWizardPage");
const stateMachine_1 = require("../models/stateMachine");
const createMigrationServiceDialog_1 = require("../dialogs/createMigrationServiceDialog");
const constants = require("../constants/strings");
const wizardController_1 = require("./wizardController");
const azure_1 = require("../services/azure");
const telemetry_1 = require("../telemetry");
const utils = require("../services/serviceHelper");
const styles = require("../constants/styles");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
class TargetMigrationServicePage extends migrationWizardPage_1.MigrationWizardPage {
    _view;
    _subscriptionText;
    _resourceGroupDropdown;
    _dmsDropdown;
    _dmsInfoContainer;
    _migrationNameInput;
    _offlineButton;
    _onlineButton;
    _offlineDescription;
    _onlineDescription;
    _descriptionContainer;
    _disposables = [];
    _resourseGroupMigrations = [];
    _migrationServiceMigrations = [];
    _migrationServiceMigrationsMap = new Map();
    constructor(wizard, migrationStateModel) {
        super(wizard, azdata.window.createWizardPage(constants.MIGRATION_SERVICE_PAGE_TITLE), migrationStateModel);
    }
    async registerContent(view) {
        this._view = view;
        const form = view.modelBuilder.formContainer()
            .withFormItems([
            { component: this.migrationServiceDropdownContainer() }
        ])
            .withProps({ CSSStyles: { 'padding-top': '0' } })
            .component();
        this._disposables.push(this._view.onClosed(e => this._disposables.forEach(d => {
            // eslint-disable-next-line no-empty
            try {
                d.dispose();
            }
            catch {
            }
        })));
        await view.initializeModel(form);
    }
    async onPageEnter(pageChangeInfo) {
        this.wizard.registerNavigationValidator((pageChangeInfo) => {
            this.wizard.message = { text: '' };
            if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
                return true;
            }
            if (!this.migrationStateModel.dataMigrationService) {
                this.wizard.message = {
                    level: azdata.window.MessageLevel.Error,
                    text: constants.INVALID_SERVICE_ERROR
                };
                return false;
            }
            return true;
        });
        if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
            return;
        }
        this._migrationNameInput.value = this.migrationStateModel.assessmentName;
        this._subscriptionText.value = this.migrationStateModel.targetSubscription.name;
        this.migrationStateModel.dataMigrationServiceSubscription = this.migrationStateModel.targetSubscription;
        await this.loadResourceGroupDropdown();
        try {
            this._resourseGroupMigrations = await this.migrationStateModel.getMigrationsInTargetResourceGroup();
        }
        catch (e) {
            this._resourseGroupMigrations = [];
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.TargetMigrationServicePage, telemetry_1.TelemetryAction.GetResourceGroupMigrationsFailed, { error: e });
        }
        const serviceMigration = migrationLocalStorage_1.MigrationServiceMigrationsCache.getMigrationServiceMigrations();
        if (serviceMigration) {
            this._migrationServiceMigrationsMap.set(serviceMigration.migrationServiceId, serviceMigration.migrations);
        }
        this._migrationNameInput.validate();
    }
    async onPageLeave(pageChangeInfo) {
        this.wizard.registerNavigationValidator(pageChangeInfo => true);
        this.wizard.message = { text: '' };
        this.migrationStateModel.migrationName = this._migrationNameInput.value?.trim();
        this.migrationStateModel.dataMigrationMode = this._offlineButton.checked ? stateMachine_1.MigrationMode.Offline : stateMachine_1.MigrationMode.Online;
        if (pageChangeInfo.newPage > pageChangeInfo.lastPage) {
            const telemetryProps = this.migrationStateModel.getDefaultTelemetryProps();
            telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceSubscription] = this.migrationStateModel.dataMigrationServiceSubscription.id;
            telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceResourceGroup] = this.migrationStateModel.dataMigrationService?.properties.resourceGroup ?? "";
            telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = this.migrationStateModel.dataMigrationService?.name ?? "";
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.TargetMigrationServicePage, telemetry_1.TelemetryAction.TargetMigrationServiceSelectionInfo, telemetryProps, {});
        }
    }
    migrationServiceDropdownContainer() {
        const descriptionText = this._view.modelBuilder.text()
            .withProps({
            value: constants.MIGRATION_SERVICE_PAGE_DESCRIPTION,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            CSSStyles: { ...styles.BODY_CSS, 'margin-bottom': '16px' }
        }).component();
        const migrationName = this._view.modelBuilder.text().withProps({
            value: constants.MIGRATION_NAME_LABEL,
            ariaLabel: constants.MIGRATION_NAME_LABEL,
            description: constants.MIGRATION_NAME_DESCRIPTION,
            requiredIndicator: true,
            CSSStyles: {
                ...styles.LABEL_CSS
            }
        }).component();
        this._migrationNameInput = this._view.modelBuilder.inputBox().withProps({
            ariaLabel: constants.MIGRATION_NAME_LABEL,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            required: true,
            maxLength: 20,
            CSSStyles: {
                'margin-top': '-1em',
                'margin-bottom': '1em'
            }
        }).withValidation((component) => {
            return this.validateMigrationNameComponent(component);
        }).component();
        const subscriptionLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.SUBSCRIPTION,
            CSSStyles: { ...styles.LABEL_CSS }
        }).component();
        this._subscriptionText = this._view.modelBuilder.text()
            .withProps({
            ariaLabel: constants.SUBSCRIPTION,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            CSSStyles: {
                ...styles.BODY_CSS,
                'margin': '0'
            }
        }).component();
        const resourceGroupLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.RESOURCE_GROUP,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS }
        }).component();
        this._resourceGroupDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.RESOURCE_GROUP,
            placeholder: constants.SELECT_RESOURCE_GROUP,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            CSSStyles: { 'margin-top': '-1em' }
        }).component();
        this._disposables.push(this._resourceGroupDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined' && value !== constants.RESOURCE_GROUP_NOT_FOUND) {
                const selectedResourceGroup = this.migrationStateModel.resourceGroups.find(rg => rg.name === value);
                this.migrationStateModel.dataMigrationServiceResourceGroup = (selectedResourceGroup)
                    ? selectedResourceGroup
                    : undefined;
            }
            else {
                this.migrationStateModel.dataMigrationServiceResourceGroup = undefined;
            }
            await utils.clearDropDown(this._dmsDropdown);
            this.loadDmsDropdown();
        }));
        const migrationServiceDropdownLabel = this._view.modelBuilder.text()
            .withProps({
            value: constants.MIGRATION_SERVICE_PAGE_TITLE,
            requiredIndicator: true,
            CSSStyles: { ...styles.LABEL_CSS }
        }).component();
        this._dmsDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.MIGRATION_SERVICE_PAGE_TITLE,
            placeholder: constants.SELECT_RESOURCE_GROUP_PROMPT,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            editable: true,
            required: true,
            fireOnTextChange: true,
            CSSStyles: { 'margin-top': '-1em' }
        }).component();
        this._disposables.push(this._dmsDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined' && value !== constants.MIGRATION_SERVICE_NOT_FOUND_ERROR) {
                this.wizard.message = { text: '' };
                const resourceGroupName = this.migrationStateModel.dataMigrationServiceResourceGroup.name.toLowerCase();
                const selectedDms = this.migrationStateModel.dataMigrationServices.find(dms => dms.name === value
                    && dms.properties.resourceGroup.toLowerCase() === resourceGroupName);
                this.migrationStateModel.dataMigrationService = selectedDms;
                if (selectedDms) {
                    const migrationServiceMigrations = this._migrationServiceMigrationsMap.get(selectedDms.id);
                    if (migrationServiceMigrations !== undefined) {
                        this._migrationServiceMigrations = migrationServiceMigrations;
                    }
                    else {
                        try {
                            this._migrationServiceMigrations = await (0, azure_1.getServiceMigrations)(this.migrationStateModel.azureAccount, this.migrationStateModel.dataMigrationServiceSubscription, selectedDms.id);
                            this._migrationServiceMigrationsMap.set(selectedDms.id, this._migrationServiceMigrations);
                        }
                        catch (e) {
                            this._migrationServiceMigrations = [];
                            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.TargetMigrationServicePage, telemetry_1.TelemetryAction.GetMigrationServiceMigrationsFailed, { error: e });
                        }
                    }
                }
                else {
                    this._migrationServiceMigrations = [];
                }
                this._migrationNameInput.validate();
            }
            else {
                this.migrationStateModel.dataMigrationService = undefined;
                await utils.updateControlDisplay(this._dmsInfoContainer, false);
            }
        }));
        const createNewMigrationService = this._view.modelBuilder.hyperlink()
            .withProps({
            label: constants.CREATE_NEW,
            ariaLabel: constants.CREATE_NEW_MIGRATION_SERVICE,
            url: '',
            CSSStyles: { ...styles.BODY_CSS }
        }).component();
        this._disposables.push(createNewMigrationService.onDidClick(async (e) => {
            const dialog = new createMigrationServiceDialog_1.CreateDataMigrationServiceDialog();
            const createdDmsResult = await dialog.createNewDms(this.migrationStateModel, this._resourceGroupDropdown.value
                ? this._resourceGroupDropdown.value.displayName
                : '');
            await this.loadResourceGroupDropdown();
            this.loadDmsDropdown();
            this._resourceGroupDropdown.values?.forEach((resourceGroupCategoryValue, index) => {
                const resourceGroup = resourceGroupCategoryValue;
                if (resourceGroup.displayName === createdDmsResult.resourceGroup.name) {
                    utils.selectDropDownIndex(this._resourceGroupDropdown, index);
                }
            });
            this._dmsDropdown.values?.forEach((dmsCategoryValue, index) => {
                const dmsName = dmsCategoryValue;
                if (dmsName.displayName === createdDmsResult.service.name) {
                    utils.selectDropDownIndex(this._dmsDropdown, index);
                }
            });
        }));
        const migrationModeLabel = this._view.modelBuilder.text().withProps({
            value: constants.MIGRATION_MODE,
            ariaLabel: constants.MIGRATION_MODE,
            description: constants.MIGRATION_MODE,
            requiredIndicator: true,
            CSSStyles: {
                ...styles.LABEL_CSS
            }
        }).component();
        this._offlineButton = this._view.modelBuilder.radioButton().withProps({
            ariaLabel: constants.OFFLINE,
            label: constants.OFFLINE,
            checked: true
        }).withProps({
            CSSStyles: {
                ...styles.BODY_CSS,
                'margin': '0'
            }
        }).component();
        this._onlineButton = this._view.modelBuilder.radioButton().withProps({
            ariaLabel: constants.ONLINE,
            label: constants.ONLINE,
            checked: false
        }).withProps({
            CSSStyles: {
                ...styles.BODY_CSS,
                'margin': '0'
            }
        }).component();
        this._offlineDescription = this._view.modelBuilder.text().withProps({
            value: constants.OFFLINE_DESCRIPTION,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            CSSStyles: {
                ...styles.BODY_CSS,
                'margin-top': '16px'
            }
        }).component();
        this._onlineDescription = this._view.modelBuilder.text().withProps({
            value: constants.ONLINE_DESCRIPTION,
            width: wizardController_1.WIZARD_INPUT_COMPONENT_WIDTH,
            CSSStyles: {
                ...styles.BODY_CSS,
                'margin-top': '16px'
            }
        }).component();
        this._offlineButton.onDidChangeCheckedState((checked) => {
            if (checked) {
                this._onlineButton.checked = false;
                this._descriptionContainer.removeItem(this._onlineDescription);
                this._descriptionContainer.addItem(this._offlineDescription);
            }
        });
        this._onlineButton.onDidChangeCheckedState((checked) => {
            if (checked) {
                this._offlineButton.checked = false;
                this._descriptionContainer.removeItem(this._offlineDescription);
                this._descriptionContainer.addItem(this._onlineDescription);
            }
        });
        const radioButtonsContainer = this._view.modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'row',
        })
            .withItems([
            this._offlineButton, this._onlineButton
        ]).component();
        this._descriptionContainer = this._view.modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'column',
        })
            .withItems([
            this._offlineDescription
        ]).component();
        return this._view.modelBuilder.flexContainer()
            .withItems([
            descriptionText,
            migrationName,
            this._migrationNameInput,
            subscriptionLabel,
            this._subscriptionText,
            resourceGroupLabel,
            this._resourceGroupDropdown,
            migrationServiceDropdownLabel,
            this._dmsDropdown,
            createNewMigrationService,
            migrationModeLabel,
            radioButtonsContainer,
            this._descriptionContainer
        ])
            .withLayout({ flexFlow: 'column' })
            .component();
    }
    // function to validate the assessment name
    validateMigrationNameComponent(component) {
        const value = component.value?.trim();
        if (value === undefined || value.length < 3) {
            //Validating length of migration name
            component.validationErrorMessage = constants.INCORRECT_LENGTH;
            return false;
        }
        if (this._resourseGroupMigrations.filter(t => t.name.toLowerCase() === value.toLowerCase()).length >= 1
            || this._migrationServiceMigrations.filter(t => t.name.toLowerCase() === value.toLowerCase()).length >= 1) {
            component.validationErrorMessage = constants.DUPLICATE_MIGRATION_NAME;
            return false;
        }
        return true;
    }
    async loadResourceGroupDropdown() {
        try {
            this._resourceGroupDropdown.loading = true;
            const account = this.migrationStateModel.azureAccount;
            const subscription = this.migrationStateModel.dataMigrationServiceSubscription;
            const serviceId = this.migrationStateModel.dataMigrationService?.id;
            const resourceGroup = (this.migrationStateModel.dataMigrationServiceResourceGroup?.name ??
                serviceId !== undefined)
                ? (0, azure_1.getFullResourceGroupFromId)(serviceId)
                : undefined;
            const migrationServices = await utils.getAzureDataMigrationServices(account, subscription);
            const resourceGroups = utils.getServiceResourceGroups(migrationServices);
            this._resourceGroupDropdown.values = utils.getResourceDropdownValues(resourceGroups, constants.RESOURCE_GROUP_NOT_FOUND);
            this.migrationStateModel.dataMigrationServices = migrationServices;
            this.migrationStateModel.resourceGroups = resourceGroups;
            utils.selectDefaultDropdownValue(this._resourceGroupDropdown, resourceGroup, false);
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.TargetMigrationServicePage, telemetry_1.TelemetryAction.PopulateMigrationServicesFailed, { error: e });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.MIGRATION_SERVICES_FETCH_UNEXPECTED_FAILURE
            };
        }
        finally {
            this._resourceGroupDropdown.loading = false;
        }
    }
    loadDmsDropdown() {
        try {
            this._dmsDropdown.loading = true;
            const serviceId = this.migrationStateModel.dataMigrationService?.id;
            this._dmsDropdown.values = utils.getAzureResourceDropdownValues(this.migrationStateModel.dataMigrationServices, this.migrationStateModel.dataMigrationServiceResourceGroup?.name, constants.MIGRATION_SERVICE_NOT_FOUND_ERROR);
            utils.selectDefaultDropdownValue(this._dmsDropdown, serviceId, false);
        }
        finally {
            this._dmsDropdown.loading = false;
        }
    }
}
exports.TargetMigrationServicePage = TargetMigrationServicePage;
//# sourceMappingURL=targetMigrationServicePage.js.map