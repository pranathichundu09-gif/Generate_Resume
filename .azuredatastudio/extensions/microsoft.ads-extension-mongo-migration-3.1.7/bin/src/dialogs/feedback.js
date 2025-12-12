"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=feedback.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the feedback dialog of the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
class Feedback {
    dialog;
    async initializeDialog(dialog) {
        dialog.registerContent(async (view) => {
            const rootContainer = this.initializePageContent(view);
            return view.initializeModel(rootContainer);
        });
        dialog.cancelButton.hidden = true;
        dialog.okButton.label = constants.CLOSE;
        dialog.okButton.position = 'left';
    }
    async openDialog() {
        this.dialog = azdata.window.createModelViewDialog(constants.FEEDBACK, constants.FEEDBACK, '585px');
        const dialogSetupPromises = [];
        dialogSetupPromises.push(this.initializeDialog(this.dialog));
        azdata.window.openDialog(this.dialog);
        await Promise.all(dialogSetupPromises);
    }
    initializePageContent(view) {
        const container = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '474px',
            justifyContent: 'flex-start',
        }).withProps({
            CSSStyles: {
                padding: '15px'
            }
        }).component();
        const feedbackText = view.modelBuilder.text().withProps({
            value: constants.FEEDBACK_TEXT,
            CSSStyles: {
                'width': '474px',
                'margin': '0px',
                'font-size': '14px',
                'line-height': '20px',
                'font-weight': '600',
            },
        }).component();
        container.addItem(feedbackText);
        return container;
    }
}
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.js.map