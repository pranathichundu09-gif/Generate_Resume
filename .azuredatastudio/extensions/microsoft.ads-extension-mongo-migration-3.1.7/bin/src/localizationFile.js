"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.localize = exports.Localization = exports.LocalizationBundle = void 0;
const fs = require("fs");
const path = require("path");
const logger_1 = require("./logger");
/**
 * Provides utilities for localizing strings using *.nls*.json files.
 */
class LocalizationBundle {
    /**
     * Localized strings mapped to their key, loaded from localization files.
     * @private
     */
    cachedMessages = new Map();
    /**
     * Whether localization is currently configured to use "pseudolocalization". If `true`, zenkaku
     * localization will be used when returning localized strings.
     * @private
     */
    isPseudo = false;
    /**
     * language-region localization code, value is set in setup.
     */
    localizedLanguageCode = "";
    /**
     * Initializes the localization cache by reading in the appropriate nls files from the extension
     * root. Locale information is loaded from the `VSCODE_NLS_CONFIG` environment variable
     * and used to build the extension of the localization files (eg, `ja` => `.nls.ja.json`).
     * Any file ending with the nls extension is parsed and merged into a cache.
     *
     * @param extensionRoot Path to the root of the extension.
     * @param logger Logger to use for logging errors during localization initialization.
     */
    async setup(extensionRoot) {
        // Parse the locale setting
        const nlsConfig = JSON.parse(process.env.VSCODE_NLS_CONFIG || "{}");
        let normalizedLocale = nlsConfig.locale.toLowerCase();
        this.isPseudo = normalizedLocale === "pseudo";
        if (this.isPseudo) {
            // Skip parsing nls files if we're in pseudo mode
            return;
        }
        // Parse the nls files
        try {
            // Determine the localization files to look for
            // To specifically handle Chinese language, the switch case has been added, since the locale retrieved from ADS is the older langugage code. 
            switch (normalizedLocale) {
                // zh-cn is the older version of Chinese Simplefied. Refer: https://github.com/microsoft/azuredatastudio/blob/main/i18n/ads-language-pack-zh-hans/package.json
                case "zh-cn": {
                    normalizedLocale = "zh-Hans";
                    break;
                }
                // zh-tw is the older version of Chinese Traditional. Refer: https://github.com/microsoft/azuredatastudio/blob/main/i18n/ads-language-pack-zh-hant/package.json
                case "zh-tw": {
                    normalizedLocale = "zh-Hant";
                    break;
                }
            }
            const splitLocale = normalizedLocale.split("-");
            let nlsFileRegex;
            if (splitLocale.length === 2) {
                const language = splitLocale[0];
                const region = splitLocale[1];
                nlsFileRegex = new RegExp(`\\.nls(\\.${language}(-${region})?)?\\.json$`, "i");
                this.localizedLanguageCode = `${language}-${region}`;
            }
            else {
                nlsFileRegex = new RegExp(`\\.nls(\\.${normalizedLocale})?\\.json$`, "i");
                this.localizedLanguageCode = `${normalizedLocale}`;
            }
            // Load the localization files that match the previous filter
            const staticStrings = await fs.promises.readdir(extensionRoot);
            const errorMessages = await fs.promises.readdir(path.join(extensionRoot, "error_messages"));
            const possibleCauses = await fs.promises.readdir(path.join(extensionRoot, "possible_causes"));
            const remediationActions = await fs.promises.readdir(path.join(extensionRoot, "remediation_actions"));
            const files = staticStrings.concat(errorMessages).concat(possibleCauses).concat(remediationActions);
            const filePaths = files.filter((fileName) => nlsFileRegex.test(fileName))
                .sort((x, y) => x.length - y.length) // Make sure we sort .nls.json,.nls.en.json,
                // .nls.en-us.json so the latter override the former
                .map((fileName) => {
                if (fileName.includes("error")) {
                    return path.join(extensionRoot, "error_messages", fileName);
                }
                else if (fileName.includes("possible")) {
                    return path.join(extensionRoot, "possible_causes", fileName);
                }
                else if (fileName.includes("remediation")) {
                    return path.join(extensionRoot, "remediation_actions", fileName);
                }
                else {
                    return path.join(extensionRoot, fileName);
                }
            });
            for (const filePath of filePaths) {
                console.log(filePath);
                await this.mergeNlsFile(filePath);
            }
        }
        catch (e) {
            logger_1.logger.logWarning(`Failed to load localization files: ${e}`);
        }
    }
    /**
     * Localizes a string by looking up the provided {@paramref key} in the cache of localization
     * strings. If {@paramref key} cannot be found in the cache, {@paramref defaultMessage} is
     * used. The localized string is then formatted using any provided {@paramref args}.
     *
     * @param key Key to use to look up the localization string.
     * @param defaultMessage Message to use if {@paramref key} is not found in the cache.
     * @param args Optionally, a list of arguments to use to format the localization string.
     */
    localize(key, defaultMessage, ...args) {
        // Attempt to find the key in the cache
        const cachedMessage = this.cachedMessages.get(key) || defaultMessage;
        return this.format(cachedMessage, ...args);
    }
    /**
     * Formats a localized string by applying {@paramref args} into the {@paramref message}.
     * Use `{{` to escape a `{`.
     *
     * @param message Localized formatting string.
     * @param args Arguments to insert into the format string.
     * @private
     */
    format(message, ...args) {
        let result;
        if (this.isPseudo) {
            // FF3B and FF3D is the Unicode zenkaku representation for [ and ]
            message = '\uFF3B' + message.replace(/[aouei]/g, '$&$&') + '\uFF3D';
        }
        if (args.length === 0) {
            result = message;
        }
        else {
            // Regex:
            //    (^|[^{]) - matches start of string or any character not { (prevents {{ from matching)
            //    {(\d+)}  - captures a number, surrounded by {}
            result = message.replace(/(^|[^{]){(\d+)}/g, (match, prefix, index) => {
                const arg = args[index];
                let replacement = match;
                if (index < args.length) {
                    if (typeof arg === 'string') {
                        replacement = prefix + arg;
                    }
                    else if (typeof arg === 'number' || typeof arg === 'boolean' || arg === void 0 || arg === null) {
                        replacement = prefix + String(arg);
                    }
                }
                return replacement;
            });
        }
        return result;
    }
    /**
     * Loads an nls JSON file, parses it to a JS object then merges it into the cached messages.
     * This is done synchronously to avoid string localization becoming asynchronous (ie, dependent
     * on completion of setup before returning localized strings).
     *
     * @param path Path to the nls file to load.
     * @param logger Logger to use for logging errors during localization initialization.
     * @private
     */
    async mergeNlsFile(path) {
        try {
            const fileBuffer = await fs.promises.readFile(path, "utf8");
            const fileObj = JSON.parse(fileBuffer.toString());
            const entries = Object.entries(fileObj);
            this.cachedMessages = new Map([...this.cachedMessages, ...entries]);
        }
        catch (e) {
            // File was not found or failed to load. Ignore and skip ahead
            logger_1.logger.logWarning(`Failed to load localization file '${path}: ${e}'`);
        }
    }
}
exports.LocalizationBundle = LocalizationBundle;
/**
 * Singleton instance of the localization class.
 */
exports.Localization = new LocalizationBundle();
/**
 * Localizes a string by looking up the provided {@paramref key} in the cache of localization
 * strings. If {@paramref key} cannot be found in the cache, {@paramref defaultMessage} is
 * used. The localized string is then formatted using any provided {@paramref args}.
 *
 * @param key Key to use to look up the localization string.
 * @param defaultMessage Message to use if {@paramref key} is not found in the cache.
 * @param args Optionally, a list of arguments to use to format the localization string.
 */
const localize = (key, defaultMessage, ...args) => exports.Localization.localize(key, defaultMessage, ...args);
exports.localize = localize;
//# sourceMappingURL=localizationFile.js.map