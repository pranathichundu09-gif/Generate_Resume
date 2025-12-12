"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=allAssessments.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines the assessment tab of the extension.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllAssessmentsTab = exports.assessmentMap = void 0;
const azdata = require("azdata");
const vscode = require("vscode");
const parentTab_1 = require("./parentTab");
const styles = require("../constants/styles");
const constants = require("../constants/strings");
const extension_1 = require("../extension");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const utils_1 = require("../common/utils");
const telemetry_1 = require("../telemetry");
const fs_1 = require("fs");
const reportBuilder_1 = require("../report/reportBuilder");
const startAssessment_1 = require("../contracts/assessment/startAssessment");
exports.assessmentMap = new Map();
class AllAssessmentsTab extends parentTab_1.ParentTab {
    _autoRefreshHandle;
    _assessmentsCompletedTable;
    _disposables = [];
    _rootContainer;
    _filterInput;
    _noAssessmentImage;
    _noAssessmentText;
    _assessmentList;
    connectionProfile;
    infoPanel;
    assessmentTitle;
    assessmentsContainer;
    constructor(extensionContext, serviceContextChangedEvent) {
        super(extensionContext, serviceContextChangedEvent, constants.ASSESSMENTS, 'AssessmentsTab');
        this._serviceContextChangedEvent = serviceContextChangedEvent;
    }
    async tabContent(view) {
        this.connectionProfile = await azdata.connection.getCurrentConnection();
        this._rootContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '100%',
            height: '100%',
        }).component();
        this._rootContainer.addItem(await this.createToolbar(view), {
            flex: '0 0 auto', CSSStyles: {
                'border-top': '2px solid rgb(221, 221, 221)'
            }
        });
        this._filterInput = view.modelBuilder.inputBox()
            .withProps({
            placeHolder: constants.FILTER_ASSESSMENTS,
            stopEnterPropagation: true,
            width: '200px',
            maxLength: 20
        }).withValidation((component) => {
            const value = component.value?.trim();
            if (value === undefined || value.length > utils_1.assessmentNameMaxLength) {
                component.validationErrorMessage = constants.EXCEEDING_LENGTH;
                return false;
            }
            return true;
        }).component();
        this._filterInput.onTextChanged(async () => {
            await this.populateAssessments();
        });
        this._filterInput.updateCssStyles({
            'margin': '16px'
        });
        this._rootContainer.addItem(this._filterInput, {
            flex: '0 0 auto'
        });
        const assessmentContainer = await this.createCompletedAssessmentsContainer(view);
        this._rootContainer.addItem(assessmentContainer);
        this._disposables.push(this._view.onClosed(() => {
            clearInterval(this._autoRefreshHandle);
            this._disposables.forEach(d => { d.dispose(); });
        }));
        return this._rootContainer;
    }
    filterAssessments(response, assessmentNameFilter) {
        let filteredResponse = response;
        if (assessmentNameFilter) {
            filteredResponse = response.filter((value) => {
                return value.assessmentName.toLowerCase().includes(assessmentNameFilter.toLowerCase());
            });
        }
        return filteredResponse;
    }
    async callDeleteAssessment(context) {
        this.connectionProfile = await azdata.connection.getCurrentConnection();
        await (0, extension_1.deleteAssessment)(this.connectionProfile, context);
    }
    getButtonsContainer(assessmentId, assessmentName, status) {
        const deleteButton = this._view.modelBuilder.button().withProps({
            label: '',
            ariaLabel: constants.DELETE_ASSESSMENT,
            iconPath: iconPathHelper_1.IconPathHelper.delete,
            width: '15px'
        }).component();
        const downloadButton = this._view.modelBuilder.button().withProps({
            label: '',
            ariaLabel: constants.DOWNLOAD_REPORT,
            iconPath: iconPathHelper_1.IconPathHelper.download,
            width: '15px'
        }).component();
        const buttonContainer = this._view.modelBuilder.flexContainer().component();
        buttonContainer.addItems([deleteButton, downloadButton]);
        if (status === startAssessment_1.AssessmentStatus.FAILED || status === startAssessment_1.AssessmentStatus.CANCELLED) {
            downloadButton.enabled = false;
        }
        else if (status === startAssessment_1.AssessmentStatus.INPROGRESS) {
            deleteButton.enabled = false;
            downloadButton.enabled = false;
        }
        deleteButton.onDidClick(async () => {
            await this.callDeleteAssessment(assessmentId);
            deleteButton.enabled = false;
            this.populateAssessments();
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AllAssessmentsPage, telemetry_1.TelemetryAction.DeleteAssessment, {
                assessmentId: assessmentId,
            }, {});
        });
        downloadButton.onDidClick(async () => {
            const options = {
                defaultUri: vscode.Uri.file((0, utils_1.suggestReportFile)(Date.now())),
                filters: { 'HTML File': ['html'] }
            };
            const chosenPath = await vscode.window.showSaveDialog(options);
            if (chosenPath !== undefined) {
                const reportContent = await new reportBuilder_1.ReportBuilder(assessmentId, assessmentName, this.connectionProfile).build();
                await fs_1.promises.writeFile(chosenPath.fsPath, reportContent);
                if (await vscode.window.showInformationMessage(constants.REPORT_SAVED_MESSAGE, "Open", "Cancel") === "Open") {
                    vscode.env.openExternal(chosenPath);
                }
            }
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AllAssessmentsPage, telemetry_1.TelemetryAction.DownloadReport, {
                assessmentId: assessmentId,
            }, {});
        });
        return buttonContainer;
    }
    async populateAssessments() {
        this._assessmentList = await (0, extension_1.getAssessments)(this.connectionProfile);
        this._assessmentList = this.filterAssessments(this._assessmentList, this._filterInput.value);
        this._filterInput.ariaLabel = constants.FILTER_RESULTS_FOUND(this._assessmentList.length);
        if (this._assessmentList.length > 0) {
            this._assessmentList = (0, utils_1.sortAssessments)(this._assessmentList);
            const data = this._assessmentList.map(r => {
                exports.assessmentMap.set(r.assessmentId, r.assessmentName);
                return [
                    { value: r.assessmentName },
                    { value: (0, utils_1.getStatus)(r.assessmentStatus, this._view) },
                    { value: (0, utils_1.formatDate)(r.startTime) },
                    { value: (0, utils_1.formatDate)(r.endTime) },
                    {
                        value: this.getButtonsContainer(r.assessmentId, r.assessmentName, r.assessmentStatus)
                    }
                ];
            });
            await this._assessmentsCompletedTable.setDataValues(data);
            await this._assessmentsCompletedTable.updateCssStyles({
                'display': 'block'
            });
            await this._noAssessmentImage.updateCssStyles({
                'display': 'none'
            });
            await this._noAssessmentText.updateCssStyles({
                'display': 'none'
            });
            let count = 0;
            this._assessmentList.forEach((r) => {
                if (r.assessmentStatus !== startAssessment_1.AssessmentStatus.INPROGRESS) {
                    count++;
                }
            });
            if (count === this._assessmentList.length) {
                clearInterval(this._autoRefreshHandle);
            }
        }
        else {
            await this._assessmentsCompletedTable.updateCssStyles({
                'display': 'none'
            });
            await this._noAssessmentImage.updateCssStyles({
                'display': 'block'
            });
            await this._noAssessmentText.updateCssStyles({
                'display': 'block'
            });
        }
    }
    setAutoRefresh(interval) {
        clearInterval(this._autoRefreshHandle);
        if (interval !== -1) {
            this._autoRefreshHandle = setInterval(async () => { await this.populateAssessments(); }, interval);
        }
    }
    getAllAssessments() {
        return this._assessmentList;
    }
    async clearAssessments() {
        this._rootContainer.clearItems();
        this._rootContainer.addItem(await this.createToolbar(this._view), {
            flex: '0 0 auto', CSSStyles: {
                'border-top': '2px solid rgb(221, 221, 221)'
            }
        });
        this._rootContainer.addItem(this._filterInput, {
            flex: '0 0 auto'
        });
        this._rootContainer.addItem(this.assessmentsContainer);
        this.populateAssessments();
    }
    async createCompletedAssessmentsContainer(view) {
        this.assessmentsContainer = view.modelBuilder.flexContainer().withLayout({
            flexFlow: 'column',
            width: '850px',
            justifyContent: 'flex-start',
        }).withProps({
            CSSStyles: {
                'padding': '16px'
            }
        }).component();
        this._noAssessmentImage = view.modelBuilder.image().withProps({
            iconPath: iconPathHelper_1.IconPathHelper.blankCanvas,
            iconHeight: 100,
            iconWidth: 100,
            width: 96,
            height: 96,
            CSSStyles: {
                'opacity': '50%',
                'margin': '5% auto',
                'filter': 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                'display': 'none'
            }
        }).component();
        this._noAssessmentText = view.modelBuilder.text().withProps({
            value: constants.NO_ASSESSMENTS,
            width: 210,
            height: 34,
            CSSStyles: {
                ...styles.NOTE_CSS,
                'margin': 'auto',
                'text-align': 'center',
                'display': 'none'
            }
        }).component();
        this.createTable();
        await this.populateAssessments();
        const titleCSS = {
            'font-weight': '500',
            'margin-block-start': '0px',
            'margin-block-end': '0px',
            'font-size': '17px',
            'padding-left': '10px'
        };
        this.assessmentTitle = view.modelBuilder.text().withProps({
            value: '',
            CSSStyles: titleCSS
        }).component();
        this.infoPanel = view.modelBuilder.flexContainer()
            .withLayout({
            flexFlow: 'row'
        }).withProps({
            CSSStyles: {
                'margin': '8px',
                'margin-left': '11px'
            }
        }).component();
        this.infoPanel.addItem(this.assessmentTitle);
        this.assessmentsContainer.addItem(this._assessmentsCompletedTable);
        this.assessmentsContainer.addItems([this._noAssessmentImage, this._noAssessmentText]);
        return this.assessmentsContainer;
    }
    createTable() {
        this._assessmentsCompletedTable = this._view.modelBuilder.declarativeTable().withProps({
            ariaLabel: constants.ASSESSMENTS,
            width: '100%',
            height: '600px',
            CSSStyles: {
                'border': 'none',
                'padding': '0px'
            },
            columns: [
                {
                    displayName: constants.ASSESSMENT_NAME_LABEL,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 200,
                    isReadOnly: true,
                    headerCssStyles: utils_1.cssHeader,
                    rowCssStyles: utils_1.cssRow
                },
                {
                    displayName: constants.STATUS,
                    valueType: azdata.DeclarativeDataType.component,
                    width: 120,
                    isReadOnly: true,
                    headerCssStyles: utils_1.cssHeader,
                    rowCssStyles: utils_1.cssRow
                },
                {
                    displayName: constants.START_TIME,
                    width: 100,
                    isReadOnly: true,
                    valueType: azdata.DeclarativeDataType.string,
                    headerCssStyles: utils_1.cssHeader,
                    rowCssStyles: utils_1.cssRow
                },
                {
                    displayName: constants.END_TIME,
                    width: 200,
                    isReadOnly: true,
                    valueType: azdata.DeclarativeDataType.string,
                    headerCssStyles: utils_1.cssHeader,
                    rowCssStyles: utils_1.cssRow
                },
                {
                    displayName: '',
                    width: 100,
                    valueType: azdata.DeclarativeDataType.component,
                    headerCssStyles: utils_1.cssHeader,
                    rowCssStyles: utils_1.cssRow,
                    isReadOnly: true
                }
            ],
            data: []
        }).component();
    }
    async createToolbar(view) {
        const iconSize = 16;
        const btnHeight = '26px';
        const refreshButton = view.modelBuilder.button()
            .withProps({
            label: constants.REFRESH,
            ariaLabel: constants.REFRESH,
            iconPath: iconPathHelper_1.IconPathHelper.refresh,
            iconHeight: iconSize,
            iconWidth: iconSize,
            height: btnHeight
        }).component();
        this._disposables.push(refreshButton.onDidClick(async () => {
            await this.populateAssessments();
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AllAssessmentsPage, telemetry_1.TelemetryAction.Refresh, {}, {});
        }));
        return view.modelBuilder.toolbarContainer()
            .withToolbarItems([
            { component: refreshButton },
        ]).component();
    }
}
exports.AllAssessmentsTab = AllAssessmentsTab;
//# sourceMappingURL=allAssessments.js.map