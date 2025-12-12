"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetDatabaseSummaryDialog = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
const styles = require("../constants/styles");
class TargetDatabaseSummaryDialog {
    _model;
    _dialogObject;
    _view;
    _tableLength = 700;
    constructor(_model) {
        this._model = _model;
        const dialogWidth = 'medium';
        this._dialogObject = azdata.window.createModelViewDialog(constants.COLLECTION_TO_BE_MIGRATED, 'TargetDatabaseSummaryDialog', dialogWidth);
    }
    async initialize() {
        const tab = azdata.window.createTab('mongo.migration.CreateResourceGroupDialog');
        tab.registerContent(async (view) => {
            this._view = view;
            const databaseCount = this._view.modelBuilder.text()
                .withProps({
                value: constants.COUNT_COLLECTIONS(this._model.targetNamespacesForMigration.length),
                CSSStyles: { ...styles.BODY_CSS, 'margin-bottom': '20px' }
            }).component();
            const headerCssStyle = {
                'border': 'none',
                'text-align': 'left',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                'overflow': 'hidden',
                'border-bottom': '1px solid'
            };
            const rowCssStyle = {
                'border': 'none',
                'text-align': 'left',
                'white-space': 'nowrap',
                'text-overflow': 'ellipsis',
                'overflow': 'hidden',
            };
            const columnWidth = 150;
            const columns = [
                {
                    valueType: azdata.DeclarativeDataType.string,
                    displayName: constants.SOURCE_COLLECTION,
                    isReadOnly: true,
                    width: columnWidth,
                    rowCssStyles: rowCssStyle,
                    headerCssStyles: headerCssStyle
                },
                {
                    valueType: azdata.DeclarativeDataType.string,
                    displayName: constants.TARGET_COLLECTION_NAME,
                    isReadOnly: true,
                    width: columnWidth,
                    rowCssStyles: rowCssStyle,
                    headerCssStyles: headerCssStyle
                }
            ];
            const tableRows = [];
            this._model.targetNamespacesForMigration.forEach((db) => {
                const tableRow = [];
                tableRow.push({ value: db }, { value: db });
                tableRows.push(tableRow);
            });
            const databaseTable = this._view.modelBuilder.declarativeTable()
                .withProps({
                ariaLabel: constants.COLLECTION_TO_BE_MIGRATED,
                columns: columns,
                dataValues: tableRows,
                width: this._tableLength
            }).component();
            const container = this._view.modelBuilder.flexContainer()
                .withLayout({ flexFlow: 'column' })
                .withItems([databaseCount, databaseTable])
                .component();
            const form = this._view.modelBuilder.formContainer()
                .withFormItems([{ component: container }], { horizontal: false })
                .withLayout({ width: '100%' })
                .component();
            return view.initializeModel(form);
        });
        this._dialogObject.content = [tab];
        azdata.window.openDialog(this._dialogObject);
    }
}
exports.TargetDatabaseSummaryDialog = TargetDatabaseSummaryDialog;
//# sourceMappingURL=targetDatabaseSummaryDialog.js.map