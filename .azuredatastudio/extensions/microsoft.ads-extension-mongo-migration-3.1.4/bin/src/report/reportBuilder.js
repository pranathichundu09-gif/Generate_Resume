"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=reportBuilder.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the class to return html content for report.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportBuilder = void 0;
const css_1 = require("./css");
const utils_1 = require("../common/utils");
const extension_1 = require("../extension");
const constants = require("../constants/strings");
const localizationFile_1 = require("../localizationFile");
const bytesDivisor = 1024;
class ReportBuilder {
    assessmentId;
    assessmentName;
    connectionProfile;
    constructor(assessmentId, assessmentName, connectionProfile) {
        this.assessmentId = assessmentId;
        this.assessmentName = assessmentName;
        this.connectionProfile = connectionProfile;
    }
    async build() {
        const assessmentDetails = await (0, extension_1.getAssessmentDetails)(this.assessmentId, this.assessmentName, this.connectionProfile);
        const instanceSummary = await (0, extension_1.getInstanceSummary)(this.assessmentId, this.assessmentName, this.connectionProfile);
        const combinedAssessmentReportData = await (0, extension_1.getCombinedAssessmentReport)(this.assessmentId, this.assessmentName, this.connectionProfile);
        const langAttribute = `lang = "${localizationFile_1.Localization.localizedLanguageCode}"`;
        let mainContent = `
        <html ${langAttribute}>
        <head ${langAttribute}>
            <title ${langAttribute}>${[constants.EXTENSION_NAME]}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            ${(0, css_1.buildStyling)()}
        </head>
        <body ${langAttribute}>
            <div class="container" ${langAttribute}>
                <h1 ${langAttribute}>${[constants.EXTENSION_NAME]}</h1>
            <br>
                <h2 ${langAttribute}>${[constants.MIGRATION_NAME_LABEL]} - ${assessmentDetails.body.assessmentName}</h2>
                <h2 ${langAttribute}>${[constants.TARGET_PLATFORM_LABEL]} - ${[(0, utils_1.getTargetPlatformText)(assessmentDetails.body.targetPlatform)]}</h2>
            <div ${langAttribute}>${[constants.ASSESSMENT_ID]} - ${assessmentDetails.body.assessmentId}</div>
            <div ${langAttribute}>${[constants.ASSESSMENT_START_TIME]} - ${(0, utils_1.formatDate)(assessmentDetails.body.startTime)}</div>
            <div ${langAttribute}>${[constants.ASSESSMENT_END_TIME]} - ${(0, utils_1.formatDate)(assessmentDetails.body.endTime)}</div>
            <div ${langAttribute}>${[constants.SOURCE_LOG_FOLDER_PATH]} - ${(assessmentDetails.body.logFolderPath && assessmentDetails.body.logFolderPath.length > 0) ? assessmentDetails.body.logFolderPath : '<span syle=style="font-style: italic; font-size: 7px;">NA</span>'}</div>
                <h2 ${langAttribute}>${[constants.INSTANCE_SUMMMARY]}</h2>
                <div ${langAttribute}>${[constants.SOURCE_INSTANCE_TYPE]} - ${instanceSummary.body.instanceType === null ? '-' : instanceSummary.body.instanceType}</div>
                <div ${langAttribute}>${[constants.SOURCE_VERSION]} - ${instanceSummary.body.sourceVersion === null ? '-' : instanceSummary.body.sourceVersion}</div>
                <div ${langAttribute}>${[constants.LICENSE_TYPE]} - ${instanceSummary.body.licenseType === null ? '-' : instanceSummary.body.licenseType}</div>
                <br>
                ${this.buildInstanceSummarySection(instanceSummary.body)}`;
        if (assessmentDetails.body.logFolderPath && assessmentDetails.body.logFolderPath.length > 0) {
            mainContent += `<br><div ${langAttribute}>${[constants.ASSESSMENT_REPORT_LOG_TEXT(assessmentDetails.body.logFolderPath)]}</div>`;
        }
        else {
            mainContent += `<br><div ${langAttribute}>${[constants.ASSESSMENT_REPORT_SERVER_STATUS_TEXT((0, utils_1.formatDate)(instanceSummary.body.serverStartTime))]}</div>
            <div>${[constants.SERVER_UP_TIME]} - ${instanceSummary.body.upTimeInMilliSeconds}</div>`;
        }
        mainContent += `
        <h2 ${langAttribute}>${[constants.ASSESSMENT_SUMMARY]}</h2>
         ${[this.buildAssessmentDataSection(combinedAssessmentReportData.body.assessments)]}`;
        mainContent += `
        </div>
        </body>
        </html>`;
        return mainContent;
    }
    buildInstanceSummarySection(instanceSummary) {
        let databaseSummaryContent = ``;
        instanceSummary.databaseSummary.forEach((object) => {
            const sizeInGb = parseFloat((object.dataSize / Math.pow(bytesDivisor, 3)).toFixed(6));
            databaseSummaryContent += `<tr>
                    <td>${[this.encodeString(object.databaseName)]}</td>
                    <td>${[object.collectionCount]}</td>
                    <td>${[object.viewCount]}</td>
                    <td>${[object.timeSeriesCount]}</td>
                    <td>${[sizeInGb]}</td>
                </tr>`;
        });
        let collectionSummaryContent = ``;
        instanceSummary.collectionSummary.forEach((object) => {
            const dataSizeInGb = parseFloat((object.dataSize / Math.pow(bytesDivisor, 3)).toFixed(6));
            const indexSizeInGb = parseFloat((object.indexSize / Math.pow(bytesDivisor, 3)).toFixed(6));
            const docSizeInGb = parseFloat((object.averageDocumentSize / Math.pow(bytesDivisor, 3)).toFixed(6));
            collectionSummaryContent += `<tr>
                    <td>${[this.encodeString(object.databaseName)]}</td>
                    <td>${[this.encodeString(object.collectionName)]}</td>
                    <td>${[this.encodeString(object.type)]}</td>
                    <td>${[object.isSharded]}</td>
                    <td>${[this.encodeString(object.shardKey)]}</td>
                    <td>${[object.documentCount]}</td>
                    <td>${[object.indexCount]}</td>
                    <td>${[dataSizeInGb]}</td>
                    <td>${[indexSizeInGb]}</td>
                    <td>${[docSizeInGb]}</td>
                </tr>`;
        });
        const content = `
            <h2>${[constants.DATABASE_SUMMARY]}</h2>
            <div>${[constants.TOTAL_DATABASE_COUNT]} - ${instanceSummary.totalDatabaseCount === null ? '-' : instanceSummary.totalDatabaseCount}</div>
            <div>${[constants.TOTAL_COLLECTION_COUNT]} - ${instanceSummary.totalCollectionCount === null ? '-' : instanceSummary.totalCollectionCount}</div>
            <div>${[constants.TOTAL_VIEWS_COUNT]} - ${instanceSummary.totalViewsCount === null ? '-' : instanceSummary.totalViewsCount}</div>
            <div>${[constants.TOTAL_TIME_SERIES_COUNT]} - ${instanceSummary.totalTimeseriesCount === null ? '-' : instanceSummary.totalTimeseriesCount}</div>
            <div class = "table-wrapper" tabindex="0">
            <table>
                <caption>${[constants.DATABASE_SUMMARY_TABLE_CAPTION]}</caption>
                <tr><th>${[constants.DATABASE_NAME]}</th>
                <th>${[constants.COLLECTION_COUNT]}</th>
                <th>${[constants.VIEW_COUNT]}</th>
                <th>${[constants.TIME_SERIES_COUNT]}</th>
                <th>${[constants.DATA_SIZE]}</th></tr>
                ${[databaseSummaryContent]}
            </table>
            </div>
            <br>
            <br>
            <h2>${[constants.COLLECTION_SUMMARY]}</h2>
            <div>${[constants.NUMBER_OF_COLLECTIONS]} - ${instanceSummary.totalCollectionCount === null ? '-' : Number(instanceSummary.totalCollectionCount) + Number(instanceSummary.totalTimeseriesCount) + Number(instanceSummary.totalViewsCount)}</div>
            <div>${[constants.TOTAL_INDEX_COUNT]} - ${instanceSummary.totalIndexesCount === null ? '-' : instanceSummary.totalIndexesCount}</div>
            <div class = "table-wrapper" tabindex="0">
            <table>
                <caption>${[constants.DATABASE_SUMMARY_TABLE_CAPTION]}</caption>
                <tr><th>${[constants.DATABASE_NAME]}</th>
                <th>${[constants.COLLECTION_NAME]}</th>
                <th>${[constants.COLLECTION_TYPE]}</th>
                <th>${[constants.IS_SHARDED]}</th>
                <th>${[constants.SHARD_KEY]}</th>
                <th>${[constants.DOCUMENT_COUNT]}</th>
                <th>${[constants.INDEX_COUNT]}</th>
                <th>${[constants.DATA_SIZE]}</th>
                <th>${[constants.INDEX_SIZE]}</th>
                <th>${[constants.AVERAGE_DOCUMENT_SIZE]}</th>
                ${[collectionSummaryContent]}
            </table>
            <br>
            </div>`;
        return content;
    }
    buildAssessmentDataSection(assessmentReportData) {
        const assessmentDataContent = `
            <div class="table-wrapper" tabindex="0">
                <table>
                  <tr><th>${[constants.DATABASE_NAME]}</th>
                  <th>${[constants.COLLECTION_NAME]}</th>
                  <th>${[constants.ASSESSMENT_CATEGORY]}</th>
                  <th>${[constants.ASSESSMENT_SEVERITY]}</th>
                  <th>${[constants.ASSESSMENT_MESSAGE]}</th>
                  <th>${[constants.ADDITIONAL_DETAILS]}</th>
                  <th>${[constants.MORE_INFO]}</th></tr>
                  ${[this.buildAssessmentContent(assessmentReportData)]}
                </table>
                <br>
            </div>`;
        return assessmentDataContent;
    }
    buildAssessmentContent(assessmentDataList) {
        let assessmentContent = ``;
        assessmentDataList.forEach((assessmentData) => {
            const details = (assessmentData.additionalDetails && assessmentData.additionalDetails !== '{}' && assessmentData.additionalDetails.includes(",")) ? assessmentData.additionalDetails.split(",") : [];
            assessmentContent += `<tr>
                    ${(assessmentData.databaseName.length > 0) ? `<td>${[this.encodeString(assessmentData.databaseName)]}</td>` : this.emptyCellText()}
                    ${(assessmentData.collectionName.length > 0) ? `<td>${[this.encodeString(assessmentData.collectionName)]}</td>` : this.emptyCellText()}
                    <td>${[assessmentData.assessmentCategory]}</td>
                    <td>${[assessmentData.assessmentSeverity]}</td>
                    <td>${[assessmentData.message]}</td>
                    <td>${(assessmentData.additionalDetails === '{}') ? '' : details.join(", ")}</td>
                    ${(assessmentData.moreInfo !== null) ? `<td><a href="${[assessmentData.moreInfo.href]}"> ${[assessmentData.moreInfo.label]}</a></td>` : this.emptyCellText()}
                </tr>`;
        });
        return assessmentContent;
    }
    emptyCellText() {
        return `<td style="font-style: italic; font-size: 7px;">NA</td>`;
    }
    encodeString(unencodedString) {
        if (!unencodedString) {
            return unencodedString;
        }
        return unencodedString
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;")
            .replaceAll("'", "&#x27;")
            .replaceAll("/", "&#x2F;");
    }
}
exports.ReportBuilder = ReportBuilder;
//# sourceMappingURL=reportBuilder.js.map