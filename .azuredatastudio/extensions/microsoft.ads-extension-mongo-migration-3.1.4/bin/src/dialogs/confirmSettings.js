"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=confirmSettings.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the confirm settings dialog of the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmSettings = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
const servicehelper = require("../services/serviceHelper");
const telemetry_1 = require("../telemetry");
const utils_1 = require("../common/utils");
class ConfirmSettings {
    _model;
    _disposables = [];
    dialog;
    constructor(_model) {
        this._model = _model;
    }
    async initializeDialog(dialog) {
        dialog.registerContent(async (view) => {
            const rootContainer = this.initializePageContent(view, dialog);
            return view.initializeModel(rootContainer);
        });
        dialog.cancelButton.hidden = false;
        dialog.okButton.label = 'Continue';
        dialog.okButton.position = 'left';
        dialog.okButton.enabled = false;
    }
    async openDialog() {
        this.dialog = azdata.window.createModelViewDialog(constants.CONFIRM_SETTINGS_TITLE, constants.CONFIRM_SETTINGS_TITLE, '585px');
        const dialogSetupPromises = [];
        dialogSetupPromises.push(this.initializeDialog(this.dialog));
        azdata.window.openDialog(this.dialog);
        await Promise.all(dialogSetupPromises);
        return this.dialog;
    }
    async testDMSConnectivity(dialog, connectionResultsInfoBox, testDmsConnectionTestContainer) {
        const telemetryProps = this._model.getDefaultTelemetryProps();
        telemetryProps[telemetry_1.TelemetryPropNames.TargetSubscription] = this._model.targetSubscription.id;
        telemetryProps[telemetry_1.TelemetryPropNames.TargetResourceGroup] = this._model.resourceGroup.name;
        telemetryProps[telemetry_1.TelemetryPropNames.TargetAccount] = (0, utils_1.parseMongoConnectionString)(this._model.targetConnectionString)?.options.server;
        telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceSubscription] = this._model.dataMigrationServiceSubscription.id;
        telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceResourceGroup] = this._model.dataMigrationServiceResourceGroup.name;
        telemetryProps[telemetry_1.TelemetryPropNames.DataMigrationServiceName] = this._model.dataMigrationService?.name ?? '';
        try {
            testDmsConnectionTestContainer.loading = true;
            await servicehelper.updateControlDisplay(connectionResultsInfoBox, false);
            const response = await this._model.testDMSConnectivity();
            if (response.errors != null && response.errors.length > 0) {
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TestConnectivityFailed, { error: response.errors[0].message });
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TestConnectivityFailed, telemetryProps, {});
                dialog.message = {
                    level: azdata.window.MessageLevel.Error,
                    text: constants.TEST_CONNECTIVITY_UNEXPECTED_FAILURE
                };
                return;
            }
            if (response.response?.data.errors != null && response.response?.data.errors.length > 0) {
                let errorMessages = "";
                response.response?.data.errors.forEach((element) => {
                    errorMessages = errorMessages + " error code: " + element.code + " error: " + element.message + "\n";
                });
                dialog.message = {
                    level: azdata.window.MessageLevel.Error,
                    text: constants.TEST_CONNECTIVITY_FAILURE(errorMessages)
                };
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TestConnectivityFailed, { errorType: errorMessages });
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TestConnectivityFailed, telemetryProps, {});
                return;
            }
            await servicehelper.updateControlDisplay(connectionResultsInfoBox, true);
            dialog.okButton.enabled = true;
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TestConnectivitySucceeded, telemetryProps, {});
        }
        catch (e) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TestConnectivityFailed, { error: e });
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TestConnectivityFailed, telemetryProps, {});
            dialog.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.TRIGGER_DATA_MIGRATION_UNEXPECTED_FAILURE
            };
        }
        finally {
            testDmsConnectionTestContainer.loading = false;
        }
    }
    initializePageContent(view, dialog) {
        const linksContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '474px',
            justifyContent: 'flex-start',
        }).withProps({
            CSSStyles: {
                padding: '15px'
            }
        }).component();
        const noteForIR = view.modelBuilder.infoBox().withProps({
            text: constants.CONFIRM_SETTINGS_STEPS + "\n\n" +
                constants.CONFIRM_SETTINGS_ALLOW_CONNECTIONS + "\n\n" +
                constants.CONFIRM_SETTINGS_FIREWALL_EXCEPTIONS + "\n\n" +
                constants.CONFIRM_SETTINGS_IMPORTANT + "\n" +
                constants.CONFIRM_SETTINGS_PRIVATE_ENDPOINT + "\n\n" +
                constants.CONFIRM_SETTINGS_ENSURE + "\n\n" +
                constants.CONFIRM_SETTINGS_CONFIRM,
            style: 'warning',
            links: [
                {
                    text: constants.CONFIRM_SETTINGS_AZURE_IP,
                    url: 'https://www.microsoft.com/en-us/download/details.aspx?id=56519'
                },
                {
                    text: constants.CONFIRM_SETTINGS_IP_FIREWALL,
                    url: 'https://learn.microsoft.com/en-us/azure/cosmos-db/how-to-configure-firewall'
                }
            ],
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'margin': '4px 0',
            }
        }).component();
        linksContainer.addItem(noteForIR);
        const checkConnectivityButton = view.modelBuilder.button()
            .withProps({
            enabled: true,
            label: constants.CHECK_CONNECTIVITY,
            width: '120px',
        }).component();
        const connectionResultsInfoBox = view.modelBuilder.infoBox()
            .withProps({
            style: 'success',
            text: '',
            announceText: true,
            CSSStyles: { 'display': 'none' },
        })
            .component();
        const testDmsConnectionButtonLoadingContainer = view.modelBuilder.loadingComponent()
            .withItem(checkConnectivityButton)
            .withProps({ loading: false })
            .component();
        const testDmsConnectionTestContainer = view.modelBuilder.flexContainer()
            .withItems([
            testDmsConnectionButtonLoadingContainer,
            connectionResultsInfoBox
        ], { flex: '0 0 auto' })
            .withLayout({
            flexFlow: 'row',
            alignContent: 'center',
            alignItems: 'center',
        })
            .withProps({ CSSStyles: { 'margin': '15px 0 0 0' } })
            .component();
        linksContainer.addItem(testDmsConnectionTestContainer);
        this._disposables.push(checkConnectivityButton.onDidClick(async (value) => {
            this.testDMSConnectivity(dialog, connectionResultsInfoBox, testDmsConnectionButtonLoadingContainer);
        }));
        return linksContainer;
    }
}
exports.ConfirmSettings = ConfirmSettings;
//# sourceMappingURL=confirmSettings.js.map