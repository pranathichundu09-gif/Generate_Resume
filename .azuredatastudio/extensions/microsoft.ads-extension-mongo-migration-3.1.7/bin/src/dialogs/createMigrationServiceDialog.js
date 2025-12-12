"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDataMigrationServiceDialog = void 0;
const azdata = require("azdata");
const azure_1 = require("../services/azure");
const telemetry_1 = require("../telemetry");
const constants = require("../constants/strings");
const os = require("os");
const createResourceGroupDialog_1 = require("./createResourceGroupDialog");
const EventEmitter = require("events");
const utils = require("../services/serviceHelper");
const styles = require("../constants/styles");
class CreateDataMigrationServiceDialog {
    _model;
    _migrationServiceSubscription;
    _migrationServiceResourceGroupDropdown;
    _locationDropDown;
    _migrationServiceNameText;
    _formSubmitButton;
    _createResourceGroupLink;
    _statusLoadingComponent;
    _refreshLoadingComponent;
    _connectionStatus;
    _setupContainer;
    _resourceGroupPreset;
    _dialogObject;
    _view;
    _createdMigrationService;
    _resourceGroups;
    _selectedResourceGroup;
    _doneButtonEvent = new EventEmitter();
    _disposables = [];
    async createNewDms(migrationStateModel, resourceGroupPreset) {
        this._model = migrationStateModel;
        this._resourceGroupPreset = resourceGroupPreset;
        this._dialogObject = azdata.window.createModelViewDialog(constants.CREATE_MIGRATION_SERVICE_TITLE, 'MigrationServiceDialog', 'medium');
        this._dialogObject.okButton.position = 'left';
        this._dialogObject.cancelButton.position = 'left';
        const tab = azdata.window.createTab('');
        this._dialogObject.registerCloseValidator(async () => {
            return true;
        });
        tab.registerContent(async (view) => {
            this._view = view;
            this._formSubmitButton = view.modelBuilder.button().withProps({
                label: constants.CREATE,
                width: '80px'
            }).component();
            this._disposables.push(this._formSubmitButton.onDidClick(async (e) => {
                utils.clearDialogMessage(this._dialogObject);
                this._statusLoadingComponent.loading = true;
                this._migrationServiceResourceGroupDropdown.loading = false;
                this.setFormEnabledState(false);
                const subscription = this._model.dataMigrationServiceSubscription;
                const resourceGroup = this._selectedResourceGroup;
                const location = this._model.targetCosmosInstance.location;
                const serviceName = this._migrationServiceNameText.value;
                const formValidationErrors = this.validateCreateServiceForm(subscription, resourceGroup.name, location, serviceName);
                const telemetryProps = this._model.getDefaultTelemetryProps();
                telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceSubscription] = subscription.id;
                telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceResourceGroup] = resourceGroup.name;
                telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = serviceName;
                try {
                    if (formValidationErrors.length > 0) {
                        this.setDialogMessage(formValidationErrors);
                        this.setFormEnabledState(true);
                        return;
                    }
                    utils.clearDialogMessage(this._dialogObject);
                    this._createdMigrationService = await (0, azure_1.createDataMigrationService)(this._model.azureAccount, subscription, resourceGroup.name, location, serviceName, this._model.sessionId);
                    if (this._createdMigrationService.error) {
                        const createMigrationServiceError = this._createdMigrationService.error;
                        (0, telemetry_1.logError)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.CreateMigrationServiceFailed, { errorCode: createMigrationServiceError.code, errorType: createMigrationServiceError.message });
                        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.CreateMigrationServiceFailed, telemetryProps, {});
                        this.setDialogMessage(`${this._createdMigrationService.error.code} : ${this._createdMigrationService.error.message}`);
                        this.setFormEnabledState(true);
                        return;
                    }
                    (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.StartCreateMigrationServiceSucceeded, telemetryProps, {});
                    await this.refreshStatus();
                    this._setupContainer.display = 'inline';
                }
                catch (e) {
                    (0, telemetry_1.logError)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.CreateMigrationServiceFailed, { error: e });
                    (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.CreateMigrationServiceFailed, telemetryProps, {});
                    if (e instanceof Error) {
                        this.setDialogMessage(e.message);
                        this.setFormEnabledState(true);
                    }
                }
                finally {
                    this._statusLoadingComponent.loading = false;
                }
            }));
            this._statusLoadingComponent = view.modelBuilder.loadingComponent().withProps({
                loadingText: constants.LOADING_MIGRATION_SERVICES,
                loading: false
            }).component();
            const creationStatusContainer = this.createServiceStatus();
            const formBuilder = view.modelBuilder.formContainer().withFormItems([
                {
                    component: (await this.migrationServiceDropdownContainer())
                },
                {
                    component: this._formSubmitButton
                },
                {
                    component: this._statusLoadingComponent
                },
                {
                    component: creationStatusContainer
                }
            ], {
                horizontal: false
            });
            const form = formBuilder.withLayout({ width: '100%' }).component();
            this._disposables.push(view.onClosed(e => {
                this._disposables.forEach(d => {
                    // eslint-disable-next-line no-empty
                    try {
                        d.dispose();
                    }
                    catch {
                    }
                });
            }));
            return view.initializeModel(form).then(async () => {
                await this.populateSubscriptions();
            });
        });
        this._dialogObject.content = [tab];
        this._dialogObject.okButton.enabled = false;
        azdata.window.openDialog(this._dialogObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._disposables.push(this._dialogObject.cancelButton.onClick(() => {
        }));
        this._disposables.push(this._dialogObject.okButton.onClick((e) => {
            this._doneButtonEvent.emit('done', this._createdMigrationService, this._selectedResourceGroup);
        }));
        return new Promise((resolve) => {
            this._doneButtonEvent.once('done', (createdDms, selectedResourceGroup) => {
                azdata.window.closeDialog(this._dialogObject);
                resolve({
                    service: createdDms,
                    resourceGroup: selectedResourceGroup
                });
            });
        });
    }
    async migrationServiceDropdownContainer() {
        const dialogDescription = this._view.modelBuilder.text().withProps({
            value: constants.MIGRATION_SERVICE_DIALOG_DESCRIPTION,
            CSSStyles: {
                ...styles.BODY_CSS
            }
        }).component();
        const subscriptionDropdownLabel = this._view.modelBuilder.text().withProps({
            value: constants.SUBSCRIPTION,
            description: constants.MIGRATION_SERVICE_SUBSCRIPTION_INFO,
            CSSStyles: {
                ...styles.LABEL_CSS
            }
        }).component();
        this._migrationServiceSubscription = this._view.modelBuilder.text().withProps({
            enabled: false,
            CSSStyles: {
                'margin': '-1em 0 0'
            }
        }).component();
        const resourceGroupDropdownLabel = this._view.modelBuilder.text().withProps({
            value: constants.RESOURCE_GROUP,
            description: constants.MIGRATION_SERVICE_RESOURCE_GROUP_INFO,
            requiredIndicator: true,
            CSSStyles: {
                ...styles.LABEL_CSS
            }
        }).component();
        this._migrationServiceResourceGroupDropdown = this._view.modelBuilder.dropDown().withProps({
            ariaLabel: constants.RESOURCE_GROUP,
            required: true,
            editable: true,
            fireOnTextChange: true,
            CSSStyles: {
                'margin-top': '-1em'
            }
        }).component();
        this._disposables.push(this._migrationServiceResourceGroupDropdown.onValueChanged(async (value) => {
            if (value && value !== 'undefined') {
                const selectedResourceGroup = this._resourceGroups.find(rg => rg.name === value || constants.NEW_RESOURCE_GROUP(rg.name) === value);
                this._selectedResourceGroup = (selectedResourceGroup)
                    ? selectedResourceGroup
                    : undefined;
            }
        }));
        const migrationServiceNameLabel = this._view.modelBuilder.text().withProps({
            value: constants.NAME,
            description: constants.MIGRATION_SERVICE_NAME_INFO,
            requiredIndicator: true,
            CSSStyles: {
                ...styles.LABEL_CSS
            }
        }).component();
        this._createResourceGroupLink = this._view.modelBuilder.hyperlink().withProps({
            label: constants.CREATE_NEW,
            ariaLabel: constants.CREATE_NEW_RESOURCE_GROUP,
            url: '',
            CSSStyles: {
                ...styles.BODY_CSS
            }
        }).component();
        this._disposables.push(this._createResourceGroupLink.onDidClick(async (e) => {
            const createResourceGroupDialog = new createResourceGroupDialog_1.CreateResourceGroupDialog(this._model.azureAccount, this._model.dataMigrationServiceSubscription, this._model.targetCosmosInstance.location);
            const createdResourceGroup = await createResourceGroupDialog.initialize();
            if (createdResourceGroup) {
                this._resourceGroups.push(createdResourceGroup);
                this._selectedResourceGroup = createdResourceGroup;
                this._migrationServiceResourceGroupDropdown.loading = true;
                this._migrationServiceResourceGroupDropdown.values.unshift({
                    displayName: constants.NEW_RESOURCE_GROUP(createdResourceGroup.name),
                    name: createdResourceGroup.name
                });
                this._migrationServiceResourceGroupDropdown.value = {
                    displayName: createdResourceGroup.name,
                    name: createdResourceGroup.name
                };
                this._migrationServiceResourceGroupDropdown.loading = false;
                await this._migrationServiceResourceGroupDropdown.focus();
            }
        }));
        this._migrationServiceNameText = this._view.modelBuilder.inputBox().withProps({
            required: true,
            CSSStyles: {
                'margin-top': '-1em'
            }
        }).component();
        const locationDropdownLabel = this._view.modelBuilder.text().withProps({
            value: constants.LOCATION,
            description: constants.MIGRATION_SERVICE_LOCATION_INFO,
            CSSStyles: {
                ...styles.LABEL_CSS
            }
        }).component();
        this._locationDropDown = this._view.modelBuilder.text().withProps({
            ariaLabel: constants.LOCATION,
            CSSStyles: {
                'margin-top': '-1em'
            },
            value: this._model.targetCosmosInstance.location
        }).component();
        const flexContainer = this._view.modelBuilder.flexContainer().withItems([
            dialogDescription,
            subscriptionDropdownLabel,
            this._migrationServiceSubscription,
            locationDropdownLabel,
            this._locationDropDown,
            resourceGroupDropdownLabel,
            this._migrationServiceResourceGroupDropdown,
            this._createResourceGroupLink,
            migrationServiceNameLabel,
            this._migrationServiceNameText,
        ]).withLayout({
            flexFlow: 'column'
        }).component();
        return flexContainer;
    }
    validateCreateServiceForm(subscription, resourceGroup, location, migrationServiceName) {
        const errors = [];
        if (!subscription) {
            errors.push(constants.INVALID_SUBSCRIPTION_ERROR);
        }
        if (!resourceGroup) {
            errors.push(constants.INVALID_RESOURCE_GROUP_ERROR);
        }
        if (!location) {
            errors.push(constants.INVALID_LOCATION_ERROR);
        }
        if (!migrationServiceName || migrationServiceName.length < 3 || migrationServiceName.length > 63 || !/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(migrationServiceName)) {
            errors.push(constants.INVALID_SERVICE_NAME_ERROR);
        }
        return errors.join(os.EOL);
    }
    async populateSubscriptions() {
        this._migrationServiceResourceGroupDropdown.loading = true;
        this._migrationServiceSubscription.value = this._model.dataMigrationServiceSubscription.name;
        await this.populateResourceGroups();
    }
    async populateResourceGroups() {
        this._migrationServiceResourceGroupDropdown.loading = true;
        try {
            this._resourceGroups = await utils.getAllResourceGroups(this._model.azureAccount, this._model.dataMigrationServiceSubscription);
            this._migrationServiceResourceGroupDropdown.values = utils.getResourceDropdownValues(this._resourceGroups, constants.RESOURCE_GROUP_NOT_FOUND);
            const selectedResourceGroupValue = this._migrationServiceResourceGroupDropdown.values.find(v => v.name.toLowerCase() === this._resourceGroupPreset.toLowerCase());
            this._migrationServiceResourceGroupDropdown.value = (selectedResourceGroupValue)
                ? selectedResourceGroupValue
                : this._migrationServiceResourceGroupDropdown.values?.length > 0
                    ? this._migrationServiceResourceGroupDropdown.values[0]
                    : '';
        }
        catch (e) {
            if (e instanceof Error) {
                this.setDialogMessage(constants.RESOURCE_GROUP_FETCH_UNEXPECTED_FAILURE);
            }
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.PopulateResourceGroupsFailed, { error: e });
        }
        finally {
            this._migrationServiceResourceGroupDropdown.loading = false;
        }
    }
    createServiceStatus() {
        this._connectionStatus = this._view.modelBuilder.infoBox().withProps({
            text: '',
            style: 'error',
            CSSStyles: {
                ...styles.BODY_CSS
            }
        }).component();
        this._connectionStatus.CSSStyles = {
            'width': '350px'
        };
        this._refreshLoadingComponent = this._view.modelBuilder.loadingComponent().withProps({
            loading: false,
            CSSStyles: {
                ...styles.BODY_CSS
            }
        }).component();
        this._setupContainer = this._view.modelBuilder.flexContainer().withItems([
            this._connectionStatus,
            this._refreshLoadingComponent
        ], {
            CSSStyles: {
                'margin-bottom': '5px'
            }
        }).withLayout({
            flexFlow: 'column'
        }).component();
        this._setupContainer.display = 'none';
        return this._setupContainer;
    }
    async refreshStatus() {
        const subscription = this._model.dataMigrationServiceSubscription;
        const resourceGroupId = this._migrationServiceResourceGroupDropdown.value.name;
        const resourceGroup = (0, azure_1.getResourceName)(resourceGroupId);
        const telemetryProps = this._model.getDefaultTelemetryProps();
        telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceSubscription] = subscription.id;
        telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceResourceGroup] = resourceGroup;
        telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = this._createdMigrationService.name;
        const maxRetries = 5;
        let migrationServiceStatus;
        for (let i = 0; i < maxRetries; i++) {
            try {
                utils.clearDialogMessage(this._dialogObject);
                migrationServiceStatus = await (0, azure_1.getMigrationService)(this._model.azureAccount, subscription, resourceGroup, this._createdMigrationService.name);
                break;
            }
            catch (e) {
                if (e instanceof Error) {
                    this.setDialogMessage(constants.SERVICE_STATUS_REFRESH_ERROR);
                }
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.GetMigrationServiceFailed, { error: e });
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.GetMigrationServiceFailed, telemetryProps, {});
            }
            await new Promise(r => setTimeout(r, 5000));
        }
        if (migrationServiceStatus) {
            this._connectionStatus.text = constants.SERVICE_READY(this._createdMigrationService.name);
            await this._connectionStatus.updateProperties({
                text: constants.SERVICE_READY(this._createdMigrationService.name),
                isClickable: true,
                clickableButtonAriaLabel: constants.SERVICE_READY(this._createdMigrationService.name),
                style: 'information',
                CSSStyles: {
                    ...styles.BODY_CSS
                }
            });
            this._dialogObject.okButton.enabled = true;
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CreateDataMigrationServiceDialog, telemetry_1.TelemetryAction.CreateMigrationServiceSucceeded, telemetryProps, {});
        }
    }
    setDialogMessage(message, level = azdata.window.MessageLevel.Error) {
        this._dialogObject.message = {
            text: message,
            level: level
        };
    }
    setFormEnabledState(enable) {
        this._formSubmitButton.enabled = enable;
        this._migrationServiceResourceGroupDropdown.enabled = enable;
        this._migrationServiceNameText.enabled = enable;
        this._createResourceGroupLink.enabled = enable;
    }
}
exports.CreateDataMigrationServiceDialog = CreateDataMigrationServiceDialog;
//# sourceMappingURL=createMigrationServiceDialog.js.map