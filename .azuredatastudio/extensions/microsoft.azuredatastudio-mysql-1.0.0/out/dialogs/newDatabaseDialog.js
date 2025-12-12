"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewDatabaseDialog = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const azdata = require("azdata");
const uiConstants_1 = require("../uiConstants");
const PromiseUtils_1 = require("../utils/PromiseUtils");
const toolsserviceUtils_1 = require("../utils/toolsserviceUtils");
class NewDatabaseDialog {
    constructor(client) {
        this.toDispose = [];
        this.initDialogComplete = new PromiseUtils_1.Deferred();
        this.DEFAULT_CHARSET_VALUE = "utf8mb4";
        this.DEFAULT_COLLATION_VALUE = "utf8mb4_general_ci";
        this.charsetsCache = [];
        this.defaultCollationCache = new Map();
        this.collationsCache = new Map();
        this.client = client;
        this.dialog = azdata.window.createModelViewDialog(uiConstants_1.NewDatabaseTitle, uiConstants_1.NewDatabaseDialogName);
        this.newDatabaseTab = azdata.window.createTab('');
        this.dialog.registerCloseValidator(() => __awaiter(this, void 0, void 0, function* () {
            return this.executeAndValidate();
        }));
    }
    openDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initializeDialog();
            this.dialog.okButton.label = uiConstants_1.CreateButtonLabel;
            this.dialog.okButton.enabled = false;
            this.toDispose.push(this.dialog.okButton.onClick(() => __awaiter(this, void 0, void 0, function* () { return yield this.handleCreateButtonClick(); })));
            this.dialog.cancelButton.label = uiConstants_1.CancelButtonLabel;
            yield this.loadConnectionOwnerUri();
            azdata.window.openDialog(this.dialog);
            yield this.initDialogComplete.promise;
            yield this.loadDialogData();
            this.onLoadingComplete();
        });
    }
    loadDialogData() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadAndUpdateCharsetValues();
            yield this.tryUpdateCollationDropDown(this.DEFAULT_CHARSET_VALUE);
        });
    }
    onLoadingComplete() {
        this.databaseNameTextBox.enabled = true;
        this.databaseCharsetDropDown.enabled = true;
        this.databaseCollationDropDown.enabled = true;
    }
    loadConnectionOwnerUri() {
        return __awaiter(this, void 0, void 0, function* () {
            var connid = (yield azdata.connection.getCurrentConnection()).connectionId;
            this.connectionOwnerUri = (yield azdata.connection.getUriForConnection(connid));
        });
    }
    loadAndUpdateCharsetValues() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.databaseCharsetDropDown.loading = true;
                var charsets = yield toolsserviceUtils_1.ToolsServiceUtils.getCharsets(this.connectionOwnerUri, this.client);
                charsets.forEach(charset => {
                    this.charsetsCache.push(charset.name);
                    this.defaultCollationCache.set(charset.name, charset.defaultCollation);
                });
                this.databaseCharsetDropDown.values = this.charsetsCache;
            }
            catch (e) {
                // Log the error message and keep the values of charset as default.
                console.warn("New Database Tab : Unable to fetch charset values. Using default charset.");
            }
            finally {
                this.databaseCharsetDropDown.loading = false;
            }
        });
    }
    initializeDialog() {
        this.initializeNewDatabaseTab();
        this.dialog.content = [this.newDatabaseTab];
    }
    initializeNewDatabaseTab() {
        this.newDatabaseTab.registerContent((view) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const databaseNameRow = this.createDatabaseNameRow(view);
            const databaseCharsetRow = this.createDatabaseCharsetRow(view);
            const databaseCollationRow = this.createDatabaseCollationRow(view);
            const newDatabaseDetailsFormSection = view.modelBuilder.flexContainer().withLayout({ flexFlow: 'column' }).component();
            newDatabaseDetailsFormSection.addItems([databaseNameRow, databaseCharsetRow, databaseCollationRow]);
            this.formBuilder = view.modelBuilder.formContainer()
                .withFormItems([
                {
                    title: uiConstants_1.NewDatabaseDetailsTitle,
                    components: [
                        {
                            component: newDatabaseDetailsFormSection,
                        }
                    ]
                }
            ], {
                horizontal: false,
                titleFontSize: 13
            })
                .withLayout({
                width: '100%',
                padding: '10px 10px 0 20px'
            });
            let formModel = this.formBuilder.component();
            yield view.initializeModel(formModel);
            (_a = this.initDialogComplete) === null || _a === void 0 ? void 0 : _a.resolve();
        }));
    }
    createDatabaseNameRow(view) {
        this.databaseNameTextBox = view.modelBuilder.inputBox().withProps({
            ariaLabel: uiConstants_1.DatabaseNameTextBoxLabel,
            placeHolder: uiConstants_1.DatabaseNameTextBoxPlaceHolder,
            required: true,
            width: "310px",
            enabled: false
        }).component();
        this.databaseNameTextBox.onTextChanged(() => {
            var _a;
            this.databaseNameTextBox.value = (_a = this.databaseNameTextBox.value) === null || _a === void 0 ? void 0 : _a.trim();
            void this.databaseNameTextBox.updateProperty('title', this.databaseNameTextBox.value);
            this.tryEnableCreateButton();
        });
        const databaseNameLabel = view.modelBuilder.text().withProps({
            value: uiConstants_1.DatabaseNameLabel,
            requiredIndicator: true,
            width: '110px'
        }).component();
        const databaseNameRow = view.modelBuilder.flexContainer().withItems([databaseNameLabel, this.databaseNameTextBox], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();
        return databaseNameRow;
    }
    createDatabaseCharsetRow(view) {
        this.databaseCharsetDropDown = view.modelBuilder.dropDown().withProps({
            values: [this.DEFAULT_CHARSET_VALUE],
            value: this.DEFAULT_CHARSET_VALUE,
            ariaLabel: uiConstants_1.DatabaseCharsetDropDownLabel,
            required: false,
            width: '310px',
            enabled: false
        }).component();
        this.databaseCharsetDropDown.onValueChanged(() => {
            this.tryUpdateCollationDropDown(this.getCurrentCharset());
        });
        const databaseCharsetLabel = view.modelBuilder.text().withProps({
            value: uiConstants_1.DatabaseCharsetLabel,
            requiredIndicator: false,
            width: '110px'
        }).component();
        const databaseCharsetRow = view.modelBuilder.flexContainer().withItems([databaseCharsetLabel, this.databaseCharsetDropDown], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();
        return databaseCharsetRow;
    }
    getCollationValues(charset) {
        return __awaiter(this, void 0, void 0, function* () {
            let collationValues = [this.defaultCollationCache.get(charset)];
            try {
                if (!this.collationsCache.has(charset)) {
                    let collations = yield toolsserviceUtils_1.ToolsServiceUtils.getCollations(this.connectionOwnerUri, charset, this.client);
                    this.collationsCache.set(charset, collations);
                }
                collationValues = this.collationsCache.get(charset);
            }
            catch (e) {
                // Log the error message and keep the values of collation value as default.
                console.warn("New Database Tab : Unable to fetch collation values. Using default collation.");
            }
            return collationValues;
        });
    }
    createDatabaseCollationRow(view) {
        this.databaseCollationDropDown = view.modelBuilder.dropDown().withProps({
            values: [this.DEFAULT_COLLATION_VALUE],
            value: this.DEFAULT_COLLATION_VALUE,
            ariaLabel: uiConstants_1.DatabaseCollationDropDownLabel,
            required: false,
            width: '310px',
            enabled: false
        }).component();
        const databaseCollationLabel = view.modelBuilder.text().withProps({
            value: uiConstants_1.DatabaseCollationLabel,
            requiredIndicator: false,
            width: '110px'
        }).component();
        const databaseCharsetRow = view.modelBuilder.flexContainer().withItems([databaseCollationLabel, this.databaseCollationDropDown], { flex: '0 0 auto', CSSStyles: { 'margin-right': '10px', 'margin-top': '-10px' } }).withLayout({ flexFlow: 'row', alignItems: 'center' }).component();
        return databaseCharsetRow;
    }
    tryUpdateCollationDropDown(charset_name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.databaseCollationDropDown.loading = true;
            this.databaseCollationDropDown.value = this.defaultCollationCache.get(charset_name);
            this.databaseCollationDropDown.values = (yield this.getCollationValues(charset_name));
            this.databaseCollationDropDown.loading = false;
        });
    }
    tryEnableCreateButton() {
        this.dialog.okButton.enabled = true;
    }
    handleCreateButtonClick() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dispose();
        });
    }
    dispose() {
        this.toDispose.forEach(disposable => disposable.dispose());
    }
    executeAndValidate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield toolsserviceUtils_1.ToolsServiceUtils.createDatabase(this.databaseNameTextBox.value, this.getCurrentCharset(), this.getCurrentCollation(), this.connectionOwnerUri, this.client);
                return true;
            }
            catch (e) {
                this.showErrorMessage(e.message);
            }
            return false;
        });
    }
    getCurrentCharset() {
        let charset = this.databaseCharsetDropDown.value;
        let charsetValue = (typeof charset === 'string') ? charset : charset.name;
        return charsetValue;
    }
    getCurrentCollation() {
        let collation = this.databaseCollationDropDown.value;
        let collationValue = (typeof collation === 'string') ? collation : collation.name;
        return collationValue;
    }
    showErrorMessage(message) {
        this.dialog.message = {
            text: message,
            level: azdata.window.MessageLevel.Error
        };
    }
}
exports.NewDatabaseDialog = NewDatabaseDialog;

//# sourceMappingURL=newDatabaseDialog.js.map
