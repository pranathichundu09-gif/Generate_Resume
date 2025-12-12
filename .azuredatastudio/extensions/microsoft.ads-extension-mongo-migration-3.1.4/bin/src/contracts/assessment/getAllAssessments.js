"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=getAllAssessments.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines contract for GetAllAssessments() api.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAssessmentsrequestType = exports.GetAllAssessmentsApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to get all assessments.
exports.GetAllAssessmentsApi = 'assessments/getAllAssessments';
exports.getAllAssessmentsrequestType = new vscode_languageclient_1.RequestType(exports.GetAllAssessmentsApi);
//# sourceMappingURL=getAllAssessments.js.map