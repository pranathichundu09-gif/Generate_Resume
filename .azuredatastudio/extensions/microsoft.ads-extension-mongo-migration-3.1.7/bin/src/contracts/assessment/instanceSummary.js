"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=insanceSummary.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines contract for GetInstanceSummary() api.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceSummaryRequestType = exports.GetInstanceSummaryApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to get instance summary.
exports.GetInstanceSummaryApi = "assessments/getInstanceSummaryReport";
exports.getInstanceSummaryRequestType = new vscode_languageclient_1.RequestType(exports.GetInstanceSummaryApi);
//# sourceMappingURL=instanceSummary.js.map