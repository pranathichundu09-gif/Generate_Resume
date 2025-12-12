"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=assessment-extension.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines calls to rpc layer.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentExtension = void 0;
const getAllAssessments_1 = require("./contracts/assessment/getAllAssessments");
const logger_1 = require("./logger");
const vscode = require("vscode");
const azdata = require("azdata");
const startAssessment_1 = require("./contracts/assessment/startAssessment");
const Crypto = require("crypto-js");
const constants = require("./constants/strings");
const getAssessmentDetails = require("./contracts/assessment/getAssessmentDetails");
const fs = require("fs");
const deleteAssessment_1 = require("./contracts/assessment/deleteAssessment");
const checkPrerequisite_1 = require("./contracts/assessment/checkPrerequisite");
const instanceSummary_1 = require("./contracts/assessment/instanceSummary");
const config_1 = require("./config/config");
const telemetry_1 = require("./telemetry");
const cancelAssessment_1 = require("./contracts/assessment/cancelAssessment");
const getAssessmentReport_1 = require("./contracts/assessment/getAssessmentReport");
const getCombinedReport_1 = require("./contracts/assessment/getCombinedReport");
const allAssessments_1 = require("./tabs/allAssessments");
const refreshFrequency = 3000;
class AssessmentExtension {
    backendService;
    _context;
    _assessmentMap = new Map();
    _assessmentStagesMap = new Map();
    _config;
    constructor(backendService, context) {
        this.backendService = backendService;
        this._context = context;
        this._config = new config_1.Config();
    }
    async getAssessmentPath() {
        return await this._config.getAssessmentLocation();
    }
    //Defines request Type for StartAssessment Method call.
    get startAssessmentRequestType() {
        return startAssessment_1.startAssessmentrequestType;
    }
    //Defines request Type for Progress Notification call.
    get assessmentProgressNotificationType() {
        return startAssessment_1.assessmentProgressNotificationType;
    }
    //Defines request Type for checkPrerequisite Method call.
    get checkPrerequisiteRequestType() {
        return checkPrerequisite_1.checkPrerequisiteRequestType;
    }
    //Defines request Type for GetAllAssessment Method call.
    get getAllAssessmentsRequestType() {
        return getAllAssessments_1.getAllAssessmentsrequestType;
    }
    //Defines request Type for GetInstanceSummary Method call.
    get getInstanceSummaryRequestType() {
        return instanceSummary_1.getInstanceSummaryRequestType;
    }
    //Defines request Type for GetAssessmentReport Method call.
    get getAssessmentReportType() {
        return getAssessmentReport_1.getAssessmentReportRequestType;
    }
    //Defines request Type for GetCombinedAssessmentReport Method call.
    get getCombinedAssessmentReportType() {
        return getCombinedReport_1.getCombinedAssessmentReportRequestType;
    }
    //Defines request Type for getDeleteAssessment Method call.
    get getDeleteAssessmentRequestType() {
        return deleteAssessment_1.deleteAssessmentRequestType;
    }
    async getAllAssessments(connectionProfile) {
        let response = [];
        try {
            const instanceIdHash = Crypto.SHA256(connectionProfile.serverName).toString(Crypto.enc.Hex);
            const response1 = await this.backendService.sendRequest(this.getAllAssessmentsRequestType.method, {
                InstanceId: instanceIdHash,
                AssessmentFolderPath: await this.getAssessmentPath(),
            });
            // TODO: refactor code to a cleaner one.
            if (response1.error === null) {
                response = response1.body;
            }
            else {
                void vscode.window.showErrorMessage(response1.error.errorMessage);
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.MongoMigrationDashboard, telemetry_1.TelemetryAction.GetAllAssessmentAPIFailed, {
                    errorMessage: response1.error.errorMessage,
                    errorCode: response1.error.errorCode,
                }, {});
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.MongoMigrationDashboard, 'GetAllAssessmentAPIFailed', { errorCode: response1.error.errorCode, errorType: response1.error.errorMessage });
            }
        }
        catch (e) {
            if (e instanceof Error)
                logger_1.logger.logException("Exception in getAllAssessments API call: " + e.stack);
            else
                logger_1.logger.logException("Exception in getAllAssessments API call: " + e);
        }
        return response;
    }
    async deleteAssessment(assessmentId, connectionProfile) {
        let response = {};
        try {
            const assessmentName = allAssessments_1.assessmentMap.get(assessmentId) ?? "";
            if (assessmentName === "") {
                throw new Error("Could not find assessment to delete");
            }
            const instanceIdHash = Crypto.SHA256(connectionProfile.serverName).toString(Crypto.enc.Hex);
            response = await this.backendService.sendRequest(this.getDeleteAssessmentRequestType.method, {
                instanceId: instanceIdHash,
                assessmentName: assessmentName,
                assessmentId: assessmentId,
                assessmentFolderPath: await this.getAssessmentPath()
            });
            // If delete call fails
            if (!response.body) {
                vscode.window.showErrorMessage(constants.DELETE_ASSESSMENT_ERROR(response.error.errorMessage));
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AllAssessmentsPage, telemetry_1.TelemetryAction.DeleteAssessmentAPIFailed, {
                    errorMessage: response.error.errorMessage,
                    errorCode: response.error.errorCode,
                    assessmentId: assessmentId
                }, {});
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.AllAssessmentsPage, 'DeleteAssessmentAPIFailed', { errorCode: response.error.errorCode, errorType: response.error.errorMessage });
            }
        }
        catch (e) {
            logger_1.logger.logException("Exception: " + e);
        }
        return;
    }
    // Function to call checkPrerequisite API on the RPC layer
    async checkPrerequisite(connectionProfile, assessmentId) {
        let response = {};
        try {
            const ownerUri = await azdata.connection.getUriForConnection(connectionProfile.connectionId);
            const connProvider = azdata.dataprotocol.getProvider(connectionProfile.providerId, azdata.DataProviderType.ConnectionProvider);
            const connStr = await connProvider.getConnectionString(ownerUri, true);
            // calls API
            response = await this.backendService.sendRequest(this.checkPrerequisiteRequestType.method, {
                connectionString: connStr,
                assessmentId: assessmentId
            });
        }
        catch (e) {
            logger_1.logger.logException(e);
            throw e;
        }
        return response;
    }
    // Function to call startAssessment API on the RPC Layer
    async startAssessment(startAssessmentParameters, connectionProfile, migrationsTab, dashboardTab) {
        let startAssessmentResponse = {};
        try {
            const ownerUri = await azdata.connection.getUriForConnection(connectionProfile.connectionId);
            const connProvider = azdata.dataprotocol.getProvider(connectionProfile.providerId, azdata.DataProviderType.ConnectionProvider);
            const connStr = await connProvider.getConnectionString(ownerUri, true);
            const dir = await this.getAssessmentPath();
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            if (!this._config.isExtensionPathValid()) {
                vscode.window.showErrorMessage(constants.INVALID_PATH_ERROR_MESSAGE + this._config.getDefaultPath());
            }
            const instanceIdHash = Crypto.SHA256(connectionProfile.serverName).toString(Crypto.enc.Hex);
            //calls api
            startAssessmentResponse = await this.backendService.sendRequest(this.startAssessmentRequestType.method, {
                instanceId: instanceIdHash,
                assessmentName: startAssessmentParameters.assessmentName,
                assessmentId: startAssessmentParameters.assessmentId,
                targetPlatform: startAssessmentParameters.targetPlatform,
                logFolderPath: startAssessmentParameters.logFolderPath,
                connectionString: connStr,
                assessmentFolderPath: dir,
                dataAssessmentReportPath: startAssessmentParameters.dataAssessmentReportPath
            });
        }
        catch (e) {
            logger_1.logger.logException(e);
            throw e;
        }
        return startAssessmentResponse;
    }
    get getAssessmentDetailsRequestType() {
        return getAssessmentDetails.getAssessmentDetailsrequestType;
    }
    async getAssessmentDetails(assessmentId, assessmentName, connectionProfile) {
        let response = {};
        try {
            const instanceIdHash = Crypto.SHA256(connectionProfile.serverName).toString(Crypto.enc.Hex);
            response = await this.backendService.sendRequest(this.getAssessmentDetailsRequestType.method, {
                instanceId: instanceIdHash,
                assessmentId: assessmentId,
                assessmentName: assessmentName,
                assessmentFolderPath: await this.getAssessmentPath()
            });
        }
        catch (e) {
            logger_1.logger.logException(e);
            throw e;
        }
        return response;
    }
    async getInstanceSummary(assessmentId, assessmentName, connectionProfile) {
        let response = {};
        try {
            const instanceIdHash = Crypto.SHA256(connectionProfile.serverName).toString(Crypto.enc.Hex);
            response = await this.backendService.sendRequest(this.getInstanceSummaryRequestType.method, {
                instanceId: instanceIdHash,
                assessmentId: assessmentId,
                assessmentName: assessmentName,
                assessmentFolderPath: await this.getAssessmentPath()
            });
            if (response.error !== null) {
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentReportTab, telemetry_1.TelemetryAction.GetInstanceSummaryAPIFailed, {
                    errorMessage: response.error.errorMessage,
                    errorCode: response.error.errorCode,
                    assessmentId: assessmentId,
                }, {});
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.AssessmentReportTab, 'GetInstanceSummaryAPIFailed', { errorCode: response.error.errorCode, errorType: response.error.errorMessage });
            }
        }
        catch (e) {
            logger_1.logger.logException("Exception: " + e);
        }
        return response;
    }
    //Defines request Type for Cancel Assessment.
    get cancelAssessmentsrequestType() {
        return cancelAssessment_1.cancelAssessmentsRequestType;
    }
    async cancelAssessment(assessmentId) {
        let response = {};
        try {
            response = await this.backendService.sendRequest(this.cancelAssessmentsrequestType.method, assessmentId);
            if (!response) {
                logger_1.logger.logError("Cancellation failed");
            }
        }
        catch (e) {
            logger_1.logger.logException("Exception: " + e);
        }
        return response.body;
    }
    async getAssessmentReport(assessmentId, assessmentName, assessmentType, connectionProfile) {
        let response = {};
        try {
            const instanceIdHash = Crypto.SHA256(connectionProfile.serverName).toString(Crypto.enc.Hex);
            response = await this.backendService.sendRequest(this.getAssessmentReportType.method, {
                instanceId: instanceIdHash,
                assessmentId: assessmentId,
                assessmentName: assessmentName,
                assessmentFolderPath: await this.getAssessmentPath(),
                assessmentType: assessmentType
            });
            if (response.error !== null) {
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentReportTab, telemetry_1.TelemetryAction.GetAssessmentReportAPIFailed, {
                    errorMessage: response.error.errorMessage,
                    errorCode: response.error.errorCode,
                    assessmentId: assessmentId,
                }, {});
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.AssessmentReportTab, 'GetAssessmentReportAPIFailed', { errorCode: response.error.errorCode, errorType: response.error.errorMessage });
            }
        }
        catch (e) {
            logger_1.logger.logException("Exception: " + e);
        }
        return response;
    }
    async getCombinedAssessmentReport(assessmentId, assessmentName, connectionProfile) {
        let response = {};
        try {
            const instanceIdHash = Crypto.SHA256(connectionProfile.serverName).toString(Crypto.enc.Hex);
            response = await this.backendService.sendRequest(this.getCombinedAssessmentReportType.method, {
                instanceId: instanceIdHash,
                assessmentId: assessmentId,
                assessmentName: assessmentName,
                assessmentFolderPath: await this.getAssessmentPath(),
            });
            if (response.error !== null) {
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentReportTab, telemetry_1.TelemetryAction.GetCombinedAssessmentReportAPIFailed, {
                    errorMessage: response.error.errorMessage,
                    errorCode: response.error.errorCode,
                    assessmentId: assessmentId,
                }, {});
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.AssessmentReportTab, 'GetCombinedAssessmentReportAPIFailed', { errorCode: response.error.errorCode, errorType: response.error.errorMessage });
            }
        }
        catch (e) {
            logger_1.logger.logException("Exception: " + e);
        }
        return response;
    }
}
exports.AssessmentExtension = AssessmentExtension;
//# sourceMappingURL=assessment-extension.js.map