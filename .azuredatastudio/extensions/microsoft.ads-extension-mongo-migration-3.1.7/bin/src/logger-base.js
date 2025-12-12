"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerBase = exports.MessageSeverity = void 0;
/**
 * Severity level of the log message.
 * Integer values of these severity levels map to `ProgressMessageSeverity` of
 * the `conversion/convertObjectsProgress` event notification.
 */
var MessageSeverity;
(function (MessageSeverity) {
    /**
     * Error message.
     */
    MessageSeverity[MessageSeverity["Error"] = 1] = "Error";
    /**
     * Warning message.
     */
    MessageSeverity[MessageSeverity["Warning"] = 2] = "Warning";
    /**
     * Informational message.
     */
    MessageSeverity[MessageSeverity["Info"] = 3] = "Info";
    /**
     * Debugging message.
     */
    MessageSeverity[MessageSeverity["Debug"] = 4] = "Debug";
})(MessageSeverity = exports.MessageSeverity || (exports.MessageSeverity = {}));
/**
 * Base class for a logger.
 */
class LoggerBase {
    /**
     * Logs a message with the given severity.
     *
     * @param severity Message severity.
     * @param message Message text.
     */
    logMessage(severity, message) {
        this.writeMessage(severity, message);
        return message;
    }
    /**
     * Logs a debug message.
     *
     * @param message Message text.
     */
    logDebug(message) {
        return this.logMessage(MessageSeverity.Debug, message);
    }
    /**
     * Logs an informational message.
     *
     * @param message Message text.
     */
    logInfo(message) {
        return this.logMessage(MessageSeverity.Info, message);
    }
    /**
     * Logs a warning message.
     *
     * @param message Message text.
     */
    logWarning(message) {
        return this.logMessage(MessageSeverity.Warning, message);
    }
    /**
     * Logs an error message.
     *
     * @param message Message text.
     */
    logError(message) {
        return this.logMessage(MessageSeverity.Error, message);
    }
    /**
     * Logs an error message from the exception.
     *
     * @param error An exception that was caught.
     */
    logException(error) {
        return this.logMessage(MessageSeverity.Error, error.message ?? error);
    }
}
exports.LoggerBase = LoggerBase;
//# sourceMappingURL=logger-base.js.map