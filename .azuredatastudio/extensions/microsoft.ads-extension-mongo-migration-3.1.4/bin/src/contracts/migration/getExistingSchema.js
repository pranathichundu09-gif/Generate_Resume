"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=getExistingSchema.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for get existing schema API call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumCollectionType = exports.GetExistingSchemaRequestType = exports.GetExistingSchemaApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to list schema.
exports.GetExistingSchemaApi = 'schemaMigration/getExistingSchema';
exports.GetExistingSchemaRequestType = new vscode_languageclient_1.RequestType(exports.GetExistingSchemaApi);
var EnumCollectionType;
(function (EnumCollectionType) {
    EnumCollectionType[EnumCollectionType["unknown"] = 0] = "unknown";
    EnumCollectionType[EnumCollectionType["collection"] = 1] = "collection";
    EnumCollectionType[EnumCollectionType["view"] = 2] = "view";
    EnumCollectionType[EnumCollectionType["timeseries"] = 3] = "timeseries";
    EnumCollectionType[EnumCollectionType["capped"] = 4] = "capped";
    EnumCollectionType[EnumCollectionType["clustered"] = 5] = "clustered";
})(EnumCollectionType = exports.EnumCollectionType || (exports.EnumCollectionType = {}));
//# sourceMappingURL=getExistingSchema.js.map