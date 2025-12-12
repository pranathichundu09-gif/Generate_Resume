"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.MessageSeverity = exports.ExtensionLogger = void 0;
const vscode = require("vscode");
const extension = "Azure Cosmos DB Migration for MongoDB";
/**
 * Simple extension logger class.
 */
class ExtensionLogger {
    _outputChannel;
    _logLevel;
    /**
     * Initializes a new instance of the extension logger with provided output channel and
     * minimum logging level.
     * @param _outputChannel Output channel to log messages to.
     * @param _logLevel Minimum severity level to log.
     */
    constructor(_outputChannel, _logLevel) {
        this._outputChannel = _outputChannel;
        this._logLevel = _logLevel;
    }
    /**
     * Gets the current output channel.
     */
    get outputChannel() {
        return this._outputChannel;
    }
    /**
     * Writes given message to the log stream.
     * @param severity Message severity.
     * @param message Message text.
     */
    logMessage(severity, message) {
        if (severity >= this._logLevel) {
            this.outputChannel.appendLine(`[${this.getSeverityLabel(severity)} - ${(new Date().toLocaleTimeString())}] ${message}`);
        }
        return message;
    }
    /**
     * Writes a debug message to the log stream.
     * @param message Message text.
     */
    logDebug(message) {
        return this.logMessage(MessageSeverity.Debug, message);
    }
    /**
     * Writes an informational message to the log stream.
     * @param message Message text.
     */
    logInfo(message) {
        return this.logMessage(MessageSeverity.Info, message);
    }
    /**
     * Writes a warning message to the log stream.
     * @param message Message text.
     */
    logWarning(message) {
        return this.logMessage(MessageSeverity.Warning, message);
    }
    /**
     * Writes an error message to the log stream.
     * @param message Message text.
     */
    logError(message) {
        return this.logMessage(MessageSeverity.Error, message);
    }
    /**
     * Writes an error message from the exception to the log stream.
     * @param error An exception that was caught.
     */
    logException(error) {
        return this.logMessage(MessageSeverity.Error, error.message ?? error);
    }
    /**
     * Gets the string label that represents the given severity level.
     * @param severity Message severity level.
     */
    getSeverityLabel(severity) {
        switch (severity) {
            case MessageSeverity.Error:
                return "Error";
            case MessageSeverity.Warning:
                return "Warn";
            case MessageSeverity.Info:
                return "Info";
            case MessageSeverity.Debug:
                return "Debug";
            default:
                return severity;
        }
    }
}
exports.ExtensionLogger = ExtensionLogger;
/**
 * Severity level of the log message.
 */
var MessageSeverity;
(function (MessageSeverity) {
    /**
     * Debugging message.
     */
    MessageSeverity[MessageSeverity["Debug"] = 0] = "Debug";
    /**
     * Informational message.
     */
    MessageSeverity[MessageSeverity["Info"] = 1] = "Info";
    /**
     * Warning message.
     */
    MessageSeverity[MessageSeverity["Warning"] = 2] = "Warning";
    /**
     * Error message.
     */
    MessageSeverity[MessageSeverity["Error"] = 3] = "Error";
})(MessageSeverity = exports.MessageSeverity || (exports.MessageSeverity = {}));
/**
 * Default logger instance.
 */
exports.logger = new ExtensionLogger(vscode.window.createOutputChannel(extension), MessageSeverity.Info);
//# sourceMappingURL=logger.js.map