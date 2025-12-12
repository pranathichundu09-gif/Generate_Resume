"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=migrateNonUniqueIndexNotification.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for telemetry notification call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateNonUniqueIndexNotificationType = exports.MigrateNonUniqueIndexNotificationApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
//Defines a notification sent to the client to provide progress notification of the assessment.
exports.MigrateNonUniqueIndexNotificationApi = "schemaMigration/migrateNonUniqueIndexesNotification";
exports.migrateNonUniqueIndexNotificationType = new vscode_languageclient_1.NotificationType(exports.MigrateNonUniqueIndexNotificationApi);
//# sourceMappingURL=migrateNonUniqueIndexNotification.js.map