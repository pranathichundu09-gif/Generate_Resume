"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteCutoverDialog = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const constants = require("../constants/strings");
const EventEmitter = require("events");
const styles = require("../constants/styles");
const azure_1 = require("../services/azure");
const migrationLocalStorage_1 = require("../models/migrationLocalStorage");
const telemetry_1 = require("../telemetry");
const serviceHelper_1 = require("../services/serviceHelper");
const utils_1 = require("../common/utils");
const CONTROL_MARGIN = '20px';
const DefaultValue = '--';
class CompleteCutoverDialog {
    _dialogObject;
    _view;
    _doneButtonEvent = new EventEmitter();
    _disposables = [];
    async completeCutover(migration, context, statusBarContainer, view) {
        this._dialogObject = azdata.window.createModelViewDialog(constants.COMPLETE_CUTOVER_PAGE_TITLE, 'CompleteCutoverDialog', 'narrow');
        this._dialogObject.okButton.label = constants.CONFIRM_CUTOVER;
        this._dialogObject.okButton.position = 'left';
        this._dialogObject.cancelButton.position = 'left';
        this._dialogObject.okButton.enabled = false;
        const tab = azdata.window.createTab('');
        this._dialogObject.registerCloseValidator(async () => {
            return true;
        });
        tab.registerContent(async (view) => {
            this._view = view;
            const completeCutoverDescription = this._view.modelBuilder.text().withProps({
                value: constants.COMPLETE_CUTOVER_DESCRIPTION,
                CSSStyles: {
                    ...styles.BODY_CSS
                }
            }).component();
            const confirmCutoverCheckbox = this._view.modelBuilder.checkBox().withProps({
                required: true
            }).component();
            confirmCutoverCheckbox.onChanged(() => {
                this._dialogObject.okButton.enabled = confirmCutoverCheckbox.checked === true;
            });
            const confirmCutoverDescription = this._view.modelBuilder.text().withProps({
                value: constants.COMPLETE_CUTOVER_CONFIRMATION,
                CSSStyles: {
                    ...styles.BODY_CSS
                }
            }).component();
            const confirmContainer = this._view.modelBuilder.flexContainer().withLayout({
                flexFlow: 'row'
            }).withItems([
                confirmCutoverCheckbox,
                confirmCutoverDescription
            ]).withProps({ CSSStyles: { 'padding': CONTROL_MARGIN } })
                .component();
            const collectionTable = this._view.modelBuilder.declarativeTable().withProps({
                ariaLabel: constants.REPLICATION_GAP_TABLE,
                columns: [
                    {
                        displayName: constants.COLLECTION_NAME,
                        valueType: azdata.DeclarativeDataType.string,
                        width: 150,
                        isReadOnly: true,
                        rowCssStyles: styles.styleLeft,
                        headerCssStyles: styles.headerLeft
                    },
                    {
                        displayName: constants.REPLICATION_GAP,
                        valueType: azdata.DeclarativeDataType.string,
                        width: 150,
                        isReadOnly: true,
                        rowCssStyles: styles.styleLeft,
                        headerCssStyles: styles.headerLeft
                    },
                    {
                        displayName: constants.REPLICATION_CHANGES_REPLAYED,
                        valueType: azdata.DeclarativeDataType.string,
                        width: 120,
                        isReadOnly: true,
                        rowCssStyles: styles.styleLeft,
                        headerCssStyles: styles.headerLeft
                    }
                ]
            }).component();
            const map = new Map();
            migration.properties.collectionList.forEach(c => {
                const key = c.sourceDatabase + '.' + c.sourceCollection;
                if (!map.has(key)) {
                    map.set(key, {
                        databaseName: c.sourceDatabase,
                        collectionName: c.sourceCollection,
                    });
                }
                const row = map.get(key);
                if (c.migrationProgressDetails && c.migrationRunFsmState === 'MonitorCdcPipelinesRun') {
                    row.replicationGap = c.migrationProgressDetails.replicationGapInSeconds;
                    row.replicationChanges = c.migrationProgressDetails.processedDocumentCount;
                    row.metricsPublishTimeStamp = c.migrationProgressDetails.metricsPublishTimeStamp;
                }
            });
            if (map.size > 0) {
                const replicationGapData = [];
                map.forEach(r => {
                    let replicationGap = DefaultValue;
                    if (r.metricsPublishTimeStamp && r.replicationGap && !isNaN(r.replicationGap)) {
                        const timeNow = new Date();
                        const metricsPulishTime = new Date(r.metricsPublishTimeStamp * 1000);
                        const gapMs = r.replicationGap * 1000 + (timeNow.getTime() - metricsPulishTime.getTime());
                        replicationGap = (0, serviceHelper_1.convertDurationToString)(gapMs);
                    }
                    const collectionRows = [
                        { value: r.databaseName + '.' + r.collectionName },
                        { value: replicationGap },
                        { value: (r.replicationChanges === undefined || isNaN(r.replicationChanges)) ? DefaultValue : r.replicationChanges.toString() }
                    ];
                    replicationGapData.push(collectionRows);
                });
                collectionTable.setDataValues(replicationGapData);
            }
            const container = this._view.modelBuilder.flexContainer().withLayout({
                flexFlow: 'column'
            }).withItems([
                completeCutoverDescription,
                collectionTable,
                confirmContainer
            ]).withProps({ CSSStyles: { 'padding': CONTROL_MARGIN } })
                .component();
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
            return view.initializeModel(container);
        });
        this._dialogObject.content = [tab];
        azdata.window.openDialog(this._dialogObject);
        const telemetryProps = {};
        telemetryProps[telemetry_1.TelemetryPropNames.MigrationName] = migration.name;
        telemetryProps[telemetry_1.TelemetryPropNames.MigrationOperationId] = migration.properties.migrationOperationId;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._disposables.push(this._dialogObject.cancelButton.onClick(() => {
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CompleteCutoverDialog, telemetry_1.TelemetryAction.CompleteCutoverCancelled, telemetryProps, {});
        }));
        this._disposables.push(this._dialogObject.okButton.onClick(async (e) => {
            const migrationServiceContext = await migrationLocalStorage_1.MigrationLocalStorage.getMigrationServiceContext();
            try {
                await (0, azure_1.completeCutoverforVcore)(migrationServiceContext.azureAccount, migrationServiceContext.subscription, migration.id);
                vscode.window.showInformationMessage(constants.COMPLETE_CUTOVER_SUCCESS);
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CompleteCutoverDialog, telemetry_1.TelemetryAction.CompleteCutoverSucceeded, telemetryProps, {});
            }
            catch (e) {
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.CompleteCutoverDialog, telemetry_1.TelemetryAction.CompleteCutoverFailed, { error: e });
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.CompleteCutoverDialog, telemetry_1.TelemetryAction.CompleteCutoverFailed, telemetryProps, {});
                const statusBar = (0, utils_1.createStatusBar)(view, this._disposables, context, statusBarContainer);
                await statusBar.showError(constants.COMPLETE_CUTOVER_ERROR, constants.COMPLETE_CUTOVER_ERROR, e.message);
            }
        }));
        return new Promise((resolve) => {
            this._doneButtonEvent.once('done', () => {
                azdata.window.closeDialog(this._dialogObject);
                resolve({
                    success: true
                });
            });
        });
    }
}
exports.CompleteCutoverDialog = CompleteCutoverDialog;
//# sourceMappingURL=completeCutoverDialog.js.map