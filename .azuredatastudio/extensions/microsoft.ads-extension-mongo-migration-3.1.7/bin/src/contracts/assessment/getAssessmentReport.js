"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=getAssessmentReport.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines contract for GetAssessmentReport() api.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentReportRequestType = exports.GetAssessmentReportApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to get assessment report.
exports.GetAssessmentReportApi = 'assessments/getAssessmentReport';
exports.getAssessmentReportRequestType = new vscode_languageclient_1.RequestType(exports.GetAssessmentReportApi);
//# sourceMappingURL=getAssessmentReport.js.map