"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=telemetryNotification.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines contracts for telemetry notification call.
//
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.telemetryNotificationType = exports.TelemetryNotificationApi = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
//Defines a notification sent to the client to provide progress notification of the assessment.
exports.TelemetryNotificationApi = "assessments/telemetryNotification";
exports.telemetryNotificationType = new vscode_languageclient_1.NotificationType(exports.TelemetryNotificationApi);
//# sourceMappingURL=telemetryNotification.js.map