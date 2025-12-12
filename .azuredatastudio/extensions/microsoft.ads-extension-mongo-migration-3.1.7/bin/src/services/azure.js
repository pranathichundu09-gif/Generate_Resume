"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMigrationErrors = exports.getResourceName = exports.getFullResourceGroupFromId = exports.getResourceGroupFromId = exports.getMigrationTargetName = exports.getMigrationTargetId = exports.sortResourceArrayByName = exports.completeCutoverforVcore = exports.deleteMigration = exports.retryMigration = exports.stopMigration = exports.getMigrationDetails = exports.getServiceMigrations = exports.createDataMigrationService = exports.getDataMigrationServices = exports.getMigrationServiceById = exports.getMigrationService = exports.getAvailableStorageAccounts = exports.getAzureResourceGivenId = exports.cancelCosmosMongovCoreMigration = exports.deleteCosmosMongoMigration = exports.getCosmosMongoRUMigrations = exports.getCosmosMongovCoreMigrations = exports.createCosmosMongoRUMigration = exports.createCosmosMongovCoreMigration = exports.testConnectivity = exports.getSessionIdHeader = exports.getDefaultHeader = exports.getCosmosMongovCoreInstances = exports.getCosmosInstances = exports.listCosmosRuInstancesBysubscription = exports.createResourceGroup = exports.getResourceGroups = exports.getSubscriptions = void 0;
const vscode = require("vscode");
const azdata = require("azdata");
const constants = require("../constants/strings");
const url_1 = require("url");
const os_1 = require("os");
const DMSV2_API_VERSION = '2023-07-15-preview';
const COSMOS_API_VERSION = '2023-03-15';
const COSMOS_MONGO_CLUSTER_API_VERSION = '2023-03-15-preview';
const CosmosMongoMigrationExtensionId = 'microsoft.ads-extension-mongo-migration';
async function getAzureCoreAPI() {
    const api = (await vscode.extensions.getExtension("Microsoft.azurecore" /* azurecore.extension.name */)?.activate());
    if (!api) {
        throw new Error('azure core API undefined for cosmosdb-migration');
    }
    return api;
}
function throwErrorsIfAny(response) {
    if (response.errors.length > 0) {
        const message = response.errors
            .map(err => err.message)
            .join(', ');
        throw new Error(message);
    }
}
async function getSubscriptions(account) {
    const api = await getAzureCoreAPI();
    const subscriptions = await api.getSubscriptions(account, true);
    const listOfSubscriptions = subscriptions.subscriptions;
    sortResourceArrayByName(listOfSubscriptions);
    return subscriptions.subscriptions;
}
exports.getSubscriptions = getSubscriptions;
async function getResourceGroups(account, subscription) {
    const api = await getAzureCoreAPI();
    const result = await api.getResourceGroups(account, subscription, true);
    sortResourceArrayByName(result.resourceGroups);
    return result.resourceGroups;
}
exports.getResourceGroups = getResourceGroups;
async function createResourceGroup(account, subscription, resourceGroupName, location) {
    const api = await getAzureCoreAPI();
    const result = await api.createResourceGroup(account, subscription, resourceGroupName, location, false);
    return result.resourceGroup;
}
exports.createResourceGroup = createResourceGroup;
async function listCosmosRuInstancesBysubscription(account, subscription) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`/subscriptions/${subscription.id}/providers/Microsoft.DocumentDB/databaseAccounts?api-version=${COSMOS_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const result = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    return result.response.data;
}
exports.listCosmosRuInstancesBysubscription = listCosmosRuInstancesBysubscription;
async function getCosmosInstances(account, subscription) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`/subscriptions/${subscription.id}/providers/Microsoft.DocumentDB/databaseAccounts?api-version=${COSMOS_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const result = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    if (result.errors.length > 0) {
        const message = result.errors
            .map(err => err.message)
            .join(', ');
        throw new Error(message);
    }
    sortResourceArrayByName(result.response.data.value);
    return result.response.data.value;
}
exports.getCosmosInstances = getCosmosInstances;
async function getCosmosMongovCoreInstances(account, subscription) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`/subscriptions/${subscription.id}/providers/Microsoft.DocumentDB/mongoClusters?api-version=${COSMOS_MONGO_CLUSTER_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const result = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    if (result.errors.length > 0) {
        const message = result.errors
            .map(err => err.message)
            .join(', ');
        throw new Error(message);
    }
    sortResourceArrayByName(result.response.data.value);
    return result.response.data.value;
}
exports.getCosmosMongovCoreInstances = getCosmosMongovCoreInstances;
let userAgent;
function getUserAgent() {
    if (!userAgent) {
        const adsVersion = azdata.version ?? 'unknown';
        const adsQuality = azdata.env.quality ?? 'unknown';
        const cosmosMongoExt = vscode.extensions.getExtension(CosmosMongoMigrationExtensionId);
        const cosmosMongoExtVersion = cosmosMongoExt?.packageJSON.version ?? 'unknown';
        userAgent = `AzureDataStudio/${adsVersion} (${adsQuality}) ${CosmosMongoMigrationExtensionId}/${cosmosMongoExtVersion}`;
    }
    return userAgent;
}
function getDefaultHeader() {
    return { 'User-Agent': getUserAgent() };
}
exports.getDefaultHeader = getDefaultHeader;
function getSessionIdHeader(sessionId) {
    return {
        'User-Agent': getUserAgent(),
        'SqlMigrationSessionId': sessionId, // Todo : rename this to MigrationSessionId once Cosmos migration controllers are updated on DMS V2
    };
}
exports.getSessionIdHeader = getSessionIdHeader;
async function testConnectivity(account, subscription, resourceGroupName, migrationServiceName, requestBody, sessionId) {
    const api = await getAzureCoreAPI();
    const scope = encodeURI(`/subscriptions/${subscription.id}/resourceGroups/${resourceGroupName}`);
    const path = encodeURI(scope + `/providers/Microsoft.DataMigration/migrationServices/${migrationServiceName}/ValidateIR?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 2 /* azurecore.HttpRequestMethod.POST */, requestBody, true, host, getSessionIdHeader(sessionId));
    return response;
}
exports.testConnectivity = testConnectivity;
async function createCosmosMongovCoreMigration(account, subscription, resourceGroupName, migrationTargetServerName, migrationName, requestBody, sessionId) {
    const api = await getAzureCoreAPI();
    const scope = encodeURI(`/subscriptions/${subscription.id}/resourceGroups/${resourceGroupName}/providers/Microsoft.DocumentDb/mongoClusters/${migrationTargetServerName}`);
    const path = encodeURI(scope + `/providers/Microsoft.DataMigration/databaseMigrations/${migrationName}?api-version=${DMSV2_API_VERSION}`);
    requestBody.properties.scope = scope;
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 1 /* azurecore.HttpRequestMethod.PUT */, requestBody, true, host, getSessionIdHeader(sessionId));
    throwErrorsIfAny(response);
}
exports.createCosmosMongovCoreMigration = createCosmosMongovCoreMigration;
async function createCosmosMongoRUMigration(account, subscription, resourceGroupName, migrationTargetServerName, migrationName, requestBody, sessionId) {
    const api = await getAzureCoreAPI();
    const scope = encodeURI(`/subscriptions/${subscription.id}/resourceGroups/${resourceGroupName}/providers/Microsoft.DocumentDb/databaseAccounts/${migrationTargetServerName}`);
    const path = encodeURI(scope + `/providers/Microsoft.DataMigration/databaseMigrations/${migrationName}?api-version=${DMSV2_API_VERSION}`);
    requestBody.properties.scope = scope;
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 1 /* azurecore.HttpRequestMethod.PUT */, requestBody, true, host, getSessionIdHeader(sessionId));
    throwErrorsIfAny(response);
}
exports.createCosmosMongoRUMigration = createCosmosMongoRUMigration;
async function getCosmosMongovCoreMigrations(account, subscription, resourceGroupName, migrationTargetServerName, sessionId) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`/subscriptions/${subscription.id}/resourceGroups/${resourceGroupName}/providers/Microsoft.DocumentDb/mongoClusters/${migrationTargetServerName}/providers/Microsoft.DataMigration/databaseMigrations?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getSessionIdHeader(sessionId));
    throwErrorsIfAny(response);
    return response.response.data.value;
}
exports.getCosmosMongovCoreMigrations = getCosmosMongovCoreMigrations;
async function getCosmosMongoRUMigrations(account, subscription, resourceGroupName, migrationTargetServerName, sessionId) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`/subscriptions/${subscription.id}/resourceGroups/${resourceGroupName}/providers/Microsoft.DocumentDb/databaseAccounts/${migrationTargetServerName}/providers/Microsoft.DataMigration/databaseMigrations?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getSessionIdHeader(sessionId));
    throwErrorsIfAny(response);
    return response.response.data.value;
}
exports.getCosmosMongoRUMigrations = getCosmosMongoRUMigrations;
async function deleteCosmosMongoMigration(account, subscription, migrationId, forceDelete) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${migrationId}?api-version=${DMSV2_API_VERSION}&force=${forceDelete}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 3 /* azurecore.HttpRequestMethod.DELETE */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
}
exports.deleteCosmosMongoMigration = deleteCosmosMongoMigration;
async function cancelCosmosMongovCoreMigration(account, subscription, migrationId) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${migrationId}/cancel?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 2 /* azurecore.HttpRequestMethod.POST */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
}
exports.cancelCosmosMongovCoreMigration = cancelCosmosMongovCoreMigration;
async function getAzureResourceGivenId(account, subscription, id, apiVersion) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${id}?api-version=${apiVersion}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
    return response.response.data;
}
exports.getAzureResourceGivenId = getAzureResourceGivenId;
async function getAvailableStorageAccounts(account, subscription) {
    const api = await getAzureCoreAPI();
    const result = await api.getStorageAccounts(account, [subscription], false);
    sortResourceArrayByName(result.resources);
    return result.resources;
}
exports.getAvailableStorageAccounts = getAvailableStorageAccounts;
async function getMigrationService(account, subscription, resourceGroupName, migrationServiceName) {
    const migrationServiceId = `/subscriptions/${subscription.id}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataMigration/migrationServices/${migrationServiceName}`;
    return await getMigrationServiceById(account, subscription, migrationServiceId);
}
exports.getMigrationService = getMigrationService;
async function getMigrationServiceById(account, subscription, migrationServiceId) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${migrationServiceId}?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
    response.response.data.properties.resourceGroup = getResourceGroupFromId(response.response.data.id);
    return response.response.data;
}
exports.getMigrationServiceById = getMigrationServiceById;
async function getDataMigrationServices(account, subscription) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`/subscriptions/${subscription.id}/providers/Microsoft.DataMigration/migrationServices?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
    sortResourceArrayByName(response.response.data.value);
    response.response.data.value.forEach((sms) => {
        sms.properties.resourceGroup = getResourceGroupFromId(sms.id);
    });
    return response.response.data.value;
}
exports.getDataMigrationServices = getDataMigrationServices;
async function createDataMigrationService(account, subscription, resourceGroupName, regionName, dataMigrationServiceName, sessionId) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`/subscriptions/${subscription.id}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataMigration/migrationServices/${dataMigrationServiceName}?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const requestBody = {
        'location': regionName
    };
    const response = await api.makeAzureRestRequest(account, subscription, path, 1 /* azurecore.HttpRequestMethod.PUT */, requestBody, true, host, getSessionIdHeader(sessionId));
    throwErrorsIfAny(response);
    const asyncUrl = response.response.headers['azure-asyncoperation'];
    const asyncPath = asyncUrl.replace((new url_1.URL(asyncUrl)).origin + '/', ''); // path is everything after the hostname, e.g. the 'test' part of 'https://management.azure.com/test'
    const maxRetry = 24;
    let i = 0;
    for (i = 0; i < maxRetry; i++) {
        const asyncResponse = await api.makeAzureRestRequest(account, subscription, asyncPath, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host);
        const creationStatus = asyncResponse.response.data.status;
        if (creationStatus === constants.ProvisioningState.Succeeded) {
            break;
        }
        else if (creationStatus === constants.ProvisioningState.Failed) {
            throw new Error(asyncResponse.errors.toString());
        }
        await new Promise(resolve => setTimeout(resolve, 5000)); //adding  5 sec delay before getting creation status
    }
    if (i === maxRetry) {
        throw new Error(constants.DMS_PROVISIONING_FAILED);
    }
    return response.response.data;
}
exports.createDataMigrationService = createDataMigrationService;
async function getServiceMigrations(account, subscription, resourceId) {
    const path = encodeURI(`${resourceId}/listMigrations?&api-version=${DMSV2_API_VERSION}`);
    const api = await getAzureCoreAPI();
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
    return response.response.data.value;
}
exports.getServiceMigrations = getServiceMigrations;
async function getMigrationDetails(account, subscription, migrationId, migrationOperationId) {
    const path = migrationOperationId === undefined
        ? encodeURI(`${migrationId}?$expand=MigrationStatusDetails&api-version=${DMSV2_API_VERSION}`)
        : encodeURI(`${migrationId}?migrationOperationId=${migrationOperationId}&$expand=MigrationStatusDetails&api-version=${DMSV2_API_VERSION}`);
    const api = await getAzureCoreAPI();
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 0 /* azurecore.HttpRequestMethod.GET */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
    return response.response.data;
}
exports.getMigrationDetails = getMigrationDetails;
async function stopMigration(account, subscription, migration) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${migration.id}/cancel?api-version=${DMSV2_API_VERSION}`);
    const requestBody = { migrationOperationId: migration.properties.migrationOperationId };
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 2 /* azurecore.HttpRequestMethod.POST */, requestBody, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
}
exports.stopMigration = stopMigration;
async function retryMigration(account, subscription, migration) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${migration.id}/retry?api-version=${DMSV2_API_VERSION}`);
    const requestBody = { migrationOperationId: migration.properties.migrationOperationId };
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 2 /* azurecore.HttpRequestMethod.POST */, requestBody, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
}
exports.retryMigration = retryMigration;
async function deleteMigration(account, subscription, migrationId) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${migrationId}?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 3 /* azurecore.HttpRequestMethod.DELETE */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
}
exports.deleteMigration = deleteMigration;
async function completeCutoverforVcore(account, subscription, migrationId) {
    const api = await getAzureCoreAPI();
    const path = encodeURI(`${migrationId}/cutover?api-version=${DMSV2_API_VERSION}`);
    const host = api.getProviderMetadataForAccount(account).settings.armResource?.endpoint;
    const response = await api.makeAzureRestRequest(account, subscription, path, 2 /* azurecore.HttpRequestMethod.POST */, undefined, true, host, getDefaultHeader());
    throwErrorsIfAny(response);
}
exports.completeCutoverforVcore = completeCutoverforVcore;
function sortResourceArrayByName(resourceArray) {
    if (!resourceArray) {
        return;
    }
    resourceArray.sort((a, b) => {
        return a?.name?.toLowerCase()?.localeCompare(b?.name?.toLowerCase());
    });
}
exports.sortResourceArrayByName = sortResourceArrayByName;
function getMigrationTargetId(migration) {
    // `${targetServerId}/providers/Microsoft.DataMigration/databaseMigrations/${targetDatabaseName}?api-version=${DMSV2_API_VERSION}`
    const paths = migration.id.split('/providers/Microsoft.DataMigration/', 1);
    return paths?.length > 0
        ? paths[0]
        : '';
}
exports.getMigrationTargetId = getMigrationTargetId;
function getMigrationTargetName(migration) {
    const targetServerId = getMigrationTargetId(migration);
    return getResourceName(targetServerId);
}
exports.getMigrationTargetName = getMigrationTargetName;
function getResourceGroupFromId(id) {
    return id.replace(RegExp('^(.*?)/resourceGroups/'), '').replace(RegExp('/providers/.*'), '').toLowerCase();
}
exports.getResourceGroupFromId = getResourceGroupFromId;
function getFullResourceGroupFromId(id) {
    return id.replace(RegExp('/providers/.*'), '').toLowerCase();
}
exports.getFullResourceGroupFromId = getFullResourceGroupFromId;
function getResourceName(id) {
    const splitResourceId = id.split('/');
    return splitResourceId[splitResourceId.length - 1];
}
exports.getResourceName = getResourceName;
function getMigrationErrors(migration) {
    const errors = [];
    if (migration?.properties) {
        errors.push(migration.properties.migrationFailureError?.message);
    }
    // remove undefined and duplicate error entries
    return errors
        .filter((e, i, arr) => e !== undefined && i === arr.indexOf(e))
        .join(os_1.EOL);
}
exports.getMigrationErrors = getMigrationErrors;
//# sourceMappingURL=azure.js.map