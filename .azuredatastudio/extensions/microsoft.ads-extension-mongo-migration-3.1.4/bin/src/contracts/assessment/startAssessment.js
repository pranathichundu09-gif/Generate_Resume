"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=startAssesment.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for Start Assessment API call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentStatus = exports.AssessmentStages = exports.TargetDbPlatform = exports.assessmentProgressNotificationType = exports.startAssessmentrequestType = exports.AssessmentProgressNotificationApi = exports.StartAssessmentApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// API to start assessment.
exports.StartAssessmentApi = 'assessments/startAssessment';
// API to receive progress assessment notification.
exports.AssessmentProgressNotificationApi = 'assessments/assessmentProgressNotification';
exports.startAssessmentrequestType = new vscode_languageclient_1.RequestType(exports.StartAssessmentApi);
exports.assessmentProgressNotificationType = new vscode_languageclient_1.NotificationType(exports.AssessmentProgressNotificationApi);
var TargetDbPlatform;
(function (TargetDbPlatform) {
    TargetDbPlatform["COSMOS_DB_4_2"] = "Cosmos DB 4.2";
    TargetDbPlatform["COSMOS_DB_5_0"] = "Cosmos DB 5.0";
})(TargetDbPlatform = exports.TargetDbPlatform || (exports.TargetDbPlatform = {}));
var AssessmentStages;
(function (AssessmentStages) {
    AssessmentStages["CollectionsMetadataCollector"] = "CollectionMetadataCollector";
    AssessmentStages["FeatureMetadataCollector"] = "FeatureSupportedCollector";
    AssessmentStages["InstanceDetailsCollector"] = "InstanceDetailCollector";
    AssessmentStages["ShardKeyMetadataCollector"] = "ShardKeyCollector";
    AssessmentStages["CollectionOptionsAdvisor"] = "CollectionOptionsAdvisor";
    AssessmentStages["FeatureAdvisor"] = "FeaturesAdvisor";
    AssessmentStages["IndexAdvisor"] = "IndexAdvisor";
    AssessmentStages["InstanceSummaryAdvisor"] = "InstanceSummaryAdvisor";
    AssessmentStages["LimitsAndQuotasAdvisor"] = "LimitsAndQuotasAdvisor";
    AssessmentStages["ShardKeyAdvisor"] = "ShardKeyAdvisor";
    AssessmentStages["DataAssessmentAdvisor"] = "DataAssessmentAdvisor";
})(AssessmentStages = exports.AssessmentStages || (exports.AssessmentStages = {}));
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["SUCCESS"] = "Successful";
    AssessmentStatus["INPROGRESS"] = "InProgress";
    AssessmentStatus["WAITING"] = "Waiting";
    AssessmentStatus["FAILED"] = "Failed";
    AssessmentStatus["WARNING"] = "Warning";
    AssessmentStatus["ABORTED"] = "Aborted";
    AssessmentStatus["CANCELLED"] = "Cancelled";
})(AssessmentStatus = exports.AssessmentStatus || (exports.AssessmentStatus = {}));
//# sourceMappingURL=startAssessment.js.map