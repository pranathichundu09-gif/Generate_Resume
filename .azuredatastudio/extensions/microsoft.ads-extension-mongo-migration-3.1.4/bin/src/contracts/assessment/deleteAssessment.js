"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=deleteAssessment.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contract for DeleteAssessment() API call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssessmentRequestType = exports.DeleteAssessmentApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to delete assessment.
exports.DeleteAssessmentApi = 'assessments/deleteAssessment';
exports.deleteAssessmentRequestType = new vscode_languageclient_1.RequestType(exports.DeleteAssessmentApi);
//# sourceMappingURL=deleteAssessment.js.map