"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=extensionInfo.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This file contains the class that represents the extension version information.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionInfo = void 0;
const uuid_1 = require("uuid");
const packageJson = require("../package.json");
class ExtensionInfo {
    extensionVersion;
    sessionId;
    static extensionInfo;
    constructor(extensionVersion, sessionId) {
        this.extensionVersion = extensionVersion;
        this.sessionId = sessionId;
    }
    static getInstance() {
        if (!ExtensionInfo.extensionInfo) {
            const sessionId = (0, uuid_1.v4)();
            this.extensionInfo = new ExtensionInfo(packageJson.version, sessionId);
        }
        return this.extensionInfo;
    }
    getExtensionVersion() {
        return this.extensionVersion;
    }
    getSessionId() {
        return this.sessionId;
    }
}
exports.ExtensionInfo = ExtensionInfo;
//# sourceMappingURL=extensionInfo.js.map