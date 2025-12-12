"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=assessmentParameterPage.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file defines logic of assessment Parameter Page
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentParameterPage = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const migrationWizardPage_1 = require("../models/migrationWizardPage");
const telemetry_1 = require("../telemetry");
const common_1 = require("../contracts/common");
const extension_1 = require("../extension");
const iconPathHelper_1 = require("../constants/iconPathHelper");
class AssessmentParameterPage extends migrationWizardPage_1.MigrationWizardPage {
    connectionProfile;
    _view;
    _disposables = [];
    _paramatersContainer;
    _targetPlatformDropDown;
    _ruWarningComponent;
    _logFolderPathBrowserButton;
    _assessmentNameInput;
    _logFolderPathInput;
    _dataAssessmentReportBrowserButton;
    _dataAssessmentReportInput;
    _targetPlatformtype;
    _dataAssessmentReportTargetVersion;
    _isFormValidated;
    _isPreReqValidated;
    constructor(wizard, migrationStateModel, connectionProfile) {
        super(wizard, azdata.window.createWizardPage(constants.START_ASSESSMENT_TITLE), migrationStateModel);
        this.connectionProfile = connectionProfile;
    }
    async registerContent(view) {
        this._view = view;
        this._isFormValidated = false;
        this._isPreReqValidated = false;
        const flex = this.createAssessmentParametersContainer(view);
        this._disposables.push(this._view.onClosed(e => {
            this._disposables.forEach(d => {
                try {
                    d.dispose();
                }
                catch { //TODO: throw proper exception
                }
            });
        }));
        this._disposables.push(this.wizard.nextButton.onClick(async () => {
            if (this._isFormValidated && !this._isPreReqValidated) {
                const validatingDialogMessage = {
                    text: constants.VALIDATING_PREREQ,
                    level: 2
                };
                this.wizard.message = validatingDialogMessage;
                await this.runServerValidation();
            }
        }));
        await view.initializeModel(flex);
    }
    createAssessmentParametersContainer(_view) {
        const commonCSSStyles = {
            'font-style': 'normal',
            'font-size': '13px',
            'line-height': '18px',
        };
        const textCSSStyles = {
            ...commonCSSStyles,
            'font-weight': '400px',
            'margin': '0 0 4px 15px',
        };
        const labelCSSStyles = {
            ...commonCSSStyles,
            'font-weight': '600',
            'margin': '20px 0 4px 15px',
        };
        const enterInformationText = this._view.modelBuilder.text().withProps({
            value: constants.ASSESSMENT_INFORMATION_TEXT,
            width: '553px',
            CSSStyles: textCSSStyles
        }).component();
        const assessmentName = this._view.modelBuilder.text().withProps({
            value: constants.ASSESSMENT_NAME_LABEL,
            ariaLabel: constants.ASSESSMENT_NAME_LABEL,
            description: constants.ASSESSMENT_NAME_DESCRIPTION,
            width: '553px',
            requiredIndicator: true,
            CSSStyles: labelCSSStyles
        }).component();
        this._assessmentNameInput = this._view.modelBuilder.inputBox().withProps({
            ariaLabel: constants.ASSESSMENT_NAME_LABEL,
            width: '553px',
            required: true,
            maxLength: 20,
            CSSStyles: {
                'margin': '0 0 4px 15px'
            }
        }).withValidation((component) => {
            return this.validateAssessmentNameComponent(component);
        }).component();
        this._assessmentNameInput.focus();
        this._assessmentNameInput.onTextChanged(async (e) => {
            this._isFormValidated = false;
            this.toggleRunValidationButton();
        });
        const offeringLabel = this._view.modelBuilder.text().withProps({
            value: constants.OFFERING_LABEL,
            ariaLabel: constants.OFFERING_LABEL,
            description: constants.TARGET_PLATFORM_DESCRIPTION,
            width: 553,
            requiredIndicator: true,
            CSSStyles: labelCSSStyles
        }).component();
        const offeringDescriptionText = this._view.modelBuilder.text().withProps({
            value: constants.OFFERING_DESCRIPTION,
            width: '553px',
            CSSStyles: textCSSStyles
        }).component();
        const offeringHelpLink = this._view.modelBuilder.hyperlink().withProps({
            label: constants.OFFERING_HELP_LINK_LABEL,
            url: "https://aka.ms/mongodb-choose-model",
            CSSStyles: textCSSStyles
        }).component();
        this._targetPlatformDropDown = this._view.modelBuilder.dropDown().withProps({
            ariaLabel: constants.OFFERING_LABEL,
            placeholder: constants.SELECT_A_TARGET,
            values: [constants.COSMOS_DB_MONGO_VCORE,
                constants.COSMOS_DB_MONGO_RU],
            width: 553,
            editable: false,
            required: true,
            fireOnTextChange: true,
            CSSStyles: {
                'margin': '0 0 4px 15px'
            },
        }).component();
        this._targetPlatformtype = common_1.EnumTargetOffering.CosmosDBMongovCore;
        const ruWarningTextComponent = this._view.modelBuilder.text()
            .withProps({
            value: constants.RU_WARNING_TEXT,
            width: 553,
            CSSStyles: {
                'font-size': '11px',
                'line-height': '18px',
                'margin': '2px 15px 2px 0',
                'float': 'left',
            }
        }).component();
        const statusImageSize = 12;
        const warningIconComponent = this._view.modelBuilder.image()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.warning,
            iconHeight: statusImageSize,
            iconWidth: statusImageSize,
            height: statusImageSize,
            width: statusImageSize,
            CSSStyles: {
                'margin': '4px 4px 0 0',
                'padding': '0'
            }
        }).component();
        this._ruWarningComponent = this._view.modelBuilder.flexContainer()
            .withProps({
            CSSStyles: {
                'margin': '0 0 35px 15px',
                'padding': '0',
                'height': '18px',
            },
            display: 'inline-flex'
        }).component();
        this._ruWarningComponent.addItems([warningIconComponent, ruWarningTextComponent]);
        this._disposables.push(this._targetPlatformDropDown.onValueChanged(async (value) => {
            if (value.selected === constants.COSMOS_DB_MONGO_RU) {
                this._targetPlatformtype = common_1.EnumTargetOffering.CosmosDBMongoRU;
                this._targetPlatformDropDown.ariaLabel = constants.RU_WARNING_TEXT;
                this._paramatersContainer.insertItem(this._ruWarningComponent, 7);
            }
            else if (value.selected === constants.COSMOS_DB_MONGO_VCORE) {
                this._targetPlatformtype = common_1.EnumTargetOffering.CosmosDBMongovCore;
                this._targetPlatformDropDown.ariaLabel = constants.OFFERING_LABEL;
                this._paramatersContainer.removeItem(this._ruWarningComponent);
            }
            this._dataAssessmentReportInput.validate();
            this.toggleRunValidationButton();
        }));
        const logFolderPathLabel = this._view.modelBuilder.text().withProps({
            value: constants.LOG_FOLDER_LABEL,
            ariaLabel: constants.LOG_FOLDER_LABEL,
            description: constants.LOG_FOLDER_PATH_DESCRIPTION,
            width: 553,
            requiredIndicator: false,
            CSSStyles: labelCSSStyles
        }).component();
        const logFolderPathInfoText = this._view.modelBuilder.text().withProps({
            value: constants.LOG_FOLDER_INFO,
            width: '553px',
            CSSStyles: textCSSStyles
        }).component();
        const logFolderPathHelpLink = this._view.modelBuilder.hyperlink().withProps({
            label: constants.LOG_FOLDER_HELP_LINK_LABEL,
            url: "https://aka.ms/dmamongo-collect-log-messages",
            CSSStyles: textCSSStyles
        }).component();
        this._logFolderPathBrowserButton = this._view.modelBuilder.button().withProps({
            label: constants.BROWSE_BUTTON,
            width: '80px',
            enabled: true,
            CSSStyles: {
                'display': 'block'
            }
        }).component();
        this._disposables.push(this._logFolderPathBrowserButton.onDidClick(async () => {
            this._logFolderPathInput.value = await this.browseFilePath(false, true);
            this.toggleRunValidationButton();
        }));
        this._logFolderPathInput = this._view.modelBuilder.inputBox().withProps({
            ariaLabel: constants.LOG_FOLDER_PATH_INPUT,
            width: '553px',
            required: false,
            CSSStyles: {
                'margin': '0 0 0 15px'
            }
        }).withValidation((component) => {
            return this.validateFilePathComponent(component);
        }).component();
        this._logFolderPathInput.onTextChanged(async (e) => {
            this._isFormValidated = false;
            this.toggleRunValidationButton();
        });
        const logFolderPathInputContainer = this._view.modelBuilder.flexContainer().withItems([
            this._logFolderPathInput,
            this._logFolderPathBrowserButton
        ]).withLayout({
            flexFlow: 'row',
            alignItems: 'center'
        }).withProps({
            CSSStyles: {
                'margin-right': '5px',
                'margin-bottom': '10px'
            }
        }).component();
        const dataAssessmentReportLabel = this._view.modelBuilder.text().withProps({
            value: constants.DATA_ASSESSMENT_LABEL,
            ariaLabel: constants.DATA_ASSESSMENT_LABEL,
            description: constants.DATA_ASSESSMENT_PATH_DESCRIPTION,
            width: 553,
            requiredIndicator: false,
            CSSStyles: labelCSSStyles
        }).component();
        const dataAssessmentReportHelpLink = this._view.modelBuilder.hyperlink().withProps({
            label: constants.DATA_ASSESSMENT_HELP_LINK_LABEL,
            url: "https://aka.ms/MongoMigrationDataAssessment",
            CSSStyles: textCSSStyles
        }).component();
        this._dataAssessmentReportInput = this._view.modelBuilder.inputBox().withProps({
            ariaLabel: constants.DATA_ASSESSMENT_PATH_INPUT,
            width: '553px',
            required: false,
            CSSStyles: {
                'margin': '0 0 0 15px'
            }
        }).withValidation(async (component) => {
            this._dataAssessmentReportTargetVersion = "";
            let host = "";
            const value = component.value?.trim();
            if (value) {
                const filePath = path.join(value);
                if (fs.existsSync(filePath)) {
                    const content = await fs.promises.readFile(filePath, "utf8");
                    const json = JSON.parse(content);
                    this._dataAssessmentReportTargetVersion = json.targetVersion;
                    host = json.host;
                }
            }
            return this.validateFilePathComponent(component) && this.validateTargetVersion(component) && await this.validateHost(component, host);
        }).component();
        this._dataAssessmentReportInput.onTextChanged(async (e) => {
            this._isFormValidated = false;
            this.toggleRunValidationButton();
        });
        this._dataAssessmentReportBrowserButton = this._view.modelBuilder.button().withProps({
            label: constants.BROWSE_BUTTON,
            width: '80px',
            enabled: true,
            CSSStyles: {
                'display': 'block'
            }
        }).component();
        this._disposables.push(this._dataAssessmentReportBrowserButton.onDidClick(async () => {
            this._dataAssessmentReportInput.value = await this.browseFilePath(true, false);
            this.toggleRunValidationButton();
        }));
        const dataAssessmentReportInputContainer = this._view.modelBuilder.flexContainer().withItems([
            this._dataAssessmentReportInput,
            this._dataAssessmentReportBrowserButton
        ]).withLayout({
            flexFlow: 'row',
            alignItems: 'center'
        }).withProps({
            CSSStyles: {
                'margin-right': '5px',
                'margin-bottom': '10px'
            }
        }).component();
        this._paramatersContainer = this._view.modelBuilder.flexContainer().withItems([
            enterInformationText,
            assessmentName,
            this._assessmentNameInput,
            offeringLabel,
            offeringDescriptionText,
            offeringHelpLink,
            this._targetPlatformDropDown,
            logFolderPathLabel,
            logFolderPathInfoText,
            logFolderPathHelpLink,
            logFolderPathInputContainer,
            dataAssessmentReportLabel,
            dataAssessmentReportHelpLink,
            dataAssessmentReportInputContainer,
        ]).withLayout({
            flexFlow: 'column',
        }).withProps({
            CSSStyles: {
                'margin-left': '15px'
            }
        }).component();
        return this._paramatersContainer;
    }
    async onPageEnter(pageChangeInfo) {
        this.wizard.nextButton.enabled = true;
        this.wizard.nextButton.label = constants.RUN_VALIDATION;
        this._isPreReqValidated = false;
        this.wizard.registerNavigationValidator((pageChangeInfo) => {
            this.wizard.message = { text: '' };
            if (pageChangeInfo.newPage < pageChangeInfo.lastPage) {
                return true;
            }
            return this._isPreReqValidated;
        });
        this._disposables.push(this.wizard.cancelButton.onClick(async () => {
            (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentParameterPage, telemetry_1.TelemetryAction.WizardBack, {}, {});
        }));
    }
    async onPageLeave(pageChangeInfo) {
        this.wizard.nextButton.label = constants.WIZARD_NEXT;
        this.wizard.message = { text: '' };
        this.migrationStateModel.assessmentName = this._assessmentNameInput.value?.trim();
        this.migrationStateModel.targetOffering = this._targetPlatformtype;
        this.migrationStateModel.sourceLogPath = this._logFolderPathInput.value?.trim();
        this.migrationStateModel.dataAssessmentReportPath = this._dataAssessmentReportInput.value?.trim();
        this.migrationStateModel.runNewAssessment = true;
        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentParameterPage, telemetry_1.TelemetryAction.WizardNext, this.migrationStateModel.getDefaultTelemetryProps(), {});
    }
    async runServerValidation() {
        try {
            const response = await (0, extension_1.checkPrerequisite)(this.connectionProfile, "" /*assessmentId*/);
            if (response.body && response.body.isPreReqSatisfied) {
                // enable start assessment
                this._isPreReqValidated = true;
                this.wizard.nextButton.label = constants.START_ASSESSMENT;
                const prereqMetDialogMessage = {
                    text: constants.VALIDATION_SUCCESSFUL,
                    level: 2
                };
                this.wizard.message = prereqMetDialogMessage;
                const telemetryProps = this.migrationStateModel.getDefaultTelemetryProps();
                telemetryProps['isPrerequisiteMet'] = String(response.body.isPreReqSatisfied);
                (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.AssessmentParameterPage, telemetry_1.TelemetryAction.ValidationSuccessful, telemetryProps, {});
            }
            else {
                // disable start assessment
                this._isPreReqValidated = false;
                this.wizard.nextButton.label = constants.RUN_VALIDATION;
                let errorMessage;
                if (response.error != null) {
                    const executionFailureDialogMessage = {
                        text: response.error.errorMessage
                    };
                    errorMessage = executionFailureDialogMessage;
                }
                else {
                    const unexpectedErrorDialogMessage = {
                        text: constants.UNEXPECTED_ERROR_IN_VALIDATION
                    };
                    errorMessage = unexpectedErrorDialogMessage;
                }
                this.wizard.message = errorMessage;
                (0, telemetry_1.logError)(telemetry_1.TelemetryViews.AssessmentParameterPage, telemetry_1.TelemetryAction.ValidationFailed, { error: errorMessage.text });
            }
        }
        catch (err) {
            (0, telemetry_1.logError)(telemetry_1.TelemetryViews.AssessmentParameterPage, telemetry_1.TelemetryAction.ValidationFailed, { error: err });
        }
    }
    // function to validate log file path
    validateFilePathComponent(component) {
        const value = component.value?.trim();
        if (value !== undefined) {
            const filePath = path.join(value);
            if (!fs.existsSync(filePath)) { // validate whether path exists in file system.
                component.validationErrorMessage = constants.INVALID_PATH;
                return false;
            }
        }
        return true;
    }
    validateTargetVersion(component) {
        if (this._dataAssessmentReportTargetVersion === "") {
            return true;
        }
        if (this._targetPlatformtype === common_1.EnumTargetOffering.CosmosDBMongovCore && this._dataAssessmentReportTargetVersion !== common_1.CosmosDBVersions.vCore
            || this._targetPlatformtype === common_1.EnumTargetOffering.CosmosDBMongoRU && this._dataAssessmentReportTargetVersion !== common_1.CosmosDBVersions.RU) {
            component.validationErrorMessage = constants.INVALID_TARGET_VERSION;
            return false;
        }
        return true;
    }
    async validateHost(component, host) {
        const sourceConnectionHost = (await azdata.connection.getCurrentConnection()).serverName.split(':')[0];
        if (host && host !== sourceConnectionHost) {
            component.validationErrorMessage = constants.INVALID_HOST;
            return false;
        }
        return true;
    }
    // function to validate the assessment name
    validateAssessmentNameComponent(component) {
        const value = component.value?.trim();
        if (value === undefined || value.length < 3) { //Validating length of migration name
            component.validationErrorMessage = constants.INCORRECT_LENGTH;
            return false;
        }
        if ((0, extension_1.getAllAssessments)().filter(t => t.assessmentName === value).length >= 1) { //Making sure no assessment has duplicate names.
            component.validationErrorMessage = constants.DUPLICATE_ASSESSMENT_NAME;
            return false;
        }
        if (!(/^([A-Za-z0-9-_])+$/.test(value))) { // validating assessment name contains alpha-numeric, underscore or hyphen
            component.validationErrorMessage = constants.INVALID_ASSESSMENT_NAME;
            return false;
        }
        return true;
    }
    // function to set next button as validate or start assessment.
    toggleRunValidationButton() {
        // Run Validation Button
        this._isFormValidated = this.validateAssessmentNameComponent(this._assessmentNameInput)
            && this.validateFilePathComponent(this._logFolderPathInput)
            && this.validateFilePathComponent(this._dataAssessmentReportInput)
            && this.validateTargetVersion(this._dataAssessmentReportInput);
        if (!this._isFormValidated) {
            this._isPreReqValidated = false;
        }
    }
    async browseFilePath(canSelectFiles, canSelectFolders) {
        let path = '';
        const options = {
            defaultUri: vscode.Uri.file(process.env.HOME || process.env.USERPROFILE || ""),
            canSelectFiles: canSelectFiles,
            canSelectFolders: canSelectFolders,
            canSelectMany: false,
        };
        const fileUris = await vscode.window.showOpenDialog(options);
        if (fileUris && fileUris?.length > 0 && fileUris[0]) {
            path = fileUris[0].fsPath;
        }
        return path;
    }
}
exports.AssessmentParameterPage = AssessmentParameterPage;
//# sourceMappingURL=assessmentParameterPage.js.map