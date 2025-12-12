/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageClientErrorHandler = exports.TelemetryReporter = void 0;
const vscode = require("vscode");
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle(__filename);
const ads_extension_telemetry_1 = require("@microsoft/ads-extension-telemetry");
const vscode_languageclient_1 = require("vscode-languageclient");
const Utils = require("./utils");
const Constants = require("./constants");
const packageJson = require('../package.json');
const viewKnownIssuesAction = localize(0, null);
let packageInfo = Utils.getPackageInfo(packageJson);
exports.TelemetryReporter = new ads_extension_telemetry_1.default(packageInfo.name, packageInfo.version, packageInfo.aiKey);
/**
 * Handle Language Service client errors
 * @class LanguageClientErrorHandler
 */
class LanguageClientErrorHandler {
    /**
     * Show an error message prompt with a link to known issues wiki page
     * @memberOf LanguageClientErrorHandler
     */
    showOnErrorPrompt() {
        exports.TelemetryReporter.sendTelemetryEvent(Constants.serviceName + 'Crash');
        void vscode.window.showErrorMessage(localize(1, null, Constants.serviceName), viewKnownIssuesAction).then(action => {
            if (action && action === viewKnownIssuesAction) {
                void vscode.env.openExternal(vscode.Uri.parse(Constants.serviceCrashLink));
            }
        });
    }
    /**
     * Callback for language service client error
     *
     * @param {Error} error
     * @param {Message} message
     * @param {number} count
     * @returns {ErrorAction}
     *
     * @memberOf LanguageClientErrorHandler
     */
    error(error, message, count) {
        this.showOnErrorPrompt();
        // we don't retry running the service since crashes leave the extension
        // in a bad, unrecovered state
        return vscode_languageclient_1.ErrorAction.Shutdown;
    }
    /**
     * Callback for language service client closed
     *
     * @returns {CloseAction}
     *
     * @memberOf LanguageClientErrorHandler
     */
    closed() {
        this.showOnErrorPrompt();
        // we don't retry running the service since crashes leave the extension
        // in a bad, unrecovered state
        return vscode_languageclient_1.CloseAction.DoNotRestart;
    }
}
exports.LanguageClientErrorHandler = LanguageClientErrorHandler;

//# sourceMappingURL=telemetry.js.map
