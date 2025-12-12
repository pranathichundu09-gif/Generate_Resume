"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationWizardPage = void 0;
class MigrationWizardPage {
    wizard;
    wizardPage;
    migrationStateModel;
    constructor(wizard, wizardPage, migrationStateModel) {
        this.wizard = wizard;
        this.wizardPage = wizardPage;
        this.migrationStateModel = migrationStateModel;
    }
    registerWizardContent() {
        return new Promise((resolve, reject) => {
            this.wizardPage.registerContent(async (view) => {
                try {
                    await this.registerContent(view);
                    resolve();
                }
                catch (ex) {
                    reject(ex);
                }
                finally {
                    reject(new Error());
                }
            });
        });
    }
    getwizardPage() {
        return this.wizardPage;
    }
    canEnter() {
        return Promise.resolve(true);
    }
    canLeave() {
        return Promise.resolve(true);
    }
    async goToNextPage() {
        const current = this.wizard.currentPage;
        await this.wizard.setCurrentPage(current + 1);
    }
}
exports.MigrationWizardPage = MigrationWizardPage;
//# sourceMappingURL=migrationWizardPage.js.map