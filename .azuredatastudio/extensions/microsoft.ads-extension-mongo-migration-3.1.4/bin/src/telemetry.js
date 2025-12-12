"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=telemetry.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines UI telemetry
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTelemetry = exports.logError = exports.TelemetryMeasureNames = exports.TelemetryPropNames = exports.TelemetryAction = exports.TelemetryViews = exports.TelemetryReporter = void 0;
const azdata = require("azdata");
const Crypto = require("crypto-js");
const ads_extension_telemetry_1 = require("@microsoft/ads-extension-telemetry");
const utils_1 = require("./common/utils");
const packageJson = require("../package.json");
const logger_1 = require("./logger");
const packageInfo = (0, utils_1.getPackageInfo)(packageJson);
exports.TelemetryReporter = new ads_extension_telemetry_1.default(packageInfo.name, packageInfo.version, packageInfo.aiKey);
var TelemetryViews;
(function (TelemetryViews) {
    TelemetryViews["AllAssessmentsPage"] = "AllAssessmentsPage";
    TelemetryViews["AssessmentReportTab"] = "AssessmentReportTab";
    TelemetryViews["MigrationWizardController"] = "MigrationWizardController";
    TelemetryViews["MongoMigrationDashboard"] = "MongoMigrationDashboard";
    TelemetryViews["MigrationsTab"] = "MigrationsTab";
    TelemetryViews["CompleteCutoverDialog"] = "CompleteCutoverDialog";
    TelemetryViews["TelemetryNotification"] = "TelemetryNotification";
    TelemetryViews["AssessmentSummaryPage"] = "AssessmentSummaryPage";
    TelemetryViews["MigrationDetailsPage"] = "MigrationDetailsPage";
    TelemetryViews["MigrationSummaryPage"] = "MigrationSummaryPage";
    TelemetryViews["AssessmentParameterPage"] = "AssessmentParameterPage";
    TelemetryViews["CreateDataMigrationServiceDialog"] = "CreateDataMigrationServiceDialog";
    TelemetryViews["MigrationMappingPage"] = "MigrationMappingPage";
    TelemetryViews["SelectMigrationServiceDialog"] = "SelectMigrationServiceDialog";
    TelemetryViews["SchemaMigrationPage"] = "SchemaMigrationPage";
    TelemetryViews["TargetMigrationServicePage"] = "TargetMigrationServicePage";
    TelemetryViews["TargetSelectionPage"] = "TargetSelectionPage";
    TelemetryViews["SummaryPage"] = "SummaryPage";
    TelemetryViews["ViewAssessmentResultsPage"] = "ViewAssessmentResultsPage";
})(TelemetryViews = exports.TelemetryViews || (exports.TelemetryViews = {}));
var TelemetryAction;
(function (TelemetryAction) {
    TelemetryAction["NewMigration"] = "NewMigration";
    TelemetryAction["RunValidation"] = "RunValidation";
    TelemetryAction["AssessmentWarning"] = "AssessmentWarning";
    TelemetryAction["AssessmentError"] = "AssessmentError";
    TelemetryAction["ViewErrorDetails"] = "ViewErrorDetails";
    TelemetryAction["CancelAssessment"] = "CancelAssessment";
    TelemetryAction["DeleteAssessment"] = "DeleteAssessment";
    TelemetryAction["SuccessfulAssessment"] = "SuccessfulAssessment";
    TelemetryAction["FailedAssessment"] = "FailedAssessment";
    TelemetryAction["DeleteAssessmentAPIFailed"] = "DeleteAssessmentAPIFailed";
    TelemetryAction["DeleteMigrations"] = "DeleteMigrations";
    TelemetryAction["CancelMigration"] = "CancelMigration";
    TelemetryAction["DeleteMigrationSucceeded"] = "DeleteMigrationSucceeded";
    TelemetryAction["CancelMigrationSucceeded"] = "CancelMigrationSucceeded";
    TelemetryAction["CancelMigrationFailed"] = "CancelMigrationFailed";
    TelemetryAction["DeleteMigrationFailed"] = "DeleteMigrationFailed";
    TelemetryAction["LogAssessments"] = "LogAssessments";
    TelemetryAction["LastAssessment"] = "LastAssessment";
    TelemetryAction["DownloadReport"] = "DownloadReport";
    TelemetryAction["CloseMigrationWizard"] = "CloseMigrationWizard";
    TelemetryAction["CancelMigrationWizard"] = "CancelMigrationWizard";
    TelemetryAction["Refresh"] = "Refresh";
    TelemetryAction["AutoRefresh"] = "AutoRefresh";
    TelemetryAction["LogMigrations"] = "LogMigrations";
    TelemetryAction["LogMigrationDetailsFailed"] = "LogMigrationDetailsFailed";
    TelemetryAction["GetAllAssessmentAPIFailed"] = "GetAllAssessmentAPIFailed";
    TelemetryAction["GetAssessmentReportAPIFailed"] = "GetAssessmentReportAPIFailed";
    TelemetryAction["GetCombinedAssessmentReportAPIFailed"] = "GetCombinedAssessmentReportAPIFailed";
    TelemetryAction["GetInstanceSummaryAPIFailed"] = "GetInstanceSummaryAPIFailed";
    // actions used in wizard
    TelemetryAction["AssessmentDetailsInfo"] = "AssessmentDetailsInfo";
    TelemetryAction["CreateMigrationServiceFailed"] = "CreateMigrationServiceSucceeded";
    TelemetryAction["CreateMigrationServiceSucceeded"] = "CreateMigrationServiceSucceeded";
    TelemetryAction["GetAssessmentDetailsFailed"] = "GetAssessmentDetailsFailed";
    TelemetryAction["GetAssessmentDetailsSucceeded"] = "GetAssessmentDetailsSucceeded";
    TelemetryAction["GetSchemaFailed"] = "GetSchemaFailed";
    TelemetryAction["GetSchemaSucceeded"] = "GetSchemaSucceeded";
    TelemetryAction["GetMigrationServiceFailed"] = "GetMigrationServiceFailed";
    TelemetryAction["IndexMigrationInfo"] = "IndexMigrationInfo";
    TelemetryAction["MigrationMappingInfo"] = "MigrationMappingInfo";
    TelemetryAction["NonUniqueIndexMigrationFailed"] = "NonUniqueIndexMigrationFailed";
    TelemetryAction["PopulateAzureAccountsFailed"] = "PopulateAzureAccountsFailed";
    TelemetryAction["PopulateAzureSubscriptionsFailed"] = "PopulateAzureSubscriptionsFailed";
    TelemetryAction["PopulateMigrationServicesFailed"] = "PopulateMigrationServicesFailed";
    TelemetryAction["PopulateResourceGroupsFailed"] = "PopulateResourceGroupsFailed";
    TelemetryAction["GetResourceGroupMigrationsFailed"] = "GetResourceGroupMigrationsFailed";
    TelemetryAction["GetMigrationServiceMigrationsFailed"] = "GetMigrationServiceMigrationsFailed";
    TelemetryAction["StartAssessmentFailed"] = "StartAssessmentFailed";
    TelemetryAction["StartAssessmentSucceeded"] = "StartAssessmentSucceeded";
    TelemetryAction["StartCreateMigrationServiceSucceeded"] = "StartCreateMigrationServiceSucceeded";
    TelemetryAction["StartNonUniqueIndexMigrationFailed"] = "StartNonUniqueIndexMigrationFailed";
    TelemetryAction["StartNonUniqueIndexMigrationSucceeded"] = "StartNonUniqueIndexMigrationSucceeded";
    TelemetryAction["StartSchemaMigrationFailed"] = "StartSchemaMigrationFailed";
    TelemetryAction["SchemaMigrationFailed"] = "SchemaMigrationFailed";
    TelemetryAction["SchemaMigrationInfo"] = "SchemaMigrationInfo";
    TelemetryAction["SchemaMigrationStarted"] = "SchemaMigrationStarted";
    TelemetryAction["SchemaMigrationSucceeded"] = "SchemaMigrationSucceeded";
    TelemetryAction["TargetMigrationServiceSelectionInfo"] = "TargetMigrationServiceSelectionInfo";
    TelemetryAction["TargetSelectionInfo"] = "TargetSelectionInfo";
    TelemetryAction["TriggerDataMigrationSucceeded"] = "TriggerDataMigrationSucceeded";
    TelemetryAction["TriggerDataMigrationFailed"] = "TriggerDataMigrationFailed";
    TelemetryAction["CompleteCutoverSucceeded"] = "CompleteCutoverSucceeded";
    TelemetryAction["CompleteCutoverFailed"] = "CompleteCutoverFailed";
    TelemetryAction["CompleteCutoverCancelled"] = "CompleteCutoverCancelled";
    TelemetryAction["ValidationSuccessful"] = "ValidationSuccessful";
    TelemetryAction["ValidationFailed"] = "ValidationFailed";
    TelemetryAction["WizardBack"] = "WizardBack";
    TelemetryAction["WizardNext"] = "WizardNext";
    TelemetryAction["TestConnectivityFailed"] = "TestConnectivityFailed";
    TelemetryAction["TestConnectivitySucceeded"] = "TestConnectivitySucceeded";
})(TelemetryAction = exports.TelemetryAction || (exports.TelemetryAction = {}));
var TelemetryPropNames;
(function (TelemetryPropNames) {
    TelemetryPropNames["AssessmentId"] = "assessmentId";
    TelemetryPropNames["AssessmentName"] = "assessmentName";
    TelemetryPropNames["DataMigrationServiceSubscription"] = "dataMigrationServiceSubscription";
    TelemetryPropNames["DataMigrationServiceResourceGroup"] = "dataMigrationServiceResourceGroup";
    TelemetryPropNames["DataMigrationServiceName"] = "dataMigrationServiceName";
    TelemetryPropNames["MigrationName"] = "migrationName";
    TelemetryPropNames["MigrationMode"] = "migrationMode";
    TelemetryPropNames["MigrationKind"] = "migrationKind";
    TelemetryPropNames["ProvisioningState"] = "provisioningState";
    TelemetryPropNames["TotalCollectionCount"] = "totalCollectionCount";
    TelemetryPropNames["StartedOn"] = "startedOn";
    TelemetryPropNames["EndedOn"] = "endedOn";
    TelemetryPropNames["MigrationStatus"] = "migrationStatus";
    TelemetryPropNames["MigrationOperationId"] = "migrationOperationId";
    TelemetryPropNames["TargetAccount"] = "targetAccount";
    TelemetryPropNames["TargetOffering"] = "targetOffering";
    TelemetryPropNames["TargetResourceGroup"] = "targetResourceGroup";
    TelemetryPropNames["TargetSubscription"] = "targetSubscription";
    TelemetryPropNames["DataAssessmentId"] = "dataAssessmentId";
    TelemetryPropNames["DataAssessmentStatus"] = "dataAssessmentStatus";
    TelemetryPropNames["ErrorMessage"] = "errorMessage";
    TelemetryPropNames["IntialSourceDocCount"] = "IntialSourceDocCount";
    TelemetryPropNames["BulkCopyProcessedDocCount"] = "BulkCopyProcessedDocCount";
    TelemetryPropNames["CdcProcessedDocCount"] = "CdcProcessedDocCount";
    TelemetryPropNames["CutoverProcessedDocCount"] = "CutoverProcessedDocCount";
})(TelemetryPropNames = exports.TelemetryPropNames || (exports.TelemetryPropNames = {}));
var TelemetryMeasureNames;
(function (TelemetryMeasureNames) {
    TelemetryMeasureNames["FailedCollectionMigrationCount"] = "failedCollectionMigrationCount";
    TelemetryMeasureNames["FailedIndexMigrationCount"] = "failedIndexMigrationCount";
    TelemetryMeasureNames["SelectedCollectionCount"] = "selectedCollectionCount";
    TelemetryMeasureNames["SelectedDatabaseCount"] = "selectedDatabaseCount";
    TelemetryMeasureNames["TotalCollectionCount"] = "totalCollectionCount";
    TelemetryMeasureNames["TotalDatabaseCount"] = "totalDatabaseCount";
})(TelemetryMeasureNames = exports.TelemetryMeasureNames || (exports.TelemetryMeasureNames = {}));
function logError(telemetryView, name, errorDetails) {
    if (errorDetails.error == null) {
        logger_1.logger.logError(name);
        // We are sending errorType as our Error message
        exports.TelemetryReporter.sendErrorEvent2(telemetryView, name, null, true, errorDetails.errorCode, errorDetails.errorType);
    }
    else {
        logger_1.logger.logError(errorDetails.error);
        exports.TelemetryReporter.sendErrorEvent2(telemetryView, name, errorDetails.error, true);
    }
}
exports.logError = logError;
async function logTelemetry(telemetryView, telemetryAction, additionalProps, additionalMeasurements) {
    const serverName = (await azdata.connection.getCurrentConnection()).serverName;
    additionalProps["instanceId"] = Crypto.SHA256(serverName).toString(Crypto.enc.Hex);
    exports.TelemetryReporter.createActionEvent(telemetryView, telemetryAction)
        .withAdditionalProperties(additionalProps)
        .withAdditionalMeasurements(additionalMeasurements)
        .send();
}
exports.logTelemetry = logTelemetry;
//# sourceMappingURL=telemetry.js.map