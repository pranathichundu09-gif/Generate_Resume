"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaMigrationService = void 0;
const migrateSchema_1 = require("../contracts/migration/migrateSchema");
const logger_1 = require("../logger");
const getExistingSchema_1 = require("../contracts/migration/getExistingSchema");
const migrateNonUniqueIndex_1 = require("../contracts/migration/migrateNonUniqueIndex");
class SchemaMigrationService {
    backendService;
    constructor(backendService) {
        this.backendService = backendService;
    }
    async migrateSchema(migrateSchemaMappingRequest) {
        let response = {};
        try {
            response = await this.backendService.sendRequest(migrateSchema_1.MigrateSchemaRequestType.method, migrateSchemaMappingRequest);
            if (!response) {
                logger_1.logger.logError("Failed to migrate schema");
            }
        }
        catch (e) {
            logger_1.logger.logException(e);
            throw e;
        }
        return response;
    }
    async migrateNonUniqueIndex(migrateNonUniqueIndexRequest) {
        let response = {};
        try {
            response = await this.backendService.sendRequest(migrateNonUniqueIndex_1.MigrateNonUnqiueIndexRequestType.method, migrateNonUniqueIndexRequest);
            if (!response) {
                logger_1.logger.logError("Failed to migrate non unique index");
            }
        }
        catch (e) {
            logger_1.logger.logException(e);
            throw e;
        }
        return response;
    }
    async getExistingSchema(connectionInformation, databaseList) {
        let response = {};
        try {
            const conn = {
                connectionString: connectionInformation.connectionString,
                host: connectionInformation.host,
                port: connectionInformation.port,
                userName: connectionInformation.userName,
                password: connectionInformation.password,
                useSsl: connectionInformation.useSsl
            };
            response = await this.backendService.sendRequest(getExistingSchema_1.GetExistingSchemaRequestType.method, {
                mongoConnectionInformation: conn,
                databases: databaseList
            });
            if (!response) {
                logger_1.logger.logError("Failed to retrieve Database collection mapping");
            }
        }
        catch (e) {
            logger_1.logger.logException(e);
            throw e;
        }
        return response;
    }
}
exports.SchemaMigrationService = SchemaMigrationService;
//# sourceMappingURL=schemaMigrationService.js.map