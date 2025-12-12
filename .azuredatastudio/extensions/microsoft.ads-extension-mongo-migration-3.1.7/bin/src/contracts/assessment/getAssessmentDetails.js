"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=getAssessmentDetails.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines contract for GetAssessmentDetails() api.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssessmentDetailsrequestType = exports.GetAssessmentDetailsApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to get assessment details.
exports.GetAssessmentDetailsApi = 'assessments/getAssessmentDetails';
exports.getAssessmentDetailsrequestType = new vscode_languageclient_1.RequestType(exports.GetAssessmentDetailsApi);
//# sourceMappingURL=getAssessmentDetails.js.map