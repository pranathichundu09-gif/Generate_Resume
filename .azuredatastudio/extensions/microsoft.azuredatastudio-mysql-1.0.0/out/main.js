/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
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
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const nls = require("vscode-nls");
const localize = nls.config({ messageFormat: nls.MessageFormat.file })(__filename);
const dataprotocol_client_1 = require("dataprotocol-client");
const ads_service_downloader_1 = require("@microsoft/ads-service-downloader");
const vscode_languageclient_1 = require("vscode-languageclient");
const Constants = require("./constants");
const contextProvider_1 = require("./contextProvider");
const Utils = require("./utils");
const telemetry_1 = require("./telemetry");
const telemetry_2 = require("./features/telemetry");
const dbDesigner_1 = require("./features/dbDesigner");
const firewall_1 = require("./features/firewall");
const baseConfig = require('./config.json');
const outputChannel = vscode.window.createOutputChannel(Constants.serviceName);
const statusView = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // lets make sure we support this platform first
        let supported = yield Utils.verifyPlatform();
        if (!supported) {
            vscode.window.showErrorMessage(localize(0, null));
            return;
        }
        let config = JSON.parse(JSON.stringify(baseConfig));
        config.installDirectory = path.join(__dirname, config.installDirectory);
        config.proxy = vscode.workspace.getConfiguration('http').get('proxy');
        config.strictSSL = vscode.workspace.getConfiguration('http').get('proxyStrictSSL') || true;
        let languageClient;
        const serverdownloader = new ads_service_downloader_1.ServerProvider(config);
        serverdownloader.eventEmitter.onAny(generateHandleServerProviderEvent());
        let clientOptions = {
            providerId: Constants.providerId,
            errorHandler: new telemetry_1.LanguageClientErrorHandler(),
            documentSelector: ['sql'],
            synchronize: {
                configurationSection: Constants.providerId
            },
            features: [
                // we only want to add new features
                ...dataprotocol_client_1.SqlOpsDataClient.defaultFeatures,
                telemetry_2.TelemetryFeature,
                firewall_1.FireWallFeature
            ],
        };
        const installationStart = Date.now();
        serverdownloader.getOrDownloadServer().then(e => {
            const installationComplete = Date.now();
            let serverOptions = generateServerOptions(e);
            languageClient = new dataprotocol_client_1.SqlOpsDataClient(Constants.serviceName, serverOptions, clientOptions);
            const processStart = Date.now();
            languageClient.onReady().then(() => {
                const processEnd = Date.now();
                statusView.text = localize(1, null, Constants.providerId);
                setTimeout(() => {
                    statusView.hide();
                }, 1500);
                telemetry_1.TelemetryReporter.sendTelemetryEvent('startup/LanguageClientStarted', {
                    installationTime: String(installationComplete - installationStart),
                    processStartupTime: String(processEnd - processStart),
                    totalTime: String(processEnd - installationStart),
                    beginningTimestamp: String(installationStart)
                });
            });
            statusView.show();
            statusView.text = localize(2, null, Constants.providerId);
            (0, dbDesigner_1.registerDbDesignerCommands)(languageClient);
            languageClient.start();
        }, e => {
            telemetry_1.TelemetryReporter.sendTelemetryEvent('ServiceInitializingFailed');
            vscode.window.showErrorMessage(localize(3, null, Constants.providerId));
        });
        let contextProvider = new contextProvider_1.default();
        context.subscriptions.push(contextProvider);
        context.subscriptions.push(telemetry_1.TelemetryReporter);
        context.subscriptions.push({ dispose: () => languageClient.stop() });
    });
}
exports.activate = activate;
function generateServerOptions(executablePath) {
    let serverArgs = [];
    let serverCommand = executablePath;
    let config = vscode.workspace.getConfiguration(Constants.providerId);
    if (config) {
        // Override the server path with the local debug path if enabled
        let useLocalSource = config["useDebugSource"];
        if (useLocalSource) {
            let localSourcePath = config["debugSourcePath"];
            let filePath = path.join(localSourcePath, "ossdbtoolsservice/ossdbtoolsservice_main.py");
            process.env.PYTHONPATH = localSourcePath;
            serverCommand = process.platform === 'win32' ? 'python' : 'python3';
            let enableStartupDebugging = config["enableStartupDebugging"];
            let debuggingArg = enableStartupDebugging ? '--enable-remote-debugging-wait' : '--enable-remote-debugging';
            let debugPort = config["debugServerPort"];
            debuggingArg += '=' + debugPort;
            serverArgs = [filePath, debuggingArg];
        }
        let logFileLocation = path.join(Utils.getDefaultLogLocation(), Constants.providerId);
        serverArgs.push('--log-dir=' + logFileLocation);
        serverArgs.push(logFileLocation);
        // Enable diagnostic logging in the service if it is configured
        let logDebugInfo = config["logDebugInfo"];
        if (logDebugInfo) {
            serverArgs.push('--enable-logging');
        }
    }
    serverArgs.push('provider=' + Constants.providerId);
    // run the service host
    return { command: serverCommand, args: serverArgs, transport: vscode_languageclient_1.TransportKind.stdio };
}
function generateHandleServerProviderEvent() {
    let dots = 0;
    return (e, ...args) => {
        outputChannel.show();
        statusView.show();
        switch (e) {
            case "install_start" /* Events.INSTALL_START */:
                outputChannel.appendLine(localize(4, null, Constants.serviceName, args[0]));
                statusView.text = localize(5, null, Constants.serviceName);
                break;
            case "install_end" /* Events.INSTALL_END */:
                outputChannel.appendLine(localize(6, null, Constants.serviceName));
                break;
            case "download_start" /* Events.DOWNLOAD_START */:
                outputChannel.appendLine(localize(7, null, args[0]));
                outputChannel.append(localize(8, null, Math.ceil(args[1] / 1024).toLocaleString(vscode.env.language)));
                statusView.text = localize(9, null, Constants.serviceName);
                break;
            case "download_progress" /* Events.DOWNLOAD_PROGRESS */:
                let newDots = Math.ceil(args[0] / 5);
                if (newDots > dots) {
                    outputChannel.append('.'.repeat(newDots - dots));
                    dots = newDots;
                }
                break;
            case "download_end" /* Events.DOWNLOAD_END */:
                outputChannel.appendLine(localize(10, null));
                break;
        }
    };
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;

//# sourceMappingURL=main.js.map
