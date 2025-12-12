"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=migrateNonUniqueIndex.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for migrate non-unique index API call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateNonUnqiueIndexRequestType = exports.MigrateNonUniqueIndexApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to migrate non unique index.
exports.MigrateNonUniqueIndexApi = 'schemaMigration/migrateNonUniqueIndexes';
exports.MigrateNonUnqiueIndexRequestType = new vscode_languageclient_1.RequestType(exports.MigrateNonUniqueIndexApi);
//# sourceMappingURL=migrateNonUniqueIndex.js.map