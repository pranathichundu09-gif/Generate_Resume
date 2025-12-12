"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCollationsRequest = exports.GetCharsetsRequest = exports.CreateDatabaseRequest = void 0;
const vscode_languageclient_1 = require("vscode-languageclient");
var CreateDatabaseRequest;
(function (CreateDatabaseRequest) {
    CreateDatabaseRequest.type = new vscode_languageclient_1.RequestType("mysqlnewdatabase/create");
})(CreateDatabaseRequest = exports.CreateDatabaseRequest || (exports.CreateDatabaseRequest = {}));
var GetCharsetsRequest;
(function (GetCharsetsRequest) {
    GetCharsetsRequest.type = new vscode_languageclient_1.RequestType("mysqlnewdatabase/charsets");
})(GetCharsetsRequest = exports.GetCharsetsRequest || (exports.GetCharsetsRequest = {}));
var GetCollationsRequest;
(function (GetCollationsRequest) {
    GetCollationsRequest.type = new vscode_languageclient_1.RequestType("mysqlnewdatabase/collations");
})(GetCollationsRequest = exports.GetCollationsRequest || (exports.GetCollationsRequest = {}));

//# sourceMappingURL=contracts.js.map
