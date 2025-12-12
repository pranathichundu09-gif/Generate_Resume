"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=stateMachine.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines contract for State Machine.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationStateModel = exports.Page = exports.MigrationMapping = exports.MigrationMode = void 0;
const azdata = require("azdata");
const uuid_1 = require("uuid");
const common_1 = require("../contracts/common");
const azure_1 = require("../services/azure");
const extension_1 = require("../extension");
const dataMigration_1 = require("../contracts/migration/dataMigration");
const telemetry_1 = require("../telemetry");
var MigrationMode;
(function (MigrationMode) {
    MigrationMode["Offline"] = "Offline";
    MigrationMode["Online"] = "Online";
})(MigrationMode = exports.MigrationMode || (exports.MigrationMode = {}));
var MigrationMapping;
(function (MigrationMapping) {
    MigrationMapping["Migrate"] = "Migrate";
    MigrationMapping["Skip"] = "Skip";
})(MigrationMapping = exports.MigrationMapping || (exports.MigrationMapping = {}));
var Page;
(function (Page) {
    Page[Page["DatabaseSelector"] = 0] = "DatabaseSelector";
    Page[Page["AssessmentProgress"] = 1] = "AssessmentProgress";
    Page[Page["AssessmentParameter"] = 2] = "AssessmentParameter";
    Page[Page["ServerDbDetails"] = 3] = "ServerDbDetails";
})(Page = exports.Page || (exports.Page = {}));
const maxCollectionsPerMigration = 50;
class MigrationStateModel {
    extensionContext;
    _sourceConnectionId;
    azureAccounts;
    azureAccount;
    accountTenants;
    azureTenant;
    subscriptions;
    targetSubscription;
    location;
    resourceGroups;
    resourceGroup;
    sourceConnectionProfile;
    sourceConnectionString;
    sourceUsername;
    sourcePassword;
    targetUserName;
    targetPassword;
    targetConnectionString;
    // assessment parameters
    migrationName;
    assessmentName;
    sourceLogPath;
    targetOffering = common_1.EnumTargetOffering.CosmosDBMongovCore;
    runNewAssessment = true;
    assessmentId;
    dataAssessmentReportPath;
    // Migration parameters
    selectedSourceDatabasesForMapping = [];
    selectedNamespacetoActionMapping = new Map();
    targetAzureAccout;
    targetNamespacesForMigration;
    targetCosmosInstance;
    targetCosmosMongoRuInstances;
    targetCosmosMongovCoreInstances;
    dataMigrationServiceSubscription;
    dataMigrationServiceResourceGroup;
    dataMigrationService;
    dataMigrationServices;
    dataMigrationMode = MigrationMode.Offline;
    sessionId = (0, uuid_1.v4)();
    assessedDatabaseList;
    runAssessments = true;
    excludeDbs = [
        'master',
        'tempdb',
        'msdb',
        'model'
    ];
    serverName;
    constructor(extensionContext, _sourceConnectionId) {
        this.extensionContext = extensionContext;
        this._sourceConnectionId = _sourceConnectionId;
        this.targetNamespacesForMigration = [];
    }
    dispose() {
        //Todo: Remove this or provide standard implementation.
    }
    get sourceConnectionId() {
        return this._sourceConnectionId;
    }
    async getDatabases() {
        const temp = await azdata.connection.listDatabases(this.sourceConnectionId);
        const finalResult = temp.filter((name) => !this.excludeDbs.includes(name));
        return finalResult;
    }
    async getSourceConnectionProfile() {
        const connections = await azdata.connection.getConnections();
        return connections.find((value) => {
            if (value.connectionId === this.sourceConnectionId) {
                this.serverName = value.serverName;
                return true;
            }
            else {
                return false;
            }
        });
    }
    async getSourceConnectionString() {
        const connections = await this.getSourceConnectionProfile();
        const connectionString = await azdata.connection.getConnectionString(connections.connectionId, false);
        return connectionString;
    }
    get migrationTargetServerName() {
        switch (this.targetOffering) {
            case common_1.EnumTargetOffering.CosmosDBMongoRU:
                return this.targetCosmosInstance?.name;
            case common_1.EnumTargetOffering.CosmosDBMongovCore:
                return this.targetCosmosInstance?.name;
            default:
                return '';
        }
    }
    async testDMSConnectivity() {
        const requestBody = {
            targetDatabaseName: this.migrationTargetServerName,
            sourceMongoConnectionString: this.sourceConnectionString,
            targetMongoConnectionString: this.targetConnectionString,
            validateIntegrationRuntimeOnline: true,
            kind: dataMigration_1.MongoToCosmosMigrationKind,
        };
        requestBody.collectionList = this.getCollectionList(0, 0); //Since we check for cluster connectivity, we can pass any one collection
        const response = await (0, azure_1.testConnectivity)(this.azureAccount, this.targetSubscription, this.resourceGroup.name, this.dataMigrationService?.name ?? '', requestBody, this.sessionId);
        return response;
    }
    async startSchemaMigration() {
        // TODO - schema migration, data migration, check for index migration and migrate non unique index
        const sourceMongoConnectionInformation = {
            connectionString: this.sourceConnectionString,
            host: "",
            port: 0,
            userName: "",
            password: "",
            useSsl: false
        };
        const targetMongoConnectionInformation = {
            connectionString: this.targetConnectionString,
            host: "",
            port: 0,
            userName: "",
            password: "",
            useSsl: false
        };
        const databaseNames = new Set();
        const collectionRequests = [];
        this.targetNamespacesForMigration.forEach((targetNamespace) => {
            const nameSpaceSplit = targetNamespace.split(".");
            databaseNames.add(nameSpaceSplit[0]);
            const collectionDatabaseRequest = {
                sourceDatabaseName: nameSpaceSplit[0],
                targetDatabaseName: nameSpaceSplit[0],
                sourceCollectionName: nameSpaceSplit[1],
                targetCollectionName: nameSpaceSplit[1],
                recreateIfExist: true,
            };
            collectionRequests.push(collectionDatabaseRequest);
        });
        const databaseRequests = [];
        databaseNames.forEach((database) => {
            const migrateDatabaseRequest = {
                sourceDatabaseName: database,
                targetDatabaseName: database
            };
            databaseRequests.push(migrateDatabaseRequest);
        });
        const response = await (0, extension_1.migrateSchema)({
            migrationName: this.migrationName,
            sourceConnectionInformation: sourceMongoConnectionInformation,
            targetConnectionInformation: targetMongoConnectionInformation,
            databasesRequests: databaseRequests,
            collectionsRequests: collectionRequests
        });
        return response;
    }
    async startNonUniqueIndexMigration() {
        // TODO - schema migration, data migration, check for index migration and migrate non unique index
        const sourceMongoConnectionInformation = {
            connectionString: this.sourceConnectionString,
            host: "",
            port: 0,
            userName: "",
            password: "",
            useSsl: false
        };
        const targetMongoConnectionInformation = {
            connectionString: this.targetConnectionString,
            host: "",
            port: 0,
            userName: "",
            password: "",
            useSsl: false
        };
        const collectionDetailsList = [];
        this.targetNamespacesForMigration.forEach((targetNamespace) => {
            const nameSpaceSplit = targetNamespace.split(".");
            const collectionDetails = {
                sourceDatabaseName: nameSpaceSplit[0],
                targetDatabaseName: nameSpaceSplit[0],
                sourceCollectionName: nameSpaceSplit[1],
                targetCollectionName: nameSpaceSplit[1],
            };
            collectionDetailsList.push(collectionDetails);
        });
        const response = await (0, extension_1.migrateNonUniqueIndex)({
            migrationName: this.migrationName,
            sourceConnectionInformation: sourceMongoConnectionInformation,
            targetConnectionInformation: targetMongoConnectionInformation,
            collectionDetails: collectionDetailsList
        });
        return response;
    }
    async startDataMigration(telemetryProps) {
        const requestBody = {
            properties: {
                kind: dataMigration_1.MongoToCosmosMigrationKind,
                mode: this.dataMigrationMode,
                scope: '',
                migrationService: this.dataMigrationService?.id,
                sourceMongoConnection: {
                    connectionString: this.sourceConnectionString,
                    host: "",
                    port: 0,
                    userName: "",
                    password: "",
                    useSsl: false
                },
                targetMongoConnection: {
                    connectionString: this.targetConnectionString,
                    host: "",
                    port: 0,
                    userName: "",
                    password: "",
                    useSsl: false
                },
                collectionList: []
            }
        };
        let migrationName = this.migrationName;
        const renameMigration = this.targetNamespacesForMigration.length > maxCollectionsPerMigration;
        for (let startIndex = 0; startIndex < this.targetNamespacesForMigration.length; startIndex += maxCollectionsPerMigration) {
            const lastIndex = Math.min(startIndex + maxCollectionsPerMigration, this.targetNamespacesForMigration.length) - 1;
            if (renameMigration) {
                migrationName = this.migrationName + `_${startIndex + 1}_${lastIndex + 1}`;
            }
            requestBody.properties.collectionList = this.getCollectionList(startIndex, lastIndex);
            if (this.targetOffering === common_1.EnumTargetOffering.CosmosDBMongovCore) {
                await (0, azure_1.createCosmosMongovCoreMigration)(this.azureAccount, this.targetSubscription, this.resourceGroup.name, this.migrationTargetServerName, migrationName, requestBody, this.sessionId);
            }
            else if (this.targetOffering === common_1.EnumTargetOffering.CosmosDBMongoRU) {
                await (0, azure_1.createCosmosMongoRUMigration)(this.azureAccount, this.targetSubscription, this.resourceGroup.name, this.migrationTargetServerName, migrationName, requestBody, this.sessionId);
            }
            telemetryProps[telemetry_1.TelemetryPropNames.MigrationName] = migrationName;
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.SummaryPage, telemetry_1.TelemetryAction.TriggerDataMigrationSucceeded, telemetryProps, {});
        }
    }
    async getMigrationsInTargetResourceGroup() {
        if (this.targetOffering === common_1.EnumTargetOffering.CosmosDBMongovCore) {
            return await (0, azure_1.getCosmosMongovCoreMigrations)(this.azureAccount, this.targetSubscription, this.resourceGroup.name, this.migrationTargetServerName, this.sessionId);
        }
        else if (this.targetOffering === common_1.EnumTargetOffering.CosmosDBMongoRU) {
            return await (0, azure_1.getCosmosMongoRUMigrations)(this.azureAccount, this.targetSubscription, this.resourceGroup.name, this.migrationTargetServerName, this.sessionId);
        }
        return [];
    }
    getCollectionList(startIndex, lastIndex) {
        const migrationCollections = [];
        for (let i = startIndex; i <= lastIndex; i++) {
            const nameSpaceSplit = this.targetNamespacesForMigration[i].split(".");
            const migrationCollection = {
                sourceDatabase: nameSpaceSplit[0],
                targetDatabase: nameSpaceSplit[0],
                sourceCollection: nameSpaceSplit[1],
                targetCollection: nameSpaceSplit[1],
            };
            migrationCollections.push(migrationCollection);
        }
        return migrationCollections;
    }
    getDefaultTelemetryProps() {
        const telemetryProps = {};
        telemetryProps[telemetry_1.TelemetryPropNames.TargetOffering] = common_1.EnumTargetOffering[this.targetOffering];
        if (this.assessmentId ?? false) {
            telemetryProps[telemetry_1.TelemetryPropNames.AssessmentId] = this.assessmentId;
        }
        return telemetryProps;
    }
}
exports.MigrationStateModel = MigrationStateModel;
//# sourceMappingURL=stateMachine.js.map