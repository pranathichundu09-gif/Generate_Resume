"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireWallFeature = void 0;
const azdata = require("azdata");
const dataprotocol_client_1 = require("dataprotocol-client");
const contracts_1 = require("./contracts");
const UUID = require("vscode-languageclient/lib/utils/uuid");
const Utils = require("../utils");
const uiConstants_1 = require("../uiConstants");
class FireWallFeature extends dataprotocol_client_1.SqlOpsFeature {
    constructor(client) {
        super(client, FireWallFeature.messagesTypes);
    }
    fillClientCapabilities(capabilities) {
        Utils.ensure(capabilities, 'firewall').firewall = true;
    }
    initialize(capabilities) {
        this.register(this.messages, {
            id: UUID.generateUuid(),
            registerOptions: undefined
        });
    }
    registerProvider(options) {
        const client = this._client;
        let createFirewallRule = (account, firewallruleInfo) => {
            return client.sendRequest(contracts_1.CreateFirewallRuleRequest.type, asCreateFirewallRuleParams(account, firewallruleInfo));
        };
        let handleFirewallRule = (errorCode, errorMessage, connectionTypeId) => {
            let params = { errorCode: errorCode, errorMessage: errorMessage, connectionTypeId: connectionTypeId };
            return client.sendRequest(contracts_1.HandleFirewallRuleRequest.type, params);
        };
        return azdata.resources.registerResourceProvider({
            displayName: uiConstants_1.AzureMysqlResourceProviderName,
            id: 'Microsoft.Azure.MySQL.ResourceProvider',
            settings: {}
        }, {
            handleFirewallRule,
            createFirewallRule
        });
    }
}
exports.FireWallFeature = FireWallFeature;
FireWallFeature.messagesTypes = [
    contracts_1.CreateFirewallRuleRequest.type,
    contracts_1.HandleFirewallRuleRequest.type
];
function asCreateFirewallRuleParams(account, params) {
    return {
        account: account,
        serverName: params.serverName,
        startIpAddress: params.startIpAddress,
        endIpAddress: params.endIpAddress,
        securityTokenMappings: params.securityTokenMappings,
        firewallRuleName: params.firewallRuleName
    };
}

//# sourceMappingURL=firewall.js.map
