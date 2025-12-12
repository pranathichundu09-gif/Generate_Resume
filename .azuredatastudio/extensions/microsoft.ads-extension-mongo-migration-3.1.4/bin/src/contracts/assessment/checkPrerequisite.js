"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=checkPrerequisite.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for check prerequisite API call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPrerequisiteRequestType = exports.CheckPrerequisiteApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to check prerequisite.
exports.CheckPrerequisiteApi = 'assessments/checkPrerequisite';
exports.checkPrerequisiteRequestType = new vscode_languageclient_1.RequestType(exports.CheckPrerequisiteApi);
//# sourceMappingURL=checkPrerequisite.js.map