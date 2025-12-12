"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=assessmentSummary.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files build essential component for Assessment Summary and 
//               Progress Assessment Blades.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSummaryComponent = exports.createSummary = exports.createDownloadReportToolbar = exports.createInfoTextContainer = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const fs = require("fs");
const utils_1 = require("../common/utils");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const constants = require("../constants/strings");
const startAssessment_1 = require("../contracts/assessment/startAssessment");
const extension_1 = require("../extension");
const telemetry_1 = require("../telemetry");
const reportBuilder_1 = require("../report/reportBuilder");
const path = require("path");
let isOpen = true;
const notApplicable = "NA";
async function createInfoTextContainer(view) {
    const infoText = view.modelBuilder.text().withProps({
        value: constants.ASSESSMENT_RESULTS_SELECT_DATABASES,
        CSSStyles: {
            'font-size': '13px',
            'line-height': '18px'
        }
    }).component();
    const container = view.modelBuilder.flexContainer().withLayout({
        flexFlow: 'column',
    }).withProps({
        CSSStyles: {
            'margin-top': '10px'
        }
    }).component();
    container.addItem(infoText);
    return container;
}
exports.createInfoTextContainer = createInfoTextContainer;
async function createDownloadReportToolbar(view, migrationStateModel) {
    const downloadReportButton = view.modelBuilder.button().withProps({
        label: constants.DOWNLOAD_REPORT,
        iconPath: iconPathHelper_1.IconPathHelper.download,
        enabled: true
    }).component();
    downloadReportButton.onDidClick(async () => {
        const options = {
            defaultUri: vscode.Uri.file((0, utils_1.suggestReportFile)(Date.now())),
            filters: { 'HTML File': ['html'] }
        };
        const chosenPath = await vscode.window.showSaveDialog(options);
        if (chosenPath !== undefined) {
            const reportContent = await new reportBuilder_1.ReportBuilder(migrationStateModel.assessmentId, migrationStateModel.migrationName, await migrationStateModel.getSourceConnectionProfile()).build();
            await fs.promises.writeFile(chosenPath.fsPath, reportContent);
            if (await vscode.window.showInformationMessage(constants.REPORT_SAVED_MESSAGE, "Open", "Cancel") === "Open") {
                vscode.env.openExternal(chosenPath);
            }
        }
        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentSummaryPage, telemetry_1.TelemetryAction.DownloadReport, {
            assessmentId: migrationStateModel.assessmentId,
        }, {});
    });
    const toolbar = view.modelBuilder.toolbarContainer().withItems([downloadReportButton]).withLayout({
        orientation: azdata.Orientation.Horizontal,
    }).component();
    const container = view.modelBuilder.flexContainer().withLayout({
        flexFlow: 'column',
    }).withProps({
        CSSStyles: {
            'margin-top': '10px'
        }
    }).component();
    container.addItem(toolbar, {
        flex: '0 0 auto', CSSStyles: {
            'border-top': '2px solid rgb(221, 221, 221)'
        }
    });
    return container;
}
exports.createDownloadReportToolbar = createDownloadReportToolbar;
//Function that return summary container with heading and form with fields.
async function createSummary(view, assessmentDetails, connectionProfile, migrationStateModel) {
    const container = view.modelBuilder.flexContainer().withLayout({
        flexFlow: 'column',
    }).component();
    const headingContainer = view.modelBuilder.flexContainer().withLayout({
        flexFlow: 'row',
    }).component();
    const openclose = view.modelBuilder.button().withProps({
        iconPath: iconPathHelper_1.IconPathHelper.expandButtonOpen,
        iconHeight: 8,
        iconWidth: 8,
        height: 18,
        width: 6,
        ariaLabel: constants.EXPANDED + constants.ASSESSMENT_SUMMARY
    }).component();
    const assessmentSummary = view.modelBuilder.text().withProps({
        value: constants.ASSESSMENT_SUMMARY,
        height: 18,
        CSSStyles: {
            'font-size': '13px',
            'height': '16px',
            'line-height': '16px',
            'margin': '0px',
            'font-weight': '600'
        },
    }).component();
    headingContainer.addItem(openclose, { flex: 'none' });
    headingContainer.addItem(assessmentSummary);
    container.addItem(headingContainer);
    const formContainer = await createSummaryComponent(view, assessmentDetails, connectionProfile, migrationStateModel);
    openclose.onDidClick(() => {
        if (!isOpen) {
            openclose.iconPath = iconPathHelper_1.IconPathHelper.expandButtonOpen;
            openclose.ariaLabel = constants.EXPANDED + constants.ASSESSMENT_SUMMARY;
            isOpen = true;
            container.addItem(formContainer);
        }
        else {
            openclose.iconPath = iconPathHelper_1.IconPathHelper.expandButtonClosed;
            openclose.ariaLabel = constants.COLLAPSED + constants.ASSESSMENT_SUMMARY;
            isOpen = false;
            container.removeItem(formContainer);
        }
    });
    container.addItem(formContainer);
    return container;
}
exports.createSummary = createSummary;
// Function that returns the status (success/fail/etc) of the stage
function getStageStatus(stage, details) {
    const indexSuccess = details.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.SUCCESS);
    const indexProgress = details.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.INPROGRESS);
    const indexFailed = details.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.FAILED);
    const indexWarning = details.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.WARNING);
    const indexAborted = details.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.CANCELLED);
    if (indexWarning !== -1) {
        return startAssessment_1.AssessmentStatus.WARNING;
    }
    else if (indexSuccess !== -1) {
        return startAssessment_1.AssessmentStatus.SUCCESS;
    }
    else if (indexFailed !== -1) {
        return startAssessment_1.AssessmentStatus.FAILED;
    }
    else if (indexAborted != -1) {
        return startAssessment_1.AssessmentStatus.ABORTED;
    }
    else if (indexProgress != -1) {
        return startAssessment_1.AssessmentStatus.INPROGRESS;
    }
    return startAssessment_1.AssessmentStatus.WAITING;
}
// Function that returns summary component with form.
async function createSummaryComponent(view, assessmentDetails, connectionProfile, migrationStateModel) {
    const FormContainer = view.modelBuilder.flexContainer().withLayout({
        flexFlow: 'column',
    }).component();
    let instanceType = "--", sourceVersion = "--";
    const stageDetails = assessmentDetails.assessmentProgress;
    let instanceSummaryStatus = startAssessment_1.AssessmentStatus.WAITING;
    instanceSummaryStatus = getStageStatus(startAssessment_1.AssessmentStages.InstanceSummaryAdvisor, stageDetails);
    if (instanceSummaryStatus === startAssessment_1.AssessmentStatus.SUCCESS) {
        const databaseResponse = await (0, extension_1.getInstanceSummary)(assessmentDetails.assessmentId, assessmentDetails.assessmentName, connectionProfile);
        instanceType = databaseResponse.body.instanceType;
        sourceVersion = databaseResponse.body.sourceVersion;
        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentSummaryPage, telemetry_1.TelemetryAction.AssessmentDetailsInfo, {
            assessmentId: assessmentDetails.assessmentId,
            'sourceVersion': sourceVersion,
        }, {});
    }
    let dataAssessmentStatus = '';
    if (migrationStateModel.dataAssessmentReportPath) {
        const filePath = path.join(migrationStateModel.dataAssessmentReportPath);
        if (fs.existsSync(filePath)) {
            const content = await fs.promises.readFile(filePath, "utf8");
            const json = JSON.parse(content);
            dataAssessmentStatus = json.status;
        }
    }
    const data = [
        {
            title: constants.MIGRATION_NAME_LABEL,
            value: assessmentDetails.assessmentName
        },
        {
            title: constants.TARGET_PLATFORM_LABEL,
            value: ((0, utils_1.getTargetPlatformText)(assessmentDetails.targetPlatform)).toString()
        },
        {
            title: constants.LOG_FOLDER_LABEL,
            value: (assessmentDetails.logFolderPath !== "") ? assessmentDetails.logFolderPath : notApplicable
        },
        {
            title: constants.SOURCE_INSTANCE_TYPE,
            value: instanceType
        },
        {
            title: constants.SOURCE_VERSION,
            value: sourceVersion
        },
        {
            title: constants.DATA_ASSESSMENT_STATUS,
            value: dataAssessmentStatus
        }
    ];
    const list = data.map(l => createLabelContainer(view, l, assessmentDetails));
    for (let i = 0; i < data.length - 1; i += 2) {
        FormContainer.addItem(view.modelBuilder.flexContainer().withItems([
            list[i],
            list[i + 1]
        ]).withLayout({
            flexFlow: 'row',
        }).component());
    }
    return FormContainer;
}
exports.createSummaryComponent = createSummaryComponent;
function createLabelContainer(view, linkMetaData, assessmentDetails) {
    const maxWidth = 410;
    const labelsContainer = view.modelBuilder.flexContainer().withLayout({
        flexFlow: 'row',
        width: maxWidth,
        height: '28px',
    }).component();
    const labelComponent = view.modelBuilder.text().withProps({
        value: linkMetaData.title,
        width: 140,
        CSSStyles: {
            'font-size': '13px',
            'line-height': '18px',
            'margin': '0px',
            'padding': '5px 0'
        }
    }).component();
    const colonComponent = view.modelBuilder.text().withProps({
        value: ':',
        width: '15px',
        CSSStyles: {
            'font-size': '13px',
            'line-height': '18px',
            'margin': '0px',
            'text-align': 'center',
            'padding': '5px 0'
        }
    }).component();
    const labelComponentValue = view.modelBuilder.text().withProps({
        value: linkMetaData.value,
        width: 340,
        CSSStyles: {
            'font-size': '13px',
            'line-height': '18px',
            'margin': '0px',
            'padding': '5px 0',
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
        },
    }).component();
    labelsContainer.addItems([labelComponent, colonComponent, labelComponentValue], {
        flex: '0 0 auto',
        CSSStyles: {
            'text-overflow': 'ellipsis',
            'overflow': 'hidden',
        }
    });
    return labelsContainer;
}
//# sourceMappingURL=assessmentSummary.js.map