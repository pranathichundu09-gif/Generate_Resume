"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=migrateSchemaNotification.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for telemetry notification call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateSchemaNotificationType = exports.CollectionMigrationFailedState = exports.ResponseStatus = exports.MigrateSchemaNotificationApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
//Defines a notification sent to the client to provide progress notification of the assessment.
exports.MigrateSchemaNotificationApi = "schemaMigration/migrateSchemaNotification";
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Failure"] = 0] = "Failure";
    ResponseStatus[ResponseStatus["Success"] = 1] = "Success";
    ResponseStatus[ResponseStatus["Skipped"] = 2] = "Skipped";
    ResponseStatus[ResponseStatus["Canceled"] = 3] = "Canceled";
    ResponseStatus[ResponseStatus["PartialSuccess"] = 4] = "PartialSuccess";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
var CollectionMigrationFailedState;
(function (CollectionMigrationFailedState) {
    CollectionMigrationFailedState[CollectionMigrationFailedState["CollectionCreation"] = 0] = "CollectionCreation";
    CollectionMigrationFailedState[CollectionMigrationFailedState["UniqueIndexCreation"] = 1] = "UniqueIndexCreation";
    CollectionMigrationFailedState[CollectionMigrationFailedState["NonUniqueIndexCreation"] = 2] = "NonUniqueIndexCreation";
})(CollectionMigrationFailedState = exports.CollectionMigrationFailedState || (exports.CollectionMigrationFailedState = {}));
exports.migrateSchemaNotificationType = new vscode_languageclient_1.NotificationType(exports.MigrateSchemaNotificationApi);
//# sourceMappingURL=migrateSchemaNotification.js.map