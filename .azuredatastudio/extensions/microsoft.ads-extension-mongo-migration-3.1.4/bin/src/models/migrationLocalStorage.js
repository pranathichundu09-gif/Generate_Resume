"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoMigrations = exports.getSelectedServiceStatus = exports.isServiceContextValid = exports.MigrationServiceMigrationsCache = exports.MigrationLocalStorage = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const azdata = require("azdata");
const azure_1 = require("../services/azure");
const serviceHelper_1 = require("../services/serviceHelper");
const loc = require("../constants/strings");
const dataMigration_1 = require("../contracts/migration/dataMigration");
class MigrationLocalStorage {
    static context;
    static mementoToken = 'sqlmigration.databaseMigrations';
    static setExtensionContext(context) {
        MigrationLocalStorage.context = context;
    }
    static async getMigrationServiceContext() {
        const connectionProfile = await await azdata.connection.getCurrentConnection();
        if (connectionProfile) {
            const serverContextKey = `${this.mementoToken}.${connectionProfile.serverName}.serviceContext`;
            return (0, serviceHelper_1.deepClone)(await this.context.globalState.get(serverContextKey)) || {};
        }
        return {};
    }
    static async saveMigrationServiceContext(serviceContext, serviceContextChangedEvent) {
        const connectionProfile = await azdata.connection.getCurrentConnection();
        if (connectionProfile) {
            const serverContextKey = `${this.mementoToken}.${connectionProfile.serverName}.serviceContext`;
            await this.context.globalState.update(serverContextKey, (0, serviceHelper_1.deepClone)(serviceContext));
            serviceContextChangedEvent.fire({ connectionId: connectionProfile.connectionId });
        }
    }
    static async refreshMigrationAzureAccount(serviceContext, migration, serviceContextChangedEvent) {
        if ((0, serviceHelper_1.isAccountTokenStale)(serviceContext.azureAccount)) {
            const accounts = await azdata.accounts.getAllAccounts();
            const account = accounts.find(a => !(0, serviceHelper_1.isAccountTokenStale)(a) && a.key.accountId === serviceContext.azureAccount?.key.accountId);
            if (account) {
                const subscriptions = await (0, azure_1.getSubscriptions)(account);
                const subscription = subscriptions.find(s => s.id === serviceContext.subscription?.id);
                if (subscription) {
                    serviceContext.azureAccount = account;
                    await this.saveMigrationServiceContext(serviceContext, serviceContextChangedEvent);
                }
            }
        }
    }
}
exports.MigrationLocalStorage = MigrationLocalStorage;
class MigrationServiceMigrationsCache {
    static migrationServiceMigrations;
    static setMigrationServiceMigrations(migrationServiceMigrations) {
        MigrationServiceMigrationsCache.migrationServiceMigrations = migrationServiceMigrations;
    }
    static getMigrationServiceMigrations() {
        return MigrationServiceMigrationsCache.migrationServiceMigrations;
    }
}
exports.MigrationServiceMigrationsCache = MigrationServiceMigrationsCache;
function isServiceContextValid(serviceContext) {
    return (!(0, serviceHelper_1.isAccountTokenStale)(serviceContext.azureAccount) &&
        serviceContext.migrationService?.id !== undefined &&
        serviceContext.resourceGroup?.id !== undefined &&
        serviceContext.subscription?.id !== undefined &&
        serviceContext.tenant?.id !== undefined);
}
exports.isServiceContextValid = isServiceContextValid;
async function getSelectedServiceStatus() {
    const serviceContext = await MigrationLocalStorage.getMigrationServiceContext();
    const serviceName = serviceContext?.migrationService?.name;
    return serviceName && isServiceContextValid(serviceContext)
        ? loc.MIGRATION_SERVICE_SERVICE_PROMPT(serviceName)
        : loc.MIGRATION_SERVICE_SELECT_SERVICE_PROMPT;
}
exports.getSelectedServiceStatus = getSelectedServiceStatus;
async function getMongoMigrations() {
    const serviceContext = await MigrationLocalStorage.getMigrationServiceContext();
    const migrations = isServiceContextValid(serviceContext)
        ? await (0, azure_1.getServiceMigrations)(serviceContext.azureAccount, serviceContext.subscription, serviceContext.migrationService.id)
        : [];
    const mongoMigrations = migrations.filter(m => m.properties?.kind === dataMigration_1.MongoToCosmosMigrationKind) || [];
    MigrationServiceMigrationsCache.setMigrationServiceMigrations({ migrationServiceId: serviceContext.migrationService.id, migrations: mongoMigrations });
    return mongoMigrations;
}
exports.getMongoMigrations = getMongoMigrations;
//# sourceMappingURL=migrationLocalStorage.js.map