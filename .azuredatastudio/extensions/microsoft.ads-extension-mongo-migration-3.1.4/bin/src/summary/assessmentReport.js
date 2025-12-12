"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=assessmentReport.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files build Assessment Report Page.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentReport = void 0;
const azdata = require("azdata");
const constants = require("../constants/strings");
const styles = require("../constants/styles");
const extension_1 = require("../extension");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const styles_1 = require("../constants/styles");
const telemetry_1 = require("../telemetry");
const warning = "Warning";
const critical = "Critical";
const informational = "Informational";
const none = "";
const featuresAssessmentCategory = "Features Compatibility";
const dataAssessmentCategory = "Data Assessment";
class AssessmentReport {
    _view;
    _disposables = [];
    _databaseTableValues;
    _databaseTable;
    _instanceTable;
    _assessmentTypeTitle;
    _assessmentTypeDropdown;
    _assessmentDetailstitle;
    _dbNames;
    _currentdbName = none;
    _bottomContainer;
    _blockingIssuesTable;
    _warningIssuesTable;
    _informationalIssuesTable;
    _allAssessmentListContainer;
    _assessmentDetailsContainer;
    _serverSummaryContainer;
    _blockingIssuesAssessmentsList;
    _warningIssuesAssessmentsList;
    _informationalIssuesAssessmentsList;
    _blockingIssuesAssessmentsData;
    _warningIssuesAssessmentsData;
    _informationalIssuesAssessmentsData;
    _blockingIssuesDbAssessmentsMap = new Map();
    _warningIssuesDbAssessmentsMap = new Map();
    _informationalIssuesDbAssessmentsMap = new Map();
    _serverSummaryDescription;
    _assessedDatabaseText;
    _assessedDatabaseValue;
    _totalIssuesFoundValue;
    _readySummaryCount;
    _readyWithConditionSummaryCount;
    _notReadySummaryCount;
    _serverSummaryBlockerCount;
    _serverSummaryWarningCount;
    _serverSummaryInfoCount;
    _notReadyBarImage;
    _readyBarImage;
    _readyWithConditionsBarImage;
    _assessmentTitle;
    _assessmentSeverityText;
    _databaseNameText;
    _collectionNameText;
    _descriptionText;
    _additionalDetailsText;
    _moreInfo;
    _blockingIssuesHeadingButton;
    _warningIssuesHeadingButton;
    _informationalIssuesHeadingButton;
    _serverSummaryHeadingButton;
    _notAvailable = "NA";
    _isBlockingIssuesOpen = false;
    _isWarningIssuesOpen = false;
    _isInformationalIssuesOpen = false;
    _totalAssessmentcount = 0;
    _dbNotReadyCount = 0;
    _dbReadyWithConditionsCount = 0;
    _dbReadyCount = 0;
    _serverBlockerCount = 0;
    _serverWarningCount = 0;
    _serverInfoCount = 0;
    // This function returns a list pane with assessments categorized based on databases and categories along with details of assessments.
    async showAssessmentList(view, context, assessmentId, assessmentName, connectionProfile) {
        this._view = view;
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({
            flexFlow: "row",
            width: "100%",
            height: "calc(100% - 15px)",
        })
            .withProps({
            ariaLive: "polite",
            CSSStyles: {
                margin: "15px 0 0 0",
                "border-top": "1px solid #cecece",
            },
        })
            .component();
        container.addItem(await this.createServerAndDatabaseList(), {
            flex: "0 0 auto",
            CSSStyles: {
                width: "310px",
                height: "100%",
            },
        });
        container.addItem(await this.createAssessmentListAndDetails(), {
            flex: "0 0 auto",
        });
        this.initializeData(assessmentId, assessmentName, connectionProfile);
        return container;
    }
    async createServerAndDatabaseList() {
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({
            flexFlow: "column",
            height: "calc(100% - 8px)",
        })
            .withProps({
            CSSStyles: {
                "border-right": "solid 1px #C4C4C4",
            },
        })
            .component();
        container.addItem(this.createSearchComponent(), {
            flex: "0 0 auto",
            CSSStyles: { height: "40px" },
        });
        container.addItem(this.createInstanceComponent(), {
            flex: "0 0 auto",
            CSSStyles: { height: "60px" },
        });
        container.addItem(this.createDatabaseComponent(), {
            flex: "0 0 auto",
            CSSStyles: { "overflow-y": "auto", height: "calc(100% - 100px)" },
        });
        return container;
    }
    async createAssessmentListAndDetails() {
        const topContainer = this.createTopContainer();
        this._bottomContainer = this.createBottomContainer();
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({
            flexFlow: "column",
            height: "calc(100% - 23px)",
        })
            .withProps({
            CSSStyles: {
                margin: "15px 0px 0px 18px",
                "overflow-y": "hidden",
            },
        })
            .component();
        container.addItem(topContainer, {
            flex: "0 0 auto",
            CSSStyles: { height: "23px" },
        });
        container.addItem(this._bottomContainer, {
            flex: "0 0 auto",
            CSSStyles: { height: "calc(100% - 20px)" },
        });
        return container;
    }
    createTopContainer() {
        const assessmentTypeTitle = this.createAssessmentTypeTitle();
        const assessmentTypeDropdown = this.createAssessmentTypeDropdown();
        const assessmentDetailsTitle = this.createAssessmentDetailsTitle();
        const assessmentTypeContainer = this._view.modelBuilder.flexContainer()
            .withLayout({
            alignContent: 'center',
            alignItems: 'center',
        }).withProps({ CSSStyles: { 'margin-left': '10px' } })
            .component();
        assessmentTypeContainer.addItem(assessmentTypeTitle, { flex: '0' });
        assessmentTypeContainer.addItem(assessmentTypeDropdown, { flex: '0', CSSStyles: { 'margin-left': '5px' } });
        const titleContainer = this._view.modelBuilder
            .flexContainer()
            .withItems([])
            .withProps({
            CSSStyles: {
                "border-bottom": "solid 1px #C4C4C4",
            },
        })
            .component();
        titleContainer.addItem(assessmentTypeContainer, {
            flex: "0 0 auto",
        });
        titleContainer.addItem(assessmentDetailsTitle, {
            flex: "0 0 auto",
        });
        const container = this._view.modelBuilder
            .flexContainer()
            .withItems([titleContainer])
            .withLayout({
            flexFlow: "column",
        })
            .component();
        return container;
    }
    createAssessmentTypeTitle() {
        this._assessmentTypeTitle = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.ASSESSMENT_TYPE_LABEL,
            ariaLabel: constants.FINDINGS,
            CSSStyles: {
                ...styles.LABEL_CSS,
                margin: "0 8px 4px 0",
                width: "100px",
            },
        })
            .component();
        return this._assessmentTypeTitle;
    }
    createAssessmentTypeDropdown() {
        this._assessmentTypeDropdown = this._view.modelBuilder.dropDown()
            .withProps({
            ariaLabel: constants.MIGRATION_STATUS_FILTER,
            values: [constants.ASSESSMENT_TYPE_ALL,
                constants.ASSESSMENT_TYPE_SCHEMA,
                constants.ASSESSMENT_TYPE_FEATURES,
                constants.ASSESSMENT_TYPE_DATA],
            width: '80px',
            fireOnTextChange: true,
            value: constants.ASSESSMENT_TYPE_ALL,
        }).component();
        this._disposables.push(this._assessmentTypeDropdown.onValueChanged(async (value) => {
            this.resetButtons();
            this.resetFindingsData(this._currentdbName);
        }));
        return this._assessmentTypeDropdown;
    }
    createAssessmentDetailsTitle() {
        this._assessmentDetailstitle = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.ISSUES_DETAILS,
            ariaLabel: constants.ISSUES_DETAILS,
            CSSStyles: {
                ...styles.LABEL_CSS,
                padding: "0 0 0 20px",
                width: "200px",
                "border-left": "1px solid #CECECE",
                height: "101%",
            },
        })
            .component();
        return this._assessmentDetailstitle;
    }
    createBottomContainer() {
        this._blockingIssuesTable = this.createBlockingIssuesTable();
        this._warningIssuesTable = this.createWarningIssuesTable();
        this._informationalIssuesTable = this.createInformationalIssuesTable();
        this._serverSummaryContainer = this.createServerSummaryComponent();
        this._assessmentDetailsContainer = this.createAssessmentContainer();
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({
            flexFlow: "row",
            height: "100%",
        })
            .withProps({
            CSSStyles: {
                height: "100%",
            },
        })
            .component();
        this._allAssessmentListContainer = this._view.modelBuilder
            .flexContainer()
            .withLayout({
            flexFlow: "column",
            width: "209px",
            height: "100%",
        })
            .withProps({
            CSSStyles: {
                "border-right": "1px solid #CECECE",
                "overflow-y": "scroll",
            },
        })
            .component();
        this._serverSummaryHeadingButton = this._view.modelBuilder
            .button()
            .withProps({
            label: constants.SUMMARY,
            ariaLabel: constants.SUMMARY,
            buttonType: azdata.ButtonType.Normal,
            height: 24,
            width: 90,
            iconHeight: 8,
            iconWidth: 8,
            iconPath: iconPathHelper_1.IconPathHelper.noIcon,
            CSSStyles: {
                ...styles.LABEL_CSS,
                "text-align": "left",
                margin: "5px 0 0 15px",
            },
        })
            .component();
        this._allAssessmentListContainer.addItem(this._serverSummaryHeadingButton, {
            flex: "0 0 auto",
            order: 0,
            CSSStyles: { border: "0", color: "#000000", width: "70px" },
        });
        this._serverSummaryHeadingButton.onDidClick(async () => {
            this.resetButtons();
            this.serverSummaryHeadingButtonAction();
        });
        this._blockingIssuesHeadingButton = this._view.modelBuilder
            .button()
            .withProps({
            label: constants.BLOCKING_ISSUES_HEADING_WITH_COUNT(0),
            ariaLabel: constants.BLOCKING_ISSUES_HEADING_WITH_COUNT(0),
            buttonType: azdata.ButtonType.Normal,
            height: 24,
            iconHeight: 8,
            iconWidth: 8,
            iconPath: iconPathHelper_1.IconPathHelper.expandButtonClosed,
            CSSStyles: {
                ...styles.LABEL_CSS,
                "text-align": "left",
                margin: "4px 0 5px 5px",
            },
        })
            .component();
        this._allAssessmentListContainer.addItem(this._blockingIssuesHeadingButton, {
            flex: "0 0 auto",
            order: 1,
            CSSStyles: {
                border: "0",
                color: "#000000",
                width: "140px",
                "margin-bottom": "5px",
            },
        });
        this._blockingIssuesHeadingButton.onDidClick(async () => {
            const assessments = this._currentdbName != none
                ? this._blockingIssuesDbAssessmentsMap.get(this._currentdbName)
                : this._blockingIssuesAssessmentsData;
            if (this._blockingIssuesAssessmentsList.options.length > 0 && !this._isBlockingIssuesOpen) {
                this._blockingIssuesHeadingButton.iconPath =
                    iconPathHelper_1.IconPathHelper.expandButtonOpen;
                this._blockingIssuesHeadingButton.ariaLabel = constants.EXPANDED +
                    constants.BLOCKING_ISSUES_HEADING_WITH_COUNT(assessments.length);
                this._isBlockingIssuesOpen = true;
                this._allAssessmentListContainer.addItem(this._blockingIssuesTable, { flex: "0 0 auto", order: 2, CSSStyles: { "margin-left": "22px" } });
                this._bottomContainer.removeItem(this._serverSummaryContainer);
                this._bottomContainer.addItem(this._assessmentDetailsContainer);
                this._blockingIssuesAssessmentsList.selectedOptionId = this._blockingIssuesAssessmentsList.options[0].id;
            }
            else {
                this.resetBlockingIssuesButton(assessments.length);
            }
        });
        this._warningIssuesHeadingButton = this._view.modelBuilder
            .button()
            .withProps({
            label: constants.WARNING_ISSUES_HEADING_WITH_COUNT(0),
            ariaLabel: constants.WARNING_ISSUES_HEADING_WITH_COUNT(0),
            buttonType: azdata.ButtonType.Normal,
            height: 24,
            iconHeight: 8,
            iconWidth: 8,
            iconPath: iconPathHelper_1.IconPathHelper.expandButtonClosed,
            CSSStyles: {
                ...styles.LABEL_CSS,
                "text-align": "left",
                margin: "4px 0 5px 5px",
            },
        })
            .component();
        this._allAssessmentListContainer.addItem(this._warningIssuesHeadingButton, {
            flex: "0 0 auto",
            order: 3,
            CSSStyles: { border: "0", color: "#000000", width: "140px" },
        });
        this._warningIssuesHeadingButton.onDidClick(async () => {
            const assessments = this._currentdbName != none
                ? this._warningIssuesDbAssessmentsMap.get(this._currentdbName)
                : this._warningIssuesAssessmentsData;
            if (this._warningIssuesAssessmentsList.options.length > 0 && !this._isWarningIssuesOpen) {
                this._warningIssuesHeadingButton.iconPath =
                    iconPathHelper_1.IconPathHelper.expandButtonOpen;
                this._warningIssuesHeadingButton.ariaLabel = constants.EXPANDED +
                    constants.WARNING_ISSUES_HEADING_WITH_COUNT(assessments.length);
                this._isWarningIssuesOpen = true;
                this._allAssessmentListContainer.addItem(this._warningIssuesTable, {
                    flex: "0 0 auto",
                    order: 4,
                    CSSStyles: { "margin-left": "22px" },
                });
                this._bottomContainer.removeItem(this._serverSummaryContainer);
                this._bottomContainer.addItem(this._assessmentDetailsContainer);
                this._warningIssuesAssessmentsList.selectedOptionId = this._warningIssuesAssessmentsList.options[0].id;
            }
            else {
                this.resetWarningIssuesButton(assessments.length);
            }
        });
        this._informationalIssuesHeadingButton = this._view.modelBuilder
            .button()
            .withProps({
            label: constants.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT(0),
            ariaLabel: constants.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT(0),
            buttonType: azdata.ButtonType.Normal,
            height: 24,
            iconHeight: 8,
            iconWidth: 8,
            iconPath: iconPathHelper_1.IconPathHelper.expandButtonClosed,
            CSSStyles: {
                ...styles.LABEL_CSS,
                "text-align": "left",
                margin: "4px 0 5px 5px",
            },
        })
            .component();
        this._allAssessmentListContainer.addItem(this._informationalIssuesHeadingButton, {
            flex: "0 0 auto",
            order: 5,
            CSSStyles: { border: "0", color: "#000000", width: "165px" },
        });
        this._informationalIssuesHeadingButton.onDidClick(async () => {
            const assessments = this._currentdbName != none
                ? this._informationalIssuesDbAssessmentsMap.get(this._currentdbName)
                : this._informationalIssuesAssessmentsData;
            if (this._informationalIssuesAssessmentsList.options.length > 0 && !this._isInformationalIssuesOpen) {
                this._informationalIssuesHeadingButton.iconPath =
                    iconPathHelper_1.IconPathHelper.expandButtonOpen;
                this._informationalIssuesHeadingButton.ariaLabel = constants.EXPANDED +
                    constants.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT(assessments.length);
                this._isInformationalIssuesOpen = true;
                this._allAssessmentListContainer.addItem(this._informationalIssuesTable, {
                    flex: "0 0 auto",
                    order: 6,
                    CSSStyles: { "margin-left": "22px" },
                });
                this._bottomContainer.removeItem(this._serverSummaryContainer);
                this._bottomContainer.addItem(this._assessmentDetailsContainer);
                this._informationalIssuesAssessmentsList.selectedOptionId = this._informationalIssuesAssessmentsList.options[0].id;
            }
            else {
                this.resetInformationalIssuesButton(assessments.length);
            }
        });
        container.addItem(this._allAssessmentListContainer, {
            flex: "0 0 auto",
            CSSStyles: { "overflow-y": "auto", height: "100%" },
        });
        container.addItem(this._assessmentDetailsContainer, {
            flex: "0 0 auto",
            CSSStyles: { "overflow-y": "auto", height: "100%" },
        });
        container.addItem(this._serverSummaryContainer, {
            flex: "0 0 auto",
            CSSStyles: { "overflow-y": "auto", height: "100%" },
        });
        return container;
    }
    serverSummaryHeadingButtonAction() {
        this._bottomContainer.removeItem(this._assessmentDetailsContainer);
        this._allAssessmentListContainer.addItem(this._serverSummaryHeadingButton, {
            flex: "0 0 auto",
            order: 0,
            CSSStyles: { border: "0", color: "#000000", width: "70px" },
        });
        this._bottomContainer.addItem(this._serverSummaryContainer, {
            flex: "0 0 auto",
            CSSStyles: { height: "100%" },
        });
        this.refreshServerSummaryDetails();
    }
    async refreshServerSummaryDetails() {
        this._serverSummaryDescription.value =
            constants.ASSESSMENT_SUMMARY_DESCRIPTION(this._dbNames.length);
        this._assessedDatabaseValue.value = String(this._dbNames.length);
        this._readySummaryCount.value = "(" + String(this._dbReadyCount) + ")";
        this._notReadySummaryCount.value = "(" + String(this._dbNotReadyCount) + ")";
        this._readyWithConditionSummaryCount.value =
            "(" + String(this._dbReadyWithConditionsCount) + ")";
        this._totalIssuesFoundValue.value = String(this._totalAssessmentcount);
        this._serverSummaryBlockerCount.value = String(this._serverBlockerCount);
        this._serverSummaryWarningCount.value = String(this._serverWarningCount);
        this._serverSummaryInfoCount.value = String(this._serverInfoCount);
        this._notReadyBarImage.width = this.getNotReadyWidth();
        this._readyBarImage.width = this.getReadyWidth();
        this._readyWithConditionsBarImage.width = this.getReadyWithConditionWidth();
    }
    getReadyWidth() {
        return (this._dbReadyCount / this._dbNames.length) * 300 + 15; //Adding 15 px to show the minimum bar
    }
    getNotReadyWidth() {
        return (this._dbNotReadyCount / this._dbNames.length) * 300 + 15; //Adding 15 px to show the minimum bar
    }
    getReadyWithConditionWidth() {
        return (this._dbReadyWithConditionsCount / this._dbNames.length) * 300 + 15; //Adding 15 px to show the minimum bar
    }
    resetBlockingIssuesButton(assessmentCount = 0) {
        this._blockingIssuesHeadingButton.iconPath =
            iconPathHelper_1.IconPathHelper.expandButtonClosed;
        this._blockingIssuesHeadingButton.ariaLabel = constants.COLLAPSED +
            constants.BLOCKING_ISSUES_HEADING_WITH_COUNT(assessmentCount);
        this._isBlockingIssuesOpen = false;
        this._allAssessmentListContainer.removeItem(this._blockingIssuesTable);
        this._bottomContainer.removeItem(this._assessmentDetailsContainer);
    }
    resetWarningIssuesButton(assessmentCount = 0) {
        this._warningIssuesHeadingButton.iconPath =
            iconPathHelper_1.IconPathHelper.expandButtonClosed;
        this._warningIssuesHeadingButton.ariaLabel = constants.COLLAPSED +
            constants.WARNING_ISSUES_HEADING_WITH_COUNT(assessmentCount);
        this._isWarningIssuesOpen = false;
        this._allAssessmentListContainer.removeItem(this._warningIssuesTable);
        this._bottomContainer.removeItem(this._assessmentDetailsContainer);
    }
    resetInformationalIssuesButton(assessmentCount = 0) {
        this._informationalIssuesHeadingButton.iconPath =
            iconPathHelper_1.IconPathHelper.expandButtonClosed;
        this._informationalIssuesHeadingButton.ariaLabel = constants.COLLAPSED +
            constants.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT(assessmentCount);
        this._isInformationalIssuesOpen = false;
        this._allAssessmentListContainer.removeItem(this._informationalIssuesTable);
        this._bottomContainer.removeItem(this._assessmentDetailsContainer);
    }
    async refreshAssessmentDetails(selectedIssue) {
        this._assessmentTitle.value =
            selectedIssue?.description || this._notAvailable;
        this._assessmentSeverityText.value = constants.SEVERITY_WITH_PREFIX(selectedIssue?.assessmentSeverity || this._notAvailable);
        this._databaseNameText.value = constants.DATABASE_WITH_PREFIX(selectedIssue?.databaseName || this._notAvailable);
        this._collectionNameText.value = constants.COLLECTION_WITH_PREFIX(selectedIssue?.collectionName || this._notAvailable);
        this._descriptionText.value = selectedIssue?.message || this._notAvailable;
        this._additionalDetailsText.value =
            (selectedIssue?.additionalDetails !== "{}") ? selectedIssue?.additionalDetails : this._notAvailable;
        if (selectedIssue?.moreInfo && selectedIssue?.moreInfo.label) {
            this._moreInfo.updateProperties({
                "url": selectedIssue?.moreInfo.href,
                "label": selectedIssue?.moreInfo.label,
                "ariaLabel": constants.MORE_INFO_ANNOUNCEMENT(selectedIssue?.moreInfo.label)
            });
        }
        else {
            this._moreInfo.updateProperties({
                "url": '',
                "label": '',
                "ariaLabel": ''
            });
        }
    }
    resetButtons() {
        this.resetBlockingIssuesButton();
        this.resetWarningIssuesButton();
        this.resetInformationalIssuesButton();
    }
    createBlockingIssuesTable() {
        this._blockingIssuesAssessmentsList = this._view.modelBuilder.listView()
            .withProps({
            width: "165px",
            options: []
        }).component();
        this._disposables.push(this._blockingIssuesAssessmentsList.onDidClick(async (e) => {
            const assessments = this._currentdbName != none
                ? this._blockingIssuesDbAssessmentsMap.get(this._currentdbName)
                : this._blockingIssuesAssessmentsData;
            const selectedIssue = assessments[parseInt(this._blockingIssuesAssessmentsList.selectedOptionId)];
            this._bottomContainer.addItem(this._assessmentDetailsContainer);
            await this.refreshAssessmentDetails(selectedIssue);
        }));
        const container = this._view.modelBuilder
            .flexContainer()
            .withItems([this._blockingIssuesAssessmentsList])
            .withLayout({
            flexFlow: "column",
            height: "100%",
        })
            .withProps({ CSSStyles: {} })
            .component();
        return container;
    }
    createWarningIssuesTable() {
        this._warningIssuesAssessmentsList = this._view.modelBuilder.listView()
            .withProps({
            width: "165px",
            options: []
        }).component();
        this._disposables.push(this._warningIssuesAssessmentsList.onDidClick(async (e) => {
            const assessments = this._currentdbName != none
                ? this._warningIssuesDbAssessmentsMap.get(this._currentdbName)
                : this._warningIssuesAssessmentsData;
            const selectedIssue = assessments[parseInt(this._warningIssuesAssessmentsList.selectedOptionId)];
            this._bottomContainer.addItem(this._assessmentDetailsContainer);
            await this.refreshAssessmentDetails(selectedIssue);
        }));
        const container = this._view.modelBuilder
            .flexContainer()
            .withItems([this._warningIssuesAssessmentsList])
            .withLayout({
            flexFlow: "column",
            height: "100%",
        })
            .withProps({ CSSStyles: {} })
            .component();
        return container;
    }
    createInformationalIssuesTable() {
        this._informationalIssuesAssessmentsList = this._view.modelBuilder.listView()
            .withProps({
            width: "165px",
            options: []
        }).component();
        this._disposables.push(this._informationalIssuesAssessmentsList.onDidClick(async (e) => {
            const assessments = this._currentdbName != none
                ? this._informationalIssuesDbAssessmentsMap.get(this._currentdbName)
                : this._informationalIssuesAssessmentsData;
            const selectedIssue = assessments[parseInt(this._informationalIssuesAssessmentsList.selectedOptionId)];
            this._bottomContainer.addItem(this._assessmentDetailsContainer);
            await this.refreshAssessmentDetails(selectedIssue);
        }));
        const container = this._view.modelBuilder
            .flexContainer()
            .withItems([this._informationalIssuesAssessmentsList])
            .withLayout({
            flexFlow: "column",
            height: "100%",
        })
            .withProps({ CSSStyles: {} })
            .component();
        return container;
    }
    createServerSummaryComponent() {
        const summaryParentContainer = this._view.modelBuilder
            .flexContainer()
            .withProps({
            CSSStyles: {
                display: "flex",
                "flex-direction": "column",
            },
        })
            .component();
        const summaryContainer = this.createServerSummaryContainer();
        summaryParentContainer.addItem(summaryContainer);
        return summaryParentContainer;
    }
    createServerSummaryContainer() {
        const serverSummaryTitle = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.ASSESSMENT_SUMMARY,
            ariaLabel: constants.ASSESSMENT_SUMMARY,
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "12px",
                height: "10px",
                width: "540px",
                "font-size": "18px",
                "font-weight": "600",
            },
        })
            .component();
        this._serverSummaryDescription = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "12px",
                height: "25px",
                width: "540px",
                "border-bottom": "solid 1px #C4C4C4",
            },
        })
            .component();
        const readinessText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.MIGRATION_READINESS_HEADING,
            ariaLabel: constants.MIGRATION_READINESS_HEADING,
            CSSStyles: {
                ...styles.BODY_CSS,
                "font-size": "15px",
                "font-weight": "600",
            },
        })
            .component();
        const assessDatabaseContainer = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({ CSSStyles: { height: "100%" } })
            .component();
        this._assessedDatabaseText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.ASSESSED_DATABASES(),
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "5px",
                "font-weight": "600",
            },
        })
            .component();
        this._assessedDatabaseValue = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "5px",
                "font-weight": "600",
                "margin-left": "5px",
            },
        })
            .component();
        assessDatabaseContainer.addItem(this._assessedDatabaseText, {
            flex: "0 0 auto",
        });
        assessDatabaseContainer.addItem(this._assessedDatabaseValue, {
            flex: "1 1 auto",
        });
        const readyComponent = this.createReadyComponent();
        const readyWithConditionComponent = this.createReadyWithConditionComponent();
        const notReadyComponent = this.createNotReadyComponent();
        const serverIssueSummaryText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.SERVER_ISSUES_SUMMARY_TEXT,
            ariaLabel: constants.SERVER_ISSUES_SUMMARY_TEXT,
            CSSStyles: {
                ...styles.BODY_CSS,
                "font-size": "15px",
                "font-weight": "600",
                margin: "16px 0 10px 0",
            },
        })
            .component();
        const totalIssuesFoundContainer = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({ CSSStyles: { height: "100%" } })
            .component();
        const totalIssuesFoundText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.TOTAL_ISSUES_FOUND(),
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "0",
            },
        })
            .component();
        this._totalIssuesFoundValue = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "0",
                "font-weight": "600",
                "margin-left": "5px",
            },
        })
            .component();
        totalIssuesFoundContainer.addItem(totalIssuesFoundText, {
            flex: "0 0 auto",
        });
        totalIssuesFoundContainer.addItem(this._totalIssuesFoundValue, {
            flex: "1 1 auto",
        });
        const issueBySeverityHeading = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.ISSUE_BY_SEVERITY,
            ariaLabel: constants.ISSUE_BY_SEVERITY,
            CSSStyles: {
                ...styles.BODY_CSS,
                "font-weight": "600",
            },
        })
            .component();
        const issueBySeverityBlockerComponent = this.createIssueBySeverityBlockerComponent();
        const issueBySeverityWarningComponent = this.createIssueBySeverityWarningComponent();
        const issueBySeverityInfoComponent = this.createIssueBySeverityInfoComponent();
        const container = this._view.modelBuilder
            .flexContainer()
            .withItems([
            serverSummaryTitle,
            this._serverSummaryDescription,
            readinessText,
            assessDatabaseContainer,
            notReadyComponent,
            readyWithConditionComponent,
            readyComponent,
            serverIssueSummaryText,
            totalIssuesFoundContainer,
            issueBySeverityHeading,
            issueBySeverityBlockerComponent,
            issueBySeverityWarningComponent,
            issueBySeverityInfoComponent,
        ])
            .withLayout({ flexFlow: "column", height: "100%" })
            .withProps({ CSSStyles: { "margin-left": "24px", height: "100%" } })
            .component();
        return container;
    }
    createIssueBySeverityBlockerComponent() {
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({ CSSStyles: { "margin-left": "24px", height: "100%" } })
            .component();
        container.addItem(this.createBlockerImage(), { flex: "0 0 auto" });
        const serverSummaryBlockerText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.BLOCKING_ISSUE_TEXT(),
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "2px",
            },
        })
            .component();
        this._serverSummaryBlockerCount = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.LABEL_CSS,
                "margin-top": "2px",
                "font-weight": "600",
                "margin-left": "5px",
            },
        })
            .component();
        container.addItem(serverSummaryBlockerText, { flex: "0 0 auto" });
        container.addItem(this._serverSummaryBlockerCount, { flex: "1 1 auto" });
        return container;
    }
    createBlockerImage() {
        const component = this._view.modelBuilder
            .image()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.error,
            iconHeight: 12,
            iconWidth: 12,
            width: 20,
            height: 26,
        })
            .withProps({
            CSSStyles: {
                "background-position": "0",
            },
        })
            .component();
        return component;
    }
    createIssueBySeverityWarningComponent() {
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({ CSSStyles: { "margin-left": "24px", height: "100%" } })
            .component();
        container.addItem(this.createWarningImage(), { flex: "0 0 auto" });
        const serverSummaryWarningText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.WARNING_ISSUE_TEXT(),
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "2px",
            },
        })
            .component();
        this._serverSummaryWarningCount = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "2px",
                "font-weight": "600",
                "margin-left": "5px",
            },
        })
            .component();
        container.addItem(serverSummaryWarningText, { flex: "0 0 auto" });
        container.addItem(this._serverSummaryWarningCount, { flex: "1 1 auto" });
        return container;
    }
    createWarningImage() {
        const component = this._view.modelBuilder
            .image()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.warning,
            iconHeight: 12,
            iconWidth: 12,
            width: 20,
            height: 26,
        })
            .withProps({
            CSSStyles: {
                "background-position": "0",
            },
        })
            .component();
        return component;
    }
    createIssueBySeverityInfoComponent() {
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({ CSSStyles: { "margin-left": "24px", height: "100%" } })
            .component();
        container.addItem(this.createInfoImage(), { flex: "0 0 auto" });
        const serverSummaryInfoText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.INFO_TEXT(),
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "2px",
            },
        })
            .component();
        this._serverSummaryInfoCount = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "2px",
                "font-weight": "600",
                "margin-left": "5px",
            },
        })
            .component();
        container.addItem(serverSummaryInfoText, { flex: "0 0 auto" });
        container.addItem(this._serverSummaryInfoCount, { flex: "1 1 auto" });
        return container;
    }
    createInfoImage() {
        const component = this._view.modelBuilder
            .image()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.info,
            iconHeight: 12,
            iconWidth: 12,
            width: 20,
            height: 26,
        })
            .withProps({
            CSSStyles: {
                "background-position": "0",
            },
        })
            .component();
        return component;
    }
    createReadyComponent() {
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({
            CSSStyles: {
                "margin-left": "24px",
                height: "100%",
                "line-height": "30px",
            },
        })
            .component();
        const readyText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.READY_TEXT(),
            width: 59,
            CSSStyles: {
                ...styles.BODY_CSS,
                margin: "5px 0 4px",
            },
        })
            .component();
        this._readySummaryCount = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            width: 59,
            CSSStyles: {
                ...styles.BODY_CSS,
                margin: "5px 0 4px",
            },
        })
            .component();
        container.addItem(readyText, { flex: "0 0 auto" });
        container.addItem(this._readySummaryCount, {
            flex: "0 0 auto",
            CSSStyles: {
                width: "125px",
            },
        });
        container.addItem(this.createReadyImage(), {
            flex: "2 2 auto",
        });
        return container;
    }
    createReadyImage() {
        this._readyBarImage = this._view.modelBuilder
            .image()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.migrationReady,
            iconHeight: 300,
            iconWidth: 300,
            width: 1,
            height: 25,
        })
            .withProps({
            CSSStyles: {
                "background-position": "0",
                "margin-top": "3px",
                "border-left": "1px solid #CECECE",
            },
        })
            .component();
        return this._readyBarImage;
    }
    createReadyWithConditionComponent() {
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({
            CSSStyles: {
                "margin-left": "24px",
                height: "100%",
                "line-height": "30px",
            },
        })
            .component();
        const readyWithConditionSummaryText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.READY_WITH_CONDITION(),
            width: 150,
            CSSStyles: {
                ...styles.BODY_CSS,
                margin: "5px 0 4px",
            },
        })
            .component();
        this._readyWithConditionSummaryCount = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            width: 150,
            CSSStyles: {
                ...styles.BODY_CSS,
                margin: "5px 0 4px",
            },
        })
            .component();
        container.addItem(readyWithConditionSummaryText, { flex: "0 0 auto" });
        container.addItem(this._readyWithConditionSummaryCount, {
            flex: "0 0 auto",
            CSSStyles: {
                width: "34px",
            },
        });
        container.addItem(this.createReadyWithConditionImage(), {
            flex: "2 2 auto",
        });
        return container;
    }
    createReadyWithConditionImage() {
        this._readyWithConditionsBarImage = this._view.modelBuilder
            .image()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.readyWithCondition,
            iconHeight: 300,
            iconWidth: 300,
            width: 1,
            height: 25,
        })
            .withProps({
            CSSStyles: {
                "background-position": "0",
                "margin-top": "3px",
                "border-left": "1px solid #CECECE",
            },
        })
            .component();
        return this._readyWithConditionsBarImage;
    }
    createNotReadyComponent() {
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({
            CSSStyles: {
                "margin-left": "24px",
                height: "100%",
                "line-height": "30px",
            },
        })
            .component();
        const notReadySummaryText = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.NOT_READY(),
            width: 84,
            CSSStyles: {
                ...styles.BODY_CSS,
                margin: "5px 0 4px",
            },
        })
            .component();
        this._notReadySummaryCount = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            width: 84,
            CSSStyles: {
                ...styles.BODY_CSS,
                margin: "5px 0 4px",
            },
        })
            .component();
        container.addItem(notReadySummaryText, { flex: "0 0 auto" });
        container.addItem(this._notReadySummaryCount, {
            flex: "0 0 auto",
            CSSStyles: {
                width: "100px",
            },
        });
        container.addItem(this.createNotReadyImage(), { flex: "2 2 auto" });
        return container;
    }
    createNotReadyImage() {
        this._notReadyBarImage = this._view.modelBuilder
            .image()
            .withProps({
            iconPath: iconPathHelper_1.IconPathHelper.notReady,
            iconHeight: 300,
            iconWidth: 300,
            width: 1,
            height: 25,
        })
            .withProps({
            CSSStyles: {
                "background-position": "0",
                "margin-top": "3px",
                "border-left": "1px solid #CECECE",
            },
        })
            .component();
        return this._notReadyBarImage;
    }
    createAssessmentContainer() {
        const title = this.createAssessmentTitle();
        const featureSeverityText = this.createAssessmentSeverityText();
        const databaseNameText = this.createDatabaseNameText();
        const collectionNameText = this.createCollecionNameText();
        const bottomContainer = this.createDescriptionContainer();
        const container = this._view.modelBuilder
            .flexContainer()
            .withItems([title, featureSeverityText, databaseNameText, collectionNameText])
            .withLayout({ flexFlow: "column", height: "100%" })
            .withProps({ CSSStyles: { "margin-left": "24px", height: "100%" } })
            .component();
        container.addItem(bottomContainer, {
            flex: "0 0 auto",
            CSSStyles: { height: "100%", flexFlow: "column" },
        });
        return container;
    }
    createAssessmentTitle() {
        this._assessmentTitle = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.LABEL_CSS,
                "margin-top": "12px",
                height: "10px",
                width: "540px",
            },
        })
            .component();
        return this._assessmentTitle;
    }
    createAssessmentSeverityText() {
        this._assessmentSeverityText = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "12px",
                height: "25px",
                width: "540px",
                "border-bottom": "solid 1px #C4C4C4",
            },
        })
            .component();
        return this._assessmentSeverityText;
    }
    createDatabaseNameText() {
        this._databaseNameText = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "12px",
                height: "25px",
                width: "540px",
                "border-bottom": "solid 1px #C4C4C4",
            },
        })
            .component();
        return this._databaseNameText;
    }
    createCollecionNameText() {
        this._collectionNameText = this._view.modelBuilder
            .text()
            .withProps({
            value: "",
            CSSStyles: {
                ...styles.BODY_CSS,
                "margin-top": "12px",
                height: "25px",
                width: "540px",
                "border-bottom": "solid 1px #C4C4C4",
            },
        })
            .component();
        return this._collectionNameText;
    }
    createDescriptionContainer() {
        const description = this.createDescription();
        const container = this._view.modelBuilder
            .flexContainer()
            .withLayout({ flexFlow: "row", height: "100%" })
            .withProps({ CSSStyles: { height: "100%" } })
            .component();
        container.addItem(description, {
            flex: "0 0 auto",
            CSSStyles: {
                width: "530px",
                height: "calc(100% - 65px)",
                "overflow-y": "auto",
            },
        });
        return container;
    }
    createDescription() {
        const LABEL_CSS = {
            ...styles.LIGHT_LABEL_CSS,
            width: "200px",
            margin: "12px 0 0",
            "font-weight": "600",
        };
        const textStyle = {
            ...styles.BODY_CSS,
            width: "500px",
            "word-wrap": "break-word",
        };
        const descriptionTitle = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.DESCRIPTION,
            ariaLabel: constants.DESCRIPTION,
            CSSStyles: LABEL_CSS,
        })
            .component();
        this._descriptionText = this._view.modelBuilder
            .text()
            .withProps({
            CSSStyles: textStyle,
        })
            .component();
        const additionalDetailsTitle = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.ADDITIONAL_DETAILS,
            ariaLabel: constants.ADDITIONAL_DETAILS,
            CSSStyles: LABEL_CSS,
        })
            .component();
        this._additionalDetailsText = this._view.modelBuilder
            .text()
            .withProps({
            CSSStyles: textStyle,
        })
            .component();
        const moreInfo = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.MORE_INFO,
            CSSStyles: LABEL_CSS,
        })
            .component();
        this._moreInfo = this._view.modelBuilder
            .hyperlink()
            .withProps({
            label: "",
            url: "",
            CSSStyles: textStyle,
            ariaLabel: constants.MORE_INFO,
            showLinkIcon: true,
        })
            .component();
        const container = this._view.modelBuilder
            .flexContainer()
            .withItems([
            descriptionTitle,
            this._descriptionText,
            additionalDetailsTitle,
            this._additionalDetailsText,
            moreInfo,
            this._moreInfo,
        ])
            .withLayout({ flexFlow: "column" })
            .component();
        return container;
    }
    async initializeData(assessmentId, assessmentName, connectionProfile) {
        let instanceTableValues = [];
        this._databaseTableValues = [];
        this._dbNames = [];
        const serverName = (await azdata.connection.getCurrentConnection())
            .serverName;
        const allAssessments = (await (0, extension_1.getCombinedAssessmentReport)(assessmentId, assessmentName, connectionProfile)).body.assessments;
        this._blockingIssuesAssessmentsData = this.getAssessmentsForSeverity(allAssessments, critical);
        this._warningIssuesAssessmentsData = this.getAssessmentsForSeverity(allAssessments, warning);
        this._informationalIssuesAssessmentsData = this.getAssessmentsForSeverity(allAssessments, informational);
        const instanceSummary = await (0, extension_1.getInstanceSummary)(assessmentId, assessmentName, connectionProfile);
        this._totalAssessmentcount = allAssessments.length;
        this._serverBlockerCount = this._blockingIssuesAssessmentsData.length;
        this._serverWarningCount = this._warningIssuesAssessmentsData.length;
        this._serverInfoCount = this._informationalIssuesAssessmentsData.length;
        instanceTableValues = [
            [
                {
                    value: serverName,
                    style: styles_1.styleLeft,
                },
                {
                    value: this._totalAssessmentcount,
                    style: styles_1.styleRight,
                },
            ],
        ];
        instanceSummary.body.databaseSummary.forEach((databaseSummary) => {
            this._dbNames.push(databaseSummary.databaseName);
        });
        this._dbNames.forEach((dbName) => {
            let dbAssessmentCount = 0;
            const blockingAssessments = this.getAssessmentsForDb(this._blockingIssuesAssessmentsData, dbName);
            this._blockingIssuesDbAssessmentsMap.set(dbName, blockingAssessments);
            dbAssessmentCount += blockingAssessments.length;
            const warningAssessments = this.getAssessmentsForDb(this._warningIssuesAssessmentsData, dbName);
            this._warningIssuesDbAssessmentsMap.set(dbName, warningAssessments);
            dbAssessmentCount += warningAssessments.length;
            const informationalAssessments = this.getAssessmentsForDb(this._informationalIssuesAssessmentsData, dbName);
            this._informationalIssuesDbAssessmentsMap.set(dbName, informationalAssessments);
            dbAssessmentCount += informationalAssessments.length;
            this.calculateDbReadinessCount(blockingAssessments
                .concat(warningAssessments)
                .concat(informationalAssessments));
            this._databaseTableValues.push([
                {
                    value: false,
                    style: styles_1.styleLeft,
                },
                {
                    value: dbName,
                    style: styles_1.styleLeft,
                },
                {
                    value: dbAssessmentCount,
                    style: styles_1.styleRight,
                },
            ]);
        });
        await this._databaseTable.setDataValues(this._databaseTableValues);
        await this._instanceTable.setDataValues(instanceTableValues);
        this.onInstanceSelect();
    }
    calculateDbReadinessCount(assessments) {
        let criticalCount = 0;
        let warningCount = 0;
        assessments.forEach((assessment) => {
            if (assessment.assessmentSeverity === critical) {
                criticalCount++;
            }
            else if (assessment.assessmentSeverity === warning) {
                warningCount++;
            }
        });
        if (criticalCount > 0) {
            this._dbNotReadyCount++;
        }
        else if (warningCount > 0) {
            this._dbReadyWithConditionsCount++;
        }
        else {
            this._dbReadyCount++;
        }
    }
    calculateServerIssuesCount(assessments) {
        assessments.forEach((assessment) => {
            if (assessment.assessmentSeverity === critical) {
                this._serverBlockerCount++;
            }
            else if (assessment.assessmentSeverity === warning) {
                this._serverWarningCount++;
            }
            else {
                this._serverInfoCount++;
            }
        });
    }
    getListViewOption(assessment, id) {
        return {
            alwaysShowTabs: true,
            id: id,
            label: assessment.description,
            icon: assessment.assessmentSeverity === warning
                ? iconPathHelper_1.IconPathHelper.warning
                : assessment.assessmentSeverity === critical
                    ? iconPathHelper_1.IconPathHelper.error
                    : iconPathHelper_1.IconPathHelper.info,
        };
    }
    getListViewOptions(assessments) {
        const filteredListViewOptions = [];
        switch (this._assessmentTypeDropdown.value) {
            case constants.ASSESSMENT_TYPE_ALL:
                {
                    for (let i = 0; i < assessments.length; i++) {
                        filteredListViewOptions.push(this.getListViewOption(assessments[i], i.toString()));
                    }
                    break;
                }
            case constants.ASSESSMENT_TYPE_SCHEMA:
                {
                    for (let i = 0; i < assessments.length; i++) {
                        if (assessments[i].assessmentCategory !== featuresAssessmentCategory && assessments[i].assessmentCategory !== dataAssessmentCategory) {
                            filteredListViewOptions.push(this.getListViewOption(assessments[i], i.toString()));
                        }
                    }
                    break;
                }
            case constants.ASSESSMENT_TYPE_FEATURES:
                {
                    for (let i = 0; i < assessments.length; i++) {
                        if (assessments[i].assessmentCategory === featuresAssessmentCategory) {
                            filteredListViewOptions.push(this.getListViewOption(assessments[i], i.toString()));
                        }
                    }
                    break;
                }
            case constants.ASSESSMENT_TYPE_DATA:
                {
                    for (let i = 0; i < assessments.length; i++) {
                        if (assessments[i].assessmentCategory === dataAssessmentCategory) {
                            filteredListViewOptions.push(this.getListViewOption(assessments[i], i.toString()));
                        }
                    }
                    break;
                }
        }
        return filteredListViewOptions;
    }
    resetFindingsData(databaseName) {
        const blockingIssuesAssessments = databaseName != none
            ? this._blockingIssuesDbAssessmentsMap.get(databaseName)
            : this._blockingIssuesAssessmentsData;
        const blockingIssuesListView = this.getListViewOptions(blockingIssuesAssessments);
        this._blockingIssuesAssessmentsList.options = blockingIssuesListView;
        this._blockingIssuesHeadingButton.label =
            constants.BLOCKING_ISSUES_HEADING_WITH_COUNT(blockingIssuesListView.length);
        this._blockingIssuesHeadingButton.ariaLabel =
            constants +
                constants.BLOCKING_ISSUES_HEADING_WITH_COUNT(blockingIssuesListView.length);
        this._blockingIssuesAssessmentsList.selectedOptionId = blockingIssuesListView.length > 0 ? blockingIssuesListView[0].id : "0";
        const warningIssuesAssessments = databaseName != none
            ? this._warningIssuesDbAssessmentsMap.get(databaseName)
            : this._warningIssuesAssessmentsData;
        const warningIssuesListView = this.getListViewOptions(warningIssuesAssessments);
        this._warningIssuesAssessmentsList.options = warningIssuesListView;
        this._warningIssuesHeadingButton.label =
            constants.WARNING_ISSUES_HEADING_WITH_COUNT(warningIssuesListView.length);
        this._warningIssuesHeadingButton.ariaLabel =
            constants.COLLAPSED +
                constants.WARNING_ISSUES_HEADING_WITH_COUNT(warningIssuesListView.length);
        this._warningIssuesAssessmentsList.selectedOptionId = warningIssuesListView.length > 0 ? warningIssuesListView[0].id : "0";
        const informationalIssuesAssessments = databaseName != none
            ? this._informationalIssuesDbAssessmentsMap.get(databaseName)
            : this._informationalIssuesAssessmentsData;
        const informationalIssuesListView = this.getListViewOptions(informationalIssuesAssessments);
        this._informationalIssuesAssessmentsList.options = informationalIssuesListView;
        this._informationalIssuesHeadingButton.label =
            constants.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT(informationalIssuesListView.length);
        this._informationalIssuesHeadingButton.ariaLabel =
            constants.COLLAPSED +
                constants.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT(informationalIssuesListView.length);
        this._informationalIssuesAssessmentsList.selectedOptionId = informationalIssuesListView.length > 0 ? informationalIssuesListView[0].id : "0";
        if (databaseName === none) {
            this.serverSummaryHeadingButtonAction();
        }
    }
    getAssessmentsForDb(assessments, databaseName) {
        return assessments.filter((assessment) => {
            return assessment.databaseName === databaseName;
        });
    }
    getAssessmentsForSeverity(assessments, severity) {
        return assessments.filter((assessment) => {
            return assessment.assessmentSeverity === severity;
        });
    }
    createSearchComponent() {
        const searchBoxLabel = this._view.modelBuilder
            .text()
            .withProps({
            value: constants.SEARCH_FILTER,
            ariaLabel: constants.SEARCH_FILTER,
            CSSStyles: {
                ...styles.SMALL_BODY_CSS,
                margin: "0 8px 2px 0",
                width: "100px",
            },
        })
            .component();
        const resourceSearchBox = this._view.modelBuilder
            .inputBox()
            .withProps({
            stopEnterPropagation: true,
            placeHolder: constants.SEARCH_FILTER,
            width: 240,
        })
            .component();
        this._disposables.push(resourceSearchBox.onTextChanged((value) => this._filterTableList(value)));
        const searchContainer = this._view.modelBuilder
            .divContainer()
            .withItems([searchBoxLabel, resourceSearchBox])
            .withProps({
            CSSStyles: {
                margin: "15px 15px 15px 15px",
            },
        })
            .component();
        return searchContainer;
    }
    _filterTableList(value) {
        const databaseNameColumnIndex = 1;
        if (this._databaseTableValues && value?.length > 0) {
            const filter = [];
            this._databaseTableValues.forEach((row, index) => {
                const text = row[databaseNameColumnIndex]?.value;
                const cellText = text?.toLowerCase();
                const searchText = value?.toLowerCase();
                if (cellText?.includes(searchText)) {
                    filter.push(index);
                }
            });
            this._databaseTable.setFilter(filter);
        }
        else {
            this._databaseTable.setFilter(undefined);
        }
    }
    createInstanceComponent() {
        this._instanceTable = this._view.modelBuilder
            .declarativeTable()
            .withProps({
            ariaLabel: constants.MONGO_SERVER_INSTANCE,
            enableRowSelection: true,
            width: 220,
            CSSStyles: {
                "table-layout": "fixed",
                cursor: "pointer",
            },
            columns: [
                {
                    displayName: constants.INSTANCE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 160,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                },
                {
                    displayName: constants.FINDINGS,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 60,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerRight,
                },
            ],
        })
            .component();
        const instanceContainer = this._view.modelBuilder
            .divContainer()
            .withItems([this._instanceTable])
            .withProps({
            CSSStyles: {
                margin: "10px 15px 0px 15px",
            },
        })
            .component();
        this._disposables.push(this._instanceTable.onRowSelected((e) => {
            this.onInstanceSelect();
        }));
        return instanceContainer;
    }
    onInstanceSelect() {
        this._currentdbName = none;
        this.resetButtons();
        this.resetFindingsData(none);
    }
    createDatabaseComponent() {
        this._databaseTable = this._view.modelBuilder
            .declarativeTable()
            .withProps({
            ariaLabel: constants.DATABASES_TABLE_TILE,
            enableRowSelection: true,
            width: 230,
            CSSStyles: {
                "table-layout": "fixed",
                cursor: "pointer",
            },
            columns: [
                {
                    displayName: '',
                    valueType: azdata.DeclarativeDataType.boolean,
                    width: 20,
                    isReadOnly: false,
                    showCheckAll: true,
                    headerCssStyles: styles_1.headerLeft,
                },
                {
                    displayName: constants.DATABASE,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 160,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerLeft,
                },
                {
                    displayName: constants.FINDINGS,
                    valueType: azdata.DeclarativeDataType.string,
                    width: 60,
                    isReadOnly: true,
                    headerCssStyles: styles_1.headerRight,
                },
            ],
        })
            .component();
        this._disposables.push(this._databaseTable.onRowSelected(async (e) => {
            this._currentdbName = this._dbNames[e.row];
            this.resetButtons();
            this._allAssessmentListContainer.removeItem(this._serverSummaryHeadingButton);
            this._bottomContainer.removeItem(this._serverSummaryContainer);
            this.resetFindingsData(this._currentdbName);
        }));
        const tableContainer = this._view.modelBuilder
            .divContainer()
            .withItems([this._databaseTable])
            .withProps({
            width: "100%",
            CSSStyles: {
                margin: "0px 15px 0px 15px",
            },
        })
            .component();
        return tableContainer;
    }
    selectedDbs() {
        const result = [];
        this._databaseTable?.dataValues?.forEach((arr, index) => {
            if (arr[0].value === true) {
                result.push(this._dbNames[index]);
            }
        });
        return result;
    }
    publishSelectedDbStats(telemetryProps) {
        const telemetryMeasures = {};
        telemetryMeasures[telemetry_1.TelemetryMeasureNames.TotalDatabaseCount] = this._dbNames.length;
        telemetryMeasures[telemetry_1.TelemetryMeasureNames.SelectedDatabaseCount] = this.selectedDbs().length;
        (0, telemetry_1.logTelemetry)(telemetry_1.TelemetryViews.ViewAssessmentResultsPage, telemetry_1.TelemetryAction.AssessmentDetailsInfo, telemetryProps, telemetryMeasures);
    }
}
exports.AssessmentReport = AssessmentReport;
//# sourceMappingURL=assessmentReport.js.map