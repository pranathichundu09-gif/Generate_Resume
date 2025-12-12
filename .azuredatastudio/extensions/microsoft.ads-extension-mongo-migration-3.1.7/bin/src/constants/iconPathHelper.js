"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=iconPathHelper.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines assessment path settings.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconPathHelper = void 0;
class IconPathHelper {
    static copy;
    static refresh;
    static mongoAssessmentLogo;
    static dashboardBackground;
    static cancel;
    static info;
    static delete;
    static error;
    static sendFeedback;
    static expandButtonClosed;
    static expandButtonOpen;
    static newSupportRequest;
    static blankCanvas;
    static completeCutover;
    static notebook;
    static supportRequest;
    static add;
    static successStatus;
    static waitingState;
    static download;
    static inProgress;
    static warning;
    static migrationReady;
    static notReady;
    static readyWithCondition;
    static migrationService;
    static noIcon;
    static setExtensionContext(context) {
        IconPathHelper.copy = {
            light: context.asAbsolutePath('images/copy.svg'),
            dark: context.asAbsolutePath('images/copy.svg')
        };
        IconPathHelper.add = {
            light: context.asAbsolutePath('images/add.svg'),
            dark: context.asAbsolutePath('images/add.svg')
        };
        IconPathHelper.refresh = {
            light: context.asAbsolutePath('images/refresh.svg'),
            dark: context.asAbsolutePath('images/refresh.svg')
        };
        IconPathHelper.dashboardBackground = {
            light: context.asAbsolutePath('images/mongoMigrationWatermark.svg'),
            dark: context.asAbsolutePath('images/mongoMigrationWatermark.svg')
        };
        IconPathHelper.mongoAssessmentLogo = {
            light: context.asAbsolutePath('images/mongoMigrationIcon.svg'),
            dark: context.asAbsolutePath('images/mongoMigrationIcon.svg')
        };
        IconPathHelper.cancel = {
            light: context.asAbsolutePath('images/cancel.svg'),
            dark: context.asAbsolutePath('images/cancel.svg')
        };
        IconPathHelper.info = {
            light: context.asAbsolutePath('images/info.svg'),
            dark: context.asAbsolutePath('images/info.svg')
        };
        IconPathHelper.delete = {
            light: context.asAbsolutePath('images/delete.svg'),
            dark: context.asAbsolutePath('images/delete.svg')
        };
        IconPathHelper.error = {
            light: context.asAbsolutePath('images/error.svg'),
            dark: context.asAbsolutePath('images/error.svg')
        };
        IconPathHelper.sendFeedback = {
            light: context.asAbsolutePath('images/sendFeedback.svg'),
            dark: context.asAbsolutePath('images/sendFeedback.svg')
        };
        IconPathHelper.expandButtonClosed = {
            light: context.asAbsolutePath('images/expandButtonClosedLight.svg'),
            dark: context.asAbsolutePath('images/expandButtonClosedDark.svg')
        };
        IconPathHelper.expandButtonOpen = {
            light: context.asAbsolutePath('images/expandButtonOpenLight.svg'),
            dark: context.asAbsolutePath('images/expandButtonOpenDark.svg')
        };
        IconPathHelper.newSupportRequest = {
            light: context.asAbsolutePath('images/newSupportRequest.svg'),
            dark: context.asAbsolutePath('images/newSupportRequest.svg')
        };
        IconPathHelper.blankCanvas = {
            light: context.asAbsolutePath('images/blankCanvas.svg'),
            dark: context.asAbsolutePath('images/blankCanvas.svg')
        };
        IconPathHelper.notebook = {
            light: context.asAbsolutePath('images/notebook.svg'),
            dark: context.asAbsolutePath('images/notebook.svg')
        };
        IconPathHelper.supportRequest = {
            light: context.asAbsolutePath('images/newSupportRequest.svg'),
            dark: context.asAbsolutePath('images/newSupportRequest.svg')
        };
        IconPathHelper.successStatus = {
            light: context.asAbsolutePath('images/successStatus.svg'),
            dark: context.asAbsolutePath('images/successStatus.svg')
        };
        IconPathHelper.waitingState = {
            light: context.asAbsolutePath('images/waitingState.svg'),
            dark: context.asAbsolutePath('images/waitingState.svg')
        };
        IconPathHelper.download = {
            light: context.asAbsolutePath('images/download.svg'),
            dark: context.asAbsolutePath('images/download.svg')
        };
        IconPathHelper.inProgress = {
            light: context.asAbsolutePath('images/inProgress.svg'),
            dark: context.asAbsolutePath('images/inProgress.svg')
        };
        IconPathHelper.warning = {
            light: context.asAbsolutePath('images/warning.svg'),
            dark: context.asAbsolutePath('images/warning.svg')
        };
        IconPathHelper.migrationReady = {
            light: context.asAbsolutePath('images/migrationReadyGreen.svg'),
            dark: context.asAbsolutePath('images/migrationReadyGreen.svg')
        };
        IconPathHelper.readyWithCondition = {
            light: context.asAbsolutePath('images/readyWithCondition.svg'),
            dark: context.asAbsolutePath('images/readyWithCondition.svg'),
        };
        IconPathHelper.notReady = {
            light: context.asAbsolutePath('images/notReady.svg'),
            dark: context.asAbsolutePath('images/notReady.svg'),
        };
        IconPathHelper.migrationService = {
            light: context.asAbsolutePath('images/migrationService.svg'),
            dark: context.asAbsolutePath('images/migrationService.svg')
        };
        IconPathHelper.noIcon = {
            light: context.asAbsolutePath('images/noIcon.svg'),
            dark: context.asAbsolutePath('images/noIcon.svg'),
        };
        IconPathHelper.completeCutover = {
            light: context.asAbsolutePath('images/completeCutover.svg'),
            dark: context.asAbsolutePath('images/completeCutover.svg')
        };
    }
}
exports.IconPathHelper = IconPathHelper;
//# sourceMappingURL=iconPathHelper.js.map