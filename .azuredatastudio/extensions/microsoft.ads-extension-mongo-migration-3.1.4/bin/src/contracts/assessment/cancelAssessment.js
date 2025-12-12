"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=cancelAssessment.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines assessment path settings.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAssessmentsRequestType = exports.CancelAssessmentApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to cancel assessment
exports.CancelAssessmentApi = 'assessments/cancelAssessment';
exports.cancelAssessmentsRequestType = new vscode_languageclient_1.RequestType(exports.CancelAssessmentApi);
//# sourceMappingURL=cancelAssessment.js.map