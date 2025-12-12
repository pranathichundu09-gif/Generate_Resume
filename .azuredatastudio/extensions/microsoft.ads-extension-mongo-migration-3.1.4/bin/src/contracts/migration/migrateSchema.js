"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=migrateSchema.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for migrate schema API call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrateSchemaRequestType = exports.MigrateSchemaApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to migrate schema.
exports.MigrateSchemaApi = 'schemaMigration/migrateSchema';
exports.MigrateSchemaRequestType = new vscode_languageclient_1.RequestType(exports.MigrateSchemaApi);
//# sourceMappingURL=migrateSchema.js.map