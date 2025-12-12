"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardStatusBar = void 0;
const azdata = require("azdata");
const loc = require("../constants/strings");
class DashboardStatusBar {
    _errorTitle = '';
    _errorLabel = '';
    _errorDescription = '';
    _errorDialogIsOpen = false;
    _statusInfoBox;
    _context;
    _disposables = [];
    constructor(context, statusInfoBox) {
        this._context = context;
        this._statusInfoBox = statusInfoBox;
    }
    dispose() {
        this._disposables.forEach(d => {
            // eslint-disable-next-line no-empty
            try {
                d.dispose();
            }
            catch {
            }
        });
    }
    async showError(errorTitle, errorLabel, errorDescription) {
        this._errorTitle = errorTitle;
        this._errorLabel = errorLabel;
        this._errorDescription = errorDescription;
        this._statusInfoBox.style = 'error';
        this._statusInfoBox.text = errorTitle;
        this._statusInfoBox.ariaLabel = errorTitle;
        await this._updateStatusDisplay(this._statusInfoBox, true);
    }
    async clearError() {
        await this._updateStatusDisplay(this._statusInfoBox, false);
        this._errorTitle = '';
        this._errorLabel = '';
        this._errorDescription = '';
        this._statusInfoBox.style = 'success';
        this._statusInfoBox.text = '';
    }
    async openErrorDialog() {
        if (this._errorDialogIsOpen) {
            return;
        }
        try {
            const tab = azdata.window.createTab(this._errorTitle);
            tab.registerContent(async (view) => {
                const flex = view.modelBuilder.flexContainer()
                    .withItems([
                    view.modelBuilder.text()
                        .withProps({ value: this._errorLabel, CSSStyles: { 'margin': '0px 0px 5px 5px' } })
                        .component(),
                    view.modelBuilder.inputBox()
                        .withProps({
                        value: this._errorDescription,
                        readOnly: true,
                        multiline: true,
                        height: 400,
                        inputType: 'text',
                        display: 'inline-block',
                        CSSStyles: { 'overflow': 'hidden auto', 'margin': '0px 0px 0px 5px' },
                    })
                        .component()
                ])
                    .withLayout({ flexFlow: 'column', width: 420, })
                    .withProps({ CSSStyles: { 'margin': '0 10px 0 10px' } })
                    .component();
                await view.initializeModel(flex);
            });
            const dialog = azdata.window.createModelViewDialog(this._errorTitle, 'errorDialog', 450, 'flyout');
            dialog.content = [tab];
            dialog.okButton.label = loc.CLEAR;
            dialog.okButton.focused = true;
            dialog.okButton.position = 'left';
            dialog.cancelButton.label = loc.CLOSE;
            dialog.cancelButton.position = 'left';
            this._context.subscriptions.push(dialog.onClosed(async (e) => {
                if (e === 'ok') {
                    await this.clearError();
                }
                this._errorDialogIsOpen = false;
            }));
            azdata.window.openDialog(dialog);
        }
        catch (error) {
            this._errorDialogIsOpen = false;
        }
    }
    async _updateStatusDisplay(control, visible) {
        await control.updateCssStyles({ 'display': visible ? 'inline' : 'none' });
    }
}
exports.DashboardStatusBar = DashboardStatusBar;
//# sourceMappingURL=DashboardStatusBar.js.map