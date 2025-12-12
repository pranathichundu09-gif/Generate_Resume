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
const fs = require("fs");
const os = require("os");
const path = require("path");
const dataprotocol_client_1 = require("dataprotocol-client");
const ads_service_downloader_1 = require("@microsoft/ads-service-downloader");
const vscode_languageclient_1 = require("vscode-languageclient");
const nls = require("vscode-nls");
// this should precede local imports because they can trigger localization calls
const localize = nls.config({ messageFormat: nls.MessageFormat.file })(__filename);
const commandObserver_1 = require("./commandObserver");
const commands_1 = require("./commands");
const Helper = require("./commonHelper");
const Constants = require("./constants");
const contextProvider_1 = require("./contextProvider");
const Utils = require("./utils");
const telemetry_1 = require("./telemetry");
const telemetry_2 = require("./features/telemetry");
const baseConfig = require('./config.json');
const outputChannel = vscode.window.createOutputChannel(Constants.serviceName);
const statusView = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // lets make sure we support this platform first
        let supported = yield Utils.verifyPlatform();
        if (!supported) {
            vscode.window.showErrorMessage('Unsupported platform');
            return;
        }
        let config = JSON.parse(JSON.stringify(baseConfig));
        config.installDirectory = path.join(__dirname, config.installDirectory);
        config.proxy = vscode.workspace.getConfiguration('http').get('proxy');
        config.strictSSL = vscode.workspace.getConfiguration('http').get('proxyStrictSSL') || true;
        let languageClient;
        const serverdownloader = new ads_service_downloader_1.ServerProvider(config);
        serverdownloader.eventEmitter.onAny(generateHandleServerProviderEvent());
        let packageInfo = Utils.getPackageInfo();
        let commandObserver = new commandObserver_1.CommandObserver();
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
                telemetry_2.TelemetryFeature
            ]
        };
        const installationStart = Date.now();
        serverdownloader.getOrDownloadServer().then(e => {
            const installationComplete = Date.now();
            let serverOptions = generateServerOptions(e);
            languageClient = new dataprotocol_client_1.SqlOpsDataClient(Constants.serviceName, serverOptions, clientOptions);
            for (let command of (0, commands_1.default)(commandObserver, packageInfo, languageClient)) {
                context.subscriptions.push(command);
            }
            const processStart = Date.now();
            languageClient.onReady().then(() => {
                const processEnd = Date.now();
                statusView.text = Constants.providerId + ' service started';
                setTimeout(() => {
                    statusView.hide();
                }, 1500);
                telemetry_1.TelemetryReporter.sendTelemetryEvent('startup/LanguageClientStarted', {
                    installationTime: String(installationComplete - installationStart),
                    processStartupTime: String(processEnd - processStart),
                    totalTime: String(processEnd - installationStart),
                    beginningTimestamp: String(installationStart)
                });
                addDeployNotificationsHandler(languageClient, commandObserver);
            });
            statusView.show();
            statusView.text = 'Starting ' + Constants.providerId + ' service';
            languageClient.start();
        }, e => {
            telemetry_1.TelemetryReporter.sendTelemetryEvent('ServiceInitializingFailed');
            vscode.window.showErrorMessage('Failed to start ' + Constants.providerId + ' tools service');
        });
        try {
            var pgProjects = yield vscode.workspace.findFiles('{**/*.pgproj}');
            if (pgProjects.length > 0) {
                yield Helper.checkProjectVersion(packageInfo.minSupportedPostgreSQLProjectSDK, packageInfo.maxSupportedPostgreSQLProjectSDK, pgProjects.map(p => p.fsPath), commandObserver);
            }
        }
        catch (err) {
            outputChannel.appendLine(`Failed to verify project SDK, error: ${err}`);
        }
        let contextProvider = new contextProvider_1.default();
        context.subscriptions.push(contextProvider);
        context.subscriptions.push(telemetry_1.TelemetryReporter);
        context.subscriptions.push({ dispose: () => languageClient.stop() });
    });
}
exports.activate = activate;
function addDeployNotificationsHandler(client, commandObserver) {
    const queryCompleteType = new vscode_languageclient_1.NotificationType('query/deployComplete');
    client.onNotification(queryCompleteType, (data) => {
        if (!data.batchSummaries.some(s => s.hasError)) {
            commandObserver.logToOutputChannel(localize(0, null));
        }
    });
    const queryMessageType = new vscode_languageclient_1.NotificationType('query/deployMessage');
    client.onNotification(queryMessageType, (data) => {
        var messageText = data.message.isError ? localize(1, null, data.message.message) : localize(2, null, data.message.message);
        commandObserver.logToOutputChannel(messageText);
    });
    const queryBatchStartType = new vscode_languageclient_1.NotificationType('query/deployBatchStart');
    client.onNotification(queryBatchStartType, (data) => {
        if (data.batchSummary.selection) {
            commandObserver.logToOutputChannel(localize(3, null, data.batchSummary.selection.startLine + 1));
        }
    });
}
function generateServerOptions(executablePath) {
    let serverArgs = [];
    let serverCommand = executablePath;
    let config = vscode.workspace.getConfiguration('pgsql');
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
                outputChannel.appendLine(`Installing ${Constants.serviceName} to ${args[0]}`);
                statusView.text = 'Installing Service';
                break;
            case "install_end" /* Events.INSTALL_END */:
                outputChannel.appendLine('Installed');
                break;
            case "download_start" /* Events.DOWNLOAD_START */:
                outputChannel.appendLine(`Downloading ${args[0]}`);
                outputChannel.append(`(${Math.ceil(args[1] / 1024)} KB)`);
                statusView.text = 'Downloading Service';
                break;
            case "download_progress" /* Events.DOWNLOAD_PROGRESS */:
                let newDots = Math.ceil(args[0] / 5);
                if (newDots > dots) {
                    outputChannel.append('.'.repeat(newDots - dots));
                    dots = newDots;
                }
                break;
            case "download_end" /* Events.DOWNLOAD_END */:
                outputChannel.appendLine('Done!');
                break;
        }
    };
}
// this method is called when your extension is deactivated
function deactivate() {
    const tempFolder = fs.realpathSync(os.tmpdir());
    const tempFolders = fs.readdirSync(tempFolder).filter((file) => file.startsWith('_MEI'));
    tempFolders.forEach((folder) => {
        const folderPath = path.join(tempFolder, folder);
        if (fs.existsSync(folderPath)) {
            fs.rmdirSync(folderPath, { recursive: true });
        }
    });
}
exports.deactivate = deactivate;

//# sourceMappingURL=main.js.map
