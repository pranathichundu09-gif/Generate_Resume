"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=help.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the settings dialog of the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpAndSupportDialog = void 0;
const vscode = require("vscode");
const azdata = require("azdata");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const constants = require("../constants/strings");
const constants_1 = require("../constants");
class HelpAndSupportDialog {
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
        this.dialog = azdata.window.createModelViewDialog(constants.HELP_SUPPORT, constants.HELP_SUPPORT, '585px');
        const dialogSetupPromises = [];
        dialogSetupPromises.push(this.initializeDialog(this.dialog));
        azdata.window.openDialog(this.dialog);
        await Promise.all(dialogSetupPromises);
    }
    initializePageContent(view) {
        const linksContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '474px',
            justifyContent: 'flex-start',
        }).withProps({
            CSSStyles: {
                padding: '15px'
            }
        }).component();
        const support = [{
                title: constants.SUPPORT_RESOURCES,
                description: constants.EXPLORE_DOCUMENTATION,
                link: constants_1.mongoMigrationDocumentation,
                iconPath: iconPathHelper_1.IconPathHelper.info,
            },
            {
                title: constants.SUPPORT_REQUEST,
                description: constants.CREATE_SUPPORT_REQUEST,
                link: '',
                iconPath: iconPathHelper_1.IconPathHelper.newSupportRequest,
            }];
        linksContainer.addItems(support.map(l => this.createSupportContainer(view, l)));
        return linksContainer;
    }
    createSupportContainer(view, linkMetaData) {
        const maxWidth = 474;
        const labelsContainer = view.modelBuilder.flexContainer().withProps({
            CSSStyles: {
                'flex-direction': 'column',
                'width': `${maxWidth}px`,
                'justify-content': 'flex-start',
                'margin-bottom': '12px'
            }
        }).component();
        const titleComponent = view.modelBuilder.text().withProps({
            value: linkMetaData.title,
            CSSStyles: {
                'font-size': '14px',
                'line-height': '20px',
                'font-weight': '600',
                'margin-bottom': '5px',
            }
        }).component();
        labelsContainer.addItems([titleComponent]);
        const linksContainer = view.modelBuilder.flexContainer().withProps({
            CSSStyles: {
                'flex-direction': 'row',
                'width': `${maxWidth + 10}px`,
                'justify-content': 'flex-start',
            }
        }).component();
        const linkImageComponent = view.modelBuilder.image().withProps({
            iconPath: linkMetaData.iconPath,
            iconHeight: '16px',
            iconWidth: '16px',
            width: '16px',
            height: '16px',
        }).component();
        linksContainer.addItems([linkImageComponent]);
        const linkComponent = view.modelBuilder.hyperlink().withProps({
            label: linkMetaData.description,
            url: linkMetaData.link,
            showLinkIcon: true,
            CSSStyles: {
                'font-size': '13px',
                'line-height': '18px',
                'margin-left': '-225px',
                'text-decoration': 'none'
            }
        }).component();
        const note = view.modelBuilder.text().withProps({
            value: constants.SUPPORT_NOTE,
            CSSStyles: {
                'margin-block-end': '-1px'
            },
        }).component();
        linksContainer.addItems([linkComponent]);
        labelsContainer.addItems([linksContainer]);
        if (linkMetaData.title === constants.SUPPORT_REQUEST) {
            linkComponent.onDidClick(async () => await this.launchNewSupportRequest());
            labelsContainer.addItem(note);
        }
        else {
            linkComponent.url = constants_1.mongoMigrationDocumentation;
        }
        return labelsContainer;
    }
    async launchNewSupportRequest() {
        await vscode.env.openExternal(vscode.Uri.parse(constants_1.supportTicket));
    }
}
exports.HelpAndSupportDialog = HelpAndSupportDialog;
//# sourceMappingURL=help.js.map