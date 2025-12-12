"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResourceGroupDialog = void 0;
const azdata = require("azdata");
const events_1 = require("events");
const azure_1 = require("../services/azure");
const constants = require("../constants/strings");
const styles = require("../constants/styles");
class CreateResourceGroupDialog {
    _azureAccount;
    _subscription;
    _location;
    _dialogObject;
    _view;
    _creationEvent = new events_1.EventEmitter;
    _disposables = [];
    constructor(_azureAccount, _subscription, _location) {
        this._azureAccount = _azureAccount;
        this._subscription = _subscription;
        this._location = _location;
        this._dialogObject = azdata.window.createModelViewDialog('', 'CreateResourceGroupDialog', 550, 'callout', 'below', false, true, {
            height: 20,
            width: 20,
            xPos: 0,
            yPos: 0
        });
    }
    async initialize() {
        const tab = azdata.window.createTab('mongo.migration.CreateResourceGroupDialog');
        tab.registerContent(async (view) => {
            this._view = view;
            const resourceGroupDescription = view.modelBuilder.text().withProps({
                value: constants.RESOURCE_GROUP_DESCRIPTION,
                CSSStyles: {
                    ...styles.BODY_CSS,
                    'margin-bottom': '8px'
                }
            }).component();
            const nameLabel = view.modelBuilder.text().withProps({
                value: constants.NAME,
                CSSStyles: {
                    ...styles.LABEL_CSS
                }
            }).component();
            const resourceGroupName = view.modelBuilder.inputBox().withProps({
                ariaLabel: constants.NAME_OF_NEW_RESOURCE_GROUP
            }).withValidation(c => {
                let valid = false;
                if (c.value.length > 0 && c.value.length <= 90 && /^[-\w._()]+$/.test(c.value)) {
                    valid = true;
                }
                okButton.enabled = valid;
                return valid;
            }).component();
            this._disposables.push(resourceGroupName.onTextChanged(async (e) => {
                await errorBox.updateCssStyles({
                    'display': 'none'
                });
            }));
            const okButton = view.modelBuilder.button().withProps({
                label: constants.OK,
                width: '80px',
                enabled: false
            }).component();
            this._disposables.push(okButton.onDidClick(async (e) => {
                await errorBox.updateCssStyles({
                    'display': 'none'
                });
                okButton.enabled = false;
                cancelButton.enabled = false;
                loading.loading = true;
                try {
                    const resourceGroup = await (0, azure_1.createResourceGroup)(this._azureAccount, this._subscription, resourceGroupName.value, this._location);
                    this._creationEvent.emit('done', resourceGroup);
                }
                catch (e) {
                    await errorBox.updateCssStyles({
                        'display': 'inline'
                    });
                    if (e instanceof Error) {
                        errorBox.text = e.toString();
                    }
                    cancelButton.enabled = true;
                    await resourceGroupName.validate();
                }
                finally {
                    loading.loading = false;
                }
            }));
            const cancelButton = view.modelBuilder.button().withProps({
                label: constants.CANCEL,
                width: '80px'
            }).component();
            this._disposables.push(cancelButton.onDidClick(e => {
                this._creationEvent.emit('done', undefined);
            }));
            const loading = view.modelBuilder.loadingComponent().withProps({
                loading: false,
                loadingText: constants.CREATING_RESOURCE_GROUP,
                loadingCompletedText: constants.RESOURCE_GROUP_CREATED
            }).component();
            const buttonContainer = view.modelBuilder.flexContainer().withProps({
                CSSStyles: {
                    'margin-top': '5px'
                }
            }).component();
            buttonContainer.addItem(okButton, {
                flex: '0',
                CSSStyles: {
                    'width': '80px'
                }
            });
            buttonContainer.addItem(cancelButton, {
                flex: '0',
                CSSStyles: {
                    'margin-left': '8px',
                    'width': '80px'
                }
            });
            buttonContainer.addItem(loading, {
                flex: '0',
                CSSStyles: {
                    'margin-left': '8px'
                }
            });
            const errorBox = this._view.modelBuilder.infoBox().withProps({
                style: 'error',
                text: '',
                CSSStyles: {
                    'display': 'none'
                }
            }).component();
            const container = this._view.modelBuilder.flexContainer().withLayout({
                flexFlow: 'column'
            }).withItems([
                resourceGroupDescription,
                nameLabel,
                resourceGroupName,
                errorBox,
                buttonContainer
            ]).component();
            const formBuilder = view.modelBuilder.formContainer().withFormItems([
                {
                    component: container
                }
            ], {
                horizontal: false
            });
            const form = formBuilder.withLayout({ width: '100%' }).withProps({
                CSSStyles: {
                    'padding': '0px !important'
                }
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
            return view.initializeModel(form).then(async (v) => {
                await resourceGroupName.focus();
            });
        });
        this._dialogObject.okButton.label = constants.APPLY;
        this._dialogObject.okButton.position = 'left';
        this._dialogObject.content = [tab];
        azdata.window.openDialog(this._dialogObject);
        return new Promise((resolve) => {
            this._creationEvent.once('done', async (resourceGroup) => {
                azdata.window.closeDialog(this._dialogObject);
                resolve(resourceGroup);
            });
        });
    }
}
exports.CreateResourceGroupDialog = CreateResourceGroupDialog;
//# sourceMappingURL=createResourceGroupDialog.js.map