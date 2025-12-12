"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsServiceUtils = void 0;
const protocol_1 = require("dataprotocol-client/lib/protocol");
const contracts_1 = require("../contracts/contracts");
class ToolsServiceUtils {
    static getCharsets(ownerUri, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = { ownerUri: ownerUri };
            let result = (yield client.sendRequest(contracts_1.GetCharsetsRequest.type, params));
            return result.charsets;
        });
    }
    static getCollations(ownerUri, charset, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = { ownerUri: ownerUri, charset: charset };
            let result = (yield client.sendRequest(contracts_1.GetCollationsRequest.type, params));
            return result.collations;
        });
    }
    static createDatabase(dbname, charset, collation, ownerUri, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = { ownerUri: ownerUri, dbName: dbname, charset: charset, collation: collation };
            yield client.sendRequest(contracts_1.CreateDatabaseRequest.type, params);
        });
    }
    static runQuery(ownerUri, queryString, client) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = { ownerUri: ownerUri, queryString: queryString };
            return yield client.sendRequest(protocol_1.SimpleExecuteRequest.type, params);
        });
    }
}
exports.ToolsServiceUtils = ToolsServiceUtils;

//# sourceMappingURL=toolsserviceUtils.js.map
