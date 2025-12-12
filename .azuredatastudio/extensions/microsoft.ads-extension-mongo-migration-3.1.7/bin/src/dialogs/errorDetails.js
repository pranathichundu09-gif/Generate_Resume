"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=errorDetails.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines the error details dialog of the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDetailsDialog = void 0;
const vscode = require("vscode");
const azdata = require("azdata");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const constants = require("../constants/strings");
const localizationFile_1 = require("../localizationFile");
const utils_1 = require("../common/utils");
const help_1 = require("./help");
const constants_1 = require("../constants");
const protocol = "https://";
const akaMS = "aka.ms/";
class ErrorDetailsDialog {
    errorEntity;
    dialog;
    constructor(errorEntity) {
        this.errorEntity = errorEntity;
    }
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
        this.dialog = azdata.window.createModelViewDialog(constants.ERROR_DETAILS, constants.ERROR_DETAILS, '585px');
        const dialogSetupPromises = [];
        dialogSetupPromises.push(this.initializeDialog(this.dialog));
        azdata.window.openDialog(this.dialog);
        await Promise.all(dialogSetupPromises);
    }
    initializePageContent(view) {
        const detailsContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '474px',
            justifyContent: 'flex-start',
        }).withProps({
            CSSStyles: {
                padding: '15px'
            }
        }).component();
        const error = [
            constants.ERROR_MESSAGE,
            constants.POSSIBLE_CAUSES,
            constants.REMEDIATION_ACTIONS
        ];
        detailsContainer.addItems(error.map(l => this.createDetailsContainer(view, l)));
        const feedbackContainer = view.modelBuilder.divContainer().withProps({
            CSSStyles: {
                'flex-direction': 'row',
                'width': '474px',
                'background-color': '#F0F6FF',
                'margin-top': '170px',
                'margin-bottom': '15px',
                'height': '45px'
            }
        }).component();
        const feedbackImageComponent = view.modelBuilder.image().withProps({
            iconPath: iconPathHelper_1.IconPathHelper.info,
            iconHeight: '16px',
            iconWidth: '16px',
            width: '16px',
            height: '16px',
            CSSStyles: {
                'margin': '15px',
                'width': '22px',
                'float': 'left'
            }
        }).component();
        feedbackImageComponent.focus();
        const feedbackComponent = view.modelBuilder.text().withProps({
            value: constants.FEEDBACK_QUESTION,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'text-decoration': 'none',
                'float': 'left',
                'margin': '14px 0px',
            }
        }).component();
        const supportLinkComponent = view.modelBuilder.hyperlink().withProps({
            label: constants.FEEDBACK_NOTE,
            url: '',
            showLinkIcon: true,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'text-decoration': 'none'
            }
        }).component();
        supportLinkComponent.onDidClick(() => {
            const helpAndSupportDialog = new help_1.HelpAndSupportDialog();
            helpAndSupportDialog.openDialog();
        });
        const qnaText = view.modelBuilder.text().withProps({
            value: constants.QNA,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'margin-bottom': '-0.7px'
            }
        }).component();
        const qnaLinkComponent = view.modelBuilder.hyperlink().withProps({
            label: constants.DMS_Link,
            url: constants_1.dmsQnaUrl,
            showLinkIcon: true,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'text-decoration': 'none'
            }
        }).component();
        qnaLinkComponent.focus();
        feedbackContainer.addItems([feedbackImageComponent, feedbackComponent]);
        detailsContainer.addItems([feedbackContainer, supportLinkComponent, qnaText, qnaLinkComponent]);
        return detailsContainer;
    }
    createDetailsContainer(view, title) {
        const labelsContainer = view.modelBuilder.flexContainer().withProps({
            CSSStyles: {
                'flex-direction': 'column',
                'width': '474px',
                'justify-content': 'flex-start',
                'margin-bottom': '12px'
            }
        }).component();
        const titleComponent = view.modelBuilder.flexContainer().withProps({
            CSSStyles: {
                'flex-direction': 'row',
            }
        }).component();
        const titleText = view.modelBuilder.text().withProps({
            value: title,
            CSSStyles: {
                'font-size': '14px',
                'line-height': '20px',
                'font-weight': '600',
                'margin-bottom': '5px',
            }
        }).component();
        titleComponent.addItem(titleText);
        const copyButton = view.modelBuilder.button().withProps({
            title: constants.COPY,
            iconPath: iconPathHelper_1.IconPathHelper.copy,
            ariaLabel: constants.COPY,
            CSSStyles: {
                'margin-top': '14px',
                'margin-left': '80%'
            }
        }).component();
        copyButton.onDidClick(async () => {
            await vscode.env.clipboard.writeText((0, localizationFile_1.localize)(this.errorEntity.errorCode, this.errorEntity.errorMessage, ...(this.errorEntity.errorParameters ?? [""])));
            void vscode.window.showInformationMessage(constants.COPIED_MESSAGE);
        });
        if (title == constants.ERROR_MESSAGE) {
            titleComponent.addItem(copyButton);
        }
        labelsContainer.addItems([titleComponent]);
        const note = view.modelBuilder.text().withProps({
            value: '',
            CSSStyles: {
                'font-size': '13px',
                'margin-block-end': '-1px'
            },
        }).component();
        const urlContainer = view.modelBuilder.flexContainer().withProps({
            CSSStyles: {
                'flex-direction': 'column',
                'width': '474px',
                'justify-content': 'flex-start'
            }
        }).component();
        // For description section
        if (title == constants.ERROR_MESSAGE) {
            let errorMessage = (0, localizationFile_1.localize)(this.errorEntity.errorCode, this.errorEntity.errorMessage, ...(this.errorEntity.errorParameters ?? [""]));
            // Only aka.ms links will work here
            const urls = (0, utils_1.detectAKAURLs)(errorMessage);
            if (urls != null) {
                urls.forEach((url) => {
                    const errorHyperlink = view.modelBuilder.hyperlink().withProps({
                        url: protocol + url,
                        label: url
                    }).component();
                    errorMessage = errorMessage.replace(url, '');
                    urlContainer.addItem(errorHyperlink);
                });
            }
            note.value = errorMessage;
        }
        // For possible causes section
        else if (title == constants.POSSIBLE_CAUSES) {
            let possibleCauses = (0, localizationFile_1.localize)(this.errorEntity.errorCode + "_PC", this.errorEntity.errorMessage, ...(this.errorEntity.errorParameters ?? [""]));
            // Only aka.ms links will work here
            const urls = (0, utils_1.detectAKAURLs)(possibleCauses);
            if (urls != null) {
                urls.forEach((url) => {
                    const errorHyperlink = view.modelBuilder.hyperlink().withProps({
                        url: protocol + url,
                        label: url
                    }).component();
                    possibleCauses = possibleCauses.replace(url, '');
                    urlContainer.addItem(errorHyperlink);
                });
            }
            note.value = possibleCauses;
            const vanityName = akaMS + (0, utils_1.convertErrorCodeToVanityName)(this.errorEntity.errorCode);
            const errorCodeLink = view.modelBuilder.hyperlink().withProps({
                url: protocol + vanityName,
                label: vanityName,
                CSSStyles: {
                    'font-size': '13px'
                },
            }).component();
            urlContainer.addItem(errorCodeLink);
        }
        // For remediation action section
        else if (title == constants.REMEDIATION_ACTIONS) {
            let remediationActions = (0, localizationFile_1.localize)(this.errorEntity.errorCode + "_RA", this.errorEntity.errorMessage, ...(this.errorEntity.errorParameters ?? [""]));
            // Only aka.ms links will work here
            const urls = (0, utils_1.detectAKAURLs)(remediationActions);
            if (urls != null) {
                urls.forEach((url) => {
                    const errorHyperlink = view.modelBuilder.hyperlink().withProps({
                        url: protocol + url,
                        label: url
                    }).component();
                    remediationActions = remediationActions.replace(url, '');
                    urlContainer.addItem(errorHyperlink);
                });
            }
            note.value = remediationActions;
        }
        labelsContainer.addItems([note, urlContainer]);
        return labelsContainer;
    }
}
exports.ErrorDetailsDialog = ErrorDetailsDialog;
//# sourceMappingURL=errorDetails.js.map