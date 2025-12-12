"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.mongoConfigurationKey = exports.assessmentPathConfigKey = void 0;
// +-----------------------------------------------------------------------------------
//  <copyright file=config.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines assessment path settings.
// ------------------------------------------------------------------------------------
const vscode = require("vscode");
const path = require("path");
const logger_1 = require("../logger");
const os = require("os");
const fs = require("fs");
const constants = require("../constants/strings");
// Extension Settings
exports.assessmentPathConfigKey = 'assessmentPath';
exports.mongoConfigurationKey = 'mongoAssessment';
class Config {
    _configValues;
    isSettingsPathValid = true;
    constructor() {
        vscode.workspace.onDidChangeConfiguration((changeEvent) => {
            const impact = changeEvent.affectsConfiguration(exports.mongoConfigurationKey);
            if (impact) {
                this._configValues.assessmentLocation = vscode.workspace.getConfiguration(exports.mongoConfigurationKey)[exports.assessmentPathConfigKey];
            }
        });
    }
    // Loads the config values
    async load() {
        const rawConfig = await fs.promises.readFile(path.join(__dirname, constants.CONFIG_FILE));
        this._configValues = JSON.parse(rawConfig.toString());
        this.writeOnConfigFile(this.getDefaultPath());
        this.isSettingsPathValid = true;
    }
    getDefaultPath() {
        return path.join(os.homedir(), constants.DEFAULT_FOLDER);
    }
    getConfigPath() {
        return path.join(__dirname, constants.CONFIG_FILE);
    }
    isExtensionPathValid() {
        return this.isSettingsPathValid;
    }
    writeOnConfigFile(assessmentPath) {
        const assessmentLocation = {
            assessmentLocation: assessmentPath
        };
        fs.writeFile(this.getConfigPath(), JSON.stringify(assessmentLocation), (err) => {
            if (err) {
                throw err;
            }
            logger_1.logger.logInfo('config data written to file');
        });
    }
    /**
     * Returns assessment path based on current scenario
     */
    async getAssessmentLocation() {
        let assessmentPath = this.getDefaultPath();
        const extensionSettingsUserPath = vscode.workspace.getConfiguration(exports.mongoConfigurationKey)[exports.assessmentPathConfigKey].toString();
        // Case 1: Global Settings 
        if (extensionSettingsUserPath !== "" && fs.existsSync(extensionSettingsUserPath)) {
            this.writeOnConfigFile(extensionSettingsUserPath);
            assessmentPath = extensionSettingsUserPath;
        }
        // Check: Invalid path provided - Use default path - Set config to default path again
        else if (extensionSettingsUserPath !== "" && !fs.existsSync(extensionSettingsUserPath)) {
            assessmentPath = this.getDefaultPath();
            this.isSettingsPathValid = false;
            this.writeOnConfigFile(assessmentPath);
            logger_1.logger.logError('Path provided by user doesnt exist');
        }
        logger_1.logger.logDebug(assessmentPath);
        return assessmentPath;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map