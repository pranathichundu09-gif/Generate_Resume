"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=common.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines entities common in contracts.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumAssessmentType = exports.CosmosDBVersions = exports.EnumTargetOffering = void 0;
var EnumTargetOffering;
(function (EnumTargetOffering) {
    EnumTargetOffering[EnumTargetOffering["None"] = 0] = "None";
    EnumTargetOffering[EnumTargetOffering["CosmosDBMongoRU"] = 1] = "CosmosDBMongoRU";
    EnumTargetOffering[EnumTargetOffering["CosmosDBMongovCore"] = 2] = "CosmosDBMongovCore";
})(EnumTargetOffering = exports.EnumTargetOffering || (exports.EnumTargetOffering = {}));
var CosmosDBVersions;
(function (CosmosDBVersions) {
    CosmosDBVersions["RU"] = "RU";
    CosmosDBVersions["vCore"] = "vCore";
})(CosmosDBVersions = exports.CosmosDBVersions || (exports.CosmosDBVersions = {}));
var EnumAssessmentType;
(function (EnumAssessmentType) {
    EnumAssessmentType["CollectionOptions"] = "CollectionOptions";
    EnumAssessmentType["Features"] = "Features";
    EnumAssessmentType["Index"] = "Index";
    EnumAssessmentType["LimitsAndQuotas"] = "LimitsAndQuotas";
    EnumAssessmentType["ShardKey"] = "ShardKey";
})(EnumAssessmentType = exports.EnumAssessmentType || (exports.EnumAssessmentType = {}));
//# sourceMappingURL=common.js.map