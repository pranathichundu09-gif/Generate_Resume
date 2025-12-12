"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=viewAssessmentResultsPage.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines logic of assessment result page.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewAssessmentResultsPage = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
const fs = require("fs");
const styles = require("../constants/styles");
const migrationWizardPage_1 = require("../models/migrationWizardPage");
const localizationFile_1 = require("../localizationFile");
const telemetry_1 = require("../telemetry");
const startAssessment_1 = require("../contracts/assessment/startAssessment");
const uuid_1 = require("uuid");
const config_1 = require("../config/config");
const extension_1 = require("../extension");
const assessmentReport_1 = require("../summary/assessmentReport");
const utils_1 = require("../common/utils");
const assessmentSummary_1 = require("../summary/assessmentSummary");
const common_1 = require("../contracts/common");
const refreshFrequency = 3000;
let autoRefreshHandle;
class ViewAssessmentResultsPage extends migrationWizardPage_1.MigrationWizardPage {
    connectionProfile;
    _view;
    _config;
    _disposables = [];
    _assessmentDetails;
    _rootContainer;
    _progressContainer;
    _assessmentLoader;
    _assessmentProgress;
    _assessmentInfo;
    _assessmentInProgressComponent;
    _assessmentStatusTable;
    _assessmentReport;
    _assessmentStatusTableData = [];
    _isAssessmentInProgress = true;
    _isUpdatingAssessments = false;
    constructor(wizard, migrationStateModel, connectionProfile) {
        super(wizard, azdata.window.createWizardPage(constants.VIEW_ASSESSMENT_RESULTS), migrationStateModel);
        this.connectionProfile = connectionProfile;
        this._config = new config_1.Config();
        this._assessmentReport = new assessmentReport_1.AssessmentReport();
    }
    async registerContent(view) {
        this._view = view;
        this._assessmentInProgressComponent = this._view.modelBuilder.flexContainer()
            .withLayout({ height: '100%', flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin-left': '30px' } })
            .component();
        this._assessmentInProgressComponent.addItem(this.createAssessmentProgress(), { flex: '0 0 auto' });
        this._assessmentInProgressComponent.addItem(await this.createAssessmentInfo(), { flex: '0 0 auto' });
        this._assessmentInProgressComponent.addItem(this.createAssessmentStatusTable(this._view), { flex: '0 0 auto' });
        this._rootContainer = this._view.modelBuilder.flexContainer()
            .withLayout({ height: '100%', flexFlow: 'column' })
            .withProps({ CSSStyles: { 'margin-left': '30px' } }).component();
        this._rootContainer.addItem(this._assessmentInProgressComponent, { flex: '0 0 auto' });
        this._view.initializeModel(this._rootContainer);
        this._disposables.push(this._view.onClosed(e => {
            this._disposables.forEach(d => { try {
                d.dispose();
            }
            catch {
                throw new Error("Temp Error");
            } });
        }));
    }
    async createAssessmentInfo() {
        this._assessmentInfo = this._view.modelBuilder.text()
            .withProps({
            value: constants.ASSESSMENT_IN_PROGRESS_CONTENT(this.migrationStateModel.serverName),
            CSSStyles: {
                ...styles.BODY_CSS,
                'width': '660px'
            }
        }).component();
        return this._assessmentInfo;
    }
    createAssessmentProgress() {
        this._assessmentLoader = this._view.modelBuilder.loadingComponent()
            .component();
        this._assessmentProgress = this._view.modelBuilder.text()
            .withProps({
            value: constants.ASSESSMENT_IN_PROGRESS,
            ariaLabel: constants.ASSESSMENT_IN_PROGRESS,
            CSSStyles: {
                ...styles.PAGE_TITLE_CSS,
                'margin-right': '20px'
            }
        }).component();
        this._progressContainer = this._view.modelBuilder.flexContainer()
            .withLayout({
            height: '100%',
            flexFlow: 'row',
            alignItems: 'center'
        }).component();
        this._progressContainer.addItem(this._assessmentProgress, { flex: '0 0 auto' });
        this._progressContainer.addItem(this._assessmentLoader, { flex: '0 0 auto' });
        return this._progressContainer;
    }
    async showAssessmentReport() {
        try {
            this._assessmentDetails = await (0, extension_1.getAssessmentDetails)(this.migrationStateModel.assessmentId, this.migrationStateModel.migrationName, this.connectionProfile);
            if (this._assessmentDetails.error !== null) {
                const assessmentError = this._assessmentDetails.error;
                this._isAssessmentInProgress = false;
                this.wizard.message = {
                    'text': constants.EXCEPTION_MESSAGE(this.migrationStateModel.migrationName) +
                        (0, localizationFile_1.localize)(assessmentError.errorCode, assessmentError.errorMessage, ...(assessmentError.errorParameters ?? [""]))
                };
                this._rootContainer.clearItems();
                this.wizard.pages[this.wizard.currentPage + 1].enabled = false;
                this.wizard.nextButton.enabled = false;
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.ViewAssessmentResultsPage, telemetry_1.TelemetryAction.GetAssessmentDetailsFailed, { errorCode: assessmentError.errorCode, errorType: assessmentError.errorMessage });
            }
            else {
                if (this._assessmentDetails.body.assessmentStatus === startAssessment_1.AssessmentStatus.INPROGRESS) {
                    this._isAssessmentInProgress = true;
                    this.wizard.message = { text: '' };
                    this.wizard.pages[this.wizard.currentPage + 1].enabled = false;
                    this.wizard.nextButton.enabled = false;
                    this.setAutoRefresh(this._view, refreshFrequency);
                    await this.populateAssessmentStatusTable(this._view, this._assessmentDetails.body.assessmentProgress);
                }
                else if (this._assessmentDetails.body.assessmentStatus === startAssessment_1.AssessmentStatus.FAILED || this._assessmentDetails.body.assessmentStatus === startAssessment_1.AssessmentStatus.CANCELLED) {
                    this._isAssessmentInProgress = false;
                    const assessmentProgressInfo = this._assessmentDetails.body.assessmentProgress;
                    assessmentProgressInfo.forEach(element => {
                        if (element.errorInfo !== undefined && element.errorInfo?.length !== 0) {
                            const errorMessage = constants.FAILED_MESSAGE(element.assessmentStage) + ' ' +
                                (0, localizationFile_1.localize)(element.errorInfo[0].errorCode ?? '', element.errorInfo[0].errorMessage ?? '', ...(element.errorInfo[0].errorParameters ?? [""]));
                            this.wizard.message = { 'text': errorMessage };
                            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.ViewAssessmentResultsPage, telemetry_1.TelemetryAction.GetAssessmentDetailsFailed, { errorCode: element.errorInfo[0].errorCode, errorType: element.errorInfo[0].errorMessage });
                        }
                    });
                    clearInterval(autoRefreshHandle);
                    await this.populateAssessmentStatusTable(this._view, this._assessmentDetails.body.assessmentProgress);
                }
                else {
                    if (this._isUpdatingAssessments) {
                        return;
                    }
                    this._isUpdatingAssessments = true;
                    this.wizard.message = { text: '' };
                    if (this.migrationStateModel.targetOffering === common_1.EnumTargetOffering.CosmosDBMongovCore) {
                        this.wizard.pages[this.wizard.currentPage + 1].enabled = true;
                        this.wizard.nextButton.enabled = true;
                    }
                    this.migrationStateModel.runNewAssessment = false;
                    this._isAssessmentInProgress = false;
                    clearInterval(autoRefreshHandle);
                    this._rootContainer.clearItems();
                    const infoTextContainer = await (0, assessmentSummary_1.createInfoTextContainer)(this._view);
                    this._rootContainer.addItem(infoTextContainer);
                    const toolBarContainer = await (0, assessmentSummary_1.createDownloadReportToolbar)(this._view, this.migrationStateModel);
                    this._rootContainer.addItem(toolBarContainer);
                    const summaryContainer = await (0, assessmentSummary_1.createSummary)(this._view, this._assessmentDetails.body, this.connectionProfile, this.migrationStateModel);
                    this._rootContainer.addItem(summaryContainer);
                    this._rootContainer.addItem(this._view.modelBuilder.separator().component());
                    this._rootContainer.addItem(await this._assessmentReport.showAssessmentList(this._view, this.migrationStateModel.extensionContext, this.migrationStateModel.assessmentId, this.migrationStateModel.migrationName, this.connectionProfile));
                    this._isUpdatingAssessments = false;
                }
            }
        }
        catch (err) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.ViewAssessmentResultsPage, telemetry_1.TelemetryAction.GetAssessmentDetailsFailed, { error: err });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.RUN_ASSESSMENT_UNEXPECTED_FAILURE
            };
        }
    }
    createAssessmentStatusTable(view) {
        const rowCssStyle = {
            'border': 'none',
            'text-align': 'left',
            'box-shadow': 'inset 0px -1px 0px #F3F2F1',
            'font-size': '13px',
            'line-height': '18px',
            'padding': '7px 5px',
            'margin': '0px',
        };
        const headerCssStyles = {
            'border': 'none',
            'text-align': 'left',
            'box-shadow': 'inset 0px -1px 0px #F3F2F1',
            'font-weight': 'bold',
            'padding-left': '5px',
            'padding-right': '5px',
            'font-size': '13px',
            'line-height': '18px'
        };
        this._assessmentStatusTable = view.modelBuilder.declarativeTable().withProps({
            ariaLabel: constants.ASSESSMENT_PROGRESS_TABLE_HEADER,
            columns: [
                {
                    displayName: constants.ASSESSMENT_STEPS,
                    valueType: azdata.DeclarativeDataType.string,
                    width: '200px',
                    isReadOnly: true,
                    rowCssStyles: rowCssStyle,
                    headerCssStyles: headerCssStyles
                },
                {
                    displayName: constants.STATUS,
                    valueType: azdata.DeclarativeDataType.component,
                    width: '120px',
                    isReadOnly: true,
                    rowCssStyles: rowCssStyle,
                    headerCssStyles: headerCssStyles
                },
                {
                    displayName: constants.TIME_TAKEN,
                    valueType: azdata.DeclarativeDataType.string,
                    width: '120px',
                    isReadOnly: true,
                    rowCssStyles: rowCssStyle,
                    headerCssStyles: headerCssStyles
                }
            ],
            data: [],
            width: '440px',
            CSSStyles: {
                'margin-left': '41px',
                'margin-top': '16px'
            }
        }).component();
        return this._assessmentStatusTable;
    }
    //Function that poulates stage status table
    async populateAssessmentStatusTable(view, details) {
        this._assessmentStatusTableData = details;
        const stagesList = [startAssessment_1.AssessmentStages.InstanceDetailsCollector, startAssessment_1.AssessmentStages.CollectionsMetadataCollector, startAssessment_1.AssessmentStages.FeatureMetadataCollector,
            startAssessment_1.AssessmentStages.ShardKeyMetadataCollector, startAssessment_1.AssessmentStages.InstanceSummaryAdvisor, startAssessment_1.AssessmentStages.CollectionOptionsAdvisor,
            startAssessment_1.AssessmentStages.FeatureAdvisor, startAssessment_1.AssessmentStages.IndexAdvisor, startAssessment_1.AssessmentStages.LimitsAndQuotasAdvisor, startAssessment_1.AssessmentStages.ShardKeyAdvisor, startAssessment_1.AssessmentStages.DataAssessmentAdvisor];
        const data = stagesList.map((row) => {
            return [
                { value: this.getStage(row) },
                { value: this.getStatus(row, view) },
                { value: this.getStageDuration(row) }
            ];
        });
        await this._assessmentStatusTable.setDataValues(data);
    }
    getStageDuration(stage) {
        const index = this._assessmentStatusTableData.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && ((v)?.assessmentStatus === startAssessment_1.AssessmentStatus.SUCCESS || (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.WARNING));
        if (index === -1) {
            return '--';
        }
        return (0, utils_1.getDuration)(this._assessmentStatusTableData[index].stageDuration);
    }
    // Function that returns status component of each stage
    getStatus(stage, view) {
        const indexSuccess = this._assessmentStatusTableData.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.SUCCESS);
        const indexProgress = this._assessmentStatusTableData.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.INPROGRESS);
        const indexFailed = this._assessmentStatusTableData.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.FAILED);
        const indexWarning = this._assessmentStatusTableData.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.WARNING);
        const indexAborted = this._assessmentStatusTableData.findIndex((v) => (v)?.assessmentStage?.toLowerCase() === stage.toLowerCase() && (v)?.assessmentStatus === startAssessment_1.AssessmentStatus.CANCELLED);
        let status;
        if (indexWarning !== -1) {
            status = startAssessment_1.AssessmentStatus.WARNING;
        }
        else if (indexSuccess !== -1) {
            status = startAssessment_1.AssessmentStatus.SUCCESS;
        }
        else if (indexFailed !== -1) {
            let updatedErrorMessage = constants.FAILED_MESSAGE(this.getStage(stage)) + ' ' +
                (0, localizationFile_1.localize)(this._assessmentStatusTableData[indexFailed].errorInfo[0].errorCode ?? '', this._assessmentStatusTableData[indexFailed].errorInfo[0].errorMessage ?? '', ...(this._assessmentStatusTableData[indexFailed].errorInfo[0].errorParameters ?? [""]));
            if (this._assessmentStatusTableData[indexFailed].errorInfo[0].errorParameters != null) {
                let value = '';
                this._assessmentStatusTableData[indexFailed].errorInfo[0].errorParameters?.forEach((element) => value = element);
                updatedErrorMessage = constants.FAILED_MESSAGE(this.getStage(stage)) + ' ' + value + ' ' +
                    (0, localizationFile_1.localize)(this._assessmentStatusTableData[indexFailed].errorInfo[0].errorCode ?? '', this._assessmentStatusTableData[indexFailed].errorInfo[0].errorMessage ?? '', ...(this._assessmentStatusTableData[indexFailed].errorInfo[0].errorParameters ?? [""]));
            }
            status = startAssessment_1.AssessmentStatus.FAILED;
        }
        else if (indexAborted !== -1) {
            status = startAssessment_1.AssessmentStatus.CANCELLED;
        }
        else if (indexProgress !== -1) {
            status = startAssessment_1.AssessmentStatus.INPROGRESS;
        }
        else {
            if (this._assessmentDetails.body.assessmentStatus === startAssessment_1.AssessmentStatus.INPROGRESS)
                status = startAssessment_1.AssessmentStatus.WAITING;
            else
                status = startAssessment_1.AssessmentStatus.ABORTED;
        }
        const statusImageSize = 14;
        const imageCellStyles = { 'margin': '3px 3px 0 0', 'padding': '0' };
        const statusCellStyles = { 'margin': '0', 'padding': '0' };
        const control = view.modelBuilder
            .divContainer()
            .withItems([
            // stage status icon
            view.modelBuilder.image()
                .withProps({
                iconPath: (0, utils_1.getStatusIcon)(status),
                iconHeight: statusImageSize,
                iconWidth: statusImageSize,
                height: statusImageSize,
                width: statusImageSize,
                CSSStyles: imageCellStyles
            })
                .component(),
            // stage status text
            view.modelBuilder.text().withProps({
                value: (0, utils_1.getStatusText)(status),
                height: statusImageSize,
                CSSStyles: statusCellStyles,
            }).component()
        ])
            .withProps({ CSSStyles: statusCellStyles, display: 'inline-flex' })
            .component();
        return control;
    }
    getStage(stage) {
        switch (stage) {
            case startAssessment_1.AssessmentStages.InstanceDetailsCollector:
                return constants.INSTANCE_DATA_COLLECTION;
            case startAssessment_1.AssessmentStages.CollectionsMetadataCollector:
                return constants.COLLECTIONS_META_DATA_COLLECTION;
            case startAssessment_1.AssessmentStages.FeatureMetadataCollector:
                return constants.FEATURE_DATA_COLLECTION;
            case startAssessment_1.AssessmentStages.ShardKeyMetadataCollector:
                return constants.SHARD_KEY_DATA_COLLECTION;
            case startAssessment_1.AssessmentStages.InstanceSummaryAdvisor:
                return constants.INSTANCE_ADVISOR;
            case startAssessment_1.AssessmentStages.CollectionOptionsAdvisor:
                return constants.COLLECTIONS_ADVISOR;
            case startAssessment_1.AssessmentStages.FeatureAdvisor:
                return constants.FEATURE_ADVISOR;
            case startAssessment_1.AssessmentStages.IndexAdvisor:
                return constants.INDEX_ADVISOR;
            case startAssessment_1.AssessmentStages.ShardKeyAdvisor:
                return constants.SHARD_KEY_ADVISOR;
            case startAssessment_1.AssessmentStages.LimitsAndQuotasAdvisor:
                return constants.LIMITS_QUOTAS_ADVISOR;
            case startAssessment_1.AssessmentStages.DataAssessmentAdvisor:
                return constants.DATA_ASSESSMENT_ADVISOR;
            default:
                return '';
        }
    }
    setAutoRefresh(view, interval) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const classVariable = this;
        clearInterval(autoRefreshHandle);
        if (interval !== -1) {
            autoRefreshHandle = setInterval(async function () { await classVariable.showAssessmentReport(); }, interval);
        }
    }
    async startAssessmentClick(viewAssessmentResultsPage) {
        this.migrationStateModel.assessmentId = (0, uuid_1.v4)();
        this._disposables.push(this.wizard.cancelButton.onClick(async () => this.CancelAssessment())); // Updating cancel assessment logic;
        const startAssessmentParameters = {
            assessmentName: this.migrationStateModel.assessmentName,
            targetPlatform: this.migrationStateModel.targetOffering,
            instanceId: '',
            assessmentId: this.migrationStateModel.assessmentId,
            connectionString: '',
            logFolderPath: this.migrationStateModel.sourceLogPath,
            assessmentFolderPath: '',
            dataAssessmentReportPath: this.migrationStateModel.dataAssessmentReportPath,
        };
        try {
            const response = await (0, extension_1.startAssessment)(startAssessmentParameters, this.connectionProfile);
            if (response.error != null) {
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.ViewAssessmentResultsPage, telemetry_1.TelemetryAction.StartAssessmentFailed, { errorCode: response.error.errorCode, errorType: response.error.errorMessage });
                return false;
            }
            const telemetryProps = this.migrationStateModel.getDefaultTelemetryProps();
            if (startAssessmentParameters.dataAssessmentReportPath) {
                const content = await fs.promises.readFile(startAssessmentParameters.dataAssessmentReportPath, "utf8");
                const json = JSON.parse(content);
                telemetryProps[telemetry_1.TelemetryPropNames.DataAssessmentId] = String(json.assessmentId);
                telemetryProps[telemetry_1.TelemetryPropNames.DataAssessmentStatus] = String(json.status);
            }
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.ViewAssessmentResultsPage, telemetry_1.TelemetryAction.StartAssessmentSucceeded, telemetryProps, {});
        }
        catch (err) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.ViewAssessmentResultsPage, telemetry_1.TelemetryAction.StartAssessmentFailed, { error: err });
            this.wizard.message = {
                level: azdata.window.MessageLevel.Error,
                text: constants.START_ASSESSMENT_UNEXPECTED_FAILURE
            };
            return false;
        }
        return true;
    }
    async CancelAssessment() {
        (0, extension_1.cancelAssessment)(this.migrationStateModel.assessmentId);
    }
    async onPageEnter(pageChangeInfo) {
        this.wizard.registerNavigationValidator(async (pageChangeInfo) => {
            this.wizard.message = { text: '' };
            this.wizard.nextButton.label = constants.WIZARD_NEXT;
            // Navigation to previous page
            const shouldNavigateToPreviousPage = !this._isAssessmentInProgress && pageChangeInfo.newPage < pageChangeInfo.lastPage;
            if (shouldNavigateToPreviousPage) {
                return true;
            }
            const selectedSourceDatabases = this._assessmentReport.selectedDbs();
            this.migrationStateModel.selectedSourceDatabasesForMapping = selectedSourceDatabases;
            const shouldNavigateToNextPage = this.migrationStateModel.runNewAssessment ? false : (selectedSourceDatabases.length > 0);
            return shouldNavigateToNextPage;
        });
        this.wizard.message = { text: '' };
        this.wizard.nextButton.label = constants.WIZARD_NEXT;
        if (this.migrationStateModel.targetOffering === common_1.EnumTargetOffering.CosmosDBMongoRU) {
            this.wizard.pages[this.wizard.currentPage + 1].enabled = false;
            this.wizard.nextButton.enabled = false;
            this.wizard.nextButton.hidden = true;
        }
        else {
            this.wizard.pages[this.wizard.currentPage + 1].enabled = true;
            this.wizard.nextButton.enabled = true;
        }
        if (this.migrationStateModel.runNewAssessment) {
            this._rootContainer.clearItems();
            this._rootContainer.addItem(this._assessmentInProgressComponent);
            await this._assessmentStatusTable.setDataValues([]);
            this._isAssessmentInProgress = true;
            this.wizard.cancelButton.secondary = true;
            this.wizard.cancelButton.onClick(async () => this.CancelAssessment());
            try {
                const isSuccessful = await this.startAssessmentClick(this);
                if (!isSuccessful) {
                    const details = await (0, extension_1.getAssessmentDetails)(this.migrationStateModel.assessmentId, this.migrationStateModel.migrationName, this.connectionProfile);
                    const assessmentProgressInfo = details.body.assessmentProgress;
                    assessmentProgressInfo.forEach(element => {
                        if (element.errorInfo !== undefined && element.errorInfo?.length !== 0) {
                            const errorMessage = constants.FAILED_MESSAGE(element.assessmentStage) + ' ' +
                                (0, localizationFile_1.localize)(element.errorInfo[0].errorCode ?? '', element.errorInfo[0].errorMessage ?? '', ...(element.errorInfo[0].errorParameters ?? [""]));
                            throw new Error(errorMessage);
                        }
                    });
                    //TODO: Temp fix. Debug this and add a more appropriate fix.
                    throw new Error("Assessment ran into an issue during execution. Please refer logs at: " + this._config.getDefaultPath());
                }
                extension_1.backendService.onNotification(startAssessment_1.assessmentProgressNotificationType, (params) => {
                    this.showAssessmentReport();
                });
            }
            catch (ex) {
                this._rootContainer.clearItems();
                if (ex instanceof Error) {
                    this.wizard.message = { 'text': ex.message };
                }
                this._isAssessmentInProgress = false;
                this._assessmentInfo.value = String(ex);
                this.wizard.nextButton.enabled = false;
            }
        }
    }
    async onPageLeave(pageChangeInfo) {
        console.log("Page leave from assessment results page");
        this.wizard.cancelButton.onClick(async () => {
            // empty body
        });
        if (pageChangeInfo.newPage > pageChangeInfo.lastPage) {
            this._assessmentReport.publishSelectedDbStats(this.migrationStateModel.getDefaultTelemetryProps());
        }
    }
}
exports.ViewAssessmentResultsPage = ViewAssessmentResultsPage;
//# sourceMappingURL=viewAssessmentResultsPage.js.map