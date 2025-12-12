"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleFirewallRuleRequest = exports.CreateFirewallRuleRequest = exports.TelemetryParams = exports.TelemetryNotification = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
// ------------------------------- < Telemetry Feature Events > ------------------------------------
/**
 * Event sent when the language service send a telemetry event
 */
var TelemetryNotification;
(function (TelemetryNotification) {
    TelemetryNotification.type = new vscode_languageclient_1.NotificationType('telemetry/mysqlevent');
})(TelemetryNotification = exports.TelemetryNotification || (exports.TelemetryNotification = {}));
/**
 * Update event parameters
 */
class TelemetryParams {
}
exports.TelemetryParams = TelemetryParams;
// ------------------------------- </ Telemetry Feature Events > ------------------------------------
// ------------------------------- < Firewall Rule Feature Events > ------------------------------------
/**
 * A request to open up a firewall rule
 */
var CreateFirewallRuleRequest;
(function (CreateFirewallRuleRequest) {
    CreateFirewallRuleRequest.type = new vscode_languageclient_1.RequestType('resource/createFirewallRule');
})(CreateFirewallRuleRequest = exports.CreateFirewallRuleRequest || (exports.CreateFirewallRuleRequest = {}));
/**
 * Firewall rule request handler
 */
var HandleFirewallRuleRequest;
(function (HandleFirewallRuleRequest) {
    HandleFirewallRuleRequest.type = new vscode_languageclient_1.RequestType('resource/handleFirewallRule');
})(HandleFirewallRuleRequest = exports.HandleFirewallRuleRequest || (exports.HandleFirewallRuleRequest = {}));
// ------------------------------- </ Firewall Rule Feature Events > ------------------------------------

//# sourceMappingURL=contracts.js.map
