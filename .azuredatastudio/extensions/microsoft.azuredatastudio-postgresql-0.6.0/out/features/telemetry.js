"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryFeature = void 0;
const Utils = require("../utils");
const contracts = require("./contracts");
const telemetry_1 = require("../telemetry");
class TelemetryFeature {
    constructor(_client) {
        this._client = _client;
    }
    fillClientCapabilities(capabilities) {
        Utils.ensure(capabilities, 'telemetry').telemetry = true;
    }
    initialize() {
        this._client.onNotification(contracts.TelemetryNotification.type, e => {
            telemetry_1.TelemetryReporter.sendTelemetryEvent(e.params.eventName, e.params.properties, e.params.measures);
        });
    }
}
exports.TelemetryFeature = TelemetryFeature;

//# sourceMappingURL=telemetry.js.map
