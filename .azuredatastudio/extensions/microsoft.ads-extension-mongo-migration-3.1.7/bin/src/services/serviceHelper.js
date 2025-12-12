"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMigrationDuration = exports.convertTimeDifferenceToDuration = exports.convertDurationToString = exports.getCollectionStatusImage = exports.getCollectionStatusString = exports.getMigrationStatusImage = exports.getMigrationStatusString = exports.getMigrationStatus = exports.clearDropDown = exports.isAdmin = exports.isWindows = exports.promptUserForFolder = exports.updateControlDisplay = exports.getAzureTenantsDropdownValues = exports.getResourceDropdownValues = exports.getAzureResourceDropdownValues = exports.getAzureResourceDropdownValuesFromResourceGroup = exports.getAzureDataMigrationServices = exports.getCosmosvCoreInstancesDropdownValues = exports.getAvailableCosmosMongovCoreInstances = exports.getCosmosRuInstancesDropdownValues = exports.getAvailableCosmosMongoRuInstances = exports.getAllResourceGroups = exports.getSubscriptionIdFromResourceId = exports.getServiceResourceGroups = exports.getAzureSubscriptionsDropdownValues = exports.getAzureSubscriptions = exports.getAzureTenants = exports.isAccountTokenStale = exports.getAzureAccountsDropdownValues = exports.getAzureAccounts = exports.getUserHome = exports.clearDialogMessage = exports.displayDialogErrorMessage = exports.get12HourTime = exports.decorate = exports.debounce = exports.hashString = exports.selectDropDownIndex = exports.selectDefaultDropdownValue = exports.convertByteSizeToReadableUnit = exports.getMigrationTime = exports.deepClone = exports.AdsMigrationStatus = exports.DefaultSettingValue = void 0;
const azdata_1 = require("azdata");
const vscode = require("vscode");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const crypto = require("crypto");
const azure = require("./azure");
const constants = require("../constants/strings");
const os = require("os");
const strings_1 = require("../constants/strings");
const logger_1 = require("../logger");
const localizationFile_1 = require("../localizationFile");
exports.DefaultSettingValue = '---';
var AdsMigrationStatus;
(function (AdsMigrationStatus) {
    AdsMigrationStatus["ALL"] = "all";
    AdsMigrationStatus["ONGOING"] = "ongoing";
    AdsMigrationStatus["SUCCEEDED"] = "succeeded";
    AdsMigrationStatus["FAILED"] = "failed";
    AdsMigrationStatus["COMPLETING"] = "completing";
})(AdsMigrationStatus = exports.AdsMigrationStatus || (exports.AdsMigrationStatus = {}));
function deepClone(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof RegExp) {
        // See https://github.com/Microsoft/TypeScript/issues/10990
        return obj;
    }
    const result = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
            result[key] = deepClone(obj[key]);
        }
        else {
            result[key] = obj[key];
        }
    });
    return result;
}
exports.deepClone = deepClone;
function getMigrationTime(migrationTime) {
    return migrationTime
        ? new Date(migrationTime).toLocaleString()
        : exports.DefaultSettingValue;
}
exports.getMigrationTime = getMigrationTime;
function convertByteSizeToReadableUnit(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    for (let i = 1; i < units.length; i++) {
        const higherUnit = size / 1024;
        if (higherUnit < 0.1) {
            return `${size.toFixed(2)} ${units[i - 1]}`;
        }
        size = higherUnit;
    }
    return size.toString();
}
exports.convertByteSizeToReadableUnit = convertByteSizeToReadableUnit;
function selectDefaultDropdownValue(dropDown, value, useDisplayName = true) {
    if (dropDown.values && dropDown.values.length > 0) {
        let selectedIndex;
        if (value) {
            const searchValue = value.toLowerCase();
            if (useDisplayName) {
                selectedIndex = dropDown.values?.findIndex((v) => v?.displayName?.toLowerCase() === searchValue);
            }
            else {
                selectedIndex = dropDown.values?.findIndex((v) => v?.name?.toLowerCase() === searchValue);
            }
        }
        else {
            selectedIndex = -1;
        }
        selectDropDownIndex(dropDown, selectedIndex > -1 ? selectedIndex : 0);
    }
    else {
        dropDown.value = undefined;
    }
}
exports.selectDefaultDropdownValue = selectDefaultDropdownValue;
function selectDropDownIndex(dropDown, index) {
    if (dropDown.values && dropDown.values.length > 0) {
        if (index >= 0 && index < dropDown.values.length) {
            dropDown.value = dropDown.values[index];
            return;
        }
    }
    dropDown.value = undefined;
}
exports.selectDropDownIndex = selectDropDownIndex;
function hashString(value) {
    if (value?.length > 0) {
        return crypto.createHash('sha512').update(value).digest('hex');
    }
    return '';
}
exports.hashString = hashString;
// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(delay) {
    return decorate((fn, key) => {
        const timerKey = `$debounce$${key}`;
        return function (...args) {
            clearTimeout(this[timerKey]);
            this[timerKey] = setTimeout(() => fn.apply(this, args), delay);
        };
    });
}
exports.debounce = debounce;
// eslint-disable-next-line @typescript-eslint/ban-types
function decorate(decorator) {
    return (_target, key, descriptor) => {
        let fnKey = null;
        // eslint-disable-next-line @typescript-eslint/ban-types
        let fn = null;
        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
        }
        else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }
        if (!fn || !fnKey) {
            throw new Error('not supported');
        }
        descriptor[fnKey] = decorator(fn, key);
    };
}
exports.decorate = decorate;
function get12HourTime(date) {
    const localeTimeStringOptions = {
        hour: '2-digit',
        minute: '2-digit'
    };
    return (date ? date : new Date()).toLocaleTimeString([], localeTimeStringOptions);
}
exports.get12HourTime = get12HourTime;
function displayDialogErrorMessage(dialog, text, error) {
    dialog.message = {
        level: azdata_1.window.MessageLevel.Error,
        text: text,
        description: error.message,
    };
}
exports.displayDialogErrorMessage = displayDialogErrorMessage;
function clearDialogMessage(dialog) {
    dialog.message = {
        text: ''
    };
}
exports.clearDialogMessage = clearDialogMessage;
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
exports.getUserHome = getUserHome;
async function getAzureAccounts() {
    let azureAccounts = [];
    try {
        azureAccounts = await azdata_1.accounts.getAllAccounts();
    }
    catch (e) {
        logger_1.logger.logException(e);
        throw e;
    }
    return azureAccounts;
}
exports.getAzureAccounts = getAzureAccounts;
async function getAzureAccountsDropdownValues(accounts) {
    let accountsValues = [];
    accounts.forEach((account) => {
        accountsValues.push({
            name: account.displayInfo.userId,
            displayName: isAccountTokenStale(account)
                ? constants.ACCOUNT_CREDENTIALS_REFRESH(account.displayInfo.displayName)
                : account.displayInfo.displayName
        });
    });
    if (accountsValues.length === 0) {
        accountsValues = [
            {
                displayName: constants.ACCOUNT_SELECTION_PAGE_NO_LINKED_ACCOUNTS_ERROR,
                name: ''
            }
        ];
    }
    return accountsValues;
}
exports.getAzureAccountsDropdownValues = getAzureAccountsDropdownValues;
function isAccountTokenStale(account) {
    return account === undefined || account?.isStale === true;
}
exports.isAccountTokenStale = isAccountTokenStale;
function getAzureTenants(account) {
    return account?.properties.tenants || [];
}
exports.getAzureTenants = getAzureTenants;
async function getAzureSubscriptions(account, tenantId) {
    let subscriptions = [];
    try {
        subscriptions = account && !isAccountTokenStale(account)
            ? await azure.getSubscriptions(account)
            : [];
    }
    catch (e) {
        logger_1.logger.logException(e);
        throw e;
    }
    const filtered = subscriptions.filter(subscription => subscription.tenant === tenantId);
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
}
exports.getAzureSubscriptions = getAzureSubscriptions;
async function getAzureSubscriptionsDropdownValues(subscriptions) {
    let subscriptionsValues = [];
    subscriptions.forEach((subscription) => {
        subscriptionsValues.push({
            name: subscription.id,
            displayName: `${subscription.name} - ${subscription.id}`
        });
    });
    if (subscriptionsValues.length === 0) {
        subscriptionsValues = [
            {
                displayName: constants.NO_SUBSCRIPTIONS_FOUND,
                name: ''
            }
        ];
    }
    return subscriptionsValues;
}
exports.getAzureSubscriptionsDropdownValues = getAzureSubscriptionsDropdownValues;
function getServiceResourceGroups(resources) {
    let resourceGroups = [];
    if (resources) {
        resourceGroups = resources
            .map(resource => {
            return {
                id: azure.getFullResourceGroupFromId(resource.id),
                name: azure.getResourceGroupFromId(resource.id),
                subscription: { id: getSubscriptionIdFromResourceId(resource.id) },
                tenant: resource.tenantId
            };
        });
    }
    // remove duplicates
    return resourceGroups
        .filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i)
        .sort((a, b) => a.name.localeCompare(b.name));
}
exports.getServiceResourceGroups = getServiceResourceGroups;
function getSubscriptionIdFromResourceId(resourceId) {
    let parts = resourceId?.split('/subscriptions/');
    if (parts?.length > 1) {
        parts = parts[1]?.split('/resourcegroups/');
        if (parts?.length > 0) {
            return parts[0];
        }
    }
    return undefined;
}
exports.getSubscriptionIdFromResourceId = getSubscriptionIdFromResourceId;
async function getAllResourceGroups(account, subscription) {
    let resourceGroups = [];
    try {
        if (account && subscription) {
            resourceGroups = await azure.getResourceGroups(account, subscription);
        }
    }
    catch (e) {
        logger_1.logger.logException(e);
        throw e;
    }
    resourceGroups.sort((a, b) => a.name.localeCompare(b.name));
    return resourceGroups;
}
exports.getAllResourceGroups = getAllResourceGroups;
async function getAvailableCosmosMongoRuInstances(account, subscription) {
    let cosmosInstances = [];
    try {
        if (account && subscription) {
            cosmosInstances = await azure.getCosmosInstances(account, subscription);
            return cosmosInstances
                .filter(cosmosInstance => cosmosInstance.kind === constants.CosmosDatabaseKind.MongoDB &&
                cosmosInstance.properties.provisioningState === constants.ProvisioningState.Succeeded)
                .sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    catch (e) {
        logger_1.logger.logException(e);
        throw e;
    }
    return [];
}
exports.getAvailableCosmosMongoRuInstances = getAvailableCosmosMongoRuInstances;
async function getCosmosRuInstancesDropdownValues(cosmosRuInstances, resourceGroup) {
    let cosmosRuInstanceValues = [];
    if (resourceGroup) {
        cosmosRuInstances.forEach((cosmosRuInstance) => {
            if (azure.getResourceGroupFromId(cosmosRuInstance.id)?.toLowerCase() === resourceGroup.name.toLowerCase()) {
                const cosmosRuInstanceValue = {
                    name: cosmosRuInstance.id,
                    displayName: cosmosRuInstance.name
                };
                cosmosRuInstanceValues.push(cosmosRuInstanceValue);
            }
        });
    }
    if (cosmosRuInstanceValues.length === 0) {
        cosmosRuInstanceValues = [
            {
                displayName: constants.NO_RU_INSTANCE_FOUND,
                name: ''
            }
        ];
    }
    return cosmosRuInstanceValues;
}
exports.getCosmosRuInstancesDropdownValues = getCosmosRuInstancesDropdownValues;
async function getAvailableCosmosMongovCoreInstances(account, subscription) {
    let cosmosMongovCoreInstances = [];
    try {
        if (account && subscription) {
            cosmosMongovCoreInstances = await azure.getCosmosMongovCoreInstances(account, subscription);
            return cosmosMongovCoreInstances
                .filter(cosmosInstance => cosmosInstance.properties.provisioningState === constants.ProvisioningState.Succeeded)
                .sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    catch (e) {
        logger_1.logger.logException(e);
        throw e;
    }
    return [];
}
exports.getAvailableCosmosMongovCoreInstances = getAvailableCosmosMongovCoreInstances;
async function getCosmosvCoreInstancesDropdownValues(cosmosvCoreInstances, resourceGroup) {
    let cosmosvCoreInstanceValues = [];
    if (resourceGroup) {
        cosmosvCoreInstances.forEach((cosmosvCoreInstance) => {
            if (azure.getResourceGroupFromId(cosmosvCoreInstance.id)?.toLowerCase() === resourceGroup.name.toLowerCase()) {
                const cosmosvCoreInstanceValue = {
                    name: cosmosvCoreInstance.id,
                    displayName: cosmosvCoreInstance.name
                };
                cosmosvCoreInstanceValues.push(cosmosvCoreInstanceValue);
            }
        });
    }
    if (cosmosvCoreInstanceValues.length === 0) {
        cosmosvCoreInstanceValues = [
            {
                displayName: constants.NO_VCORE_INSTANCE_FOUND,
                name: ''
            }
        ];
    }
    return cosmosvCoreInstanceValues;
}
exports.getCosmosvCoreInstancesDropdownValues = getCosmosvCoreInstancesDropdownValues;
async function getAzureDataMigrationServices(account, subscription) {
    try {
        if (account && subscription) {
            const services = await azure.getDataMigrationServices(account, subscription);
            return services
                .filter(dms => dms.properties.provisioningState === constants.ProvisioningState.Succeeded)
                .sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    catch (e) {
        logger_1.logger.logException(e);
        throw e;
    }
    return [];
}
exports.getAzureDataMigrationServices = getAzureDataMigrationServices;
function getAzureResourceDropdownValuesFromResourceGroup(azureResources, resourceGroup, resourceNotFoundMessage) {
    if (resourceGroup && azureResources?.length > 0) {
        const resourceGroupName = resourceGroup.toLowerCase();
        return azureResources
            .filter(resource => azure.getResourceGroupFromId(resource.id)?.toLowerCase() === resourceGroupName)
            .map(resource => {
            return { name: resource.id, displayName: resource.name };
        });
    }
    return [{ name: '', displayName: resourceNotFoundMessage }];
}
exports.getAzureResourceDropdownValuesFromResourceGroup = getAzureResourceDropdownValuesFromResourceGroup;
function getAzureResourceDropdownValues(azureResources, resourceGroup, resourceNotFoundMessage) {
    if (resourceGroup && azureResources?.length > 0) {
        const resourceGroupName = resourceGroup.toLowerCase();
        return azureResources
            .filter(resource => azure.getResourceGroupFromId(resource.id)?.toLowerCase() === resourceGroupName)
            .map(resource => {
            return { name: resource.id, displayName: resource.name };
        });
    }
    return [{ name: '', displayName: resourceNotFoundMessage }];
}
exports.getAzureResourceDropdownValues = getAzureResourceDropdownValues;
// export function testAzureTargetConnection( ): boolean {
// }
function getResourceDropdownValues(resources, resourceNotFoundMessage) {
    if (!resources || !resources.length) {
        return [{ name: '', displayName: resourceNotFoundMessage }];
    }
    return resources?.map(resource => { return { name: resource.id, displayName: resource.name }; })
        || [{ name: '', displayName: resourceNotFoundMessage }];
}
exports.getResourceDropdownValues = getResourceDropdownValues;
function getAzureTenantsDropdownValues(tenants) {
    if (!tenants || !tenants.length) {
        return [{ name: '', displayName: constants.ACCOUNT_SELECTION_PAGE_NO_LINKED_ACCOUNTS_ERROR }];
    }
    return tenants?.map(tenant => { return { name: tenant.id, displayName: tenant.displayName }; })
        || [{ name: '', displayName: constants.ACCOUNT_SELECTION_PAGE_NO_LINKED_ACCOUNTS_ERROR }];
}
exports.getAzureTenantsDropdownValues = getAzureTenantsDropdownValues;
async function updateControlDisplay(control, visible, displayStyle = 'inline') {
    const display = visible ? displayStyle : 'none';
    control.display = display;
    await control.updateCssStyles({ 'display': display });
    await control.updateProperties({ 'display': display });
}
exports.updateControlDisplay = updateControlDisplay;
async function promptUserForFolder() {
    const options = {
        defaultUri: vscode.Uri.file(getUserHome()),
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
    };
    const fileUris = await vscode.window.showOpenDialog(options);
    if (fileUris && fileUris.length > 0 && fileUris[0]) {
        return fileUris[0].fsPath;
    }
    return '';
}
exports.promptUserForFolder = promptUserForFolder;
function isWindows() { return (os.platform() === 'win32'); }
exports.isWindows = isWindows;
async function isAdmin() {
    let isAdmin = false;
    try {
        if (isWindows()) {
            //	isAdmin = (await import('native-is-elevated'))();
        }
        else {
            isAdmin = process.getuid() === 0;
        }
    }
    catch (e) {
        //Ignore error and return false;
    }
    return isAdmin;
}
exports.isAdmin = isAdmin;
async function clearDropDown(dropDown) {
    await dropDown.updateProperty('value', undefined);
    await dropDown.updateProperty('values', []);
}
exports.clearDropDown = clearDropDown;
function getMigrationStatus(migration) {
    return migration?.properties.migrationStatus
        ?? migration?.properties.provisioningState;
}
exports.getMigrationStatus = getMigrationStatus;
function getMigrationStatusString(migration) {
    const migrationStatus = getMigrationStatus(migration) ?? exports.DefaultSettingValue;
    return strings_1.MigrationStatusLookup[migrationStatus] ?? migrationStatus;
}
exports.getMigrationStatusString = getMigrationStatusString;
function getMigrationStatusImage(migration) {
    const status = getMigrationStatus(migration);
    switch (status) {
        case constants.MigrationState.Succeeded:
            return iconPathHelper_1.IconPathHelper.successStatus;
        case constants.MigrationState.Creating:
            return iconPathHelper_1.IconPathHelper.waitingState;
        case constants.MigrationState.Canceling:
        case constants.MigrationState.Canceled:
            return iconPathHelper_1.IconPathHelper.cancel;
        case constants.MigrationState.Failed:
            return iconPathHelper_1.IconPathHelper.error;
        case constants.MigrationState.InProgress:
        case constants.MigrationState.Dropping:
        case constants.MigrationState.CosmosDbCheckpointInProgress:
        case constants.MigrationState.CosmosDbBulkCopyInProgress:
        case constants.MigrationState.CosmosDbReplicationInProgress:
        case constants.MigrationState.CosmosDbCutoverInProgress:
        case constants.MigrationState.ReadyForCutover:
        default:
            return iconPathHelper_1.IconPathHelper.inProgress;
    }
}
exports.getMigrationStatusImage = getMigrationStatusImage;
function getCollectionStatusString(collectionStatus) {
    return strings_1.CollectionStatusLookup[collectionStatus] ?? (collectionStatus ? collectionStatus : (0, localizationFile_1.localize)('mongo.migration.collection.status.queued', 'Queued'));
}
exports.getCollectionStatusString = getCollectionStatusString;
function getCollectionStatusImage(collectionStatus) {
    switch (collectionStatus) {
        case constants.CollectionState.Completed:
            return iconPathHelper_1.IconPathHelper.successStatus;
        case constants.CollectionState.Failed:
            return iconPathHelper_1.IconPathHelper.error;
        case constants.CollectionState.NotStarted:
        case constants.CollectionState.InProgress:
        case constants.CollectionStateOnline.InitialLoadInProgress:
        case constants.CollectionStateOnline.ReplicationWaiting:
        case constants.CollectionStateOnline.ReplicationInProgress:
        default:
            return iconPathHelper_1.IconPathHelper.inProgress;
    }
}
exports.getCollectionStatusImage = getCollectionStatusImage;
/**
 * Generates a wordy time for duration.
 * @returns stringified duration like '10.0 days', '12.0 hrs', '1.0 min'
 */
function convertDurationToString(durationInMs) {
    const seconds = (durationInMs / 1000).toFixed(1);
    const minutes = (durationInMs / (1000 * 60)).toFixed(1);
    const hours = (durationInMs / (1000 * 60 * 60)).toFixed(1);
    const days = (durationInMs / (1000 * 60 * 60 * 24)).toFixed(1);
    if (durationInMs / 1000 < 60) {
        return constants.SEC(parseFloat(seconds));
    }
    else if (durationInMs / (1000 * 60) < 60) {
        return constants.MINUTE(parseFloat(minutes));
    }
    else if (durationInMs / (1000 * 60 * 60) < 24) {
        return constants.HRS(parseFloat(hours));
    }
    else {
        return constants.DAYS(parseFloat(days));
    }
}
exports.convertDurationToString = convertDurationToString;
/**
 * Generates a wordy time difference between start and end time.
 * @returns stringified duration like '10.0 days', '12.0 hrs', '1.0 min'
 */
function convertTimeDifferenceToDuration(startTime, endTime) {
    const time = endTime.getTime() - startTime.getTime();
    return convertDurationToString(time);
}
exports.convertTimeDifferenceToDuration = convertTimeDifferenceToDuration;
function getMigrationDuration(startDate, endDate) {
    if (startDate) {
        if (endDate) {
            return convertTimeDifferenceToDuration(new Date(startDate), new Date(endDate));
        }
        else {
            return convertTimeDifferenceToDuration(new Date(startDate), new Date());
        }
    }
    return exports.DefaultSettingValue;
}
exports.getMigrationDuration = getMigrationDuration;
//# sourceMappingURL=serviceHelper.js.map