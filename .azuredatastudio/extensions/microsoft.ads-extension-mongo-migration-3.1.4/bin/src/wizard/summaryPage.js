"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryPage = void 0;
const azdata = require("azdata");
const migrationWizardPage_1 = require("../models/migrationWizardPage");
const stateMachine_1 = require("../models/stateMachine");
const constants = require("../constants/strings");
const azure_1 = require("../services/azure");
const targetDatabaseSummaryDialog_1 = require("../dialogs/targetDatabaseSummaryDialog");
const styles = require("../constants/styles");
const common_1 = require("../contracts/common");
class SummaryPage extends migrationWizardPage_1.MigrationWizardPage {
    _view;
    _flexContainer;
    _disposables = [];
    constructor(wizard, migrationStateModel) {
        super(wizard, azdata.window.createWizardPage(constants.SUMMARY_PAGE_TITLE), migrationStateModel);
    }
    async registerContent(view) {
        this._view = view;
        this._flexContainer = view.modelBuilder.flexContainer()
            .withLayout({ flexFlow: 'column' })
            .component();
        const form = view.modelBuilder.formContainer()
            .withFormItems([{ component: this._flexContainer }])
            .component();
        this._disposables.push(this._view.onClosed(e => this._disposables.forEach(d => {
            // eslint-disable-next-line no-empty
            try {
                d.dispose();
            }
            catch {
            }
        })));
        await view.initializeModel(form);
    }
    updateTargetNamespacesforMigration() {
        this.migrationStateModel.targetNamespacesForMigration = [];
        this.migrationStateModel.selectedNamespacetoActionMapping.forEach((action, namespace) => {
            if (action === stateMachine_1.MigrationMapping.Migrate) {
                this.migrationStateModel.targetNamespacesForMigration.push(namespace);
            }
        });
    }
    async onPageEnter(pageChangeInfo) {
        this.updateTargetNamespacesforMigration();
        this.wizard.nextButton.label = constants.START_SCHEMA_MIGRATION;
        const targetDatabaseSummary = new targetDatabaseSummaryDialog_1.TargetDatabaseSummaryDialog(this.migrationStateModel);
        const isRuTarget = this.migrationStateModel.targetOffering === common_1.EnumTargetOffering.CosmosDBMongoRU;
        const numberOfCollections = (this.migrationStateModel.targetNamespacesForMigration?.length ?? 0);
        const targetDatabaseHyperlink = this._view.modelBuilder.hyperlink()
            .withProps({
            url: '',
            label: numberOfCollections.toString(),
            ariaLabel: numberOfCollections + " " + constants.COLLECTION_SUMMARY_LINK_TEXT(numberOfCollections.toString()),
            CSSStyles: { ...styles.BODY_CSS, 'margin': '0px', 'width': '300px', }
        }).component();
        this._disposables.push(targetDatabaseHyperlink.onDidClick(async (e) => await targetDatabaseSummary.initialize()));
        const targetDatabaseRow = this._view.modelBuilder.flexContainer()
            .withLayout({ flexFlow: 'row', alignItems: 'center', })
            .withItems([
            this.createLabelTextComponent(this._view, constants.SUMMARY_COLLECTION_COUNT_LABEL, { ...styles.BODY_CSS, 'width': '300px' }),
            targetDatabaseHyperlink
        ], { CSSStyles: { 'margin-right': '5px' } })
            .component();
        this._flexContainer
            .addItems([
            await this.createHeadingTextComponent(this._view, constants.SOURCE_COLLECTIONS),
            targetDatabaseRow,
            await this.createHeadingTextComponent(this._view, constants.AZURE_TARGET_TEXT),
            this.createInformationRow(this._view, constants.ACCOUNTS_SELECTION_PAGE_TITLE, this.migrationStateModel.azureAccount.displayInfo.displayName),
            this.createInformationRow(this._view, constants.AZURE_TARGET_TEXT, isRuTarget
                ? constants.AZURE_TARGET_RU_OFFERING
                : constants.AZURE_TARGET_VCORE_OFFERING),
            this.createInformationRow(this._view, constants.SUBSCRIPTION, this.migrationStateModel.targetSubscription.name),
            this.createInformationRow(this._view, constants.RESOURCE_GROUP, (0, azure_1.getResourceGroupFromId)(this.migrationStateModel.targetCosmosInstance.id)),
            this.createInformationRow(this._view, (isRuTarget)
                ? constants.AZURE_TARGET_RU_OFFERING
                : constants.AZURE_TARGET_VCORE_OFFERING, this.migrationStateModel.targetCosmosInstance.name),
            await this.createHeadingTextComponent(this._view, constants.MIGRATION_MODE_LABEL),
            this.createInformationRow(this._view, constants.MODE, this.migrationStateModel.dataMigrationMode === stateMachine_1.MigrationMode.Online
                ? constants.MIGRATION_MODE_ONLINE_LABEL
                : constants.MIGRATION_MODE_OFFLINE_LABEL),
        ]);
        this._flexContainer.addItems([
            await this.createHeadingTextComponent(this._view, constants.MIGRATION_SERVICE_SELECT_SERVICE_LABEL),
            this.createInformationRow(this._view, constants.SUBSCRIPTION, this.migrationStateModel.dataMigrationServiceSubscription?.name),
            this.createInformationRow(this._view, constants.RESOURCE_GROUP, this.migrationStateModel.dataMigrationServiceResourceGroup?.name),
            this.createInformationRow(this._view, constants.MIGRATION_SERVICE_SELECT_SERVICE_LABEL, this.migrationStateModel.dataMigrationService.name)
        ]);
        this.wizard.registerNavigationValidator(async (pageChangeInfo) => {
            this.wizard.message = { text: '' };
            return true;
        });
    }
    async onPageLeave(pageChangeInfo) {
        this.wizard.nextButton.label = constants.WIZARD_NEXT;
        this.wizard.registerNavigationValidator(pageChangeInfo => true);
        this.wizard.message = { text: '' };
        this._flexContainer.clearItems();
    }
    createInformationRow(view, label, value) {
        return view.modelBuilder.flexContainer()
            .withLayout({ flexFlow: 'row', alignItems: 'center', })
            .withItems([
            this.createLabelTextComponent(view, label, {
                ...styles.BODY_CSS,
                'margin': '4px 0px',
                'width': '300px',
            }),
            this.createTextComponent(view, value, {
                ...styles.BODY_CSS,
                'margin': '4px 0px',
                'width': '300px',
            })
        ])
            .component();
    }
    async createHeadingTextComponent(view, value, firstElement = false) {
        const component = this.createTextComponent(view, value);
        await component.updateCssStyles({
            ...styles.LABEL_CSS,
            'margin-top': firstElement ? '0' : '24px'
        });
        return component;
    }
    createLabelTextComponent(view, value, styles = { 'width': '300px' }) {
        return this.createTextComponent(view, value, styles);
    }
    createTextComponent(view, value, styles = { 'width': '300px' }) {
        return view.modelBuilder.text()
            .withProps({ value: value, CSSStyles: styles })
            .component();
    }
}
exports.SummaryPage = SummaryPage;
//# sourceMappingURL=summaryPage.js.map