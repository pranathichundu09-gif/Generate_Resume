"use strict";
// +-----------------------------------------------------------------------------------
//  <copyright file=constants.ts" company="Microsoft">
//      Copyright (c) Microsoft Corporation. All rights reserved.
//  </copyright>
//
//  Description: This files defines string constants.
// ------------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataAssessmentDocumentation = exports.migrationFaqDocumentation = exports.preMigrationDocumentation = exports.supportTicket = exports.mongoMigrationDocumentation = exports.dmsQnaUrl = exports.PROVIDER_ID = exports.okButtonCaption = exports.serviceName = exports.extensionName = void 0;
const localizationFile_1 = require("./localizationFile");
exports.extensionName = (0, localizationFile_1.localize)('constants.extensionName', 'Azure Cosmos DB Migration for MongoDB');
exports.serviceName = (0, localizationFile_1.localize)('constants.serviceName', 'MongoDB Assessment Service');
exports.okButtonCaption = (0, localizationFile_1.localize)('constants.okButtonCaption', 'OK');
exports.PROVIDER_ID = 'COSMOSDB_MONGO';
exports.dmsQnaUrl = 'https://aka.ms/qnaDMAO';
exports.mongoMigrationDocumentation = 'https://aka.ms/tutorial-mongodb-migration-in-ads';
exports.supportTicket = `https://portal.azure.com/#create/Microsoft.Support/Parameters/%7B%0A%09%22pesId%22%3A%228c615be4-9081-f10c-5866-afa4fab9666d%22%2C%0A%09%22supportTopicId%22%3A%22bb431847-2686-2f7b-f6a3-5afe9ac51938%22%0A%7D`;
exports.preMigrationDocumentation = 'https://aka.ms/mongodb-pre-migration-steps';
exports.migrationFaqDocumentation = 'https://aka.ms/mongodb-migration-in-ads-faq';
exports.dataAssessmentDocumentation = 'https://github.com/AzureCosmosDB/MongoMigrationDataAssessment';
//# sourceMappingURL=constants.js.map