"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=client-error-handler.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines error handler for service.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientErrorHandler = void 0;
const vscode = require("vscode");
const vscodelc = require("vscode-languageclient");
const localizationFile_1 = require("./localizationFile");
/**
 * Handler for Language Service client errors.
 */
class ClientErrorHandler {
    serviceName;
    logger;
    /**
     * Initializes a new instance of the error handler with the provided service name and logger.
     *
     * @param serviceName Name of the this handler is associated with service.
     * @param logger Logger to redirect messages to.
     */
    constructor(serviceName, logger) {
        this.serviceName = serviceName;
        this.logger = logger;
    }
    /**
     * Handles unexpected error in the JSON-RPC backend process.
     *
     * @param error An unexpected error.
     */
    error(error) {
        this.logger.logError(error && error.stack || "Unknown error");
        vscode.window.showErrorMessage((0, localizationFile_1.localize)("extension.serviceCrashMessage", "{0} component exited unexpectedly. Please restart Azure Data Studio.", this.serviceName), "OK");
        return vscodelc.ErrorAction.Continue;
    }
    /**
     * Gets the closing action.
     */
    closed() {
        return vscodelc.CloseAction.DoNotRestart;
    }
}
exports.ClientErrorHandler = ClientErrorHandler;
//# sourceMappingURL=client-error-handler.js.map