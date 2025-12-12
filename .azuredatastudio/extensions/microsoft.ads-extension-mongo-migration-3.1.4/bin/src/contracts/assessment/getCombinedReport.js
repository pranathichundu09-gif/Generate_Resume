"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=getCombinedReport.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines contract for GetCombinedAssessmentReport() api.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCombinedAssessmentReportRequestType = exports.GetCombinedReportApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to get combined report of all assessments.
exports.GetCombinedReportApi = 'assessments/getCombinedAssessmentReport';
exports.getCombinedAssessmentReportRequestType = new vscode_languageclient_1.RequestType(exports.GetCombinedReportApi);
//# sourceMappingURL=getCombinedReport.js.map