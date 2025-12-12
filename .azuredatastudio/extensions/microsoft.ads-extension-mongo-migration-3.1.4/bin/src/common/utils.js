"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStatusBar = exports.buildCosmosMongoConnectionString = exports.buildCosmosServerName = exports.parseMongoConnectionString = exports.formatNumber = exports.convertErrorCodeToVanityName = exports.detectAKAURLs = exports.suggestReportFile = exports.AssessmentProgressCommand = exports.openCalloutDialog = exports.stringCompare = exports.numberCompare = exports.getServiceNameFromAzureResourceId = exports.sanitizeDateString = exports.dateCompare = exports.formatDate = exports.getStatus = exports.sortAssessments = exports.isAutoRefreshRequired = exports.sortMigrations = exports.getDuration = exports.getAssessmentType = exports.getTargetPlatformText = exports.getAssesmentStatus = exports.getStatusIcon = exports.getStatusText = exports.getPackageInfo = exports.cssRow = exports.cssHeader = exports.assessmentNameMaxLength = void 0;
// +-----------------------------------------------------------------------------------
//  <copyright file=utils.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines common functions used in various files.
// ------------------------------------------------------------------------------------
const azdata = require("azdata");
const path = require("path");
const os = require("os");
const startAssessment_1 = require("../contracts/assessment/startAssessment");
const constants = require("../constants/strings");
const iconPathHelper_1 = require("../constants/iconPathHelper");
const extensionInfo_1 = require("../extensionInfo");
const common_1 = require("../contracts/common");
const mongodb_connection_string_url_1 = require("mongodb-connection-string-url");
const strings_1 = require("../constants/strings");
const DashboardStatusBar_1 = require("../dialogs/DashboardStatusBar");
const DefaultDateValue = '---';
exports.assessmentNameMaxLength = 16;
exports.cssHeader = {
    'border-bottom': '1px solid silver',
    'border-right': '1px dotted silver',
    'background-color': 'silver',
    'padding': '3px 5px',
    'white-space': 'normal',
    'text-align': 'left',
};
exports.cssRow = {
    'border-bottom': '1px solid silver',
    'border-right': '1px dotted silver',
    'padding': '3px 5px',
    'white-space': 'normal',
    'text-align': 'left',
    'word-wrap': 'break-word',
};
function getPackageInfo(packageJson) {
    if (packageJson) {
        return {
            name: packageJson.name,
            version: extensionInfo_1.ExtensionInfo.getInstance().getExtensionVersion(),
            aiKey: packageJson.aiKey,
            sessionId: extensionInfo_1.ExtensionInfo.getInstance().getSessionId()
        };
    }
    return undefined;
}
exports.getPackageInfo = getPackageInfo;
function getStatusText(status) {
    switch (status) {
        case startAssessment_1.AssessmentStatus.SUCCESS:
            return constants.COMPLETED;
        case startAssessment_1.AssessmentStatus.WAITING:
            return constants.WAITING;
        case startAssessment_1.AssessmentStatus.INPROGRESS:
            return constants.INPROGRESS;
        case startAssessment_1.AssessmentStatus.WARNING:
            return constants.WARNING;
        case startAssessment_1.AssessmentStatus.ABORTED:
            return constants.ABORTED;
        case startAssessment_1.AssessmentStatus.CANCELLED:
            return constants.CANCELED;
        default:
            return constants.FAILED;
    }
}
exports.getStatusText = getStatusText;
function getStatusIcon(status) {
    switch (status) {
        case startAssessment_1.AssessmentStatus.SUCCESS:
            return iconPathHelper_1.IconPathHelper.successStatus;
        case startAssessment_1.AssessmentStatus.WAITING:
            return iconPathHelper_1.IconPathHelper.waitingState;
        case startAssessment_1.AssessmentStatus.INPROGRESS:
            return iconPathHelper_1.IconPathHelper.inProgress;
        case startAssessment_1.AssessmentStatus.WARNING:
            return iconPathHelper_1.IconPathHelper.warning;
        case startAssessment_1.AssessmentStatus.ABORTED:
            return iconPathHelper_1.IconPathHelper.cancel;
        case startAssessment_1.AssessmentStatus.CANCELLED:
            return iconPathHelper_1.IconPathHelper.cancel;
        default:
            return iconPathHelper_1.IconPathHelper.error;
    }
}
exports.getStatusIcon = getStatusIcon;
function getAssesmentStatus(status, view) {
    const statusImageSize = 14;
    const imageCellStyles = { 'margin': '3px 3px 0 0', 'padding': '0' };
    const statusCellStyles = { 'margin': '0', 'padding': '0' };
    const iconText = view.modelBuilder
        .divContainer()
        .withItems([
        // stage status icon
        view.modelBuilder.image()
            .withProps({
            iconPath: getStatusIcon(status),
            iconHeight: statusImageSize,
            iconWidth: statusImageSize,
            height: statusImageSize,
            width: statusImageSize,
            CSSStyles: imageCellStyles
        })
            .component(),
        // stage status text
        view.modelBuilder.text().withProps({
            value: getStatusText(status),
            height: statusImageSize,
            CSSStyles: statusCellStyles,
        }).component()
    ])
        .withProps({ CSSStyles: statusCellStyles, display: 'inline-flex' })
        .component();
    return iconText;
}
exports.getAssesmentStatus = getAssesmentStatus;
function getTargetPlatformText(targetType) {
    switch (targetType) {
        case common_1.EnumTargetOffering.CosmosDBMongoRU:
            return constants.COSMOS_DB_MONGO_RU;
        case common_1.EnumTargetOffering.CosmosDBMongovCore:
            return constants.COSMOS_DB_MONGO_VCORE;
        default:
            return '';
    }
}
exports.getTargetPlatformText = getTargetPlatformText;
function getAssessmentType(assessmentType) {
    switch (assessmentType) {
        case common_1.EnumAssessmentType.CollectionOptions:
            return constants.COLLECTION_OPTIONS_ASSESSMENT_TYPE;
        case common_1.EnumAssessmentType.Features:
            return constants.FEATURE_ASSESSMENT_TYPE;
        case common_1.EnumAssessmentType.Index:
            return constants.INDEX_ASSESSMENT_TYPE;
        case common_1.EnumAssessmentType.LimitsAndQuotas:
            return constants.LIMITS_QUOTAS_ASSESSMENT_TYPE;
        case common_1.EnumAssessmentType.ShardKey:
            return constants.SHARD_KEY_ASSESSMENT_TYPE;
    }
}
exports.getAssessmentType = getAssessmentType;
function getDuration(time) {
    const timeComponents = time.split(":");
    const hours = timeComponents[0];
    const minutes = timeComponents[1];
    const seconds = timeComponents[2];
    return constants.HRS(parseInt(hours)) + " " + constants.MINUTE(parseInt(minutes)) +
        " " + constants.SEC(parseFloat(seconds));
}
exports.getDuration = getDuration;
function sortMigrations(migrations) {
    // latest migrations on top
    migrations.sort((r1, r2) => {
        if (r1.properties.startedOn < r2.properties.startedOn) {
            return 1;
        }
        if (r1.properties.startedOn > r2.properties.startedOn) {
            return -1;
        }
        return 0;
    });
    return migrations;
}
exports.sortMigrations = sortMigrations;
function isAutoRefreshRequired(migrations) {
    let autoRefresh = false;
    for (const r of migrations) {
        if (!(r.properties.migrationStatus === strings_1.MigrationState.Succeeded ||
            r.properties.migrationStatus === strings_1.MigrationState.Failed ||
            r.properties.migrationStatus === strings_1.MigrationState.Canceled)) {
            autoRefresh = true;
            break;
        }
    }
    return autoRefresh;
}
exports.isAutoRefreshRequired = isAutoRefreshRequired;
function sortAssessments(assessmentList) {
    // latest assessments on top
    assessmentList.sort((r1, r2) => {
        if (r1.startTime < r2.startTime) {
            return 1;
        }
        if (r1.startTime > r2.startTime) {
            return -1;
        }
        return 0;
    });
    return assessmentList;
}
exports.sortAssessments = sortAssessments;
function getStatus(status, view) {
    const statusImageSize = 14;
    const imageCellStyles = { 'margin': '3px 3px 0 0', 'padding': '0' };
    const statusCellStyles = { 'margin': '0', 'padding': '0' };
    const iconText = view.modelBuilder
        .divContainer()
        .withItems([
        // stage status icon
        view.modelBuilder.image()
            .withProps({
            iconPath: getStatusIcon(status),
            iconHeight: statusImageSize,
            iconWidth: statusImageSize,
            height: statusImageSize,
            width: statusImageSize,
            CSSStyles: imageCellStyles
        })
            .component(),
        // stage status text
        view.modelBuilder.text().withProps({
            value: getStatusText(status),
            height: statusImageSize,
            CSSStyles: statusCellStyles,
        }).component()
    ])
        .withProps({ CSSStyles: statusCellStyles, display: 'inline-flex' })
        .component();
    return iconText;
}
exports.getStatus = getStatus;
function formatDate(date) {
    const dateObj = new Date(date);
    return (dateObj === undefined || isNaN(dateObj.getTime()))
        ? DefaultDateValue
        : dateObj.toLocaleString([], { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}
exports.formatDate = formatDate;
function dateCompare(stringDate1, stringDate2, sortDir) {
    if (!stringDate1) {
        return sortDir;
    }
    else if (!stringDate2) {
        return -sortDir;
    }
    return new Date(stringDate1) > new Date(stringDate2) ? -sortDir : sortDir;
}
exports.dateCompare = dateCompare;
function sanitizeDateString(date) {
    return date.replace(/\//g, '-');
}
exports.sanitizeDateString = sanitizeDateString;
function getServiceNameFromAzureResourceId(resourceName) {
    return resourceName.split('/').pop() ?? "";
}
exports.getServiceNameFromAzureResourceId = getServiceNameFromAzureResourceId;
function numberCompare(number1, number2, sortDir) {
    if (!number1) {
        return sortDir;
    }
    else if (!number2) {
        return -sortDir;
    }
    return number1 > number2 ? -sortDir : sortDir;
}
exports.numberCompare = numberCompare;
function stringCompare(string1, string2, sortDir) {
    if (!string1) {
        return sortDir;
    }
    else if (!string2) {
        return -sortDir;
    }
    return string1.localeCompare(string2) * -sortDir;
}
exports.stringCompare = stringCompare;
function openCalloutDialog(dialogHeading, dialogName, calloutMessageText) {
    const dialog = azdata.window.createModelViewDialog(dialogHeading, dialogName, 288, 'callout', 'left', false, false, {
        xPos: 0,
        yPos: 0,
        width: 20,
        height: 20
    });
    const tab = azdata.window.createTab('');
    tab.registerContent(async (view) => {
        const messageTextComponent = view.modelBuilder.text().withProps({
            value: calloutMessageText,
        }).component();
        await view.initializeModel(messageTextComponent);
    });
    dialog.content = [tab];
    azdata.window.openDialog(dialog);
}
exports.openCalloutDialog = openCalloutDialog;
exports.AssessmentProgressCommand = 'mongo.migration.progress';
function suggestReportFile(date) {
    const fileName = `DatabaseAssessmentReport_${generateDefaultFileName(new Date(date))}.html`;
    return path.join(os.homedir(), fileName);
}
exports.suggestReportFile = suggestReportFile;
function generateDefaultFileName(resultDate) {
    return `${resultDate.toISOString().replace(/-/g, '').replace('T', '').replace(/:/g, '').split('.')[0]}`;
}
// Function to detect aka.ms links
function detectAKAURLs(message) {
    const urlRegex = /(aka.ms\/[^\s]+)/g;
    return message.match(urlRegex);
}
exports.detectAKAURLs = detectAKAURLs;
// Function to map error codes to their respective vanity names for aka.ms links
function convertErrorCodeToVanityName(errorCode) {
    const vanityName = errorCode.replace('-', '');
    vanityName.toUpperCase();
    return vanityName;
}
exports.convertErrorCodeToVanityName = convertErrorCodeToVanityName;
const _numberFormatterOneMinIntegers = new Intl.NumberFormat(undefined, {
    style: 'decimal',
    useGrouping: true,
    minimumIntegerDigits: 1,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});
function formatNumber(value) {
    return value >= 0
        ? _numberFormatterOneMinIntegers.format(value)
        : '';
}
exports.formatNumber = formatNumber;
const parseMongoConnectionString = (connectionString) => {
    const url = new mongodb_connection_string_url_1.default(connectionString);
    const hosts = url.hosts;
    if (!hosts || hosts.length < 1) {
        return undefined;
    }
    const username = url.username;
    let authenticationType = "SqlLogin";
    if (!username) {
        authenticationType = "Integrated";
    }
    return {
        options: {
            server: hosts.join(","),
            user: username,
            password: url.password,
            authenticationType,
            pathname: url.pathname,
            search: url.search,
            isServer: url.isSRV,
        },
    };
};
exports.parseMongoConnectionString = parseMongoConnectionString;
function buildCosmosServerName(host, isvCore) {
    return (isvCore) ? host + ".mongocluster.cosmos.azure.com" : host + "mongo.cosmos.azure.com";
}
exports.buildCosmosServerName = buildCosmosServerName;
function buildCosmosMongoConnectionString(server, isServer, user, password, pathname, search) {
    const url = new mongodb_connection_string_url_1.default(`mongodb${isServer ? "+srv" : ""}://placeholder`);
    url.hosts = server.split(",");
    url.username = user;
    url.password = password;
    url.pathname = pathname || "";
    url.search = search || "";
    // CosmosDB account need these parameters (hostname ends with cosmos.azure.com)
    if (server.match(/\.cosmos\.azure\.com(:[0-9]*)*$/g)) {
        if (!url.searchParams.get("retrywrites")) {
            url.searchParams.set("retrywrites", "false");
        }
        if (!url.searchParams.get("maxIdleTimeMS")) {
            url.searchParams.set("maxIdleTimeMS", "120000");
        }
        if (!isServer) {
            // always set this for RU based configs (not vCore)
            if (!url.searchParams.get("ssl") && !url.searchParams.get("tls")) {
                url.searchParams.set("ssl", "true");
            }
            if (!url.searchParams.get("replicaSet")) {
                url.searchParams.set("replicaSet", "globaldb");
            }
            if (!url.searchParams.get("appName")) {
                url.searchParams.set("appName", `@${user}@`);
            }
        }
        else {
            // only for vCore
            if (!url.searchParams.get("ssl") && !url.searchParams.get("tls")) {
                url.searchParams.set("tls", "true");
            }
            if (!url.searchParams.get("authMechanism")) {
                url.searchParams.set("authMechanism", "SCRAM-SHA-256");
            }
        }
    }
    return url.toString();
}
exports.buildCosmosMongoConnectionString = buildCosmosMongoConnectionString;
function createStatusBar(view, disposables, extensionContext, statusBarContainer) {
    const statusInfoBox = view.modelBuilder.infoBox()
        .withProps({
        style: 'error',
        text: '',
        clickableButtonAriaLabel: constants.VIEW_ERROR_DETAILS,
        announceText: true,
        isClickable: true,
        display: 'none',
        CSSStyles: { 'font-size': '14px', 'display': 'none', },
    }).component();
    const statusBar = new DashboardStatusBar_1.DashboardStatusBar(extensionContext, statusInfoBox);
    disposables.push(statusInfoBox.onDidClick(async (e) => await statusBar.openErrorDialog()));
    statusBarContainer.addItem(statusInfoBox);
    return statusBar;
}
exports.createStatusBar = createStatusBar;
//# sourceMappingURL=utils.js.map