"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVALID_HOST = exports.INVALID_PATH = exports.INCORRECT_LENGTH = exports.INVALID_ASSESSMENT_NAME = exports.DUPLICATE_ASSESSMENT_NAME = exports.LOG_FOLDER_PATH_DESCRIPTION = exports.TARGET_PLATFORM_DESCRIPTION = exports.MIGRATION_NAME_DESCRIPTION = exports.ASSESSMENT_NAME_DESCRIPTION = exports.ASSESSMENT_STARTED_MESSAGE = exports.DATA_ASSESSMENT_PATH_INPUT = exports.DATA_ASSESSMENT_HELP_LINK_LABEL = exports.DATA_ASSESSMENT_PATH_DESCRIPTION = exports.DATA_ASSESSMENT_LABEL = exports.LOG_FOLDER_PATH_INPUT = exports.BROWSE_BUTTON = exports.LOG_FOLDER_HELP_LINK_LABEL = exports.LOG_FOLDER_INFO = exports.LOG_FOLDER_LABEL = exports.SELECT_A_TARGET = exports.RU_WARNING_TEXT = exports.TARGET_PLATFORM_LABEL = exports.OFFERING_HELP_LINK_LABEL = exports.OFFERING_DESCRIPTION = exports.OFFERING_LABEL = exports.ASSESSMENT_CONFIGURATION_SUBTEXT = exports.MIGRATION_STATUS_SELECT_SERVICE_TEXT = exports.MIGRATION_STATUS_LABEL = exports.MIGRATION_NAME_LABEL = exports.ASSESSMENT_NAME_LABEL = exports.ASSESSMENT_INFORMATION_TEXT = exports.START_ASSESSMENT_TITLE = exports.CANCEL_ASSESSMENT = exports.PREREQ_NOT_MET = exports.UNEXPECTED_ERROR_IN_VALIDATION = exports.VALIDATION_SUCCESSFUL = exports.VALIDATING_PREREQ = exports.RUN_VALIDATION = exports.START_ASSESSMENT = exports.WIZARD_START_MIGRATION_ERROR_LABEL = exports.WIZARD_START_MIGRATION_ERROR_TITLE = exports.WIZARD_BACK = exports.WIZARD_NEXT = exports.WIZARD_TITLE = exports.INVALID_PATH_ERROR_MESSAGE = exports.CONFIG_FILE = exports.DEFAULT_FOLDER = exports.EXTENSION_NAME = exports.CosmosDatabaseKind = exports.ProvisioningState = void 0;
exports.RESOURCE_GROUP = exports.LOCATION = exports.SUBSCRIPTION = exports.NAME = exports.UNAVAILABLE_TARGET_PREFIX = exports.ACCOUNT_CREDENTIALS_REFRESH = exports.AZURE_TENANT = exports.INVALID_VCORE_INSTANCE_ERROR = exports.NO_VCORE_INSTANCE_FOUND = exports.INVALID_RU_INSTANCE_ERROR = exports.NO_RU_INSTANCE_FOUND = exports.RESOURCE_GROUP_NOT_FOUND = exports.NO_LOCATION_FOUND = exports.NO_SUBSCRIPTIONS_FOUND = exports.INVALID_RESOURCE_GROUP_ERROR = exports.INVALID_LOCATION_ERROR = exports.INVALID_SUBSCRIPTION_ERROR = exports.SELECT_A_RESOURCE_GROUP = exports.SELECT_A_LOCATION = exports.SELECT_A_SUBSCRIPTION = exports.SELECT_A_TENANT = exports.SELECT_AN_ACCOUNT = exports.SELECT_AN_TARGET_TYPE = exports.INVALID_ACCOUNT_ERROR = exports.ACCOUNT_LINK_BUTTON_LABEL = exports.ACCOUNT_SELECTION_PAGE_NO_LINKED_ACCOUNTS_ERROR = exports.ACCOUNTS_SELECTION_PAGE_DESCRIPTION = exports.ACCOUNTS_SELECTION_PAGE_TITLE = exports.AZURE_TARGET_VCORE_OFFERING = exports.AZURE_TARGET_RU_OFFERING = exports.AZURE_TARGET_PAGE_DESCRIPTION = exports.AZURE_TARGET_PAGE_TITLE = exports.NO_MIGRATE_ERROR = exports.SCHEMA_LOADING_INFO = exports.SCHEMA_LOADING_IN_PROGRESS = exports.MIGRATING_CAPPED_COLLECTION = exports.MIGRATION_MAPPING_EXISTS = exports.MIGRATION_MAPPING_ERROR = exports.MIGRATION_MAPPING_ERROR_TITLE = exports.MIGRATION_TARGET_NAME = exports.MIGRATION_ACTION = exports.MIGRATION_SOURCE_NAME = exports.MIGRATION_MAPPING_TITLE = exports.DMS_PROVISIONING_FAILED = exports.DATABASE_MIGRATION_SERVICE_AUTHENTICATION_KEYS = exports.ASSESSMENT_IN_PROGRESS_CONTENT = exports.ASSESSMENT_PROGRESS_TABLE_HEADER = exports.VIEW_ASSESSMENT_RESULTS = exports.ASSESSMENT_IN_PROGRESS = exports.INVALID_TARGET_VERSION = void 0;
exports.CANCEL = exports.OK = exports.MIGRATION_SERVICES_FETCH_UNEXPECTED_FAILURE = exports.RESOURCE_GROUP_FETCH_UNEXPECTED_FAILURE = exports.NAME_OF_NEW_RESOURCE_GROUP = exports.RESOURCE_GROUP_DESCRIPTION = exports.RESOURCE_GROUP_CREATED = exports.CREATING_RESOURCE_GROUP = exports.SERVICE_ERROR_NOT_READY = exports.SERVICE_READY = exports.SELECT_RESOURCE_GROUP_PROMPT = exports.SELECT_RESOURCE_GROUP = exports.SERVICE_NOT_FOUND = exports.SELECT_A_SERVICE = exports.MIGRATION_SERVICE_SELECT_SERVICE_LABEL = exports.MIGRATION_MODE_OFFLINE_DESCRIPTION = exports.MIGRATION_MODE_ONLINE_LABEL = exports.MIGRATION_MODE_OFFLINE_LABEL = exports.MIGRATION_MODE_DESCRIPTION = exports.MIGRATION_MODE_LABEL = exports.SERVICE_OFFLINE_ERROR = exports.INVALID_SERVICE_ERROR = exports.CREATE_NEW_RESOURCE_GROUP = exports.CREATE_NEW_MIGRATION_SERVICE = exports.CREATE_NEW = exports.MIGRATION_SERVICE_NOT_FOUND_ERROR = exports.MIGRATION_SERVICE_PAGE_DESCRIPTION = exports.MIGRATION_SERVICE_PAGE_TITLE = exports.SERVICE_CONNECTION_STATUS = exports.MIGRATION_SERVICE_SERVICE_PROMPT = exports.MIGRATION_SERVICE_SELECT_SERVICE_PROMPT = exports.COSMOS_TARGET_CONNECTION_ERROR = exports.AZURE_TARGET_CONNECTION_ERROR_TITLE = exports.SELECT_SERVICE_PLACEHOLDER = exports.TARGET_PASSWORD_PLACEHOLDER = exports.TARGET_PASSWORD_LABEL = exports.TARGET_USERNAME_PLACEHOLDER = exports.TARGET_USERNAME_LABEL = exports.TARGET_CONNECTION_PARAMETERS = exports.TARGET_CONNECTION_STRING_PLACEHOLDER = exports.TARGET_CONNECTION_STRING = exports.TARGET_CONNECTION_TYPE = exports.TARGET_RESOURCE_INFO = exports.TARGET_RESOURCE_GROUP_INFO = exports.TARGET_LOCATION_INFO = exports.TARGET_SUBSCRIPTION_INFO = exports.TARGET_INSTANCES_GET_UNEXPECTED_FAILURE = exports.AZURE_SUBSCRIPTIONS_GET_UNEXPECTED_FAILURE = exports.AZURE_ACCOUNTS_GET_UNEXPECTED_FAILURE = exports.AUTH_KEY_COLUMN_HEADER = void 0;
exports.ASSESSMENT_TIME_TAKEN = exports.ASSESSMENT_END_TIME = exports.ASSESSMENT_START_TIME = exports.ASSESSMENT_STATUS = exports.SOURCE_VERSION = exports.LICENSE_TYPE = exports.SOURCE_INSTANCE_TYPE = exports.RUN_ASSESSMENT_UNEXPECTED_FAILURE = exports.START_ASSESSMENT_UNEXPECTED_FAILURE = exports.TEST_CONNECTIVITY_FAILURE = exports.TEST_CONNECTIVITY_UNEXPECTED_FAILURE = exports.INDEX_MIGRATION_START_UNEXPECTED_FAILURE = exports.SCHEMA_MIGRATION_START_UNEXPECTED_FAILURE = exports.TRIGGER_DATA_MIGRATION_UNEXPECTED_FAILURE = exports.AZURE_TARGET_TEXT = exports.CREATE_SCHEMA_TITLE = exports.INDEX_MIGRATION_IN_PROGRESS_CONTENT = exports.SCHEMA_MIGRATION_IN_PROGRESS_CONTENT = exports.TARGET_TABLE_COUNT_NAME = exports.TARGET_COLLECTION_NAME = exports.SOURCE_COLLECTION = exports.TARGET_DATABASE_NAME = exports.SOURCE_DATABASE = exports.COUNT_COLLECTIONS = exports.COLLECTION_TO_BE_MIGRATED = exports.MODE = exports.SOURCE_COLLECTIONS = exports.SUMMARY_COLLECTION_COUNT_LABEL = exports.SUMMARY_PAGE_TITLE = exports.START_SCHEMA_MIGRATION = exports.START_MIGRATION_TEXT = exports.MIGRATION_SERVICE_SELECTION_PAGE_DESCRIPTION = exports.SERVICE_STATUS_REFRESH_ERROR = exports.INVALID_SERVICE_NAME_ERROR = exports.TARGET = exports.NEW_RESOURCE_GROUP = exports.MIGRATION_SERVICE_DIALOG_DESCRIPTION = exports.TEST_SUCCESSFUL_DMS = exports.CHECK_CONNECTIVITY = exports.TEST_CONNECTION = exports.LOADING_MIGRATION_SERVICES = exports.CREATE = exports.MIGRATION_SERVICE_TARGET_INFO = exports.MIGRATION_SERVICE_NAME_INFO = exports.MIGRATION_SERVICE_RESOURCE_GROUP_INFO = exports.MIGRATION_SERVICE_LOCATION_INFO = exports.MIGRATION_SERVICE_SUBSCRIPTION_INFO = exports.CREATE_MIGRATION_SERVICE_TITLE = exports.DUPLICATE_MIGRATION_NAME = exports.APPLY = void 0;
exports.LAST_SUCCESSFUL_ASSESSMENT = exports.EXTENSION_DESCRIPTION = exports.RETURN_MIGRATIONS = exports.VIEW_REPORT_DETAILS = exports.NEW_ASSESSMENT_DESCRIPTION = exports.RUN_NEW_MIGRATION = exports.NO_ASSESSMENTS = exports.TOP_5_ASSESSMENTS = exports.VIEW_ALL = exports.DASHBOARD = exports.EXCEPTION_MESSAGE = exports.WARNING_MESSAGE = exports.ABORTED_MESSAGE = exports.FAILED_MESSAGE = exports.SEC = exports.MINUTE = exports.HRS = exports.DAYS = exports.REPORT_SAVED_MESSAGE = exports.DELETE_ASSESSMENT = exports.CANCEL_ASSESSMENT_LABEL = exports.COLLECTION_OPTIONS_ASSESSMENT_TYPE = exports.INDEX_ASSESSMENT_TYPE = exports.LIMITS_QUOTAS_ASSESSMENT_TYPE = exports.FEATURE_ASSESSMENT_TYPE = exports.SHARD_KEY_ASSESSMENT_TYPE = exports.DATA_ASSESSMENT_ADVISOR = exports.LIMITS_QUOTAS_ADVISOR = exports.INDEX_ADVISOR = exports.SHARD_KEY_ADVISOR = exports.COLLECTIONS_ADVISOR = exports.FEATURE_ADVISOR = exports.INSTANCE_ADVISOR = exports.SHARD_KEY_DATA_COLLECTION = exports.COLLECTIONS_META_DATA_COLLECTION = exports.FEATURE_DATA_COLLECTION = exports.INSTANCE_DATA_COLLECTION = exports.ABORTED = exports.CANCELED = exports.WARNING = exports.FAILED = exports.INPROGRESS = exports.WAITING = exports.COMPLETED = exports.TIME_TAKEN = exports.ASSESSMENT_STEPS = exports.STAGE_TABLE_HEADER_ABORTED = exports.STAGE_TABLE_HEADER_FAILED = exports.STAGE_TABLE_HEADER = exports.DATA_ASSESSMENT_STATUS = void 0;
exports.NO_MIGRATIONS = exports.ERROR = exports.DOCUMENTS_MIGRATED_ONLINE = exports.DOCUMENTS_MIGRATED_OFFLINE = exports.TARGET_TYPE = exports.TARGET_SERVER = exports.REPLICATION_CHANGES_REPLAYED = exports.PERCENTAGE_COMPLETION_COLUMN_ONLINE = exports.PERCENTAGE_COMPLETION_COLUMN_OFFLINE = exports.PERCENTAGE_COMPLETION = exports.SOURCE_TYPE = exports.SOURCE_TYPE_VERSION = exports.SOURCE_SERVER_INSTANCE = exports.ESSENTIALS = exports.CANCEL_MIGRATION = exports.MIGRATION_SERVICE_DESCRIPTION = exports.SEARCH_FOR_MIGRATIONS = exports.STATUS_LABEL = exports.MIGRATION_STATUS_FILTER = exports.ASCENDING_LABEL = exports.SORT_DROPDOWN = exports.SORT_LABEL = exports.STATUS_FAILED = exports.STATUS_SUCCEEDED = exports.STATUS_COMPLETING = exports.STATUS_ONGOING = exports.STATUS_ALL = exports.DURATION_TOOL_TIP = exports.END_TIME_TOOL_TIP = exports.START_TIME_TOOL_TIP = exports.DURATION_ONLINE = exports.DURATION = exports.AZURE_TARGET_TOOL_TIP = exports.AZURE_TARGET = exports.MIGRATION_MODE_TOOL_TIP = exports.MIGRATION_MODE = exports.STATUS_TOOL_TIP = exports.STATUS_COLUMN = exports.SRC_SERVER_TOOL_TIP = exports.SRC_SERVER = exports.SRC_DATABASE_TOOL_TIP = exports.SRC_DATABASE = exports.MIGRATION_STATUS = exports.MIGRATIONS_TAB_TITLE = exports.DASHBOARD_REFRESH_MIGRATIONS_ERROR_LABEL = exports.DASHBOARD_REFRESH_MIGRATIONS_ERROR_TITLE = exports.SELECT_MIGRATION_SERVICE = exports.VIEW_MIGRATIONS_STATUS_MESSAGE = exports.VIEW_MIGRATIONS_STATUS_TITLE = exports.FILTER_ASSESSMENTS = void 0;
exports.FORCE_DELETE = exports.DELETE = exports.CLOSE = exports.ASSESSMENT_PROGRESS = exports.ASSESSMENTS = exports.ASSESSMENT_REPORT = exports.MIGRATIONS = exports.DOWNLOAD_REPORT = exports.COSMOS_DB_MONGO_VCORE = exports.COSMOS_DB_MONGO_RU = exports.END_TIME = exports.START_TIME = exports.FEEDBACK = exports.HELP_SUPPORT = exports.SETTINGS = exports.STATUS = exports.REFRESH = exports.COPY = exports.NO = exports.YES = exports.DATA_ASSESSMENT_DES = exports.DATA_ASSESSMENT_TITLE = exports.MIGRATION_FAQ = exports.MIGRATION_FAQ_TITLE = exports.MIGRATE_COSMOS_DES = exports.MIGRATE_COSMOS = exports.PRE_MIGRATE_MONGO_DES = exports.PRE_MIGRATE_MONGO = exports.HELP_ARTICLES = exports.REPLICATION_GAP_TABLE = exports.REPLICATION_GAP = exports.COMPLETE_CUTOVER_CONFIRMATION = exports.COMPLETE_CUTOVER_DESCRIPTION = exports.COMPLETE_CUTOVER_PAGE_TITLE = exports.WARNING_CANCEL_MIGRATIONS = exports.WARNING_FORCE_DELETE_MIGRATIONS = exports.WARNING_DELETE_MIGRATIONS = exports.FILTER_RESULTS_FOUND = exports.MIGRATION_STATE_REPLICATING = exports.MIGRATION_STATE_IN_PROGRESS = exports.COMPLETE_CUTOVER_ERROR = exports.COMPLETE_CUTOVER_SUCCESS = exports.CONFIRM_CUTOVER = exports.CUTOVER = exports.MIGRATION_CANCEL_ERROR = exports.MIGRATION_CANCEL_SUCCESS = exports.MIGRATION_DELETE_ERROR = exports.MIGRATION_DELETE_SUCCESS = exports.MIGRATION_STATUS_REFRESH_ERROR = exports.MIGRATION_ERROR = void 0;
exports.MIGRATION_READINESS_HEADING = exports.ISSUES_DETAILS = exports.DATABASE = exports.DATABASES_TABLE_TILE = exports.ASSESSMENT_TYPE_DATA = exports.ASSESSMENT_TYPE_FEATURES = exports.ASSESSMENT_TYPE_SCHEMA = exports.ASSESSMENT_TYPE_ALL = exports.ASSESSMENT_TYPE_LABEL = exports.FINDINGS = exports.INSTANCE = exports.MONGO_SERVER_INSTANCE = exports.SEARCH_FILTER = exports.ASSESSMENT_DURATION_SUBTITLE = exports.ASSESSMENT_CARD_TITLE = exports.ASSESSMENT_TITLE = exports.ASSESSMENT_SUMMARY = exports.SOURCE_LOG_FOLDER_PATH = exports.ASSESSMENT_REPORT_SERVER_STATUS_TEXT = exports.ASSESSMENT_REPORT_LOG_TEXT = exports.SERVER_UP_TIME = exports.ASSESSMENT_DATA = exports.ASSESSMENT_NO_INCOMPATIBILITY = exports.ASSESSMENT_RESULTS_SELECT_DATABASES = exports.ASSESSMENT_ADDITIONAL_DETAILS = exports.ASSESSMENT_MESSAGE = exports.ASSESSMENT_SEVERITY = exports.ASSESSMENT_CATEGORY = exports.ASSESSMENT_ID = exports.SUPPORT_NOTE = exports.CREATE_SUPPORT_REQUEST = exports.SUPPORT_REQUEST = exports.EXPLORE_DOCUMENTATION = exports.SUPPORT_RESOURCES = exports.FEEDBACK_TEXT = exports.CONFIRM_SETTINGS_IP_FIREWALL = exports.CONFIRM_SETTINGS_AZURE_IP = exports.CONFIRM_SETTINGS_CONFIRM = exports.CONFIRM_SETTINGS_ENSURE = exports.CONFIRM_SETTINGS_PRIVATE_ENDPOINT = exports.CONFIRM_SETTINGS_IMPORTANT = exports.CONFIRM_SETTINGS_FIREWALL_EXCEPTIONS = exports.CONFIRM_SETTINGS_ALLOW_CONNECTIONS = exports.CONFIRM_SETTINGS_STEPS = exports.CONFIRM_SETTINGS_TITLE = exports.CLEAR = exports.ASSESSMENT = exports.ASSESSMENT_CREATED_ON = exports.FOR = exports.DELETE_ASSESSMENT_ERROR = void 0;
exports.EXPANDED = exports.DATABASE_SUMMARY_TABLE_CAPTION = exports.COLLECTION_SUMMARY = exports.DATABASE_SUMMARY = exports.ASSESSMENT_OVERVIEW = exports.AVERAGE_DOCUMENT_SIZE = exports.INDEX_SIZE = exports.INDEX_COUNT = exports.DOCUMENT_COUNT = exports.SHARD_KEY = exports.IS_SHARDED = exports.COLLECTION_TYPE = exports.COLLECTION_NAME = exports.DATA_SIZE = exports.TIME_SERIES_COUNT = exports.VIEW_COUNT = exports.COLLECTION_COUNT = exports.DATABASE_NAME = exports.NUMBER_OF_COLLECTIONS = exports.TOTAL_INDEX_COUNT = exports.TOTAL_TIME_SERIES_COUNT = exports.TOTAL_VIEWS_COUNT = exports.TOTAL_COLLECTION_COUNT = exports.TOTAL_DATABASE_COUNT = exports.INSTANCE_SUMMMARY = exports.EXCEEDING_LENGTH = exports.NEW_MIGRATION = exports.FEEDBACK_TITLE = exports.INFO_TEXT = exports.WARNING_ISSUE_TEXT = exports.BLOCKING_ISSUE_TEXT = exports.ASSESSMENT_SUMMARY_DESCRIPTION = exports.NOT_READY = exports.READY_WITH_CONDITION = exports.READY_TEXT = exports.TOTAL_ISSUES_FOUND = exports.ASSESSED_DATABASES = exports.COLLECTION_WITH_PREFIX = exports.DATABASE_WITH_PREFIX = exports.SEVERITY_WITH_PREFIX = exports.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT = exports.WARNING_ISSUES_HEADING_WITH_COUNT = exports.BLOCKING_ISSUES_HEADING_WITH_COUNT = exports.MORE_INFO_ANNOUNCEMENT = exports.MORE_INFO = exports.ADDITIONAL_DETAILS = exports.DESCRIPTION = exports.SUMMARY = exports.ISSUE_BY_SEVERITY = exports.SERVER_ISSUES_SUMMARY_TEXT = void 0;
exports.EMPTY_MIGRATIONS_ERROR_MESSAGE = exports.CollectionStatusLookup = exports.CollectionStateOnline = exports.CollectionState = exports.MigrationStatusLookup = exports.MigrationState = exports.COLLECTION_SUMMARY_LINK_TEXT = exports.ONLINE_DESCRIPTION = exports.OFFLINE_DESCRIPTION = exports.ONLINE = exports.OFFLINE = exports.SELECT_SERVICE_ERROR = exports.SELECT_RESOURCE_GROUP_ERROR = exports.SELECT_SUBSCRIPTION_ERROR = exports.SELECT_TENANT_ERROR = exports.SELECT_ACCOUNT_ERROR = exports.DMS_RESOURCE_GROUP_INFO = exports.DMS_SUBSCRIPTION_INFO = exports.MIGRATION_SERVICE_SELECT_HEADING = exports.MIGRATION_SERVICE_CLEAR = exports.MIGRATION_SERVICE_SELECT_APPLY_LABEL = exports.MIGRATION_SERVICE_SELECT_TITLE = exports.REMEDIATION_ACTIONS = exports.MORE_INFORMATION = exports.COPIED_MESSAGE = exports.DMS_Link = exports.QNA = exports.FEEDBACK_NOTE = exports.FEEDBACK_QUESTION = exports.ERROR_MESSAGE = exports.POSSIBLE_CAUSES = exports.VIEW_ERROR_DETAILS = exports.ERROR_DETAILS = exports.COLLAPSED = void 0;
const utils_1 = require("../common/utils");
const localizationFile_1 = require("../localizationFile");
const path = require("path");
// Initialize the localization
// NOTE: __dirname is always root/bin/dist. We want to pass in root, so we will rebuild the path first
const extensionRoot = path.join(__dirname, "..", "..", "i18n");
localizationFile_1.Localization.setup(extensionRoot);
var ProvisioningState;
(function (ProvisioningState) {
    ProvisioningState["Failed"] = "Failed";
    ProvisioningState["Succeeded"] = "Succeeded";
    ProvisioningState["Creating"] = "Creating";
})(ProvisioningState = exports.ProvisioningState || (exports.ProvisioningState = {}));
var CosmosDatabaseKind;
(function (CosmosDatabaseKind) {
    CosmosDatabaseKind["GlobalDocumentDB"] = "GlobalDocumentDB";
    CosmosDatabaseKind["MongoDB"] = "MongoDB";
    CosmosDatabaseKind["Parse"] = "Parse";
})(CosmosDatabaseKind = exports.CosmosDatabaseKind || (exports.CosmosDatabaseKind = {}));
exports.EXTENSION_NAME = (0, localizationFile_1.localize)('mongo.migration.extension.name', 'Azure Cosmos DB Migration for MongoDB');
// config settings
exports.DEFAULT_FOLDER = (0, localizationFile_1.localize)('mongo.migration.default.folder', '.dmamongo');
exports.CONFIG_FILE = (0, localizationFile_1.localize)('mongo.migration.config.file', 'config.json');
exports.INVALID_PATH_ERROR_MESSAGE = (0, localizationFile_1.localize)('mongo.migration.invalid.path.message', 'Invalid path provided. Using default path -');
// Wizard
function WIZARD_TITLE(instanceName, sourceName) {
    return (0, localizationFile_1.localize)('mongo.migration.wizard.title', "Migrate {0} Server Instance '{1}'", sourceName, instanceName);
}
exports.WIZARD_TITLE = WIZARD_TITLE;
exports.WIZARD_NEXT = (0, localizationFile_1.localize)('mongo.migration.wizard.next', "Next");
exports.WIZARD_BACK = (0, localizationFile_1.localize)('mongo.migration.wizard.back', "Back");
exports.WIZARD_START_MIGRATION_ERROR_TITLE = (0, localizationFile_1.localize)('mongo.migration.wizard.start.migration.error.title', 'An error has occured while starting the migration.');
exports.WIZARD_START_MIGRATION_ERROR_LABEL = (0, localizationFile_1.localize)('mongo.migration.wizard.start.migration.error.label', "An error occurred while starting the migration. Please check your linked Azure connection and try again.");
// New Assessment Dialog
exports.START_ASSESSMENT = (0, localizationFile_1.localize)('mongo.migration.start.assessment', "Start assessment");
exports.RUN_VALIDATION = (0, localizationFile_1.localize)('mongo.migration.run.validation', "Run validation");
exports.VALIDATING_PREREQ = (0, localizationFile_1.localize)('mongo.migration.validating.assessment', "Validating...");
exports.VALIDATION_SUCCESSFUL = (0, localizationFile_1.localize)('mongo.migration.validation.successful', "The connected profile satisfies all prerequisite. Validation successful.");
exports.UNEXPECTED_ERROR_IN_VALIDATION = (0, localizationFile_1.localize)('mongo.migration.validationExecution.error', "Prerequisite check failed unexpectedly.\nPlease verify connectivity to database and try again. If the issue persists, please contact Microsoft Technical support.");
exports.PREREQ_NOT_MET = (0, localizationFile_1.localize)('mongo.migration.prerequisite.notmet', "Prerequisite check failed due to privilege issue.\nPlease validate if the current user has 'readAnyDatabase' and 'clusterMonitor' roles assigned.");
exports.CANCEL_ASSESSMENT = (0, localizationFile_1.localize)('mongo.migration.cancel.assessment', "Cancel");
exports.START_ASSESSMENT_TITLE = (0, localizationFile_1.localize)('mongo.migration.start.assessment.title', 'Run a new assessment of your MongoDB server');
exports.ASSESSMENT_INFORMATION_TEXT = (0, localizationFile_1.localize)('mongo.migration.assessment.information.text', 'Before we start migration, we need to start an assessment on your MongoDB server. By default the assessment is run on whole server');
exports.ASSESSMENT_NAME_LABEL = (0, localizationFile_1.localize)('mongo.migration.assessment.name.label', 'Assessment name');
exports.MIGRATION_NAME_LABEL = (0, localizationFile_1.localize)('mongo.migration.name.label', 'Migration name');
exports.MIGRATION_STATUS_LABEL = (0, localizationFile_1.localize)('mongo.migration.name.label', 'Migration status');
exports.MIGRATION_STATUS_SELECT_SERVICE_TEXT = (0, localizationFile_1.localize)('mongo.migration.select.service.text', 'Add your Azure account to view existing migrations and their status.');
exports.ASSESSMENT_CONFIGURATION_SUBTEXT = (0, localizationFile_1.localize)('mongo.migration.assessment.configurations.subtext', 'Assessment report will be generated based on below configurations.');
exports.OFFERING_LABEL = (0, localizationFile_1.localize)('mongo.migration.offering.label', 'Offering');
exports.OFFERING_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.offering.description.label', 'Azure Cosmos DB for MongoDB is offered in two variants: Request Unit (RU) and vCore-based Azure Cosmos DB for MongoDB. Both options enable straightforward utilization of Azure Cosmos DB as though it were a MongoDB database.');
exports.OFFERING_HELP_LINK_LABEL = (0, localizationFile_1.localize)('mongo.migration.offering.help.link.label', 'What are the differences between the offerings?');
exports.TARGET_PLATFORM_LABEL = (0, localizationFile_1.localize)('mongo.migration.target.platform.label', 'Target platform');
exports.RU_WARNING_TEXT = (0, localizationFile_1.localize)('mongo.migration.target.platform.ru.warning', 'This version of the Azure Cosmos DB Migration for MongoDB extension supports both assessments and migrations for the vCore offering. However, for the RU offering, only assessments are currently available.');
exports.SELECT_A_TARGET = (0, localizationFile_1.localize)('mongo.migration.select.a.target', "Select a target platform");
exports.LOG_FOLDER_LABEL = (0, localizationFile_1.localize)('mongo.migration.log.folder.label', '[Optional] Log folder path');
exports.LOG_FOLDER_INFO = (0, localizationFile_1.localize)('mongo.migration.log.folder.info', 'It\'s highly recommended to provide a Log file path when the MongoDB source version is less than 4.4.');
exports.LOG_FOLDER_HELP_LINK_LABEL = (0, localizationFile_1.localize)('mongo.migration.log.folder.help.link.label', 'How do I get the log folder path?');
exports.BROWSE_BUTTON = (0, localizationFile_1.localize)('mongo.migration.log.folder.path.button', 'Browse');
exports.LOG_FOLDER_PATH_INPUT = (0, localizationFile_1.localize)('mongo.migration.log.folder.path.input', "Log folder path input");
exports.DATA_ASSESSMENT_LABEL = (0, localizationFile_1.localize)('mongo.migration.data.assessment.label', '[Optional] Data assessment report path');
exports.DATA_ASSESSMENT_PATH_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.data.assessment.description', 'Path to data assessment report');
exports.DATA_ASSESSMENT_HELP_LINK_LABEL = (0, localizationFile_1.localize)('mongo.migration.data.assessment.help.link.label', 'How do I generate the data assessment report?');
exports.DATA_ASSESSMENT_PATH_INPUT = (0, localizationFile_1.localize)('mongo.migration.data.assessment.file.path.input', "Data assessment report file path input");
exports.ASSESSMENT_STARTED_MESSAGE = (0, localizationFile_1.localize)('mongo.migration.assessment.started.message', 'MongoDB database assessment has started.');
exports.ASSESSMENT_NAME_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.assessment.name.description', 'Name of the assessment');
exports.MIGRATION_NAME_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.name.description', 'Name of the migration');
exports.TARGET_PLATFORM_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.target.platform.description', 'Target platform for migration assessment');
exports.LOG_FOLDER_PATH_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.log.folder.description', 'Path to MongoDB logs');
exports.DUPLICATE_ASSESSMENT_NAME = (0, localizationFile_1.localize)('mongo.migration.duplicate.assessment.name', 'Assessment name already exists');
exports.INVALID_ASSESSMENT_NAME = (0, localizationFile_1.localize)('mongo.migration.invalid.assessment.name', 'Invalid Assessment name, It can contain only alpha-numeric, underscore and hypen.');
exports.INCORRECT_LENGTH = (0, localizationFile_1.localize)('mongo.migration.incorrect.length', 'Must be between 3 and 16 characters long.');
exports.INVALID_PATH = (0, localizationFile_1.localize)('mongo.migration.invalid.path', 'Path doesn\'t exist in file system.');
exports.INVALID_HOST = (0, localizationFile_1.localize)('mongo.migration.invalid.host', 'Host name in data assessment report does not match.');
exports.INVALID_TARGET_VERSION = (0, localizationFile_1.localize)('mongo.migration.invalid.target.version', 'Target version in data assessment report does not match.');
exports.ASSESSMENT_IN_PROGRESS = (0, localizationFile_1.localize)('mongo.migration.assessment.in.progress', "Assessment in progress");
exports.VIEW_ASSESSMENT_RESULTS = (0, localizationFile_1.localize)('mongo.migration.view.assessment.results', "View assessment results and select database(s) for migration");
exports.ASSESSMENT_PROGRESS_TABLE_HEADER = (0, localizationFile_1.localize)('mongo.migration.assessment.progress.table.header', "Assessment is in progress. Status of assessment steps is shown below:");
function ASSESSMENT_IN_PROGRESS_CONTENT(serverName) {
    return (0, localizationFile_1.localize)('mongo.migration.assessment.in.progress.content', "We are assessing your MongoDB server {0} to check whether you are using any features or syntax that are not supported in Azure Cosmos DB for MongoDB.", serverName);
}
exports.ASSESSMENT_IN_PROGRESS_CONTENT = ASSESSMENT_IN_PROGRESS_CONTENT;
exports.DATABASE_MIGRATION_SERVICE_AUTHENTICATION_KEYS = (0, localizationFile_1.localize)('mongo.migration.database.migration.service.authentication.keys', "Database Migration Service authentication keys");
exports.DMS_PROVISIONING_FAILED = (0, localizationFile_1.localize)('mongo.migration.dms.provision.failed', "Failed to provision a Database Migration Service. Wait a few minutes and then try again.");
//Migration mapping
exports.MIGRATION_MAPPING_TITLE = (0, localizationFile_1.localize)('mongo.migration.mapping.page.title', "Migration mapping");
exports.MIGRATION_SOURCE_NAME = (0, localizationFile_1.localize)('mongo.migration.mapping.source.name', "Source namespace");
exports.MIGRATION_ACTION = (0, localizationFile_1.localize)('mongo.migration.mapping.action', "Action");
exports.MIGRATION_TARGET_NAME = (0, localizationFile_1.localize)('mongo.migration.mapping.target.name', "Target namespace");
exports.MIGRATION_MAPPING_ERROR_TITLE = (0, localizationFile_1.localize)('mongo.migration.mapping.error.title', "An error occurred while retrieving schema from source and target databases.");
function MIGRATION_MAPPING_ERROR(message) {
    return (0, localizationFile_1.localize)('mongo.migration.mapping.error', "Schema retrieval error: {0}", message);
}
exports.MIGRATION_MAPPING_ERROR = MIGRATION_MAPPING_ERROR;
function MIGRATION_MAPPING_EXISTS(namespace) {
    return (0, localizationFile_1.localize)('mongo.migration.mapping.namespace.exists', "The collection {0} already exists within the target account. Choosing to migrate will result in overwriting the collection.", namespace);
}
exports.MIGRATION_MAPPING_EXISTS = MIGRATION_MAPPING_EXISTS;
function MIGRATING_CAPPED_COLLECTION(namespace) {
    return (0, localizationFile_1.localize)('mongo.migration.mapping.migrating.capped.collection', "Capped collections are not supported in Azure Cosmos DB for MongoDB vCore. Collection {0} will be migrated as a regular (non-capped) collection. After migration, please use TTL indexes to limit the collection size instead.", namespace);
}
exports.MIGRATING_CAPPED_COLLECTION = MIGRATING_CAPPED_COLLECTION;
exports.SCHEMA_LOADING_IN_PROGRESS = (0, localizationFile_1.localize)('mongo.migration.schema.loading.in.progress', "Schema loading in progress.");
exports.SCHEMA_LOADING_INFO = (0, localizationFile_1.localize)('mongo.migration.schema.loading.info', "we are loading collections from both source and target, please wait.");
exports.NO_MIGRATE_ERROR = (0, localizationFile_1.localize)('mongo.migration.no.migrate.action.error', "Choose Migrate action on at least one row");
// Target selection
exports.AZURE_TARGET_PAGE_TITLE = (0, localizationFile_1.localize)('mongo.migration.azure.target.title', "Specify Azure Cosmos DB for MongoDB Target Account");
function AZURE_TARGET_PAGE_DESCRIPTION(targetOffering = 'vCore') {
    return (0, localizationFile_1.localize)('mongo.migration.azure.target.description', "Select an Azure account and your target {0}.", targetOffering);
}
exports.AZURE_TARGET_PAGE_DESCRIPTION = AZURE_TARGET_PAGE_DESCRIPTION;
exports.AZURE_TARGET_RU_OFFERING = (0, localizationFile_1.localize)('mongo.migration.azure.target.ru.offering', "RU-based Azure Cosmos DB for MongoDB");
exports.AZURE_TARGET_VCORE_OFFERING = (0, localizationFile_1.localize)('mongo.migration.azure.target.vcore.offering', "vCore-based Azure Cosmos DB for MongoDB");
// accounts selection
exports.ACCOUNTS_SELECTION_PAGE_TITLE = (0, localizationFile_1.localize)('mongo.migration.wizard.account.title', "Azure account");
exports.ACCOUNTS_SELECTION_PAGE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.wizard.account.description', "Select an Azure account linked to Azure Data Studio, or link one now.");
exports.ACCOUNT_SELECTION_PAGE_NO_LINKED_ACCOUNTS_ERROR = (0, localizationFile_1.localize)('mongo.migration.wizard.account.noAccount.error', "Add a linked account and then try again.");
exports.ACCOUNT_LINK_BUTTON_LABEL = (0, localizationFile_1.localize)('mongo.migration.wizard.account.add.button.label', "Link account");
exports.INVALID_ACCOUNT_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.account.error', "To continue, select a valid Azure account.");
exports.SELECT_AN_TARGET_TYPE = (0, localizationFile_1.localize)('mongo.migration.select.service.select.target.type.', "Select target Azure mongo Type");
exports.SELECT_AN_ACCOUNT = (0, localizationFile_1.localize)('mongo.migration.select.service.select.a.', "Sign into Azure and select an account");
exports.SELECT_A_TENANT = (0, localizationFile_1.localize)('mongo.migration.select.service.select.a.tenant', "Select a tenant");
exports.SELECT_A_SUBSCRIPTION = (0, localizationFile_1.localize)('mongo.migration.select.service.select.a.subscription', "Select a subscription");
exports.SELECT_A_LOCATION = (0, localizationFile_1.localize)('mongo.migration.select.service.select.a.location', "Select a location");
exports.SELECT_A_RESOURCE_GROUP = (0, localizationFile_1.localize)('mongo.migration.select.service.select.a.resource.group', "Select a resource group");
exports.INVALID_SUBSCRIPTION_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.subscription.error', "To continue, select a valid subscription.");
exports.INVALID_LOCATION_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.location.error', "To continue, select a valid location.");
exports.INVALID_RESOURCE_GROUP_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.resourceGroup.error', "To continue, select a valid resource group.");
exports.NO_SUBSCRIPTIONS_FOUND = (0, localizationFile_1.localize)('mongo.migration.no.subscription.found', "No subscriptions found.");
exports.NO_LOCATION_FOUND = (0, localizationFile_1.localize)('mongo.migration.no.location.found', "No locations found.");
exports.RESOURCE_GROUP_NOT_FOUND = (0, localizationFile_1.localize)('mongo.migration.resource.group.not.found', "No resource groups found.");
exports.NO_RU_INSTANCE_FOUND = (0, localizationFile_1.localize)('mongo.migration.no.ruInstance.found', "No Azure Cosmos for MongoDB RU instances found.");
exports.INVALID_RU_INSTANCE_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.ruInstance.error', "To continue, select a valid Azure Cosmos for MongoDB RU instance.");
exports.NO_VCORE_INSTANCE_FOUND = (0, localizationFile_1.localize)('mongo.migration.no.vcoreInstance.found', "No Azure Cosmos for MongoDB vCore instances found.");
exports.INVALID_VCORE_INSTANCE_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.vcoreInstance.error', "To continue, select a valid Azure Cosmos for MongoDB vCore instance.");
exports.AZURE_TENANT = (0, localizationFile_1.localize)('mongo.migration.azure.tenant', "Azure AD tenant");
function ACCOUNT_CREDENTIALS_REFRESH(accountName) {
    return (0, localizationFile_1.localize)('mongo.migration.account.credentials.refresh.required', "{0} (requires credentials refresh)", accountName);
}
exports.ACCOUNT_CREDENTIALS_REFRESH = ACCOUNT_CREDENTIALS_REFRESH;
function UNAVAILABLE_TARGET_PREFIX(targetName) {
    return (0, localizationFile_1.localize)('mongo.migration.unavailable.target', "(Unavailable) {0}", targetName);
}
exports.UNAVAILABLE_TARGET_PREFIX = UNAVAILABLE_TARGET_PREFIX;
exports.NAME = (0, localizationFile_1.localize)('mongo.migration.name', "Name");
exports.SUBSCRIPTION = (0, localizationFile_1.localize)('mongo.migration.subscription', "Subscription");
exports.LOCATION = (0, localizationFile_1.localize)('mongo.migration.location', "Location");
exports.RESOURCE_GROUP = (0, localizationFile_1.localize)('mongo.migration.resourceGroups', "Resource group");
exports.AUTH_KEY_COLUMN_HEADER = (0, localizationFile_1.localize)('mongo.migration.authKeys.header', "Authentication key");
exports.AZURE_ACCOUNTS_GET_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.azure.accounts.get.unexpected.failure', 'Unexpected failure while populating Azure accounts');
exports.AZURE_SUBSCRIPTIONS_GET_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.azure.subscriptions.get.unexpected.failure', 'Unexpected failure while populating Azure Subscriptions');
exports.TARGET_INSTANCES_GET_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.target.instances.get.unexpected.failure', 'Unexpected failure while populating resource groups and target instances');
// Target info tooltip
exports.TARGET_SUBSCRIPTION_INFO = (0, localizationFile_1.localize)('mongo.migration.sku.subscription', "Subscription name for your Azure Cosmos for MongoDB target");
exports.TARGET_LOCATION_INFO = (0, localizationFile_1.localize)('mongo.migration.sku.location', "Azure region for your Azure Cosmos for MongoDB target. Only regions that contain a target eligible for migration will be shown.");
exports.TARGET_RESOURCE_GROUP_INFO = (0, localizationFile_1.localize)('mongo.migration.sku.resource_group', "Resource group for your Azure Cosmos for MongoDB target. Only resource groups that contain a target eligible for migration will be shown.");
exports.TARGET_RESOURCE_INFO = (0, localizationFile_1.localize)('mongo.migration.sku.resource', "Your Azure Cosmos for MongoDB target resource name");
exports.TARGET_CONNECTION_TYPE = (0, localizationFile_1.localize)('mongo.migration.target.connection.type', "Connection Type");
exports.TARGET_CONNECTION_STRING = (0, localizationFile_1.localize)('mongo.migration.target.connection.string', "Connection string");
exports.TARGET_CONNECTION_STRING_PLACEHOLDER = (0, localizationFile_1.localize)('mongo.migration.connection.string.placeholder', "Enter the target connection string");
exports.TARGET_CONNECTION_PARAMETERS = (0, localizationFile_1.localize)('mongo.migration.target.connection.parameters', "Parameters");
exports.TARGET_USERNAME_LABEL = (0, localizationFile_1.localize)('mongo.migration.username.label', "Target user name");
exports.TARGET_USERNAME_PLACEHOLDER = (0, localizationFile_1.localize)('mongo.migration.username.placeholder', "Enter the target user name");
exports.TARGET_PASSWORD_LABEL = (0, localizationFile_1.localize)('mongo.migration.password.label', "Target password");
exports.TARGET_PASSWORD_PLACEHOLDER = (0, localizationFile_1.localize)('mongo.migration.password.placeholder', "Enter the target password");
exports.SELECT_SERVICE_PLACEHOLDER = (0, localizationFile_1.localize)('mongo.migration.select.service.select.migration.target', "Select a target server.");
exports.AZURE_TARGET_CONNECTION_ERROR_TITLE = (0, localizationFile_1.localize)('mongo.migration.wizard.connection.error.title', "Authentication credentials could not be verified. Kindly review the provided credentials and attempt the operation once more. Additionally, verify that there are no firewall constraints blocking access to your target Azure Cosmos DB for MongoDB account.");
function COSMOS_TARGET_CONNECTION_ERROR(message) {
    return (0, localizationFile_1.localize)('mongo.migration.wizard.target.connection.error', "Connection error: {0}", message);
}
exports.COSMOS_TARGET_CONNECTION_ERROR = COSMOS_TARGET_CONNECTION_ERROR;
// Migration service context
exports.MIGRATION_SERVICE_SELECT_SERVICE_PROMPT = (0, localizationFile_1.localize)('mongo.migration.select.service.prompt', 'Select a Database Migration Service');
function MIGRATION_SERVICE_SERVICE_PROMPT(serviceName) {
    return (0, localizationFile_1.localize)('mongo.migration.service.prompt', '{0} (change)', serviceName);
}
exports.MIGRATION_SERVICE_SERVICE_PROMPT = MIGRATION_SERVICE_SERVICE_PROMPT;
exports.SERVICE_CONNECTION_STATUS = (0, localizationFile_1.localize)('mongo.migration.connection.status', "Connection status");
// Target Data migration service
exports.MIGRATION_SERVICE_PAGE_TITLE = (0, localizationFile_1.localize)('mongo.migration.service.page.title', "Select or Create Azure Database Migration Service");
exports.MIGRATION_SERVICE_PAGE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.service.page.description', "Azure Database Migration Service orchestrates database migration activities and tracks their progress. You can select an existing Database Migration Service if you have created one previously, or create a new one below.");
exports.MIGRATION_SERVICE_NOT_FOUND_ERROR = (0, localizationFile_1.localize)('mongo.migration.service.page.not.found', "No Database Migration Service found. Create a new one.");
exports.CREATE_NEW = (0, localizationFile_1.localize)('mongo.migration.create.new', "Create new");
exports.CREATE_NEW_MIGRATION_SERVICE = (0, localizationFile_1.localize)('mongo.migration.create.new.migration.service', "Create new migration service");
exports.CREATE_NEW_RESOURCE_GROUP = (0, localizationFile_1.localize)('mongo.migration.create.new.resource.group', "Create new resource group");
exports.INVALID_SERVICE_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.migration.service.error', "Select a valid Database Migration Service.");
exports.SERVICE_OFFLINE_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.migration.service.offline.error', "Select a Database Migration Service that is connected to a node.");
exports.MIGRATION_MODE_LABEL = (0, localizationFile_1.localize)('mongo.migration.database.migration.mode.label', "Migration mode");
exports.MIGRATION_MODE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.database.migration.mode.description', "To migrate to the Azure Cosmos for MongoDB target, choose a migration mode based on your downtime requirements.");
exports.MIGRATION_MODE_OFFLINE_LABEL = (0, localizationFile_1.localize)('mongo.migration.database.migration.mode.offline.label', "Offline");
exports.MIGRATION_MODE_ONLINE_LABEL = (0, localizationFile_1.localize)('mongo.migration.database.migration.mode.online.label', "Online");
exports.MIGRATION_MODE_OFFLINE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.database.migration.mode.offline.description', "Application downtime will start when the migration starts.");
exports.MIGRATION_SERVICE_SELECT_SERVICE_LABEL = (0, localizationFile_1.localize)('mongo.migration.select.migration.service.label', 'Azure Database Migration Service');
exports.SELECT_A_SERVICE = (0, localizationFile_1.localize)('mongo.migration.select.service.select.a.service', "Select a Database Migration Service");
exports.SERVICE_NOT_FOUND = (0, localizationFile_1.localize)('mongo.migration.service.not.found', "No Migration Services found. To continue, create a new one.");
exports.SELECT_RESOURCE_GROUP = (0, localizationFile_1.localize)('mongo.migration.resourceGroup.select', "Select a resource group.");
exports.SELECT_RESOURCE_GROUP_PROMPT = (0, localizationFile_1.localize)('mongo.migration.resourceGroup.select.prompt', "Select a resource group value first.");
function SERVICE_READY(serviceName) {
    return (0, localizationFile_1.localize)('mongo.migration.service.ready', "Azure Database Migration Service '{0}' was successfully provisioned and ready to use.", serviceName);
}
exports.SERVICE_READY = SERVICE_READY;
function SERVICE_ERROR_NOT_READY(serviceName, error) {
    return (0, localizationFile_1.localize)('mongo.migration.service.error.not.ready', "The following error occurred while retrieving registration information for Azure Database Migration Service '{0}'. Please click refresh and try again. Error: '{1}'.", serviceName, error);
}
exports.SERVICE_ERROR_NOT_READY = SERVICE_ERROR_NOT_READY;
exports.CREATING_RESOURCE_GROUP = (0, localizationFile_1.localize)('mongo.migration.creating.rg.loading', "Creating resource group");
exports.RESOURCE_GROUP_CREATED = (0, localizationFile_1.localize)('mongo.migration.rg.created', "Resource group created");
exports.RESOURCE_GROUP_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.resource.group.description', "A resource group is a container that holds related resources for an Azure solution.");
exports.NAME_OF_NEW_RESOURCE_GROUP = (0, localizationFile_1.localize)('mongo.migration.name.of.new.rg', "Name of new resource group");
exports.RESOURCE_GROUP_FETCH_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.resource.group.fetch.unexpected.failure', 'Unexpected failure while fetching resource groups');
exports.MIGRATION_SERVICES_FETCH_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.migration.services.fetch.unexpected.failure', 'Unexpected failure while retrieving migration services');
exports.OK = (0, localizationFile_1.localize)('mongo.migration.ok', "OK");
exports.CANCEL = (0, localizationFile_1.localize)('mongo.migration.cancel', "Cancel");
exports.APPLY = (0, localizationFile_1.localize)('mongo.migration.apply', "Apply");
exports.DUPLICATE_MIGRATION_NAME = (0, localizationFile_1.localize)('mongo.migration.duplicate.migration.name', 'Migration name already exists');
// Create migration service
exports.CREATE_MIGRATION_SERVICE_TITLE = (0, localizationFile_1.localize)('mongo.migration.services.dialog.title', "Create Azure Database Migration Service");
exports.MIGRATION_SERVICE_SUBSCRIPTION_INFO = (0, localizationFile_1.localize)('mongo.migration.services.subscription', "Subscription name for your Azure Database Migration Service.");
exports.MIGRATION_SERVICE_LOCATION_INFO = (0, localizationFile_1.localize)('mongo.migration.services.location', "Azure region for your Azure Database Migration Service. This should be the same region as your target Azure mongo.");
exports.MIGRATION_SERVICE_RESOURCE_GROUP_INFO = (0, localizationFile_1.localize)('mongo.migration.services.resource.group', "Resource group for your Azure Database Migration Service.");
exports.MIGRATION_SERVICE_NAME_INFO = (0, localizationFile_1.localize)('mongo.migration.services.name', "Azure Database Migration Service name.");
exports.MIGRATION_SERVICE_TARGET_INFO = (0, localizationFile_1.localize)('mongo.migration.services.target', "Azure Cosmos DB for MongoDB target selected as default.");
exports.CREATE = (0, localizationFile_1.localize)('mongo.migration.create', "Create");
exports.LOADING_MIGRATION_SERVICES = (0, localizationFile_1.localize)('mongo.migration.service.container.loading.help', "Loading Migration Services");
exports.TEST_CONNECTION = (0, localizationFile_1.localize)('mongo.migration.test.connection', "Test connection");
exports.CHECK_CONNECTIVITY = (0, localizationFile_1.localize)('mongo.migration.test.check.connectivity', "Check connectivity");
exports.TEST_SUCCESSFUL_DMS = (0, localizationFile_1.localize)('mongo.migration.test.dms.provisioning', "Test Created DMS");
exports.MIGRATION_SERVICE_DIALOG_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.services.container.description', "Enter the details below to create a new Azure Database Migration Service.");
function NEW_RESOURCE_GROUP(resourceGroupName) {
    return (0, localizationFile_1.localize)('mongo.migration.new.resource.group', "(new) {0}", resourceGroupName);
}
exports.NEW_RESOURCE_GROUP = NEW_RESOURCE_GROUP;
exports.TARGET = (0, localizationFile_1.localize)('mongo.migration.target', "Target");
exports.INVALID_SERVICE_NAME_ERROR = (0, localizationFile_1.localize)('mongo.migration.invalid.service.name.error', "Enter a valid name for the Migration Service.");
exports.SERVICE_STATUS_REFRESH_ERROR = (0, localizationFile_1.localize)('mongo.migration.service.status.refresh.error', 'An error occurred while refreshing the migration service creation status.');
exports.MIGRATION_SERVICE_SELECTION_PAGE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.target.migration.service.description', "Azure Database Migration Service orchestrates database migration activities and tracks their progress. You can select an existing Database Migration Service for Azure CosmosDB target if you have created one previously or create a new one below.");
// Summary page
exports.START_MIGRATION_TEXT = (0, localizationFile_1.localize)('mongo.migration.start.migration.button', "Start migration");
exports.START_SCHEMA_MIGRATION = (0, localizationFile_1.localize)('mongo.migration.start.schema.migration.button', "Create Schema");
exports.SUMMARY_PAGE_TITLE = (0, localizationFile_1.localize)('mongo.migration.summary.page.title', "Summary");
exports.SUMMARY_COLLECTION_COUNT_LABEL = (0, localizationFile_1.localize)('mongo.migration.summary.collection.count', "Collections for migration");
exports.SOURCE_COLLECTIONS = (0, localizationFile_1.localize)('mongo.migration.source.collections', "Source collections");
exports.MODE = (0, localizationFile_1.localize)('mongo.migration.mode', "Mode");
exports.COLLECTION_TO_BE_MIGRATED = (0, localizationFile_1.localize)('mongo.migration.collections.to.be.migrated', "Collections to be migrated");
function COUNT_COLLECTIONS(count) {
    return (count === 1)
        ? (0, localizationFile_1.localize)('mongo.migration.count.collection.single', "{0} collection", count)
        : (0, localizationFile_1.localize)('mongo.migration.count.collection.multiple', "{0} collections", (0, utils_1.formatNumber)(count));
}
exports.COUNT_COLLECTIONS = COUNT_COLLECTIONS;
exports.SOURCE_DATABASE = (0, localizationFile_1.localize)('mongo.migration.source.database', "Source database name");
exports.TARGET_DATABASE_NAME = (0, localizationFile_1.localize)('mongo.migration.target.database.name', "Target database name");
exports.SOURCE_COLLECTION = (0, localizationFile_1.localize)('mongo.migration.source.collection', "Source collection name");
exports.TARGET_COLLECTION_NAME = (0, localizationFile_1.localize)('mongo.migration.target.collection.name', "Target collection name");
exports.TARGET_TABLE_COUNT_NAME = (0, localizationFile_1.localize)('mongo.migration.target.table.count.name', "Tables selected");
function SCHEMA_MIGRATION_IN_PROGRESS_CONTENT(databases, collections) {
    return (0, localizationFile_1.localize)('mongo.migration.schema,migration.in.progress.content', "We are creating {0} databases and {1} collections, please wait while we are working on it.", databases, collections);
}
exports.SCHEMA_MIGRATION_IN_PROGRESS_CONTENT = SCHEMA_MIGRATION_IN_PROGRESS_CONTENT;
exports.INDEX_MIGRATION_IN_PROGRESS_CONTENT = (0, localizationFile_1.localize)('mongo.migration.index,migration.in.progress.content', "We are creating indexes now, please wait.");
exports.CREATE_SCHEMA_TITLE = (0, localizationFile_1.localize)('mongo.migration.create.schema.page.title', "Create schema");
exports.AZURE_TARGET_TEXT = (0, localizationFile_1.localize)('mongo.migration.azure.target.text', "Azure Cosmos DB for MongoDB Target Account");
exports.TRIGGER_DATA_MIGRATION_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.summary.page.unexpected.failure', 'Unexpected failure while starting data migration');
// Schema migration
exports.SCHEMA_MIGRATION_START_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.schema.migration.start.unexpected.failure', 'Unexpected failure while starting schema migration');
exports.INDEX_MIGRATION_START_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.index.migration.start.unexpected.failure', 'Unexpected failure while starting index migration');
// Test connectivity
exports.TEST_CONNECTIVITY_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.test.connectivity.unexpected.failure', 'Unexpected failure while testing connectivity. Please ensure that source and target clusters allow connections from global Azure data centers.');
function TEST_CONNECTIVITY_FAILURE(errorMessage) {
    return (0, localizationFile_1.localize)('mongo.migration.test.connectivity.failure', 'Connectivity from Azure Integration Runtime to the source or target cluster failed,{0}.', errorMessage);
}
exports.TEST_CONNECTIVITY_FAILURE = TEST_CONNECTIVITY_FAILURE;
// View assessment result
exports.START_ASSESSMENT_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.start.assessment.unexpected.failure', 'Unexpected failure while starting assessment run');
exports.RUN_ASSESSMENT_UNEXPECTED_FAILURE = (0, localizationFile_1.localize)('mongo.migration.run.assessment.unexpected.failure', 'Unexpected failure while running assessment');
//Progress Assessment
exports.SOURCE_INSTANCE_TYPE = (0, localizationFile_1.localize)('mongo.migration.instance.type', "Source Instance Type");
exports.LICENSE_TYPE = (0, localizationFile_1.localize)('mongo.migration.license.type', "License Type");
exports.SOURCE_VERSION = (0, localizationFile_1.localize)('mongo.migration.source.version', "Source version");
exports.ASSESSMENT_STATUS = (0, localizationFile_1.localize)('mongo.migration.assessment.status', "Assessment status");
exports.ASSESSMENT_START_TIME = (0, localizationFile_1.localize)('mongo.migration.assessment.start.time', "Assessment start time");
exports.ASSESSMENT_END_TIME = (0, localizationFile_1.localize)('mongo.migration.assessment.end.time', "Assessment end time");
exports.ASSESSMENT_TIME_TAKEN = (0, localizationFile_1.localize)('mongo.migration.assessment.time.taken', "Assessment time taken");
exports.DATA_ASSESSMENT_STATUS = (0, localizationFile_1.localize)('mongo.migration.data.assessment.status', "Data Assessment status");
exports.STAGE_TABLE_HEADER = (0, localizationFile_1.localize)('mongo.migration.stage.table.header', "Assessment is in progress. Status of assessment steps is shown below:");
exports.STAGE_TABLE_HEADER_FAILED = (0, localizationFile_1.localize)('mongo.migration.stage.table.header.failed', "Assessment has failed. Status of assessment steps is shown below:");
exports.STAGE_TABLE_HEADER_ABORTED = (0, localizationFile_1.localize)('mongo.migration.stage.table.header.aborted', "Assessment has aborted. Status of assessment steps is shown below:");
exports.ASSESSMENT_STEPS = (0, localizationFile_1.localize)('mongo.migration.assessment.steps', "Assessment steps");
exports.TIME_TAKEN = (0, localizationFile_1.localize)('mongo.migration.time.taken', "Time taken");
exports.COMPLETED = (0, localizationFile_1.localize)('mongo.migration.completed', "Completed");
exports.WAITING = (0, localizationFile_1.localize)('mongo.migration.waiting', "Waiting");
exports.INPROGRESS = (0, localizationFile_1.localize)('mongo.migration.inprogress', "In progress");
exports.FAILED = (0, localizationFile_1.localize)('mongo.migration.failed', "Failed");
exports.WARNING = (0, localizationFile_1.localize)('mongo.migration.warning', "Warning");
exports.CANCELED = (0, localizationFile_1.localize)('mongo.migration.canceled', "Canceled");
exports.ABORTED = (0, localizationFile_1.localize)('mongo.migration.aborted', "Aborted");
exports.INSTANCE_DATA_COLLECTION = (0, localizationFile_1.localize)('mongo.migration.instance.data.collection', 'Instance data collection');
exports.FEATURE_DATA_COLLECTION = (0, localizationFile_1.localize)('mongo.migration.feature.data.collection', 'Feature data collection');
exports.COLLECTIONS_META_DATA_COLLECTION = (0, localizationFile_1.localize)('mongo.migration.collections.data.collection', 'Collections metadata collection');
exports.SHARD_KEY_DATA_COLLECTION = (0, localizationFile_1.localize)('mongo.migration.shard.key.data.collection', 'Shard key data collection');
exports.INSTANCE_ADVISOR = (0, localizationFile_1.localize)('mongo.migration.instance.summary.advisor', 'Instance summary advisor');
exports.FEATURE_ADVISOR = (0, localizationFile_1.localize)('mongo.migration.feature.advisor', 'Feature advisor');
exports.COLLECTIONS_ADVISOR = (0, localizationFile_1.localize)('mongo.migration.collections.advisor', 'Collection options advisor');
exports.SHARD_KEY_ADVISOR = (0, localizationFile_1.localize)('mongo.migration.shard.key.advisor', 'Shard key advisor');
exports.INDEX_ADVISOR = (0, localizationFile_1.localize)('mongo.migration.index.advisor', 'Index advisor');
exports.LIMITS_QUOTAS_ADVISOR = (0, localizationFile_1.localize)('mongo.migration.limits.quotas.advisor', 'Limits and Quotas advisor');
exports.DATA_ASSESSMENT_ADVISOR = (0, localizationFile_1.localize)('mongo.migration.data.assessment.advisor', 'Data assessment advisor');
exports.SHARD_KEY_ASSESSMENT_TYPE = (0, localizationFile_1.localize)('mongo.migration.shard.key.assessment', 'Shard Key Assessment');
exports.FEATURE_ASSESSMENT_TYPE = (0, localizationFile_1.localize)('mongo.migration.feature.compatibility.assessment', 'Feature Assessment');
exports.LIMITS_QUOTAS_ASSESSMENT_TYPE = (0, localizationFile_1.localize)('mongo.migration.limitsquotas.compatibility.assessment', 'Limits and Quotas Assessment');
exports.INDEX_ASSESSMENT_TYPE = (0, localizationFile_1.localize)('mongo.migration.index.assessment', 'Index Assessment');
exports.COLLECTION_OPTIONS_ASSESSMENT_TYPE = (0, localizationFile_1.localize)('mongo.migration.collections.options.assessment', 'Collection Options Assessment');
exports.CANCEL_ASSESSMENT_LABEL = (0, localizationFile_1.localize)('mongo.migration.canel.assessment.label', "Cancel Assessment");
exports.DELETE_ASSESSMENT = (0, localizationFile_1.localize)('mongo.migration.delete.assessment', "Delete Assessment");
exports.REPORT_SAVED_MESSAGE = (0, localizationFile_1.localize)('mongo.migration.report.message', "Report has been saved. Do you want to open it?");
function DAYS(days) {
    return days > 1 ? (0, localizationFile_1.localize)('mongo.migration.days', "{0} days", days) : (0, localizationFile_1.localize)('mongo.migration.day', "{0} day", days);
}
exports.DAYS = DAYS;
function HRS(hrs) {
    return hrs > 1 ? (0, localizationFile_1.localize)('mongo.migration.hrs', "{0} hours", hrs) : (0, localizationFile_1.localize)('mongo.migration.hr', "{0} hour", hrs);
}
exports.HRS = HRS;
function MINUTE(mins) {
    mins = Math.round(mins);
    return mins > 1 ? (0, localizationFile_1.localize)('mongo.migration.mins', "{0} minutes", mins) : (0, localizationFile_1.localize)('mongo.migration.min', "{0} minute", mins);
}
exports.MINUTE = MINUTE;
function SEC(sec) {
    return (0, localizationFile_1.localize)('mongo.migration.secs', "{0} seconds", Math.round(sec * 100) / 100);
}
exports.SEC = SEC;
function FAILED_MESSAGE(stage) {
    return (0, localizationFile_1.localize)('mongo.migration.failed.message', 'Assessment failed during {0}.', stage);
}
exports.FAILED_MESSAGE = FAILED_MESSAGE;
function ABORTED_MESSAGE(stage) {
    return (0, localizationFile_1.localize)('mongo.migration.aborted.message', 'Assessment aborted at {0}.', stage);
}
exports.ABORTED_MESSAGE = ABORTED_MESSAGE;
function WARNING_MESSAGE(assessmentStage) {
    return (0, localizationFile_1.localize)('mongo.migration.warning.message', 'Warning occured at {0}', assessmentStage);
}
exports.WARNING_MESSAGE = WARNING_MESSAGE;
function EXCEPTION_MESSAGE(assessmentName) {
    return (0, localizationFile_1.localize)('mongo.migration.exception.message', '{0} failed with error message : ', assessmentName);
}
exports.EXCEPTION_MESSAGE = EXCEPTION_MESSAGE;
//Dashboard
exports.DASHBOARD = (0, localizationFile_1.localize)('mongo.migration.dashboard', "Dashboard");
exports.VIEW_ALL = (0, localizationFile_1.localize)('mongo.migration.view.all', 'View all');
exports.TOP_5_ASSESSMENTS = (0, localizationFile_1.localize)('mongo.migration.assessment.completed', 'Last five assessments');
exports.NO_ASSESSMENTS = (0, localizationFile_1.localize)('mongo.migration.no.assessments', 'No assessment has been done. \nRun a new assessment.');
exports.RUN_NEW_MIGRATION = (0, localizationFile_1.localize)('mongo.migration.run.new.migration', 'Assess and Migrate Database(s)');
exports.NEW_ASSESSMENT_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.new.assessment.description', 'Conduct a workload assessment and then migrate to Azure Cosmos DB.');
exports.VIEW_REPORT_DETAILS = (0, localizationFile_1.localize)('mongo.migration.report.details', 'View report details');
exports.RETURN_MIGRATIONS = (0, localizationFile_1.localize)('mongo.migration.return.migration', 'Migrations >');
exports.EXTENSION_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.extension.description', 'The extension helps you run an end-to-end assessment on your mongoDB workload and seamlessly migrate your workload to Azure Cosmos DB for MongoDB.');
exports.LAST_SUCCESSFUL_ASSESSMENT = (0, localizationFile_1.localize)('mongo.migration.last.successful.assessment', 'Last successful assessment ran on ');
exports.FILTER_ASSESSMENTS = (0, localizationFile_1.localize)('mongo.migration.filter.assessments', 'Filter for assessment name...');
exports.VIEW_MIGRATIONS_STATUS_TITLE = (0, localizationFile_1.localize)('mongo.migration.view.status.title', 'Database Migration Status');
exports.VIEW_MIGRATIONS_STATUS_MESSAGE = (0, localizationFile_1.localize)('mongo.migration.view.status.message', 'Add your Azure account to view existing migrations and their status.');
exports.SELECT_MIGRATION_SERVICE = (0, localizationFile_1.localize)('mongo.migration.select.service', 'Select Migration Service');
exports.DASHBOARD_REFRESH_MIGRATIONS_ERROR_TITLE = (0, localizationFile_1.localize)('mongo.migration.refresh.migrations.error.title', 'An error has occured while refreshing the migrations list.');
exports.DASHBOARD_REFRESH_MIGRATIONS_ERROR_LABEL = (0, localizationFile_1.localize)('mongo.migration.refresh.migrations.error.label', "An error occurred while refreshing the migrations list. Please check your linked Azure connection and click refresh to try again.");
//Migrations Tab
exports.MIGRATIONS_TAB_TITLE = (0, localizationFile_1.localize)('mongo.migration.tab.migrations.title', 'Migrations');
exports.MIGRATION_STATUS = (0, localizationFile_1.localize)('mongo.migration.migration.status', "Migration Status");
exports.SRC_DATABASE = (0, localizationFile_1.localize)('mongo.migration.src.database', "Source database");
exports.SRC_DATABASE_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.src.database.tool.tip', "Name of the source database");
exports.SRC_SERVER = (0, localizationFile_1.localize)('mongo.migration.src.server', "Source name");
exports.SRC_SERVER_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.src.server.tool.tip', "Name of the source server");
exports.STATUS_COLUMN = (0, localizationFile_1.localize)('mongo.migration.database.status.column', "Migration status");
exports.STATUS_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.database.status.tool.tip', "The current status of the migration");
exports.MIGRATION_MODE = (0, localizationFile_1.localize)('mongo.migration.migration.mode', "Migration mode");
exports.MIGRATION_MODE_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.database.migration.migration.mode.tool.tip', "In Azure Database Migration Service, you can migrate your databases offline or while they are online. In an offline migration, application downtime starts when the migration starts. To limit downtime to the time it takes you to cut over to the new environment after the migration, use an online migration.");
exports.AZURE_TARGET = (0, localizationFile_1.localize)('mongo.migration.azure.target', "Azure target server");
exports.AZURE_TARGET_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.database.migration.target.type.tool.tip', "The azure resource target server [vCore instance, RU instance]");
exports.DURATION = (0, localizationFile_1.localize)('mongo.migration.duration', "Duration");
exports.DURATION_ONLINE = (0, localizationFile_1.localize)('mongo.migration.duration.online', "Initial Load - Duration");
exports.START_TIME_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.database.migration.start.time.tool.tip', "The start time for the migration");
exports.END_TIME_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.database.migration.finish.time.tool.tip', "The end time for the migration");
exports.DURATION_TOOL_TIP = (0, localizationFile_1.localize)('mongo.migration.database.migration.duration.tool.tip', "The duration of the migration");
exports.STATUS_ALL = (0, localizationFile_1.localize)('mongo.migration.status.dropdown.all', "All");
exports.STATUS_ONGOING = (0, localizationFile_1.localize)('mongo.migration.status.dropdown.ongoing', "Ongoing");
exports.STATUS_COMPLETING = (0, localizationFile_1.localize)('mongo.migration.status.dropdown.completing', "Completing");
exports.STATUS_SUCCEEDED = (0, localizationFile_1.localize)('mongo.migration.status.dropdown.succeeded', "Succeeded");
exports.STATUS_FAILED = (0, localizationFile_1.localize)('mongo.migration.status.dropdown.failed', "Failed");
exports.SORT_LABEL = (0, localizationFile_1.localize)('mongo.migration.migration.list.sort.label', 'Sort');
exports.SORT_DROPDOWN = (0, localizationFile_1.localize)('mongo.migration.migration.list.sort.dropdown', 'Sort migrations');
exports.ASCENDING_LABEL = (0, localizationFile_1.localize)('mongo.migration.migration.list.ascending.label', 'Ascending');
exports.MIGRATION_STATUS_FILTER = (0, localizationFile_1.localize)('mongo.migration.migration.status.filter', "Migration status filter");
exports.STATUS_LABEL = (0, localizationFile_1.localize)('mongo.migration.status.status.label', 'Status');
exports.SEARCH_FOR_MIGRATIONS = (0, localizationFile_1.localize)('mongo.migration.search.for.migration', "Filter migration results");
exports.MIGRATION_SERVICE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.select.service.description', 'Azure Database Migration Service');
exports.CANCEL_MIGRATION = (0, localizationFile_1.localize)('mongo.migration.migration.cancel', 'Cancel Migration');
exports.ESSENTIALS = (0, localizationFile_1.localize)('mongo.migration.essentials', 'Essentials');
exports.SOURCE_SERVER_INSTANCE = (0, localizationFile_1.localize)('mongo.migration.source.server.instance', 'Source Server instance');
exports.SOURCE_TYPE_VERSION = (0, localizationFile_1.localize)('mongo.migration.source.type.version', 'Source Type version');
exports.SOURCE_TYPE = (0, localizationFile_1.localize)('mongo.migration.source.type', 'Source Type');
exports.PERCENTAGE_COMPLETION = (0, localizationFile_1.localize)('mongo.migration.percentage.completion', 'Percentage completion(%)');
exports.PERCENTAGE_COMPLETION_COLUMN_OFFLINE = (0, localizationFile_1.localize)('mongo.migration.percentage.completion.column.ofline', '% Completed');
exports.PERCENTAGE_COMPLETION_COLUMN_ONLINE = (0, localizationFile_1.localize)('mongo.migration.percentage.completion.column.online', 'Initial Load - % Completed');
exports.REPLICATION_CHANGES_REPLAYED = (0, localizationFile_1.localize)('mongo.migration.metrics.publish.time.column', 'Replication Changes Replayed');
exports.TARGET_SERVER = (0, localizationFile_1.localize)('mongo.migration.target.server', 'Target server');
exports.TARGET_TYPE = (0, localizationFile_1.localize)('mongo.migration.target.type', 'Target type');
exports.DOCUMENTS_MIGRATED_OFFLINE = (0, localizationFile_1.localize)('mongo.migration.documents.migrated.ofline', 'Documents Migrated');
exports.DOCUMENTS_MIGRATED_ONLINE = (0, localizationFile_1.localize)('mongo.migration.documents.migrated.online', 'Initial Load - Documents Migrated');
exports.ERROR = (0, localizationFile_1.localize)('mongo.migration.error', 'Error');
exports.NO_MIGRATIONS = (0, localizationFile_1.localize)('mongo.migration.no.migrations', 'No migrations found.');
exports.MIGRATION_ERROR = (0, localizationFile_1.localize)('mongo.migration.status.error', 'An error occurred during migration.');
exports.MIGRATION_STATUS_REFRESH_ERROR = (0, localizationFile_1.localize)('mongo.migration.status.refresh.error', 'An error occurred while refreshing the migration status.');
exports.MIGRATION_DELETE_SUCCESS = (0, localizationFile_1.localize)('mongo.migration.delete.migrations.success', 'Migration(s) deleted successfully.');
exports.MIGRATION_DELETE_ERROR = (0, localizationFile_1.localize)('mongo.migration.delete.migrations.error', 'Error(s) occurred while deleting the migration(s).');
exports.MIGRATION_CANCEL_SUCCESS = (0, localizationFile_1.localize)('mongo.migration.cancel.migrations.success', 'Migration(s) canceled successfully.');
exports.MIGRATION_CANCEL_ERROR = (0, localizationFile_1.localize)('mongo.migration.cancel.migrations.error', 'Error(s) occurred while canceling the migration.');
exports.CUTOVER = (0, localizationFile_1.localize)('mongo.migration.cutover', 'Cutover');
exports.CONFIRM_CUTOVER = (0, localizationFile_1.localize)('mongo.migration.confirm.cutover', 'Confirm cutover');
exports.COMPLETE_CUTOVER_SUCCESS = (0, localizationFile_1.localize)('mongo.migration.complete.cutover.success', 'Cutover started successfully.');
exports.COMPLETE_CUTOVER_ERROR = (0, localizationFile_1.localize)('mongo.migration.complete.cutover.error', 'Error(s) occurred while completing cutover.');
exports.MIGRATION_STATE_IN_PROGRESS = (0, localizationFile_1.localize)('mongo.migration.status.inprogress', 'In progress');
exports.MIGRATION_STATE_REPLICATING = (0, localizationFile_1.localize)('mongo.migration.status.replicating', 'Replicating');
function FILTER_RESULTS_FOUND(count) {
    return (0, localizationFile_1.localize)('mongo.migration.filter.results.found', "{0} results found", count);
}
exports.FILTER_RESULTS_FOUND = FILTER_RESULTS_FOUND;
function WARNING_DELETE_MIGRATIONS(count) {
    return (0, localizationFile_1.localize)('mongo.migration.warning.delete.migrations', "Are you sure you want to delete {0} migration(s)?", count);
}
exports.WARNING_DELETE_MIGRATIONS = WARNING_DELETE_MIGRATIONS;
function WARNING_FORCE_DELETE_MIGRATIONS(inProgressMigrationsCount, selectedMigrationsCount) {
    return (0, localizationFile_1.localize)('mongo.migration.warning.force.delete.migrations', "{0} of the selected migration(s) are in progress. Are you sure you want to force delete {1} migration(s)?", inProgressMigrationsCount, selectedMigrationsCount);
}
exports.WARNING_FORCE_DELETE_MIGRATIONS = WARNING_FORCE_DELETE_MIGRATIONS;
exports.WARNING_CANCEL_MIGRATIONS = (0, localizationFile_1.localize)('mongo.migration.warning.cancel.migrations', "Are you sure you want to cancel this ongoing migration?");
//Complete cutover dialog
exports.COMPLETE_CUTOVER_PAGE_TITLE = (0, localizationFile_1.localize)('mongo.migration.complete.cutover.page.title', "Complete cutover");
exports.COMPLETE_CUTOVER_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.complete.cutover.description', "The migration is currently in the replication phase, continuously copying updates from the source instance to the target instance to keep it updated with the latest changes.\n\n"
    + "Cutover is the final step in the migration process where replication is terminated. After cutover, the target instance becomes the primary, and the source instance is either retired or put into standby mode.\n\n"
    + "The cutover process should only be initiated when most changes in the source have been synced with the target, with a replication gap typically 15 minutes or less for all collections being a good indicator.\n\n"
    + "When ready to perform the migration cutover, follow these steps in order to complete the database migration:\n\n"
    + "1.	Stop all incoming write requests to the source collections being migrated.\n\n"
    + "2.	Monitor the replication changes in the table below and wait until the “Replication changes played” metric is steady.\n\n"
    + "3.	Manually validate that the row count is the same between the source and target collections.\n\n"
    + "4.	Select “Confirm Cutover”.\n"
    + "Note: Performing the cutover operation without validating that the source and target are synced may result in data loss.\n\n"
    + "5.	After cutover, change the connection string in your applications to point to the target account.\n\n");
exports.COMPLETE_CUTOVER_CONFIRMATION = (0, localizationFile_1.localize)('mongo.migration.complete.cutover.confirmation', "I confirm that I have verified the row counts between the source and target collections match and am ready to complete the cutover.");
exports.REPLICATION_GAP = (0, localizationFile_1.localize)('mongo.migration.complete.cutover.replication.gap', "Replication Gap");
exports.REPLICATION_GAP_TABLE = (0, localizationFile_1.localize)('mongo.migration.complete.cutover.replication.gap.table', "Replication gap table");
//Support Container - Dashboard
exports.HELP_ARTICLES = (0, localizationFile_1.localize)('mongo.migration.help', "Help Articles");
exports.PRE_MIGRATE_MONGO = (0, localizationFile_1.localize)('mongo.migration.pre.migrate.cosmos', "Pre migration steps to Azure Cosmos DB.");
exports.PRE_MIGRATE_MONGO_DES = (0, localizationFile_1.localize)('mongo.migration.pre.migrate.cosmos.des', "This guide provides you with pre migration steps to perform on MongoDB before migrating to Azure Cosmos DB.");
exports.MIGRATE_COSMOS = (0, localizationFile_1.localize)('mongo.migration.cosmos.guide', "Migration guide: MongoDB to Azure Cosmos DB.");
exports.MIGRATE_COSMOS_DES = (0, localizationFile_1.localize)('mongo.migration.cosmos.des', "Learn how to migrate your MongoDB workloads to Azure Cosmos DB.");
exports.MIGRATION_FAQ_TITLE = (0, localizationFile_1.localize)('mongo.migration.faq.title', "Azure Cosmos DB Migration for MongoDB FAQ.");
exports.MIGRATION_FAQ = (0, localizationFile_1.localize)('mongo.migration.faq.des', "View the frequently asked questions when using Azure Cosmos DB Migration for MongoDB extension.");
exports.DATA_ASSESSMENT_TITLE = (0, localizationFile_1.localize)('mongo.migration.data.assessment.help.title', "MongoDB Data Assessment.");
exports.DATA_ASSESSMENT_DES = (0, localizationFile_1.localize)('mongo.migration.data.assessment.help.des', "Learn to use MongoDB Data Assessment tool to examine your data and find out the steps that you may need to take to smoothly run your workloads on Azure Cosmos DB.");
//Common
exports.YES = (0, localizationFile_1.localize)('mongo.migration.yes', "Yes");
exports.NO = (0, localizationFile_1.localize)('mongo.migration.no', "No");
exports.COPY = (0, localizationFile_1.localize)('mongo.migration.copy', "Copy");
exports.REFRESH = (0, localizationFile_1.localize)('mongo.migration.refresh', "Refresh");
exports.STATUS = (0, localizationFile_1.localize)('mongo.migration.status', "Status");
exports.SETTINGS = (0, localizationFile_1.localize)('mongo.migration.settings', "Settings");
exports.HELP_SUPPORT = (0, localizationFile_1.localize)('mongo.migration.support', "Help + Support");
exports.FEEDBACK = (0, localizationFile_1.localize)('mongo.migration.feedback', "Feedback");
exports.START_TIME = (0, localizationFile_1.localize)('mongo.migration.start.time', "Start time");
exports.END_TIME = (0, localizationFile_1.localize)('mongo.migration.end.time', "End time");
exports.COSMOS_DB_MONGO_RU = (0, localizationFile_1.localize)('mongo.migration.cosmosdb4.2', 'RU');
exports.COSMOS_DB_MONGO_VCORE = (0, localizationFile_1.localize)('mongo.migration.cosmosdb5.0', 'vCore');
exports.DOWNLOAD_REPORT = (0, localizationFile_1.localize)('mongo.migration.download.report', "Download Report");
exports.MIGRATIONS = (0, localizationFile_1.localize)('mongo.migration.migrations', "Migrations");
exports.ASSESSMENT_REPORT = (0, localizationFile_1.localize)('mongo.migration.assessment.report', "Assessment report");
exports.ASSESSMENTS = (0, localizationFile_1.localize)('mongo.migration.assessments', "Assessments");
exports.ASSESSMENT_PROGRESS = (0, localizationFile_1.localize)('mongo.migration.assessment.progress', 'An assessment is in progress');
exports.CLOSE = (0, localizationFile_1.localize)('mongo.migration.close', 'Close');
exports.DELETE = (0, localizationFile_1.localize)('mongo.migration.delete', 'Delete');
exports.FORCE_DELETE = (0, localizationFile_1.localize)('mongo.migration.force.delete', 'Force delete');
function DELETE_ASSESSMENT_ERROR(error) {
    return (0, localizationFile_1.localize)('mongo.migration.delete.assessment.error', 'There was an error while deleting the assessment. ', error);
}
exports.DELETE_ASSESSMENT_ERROR = DELETE_ASSESSMENT_ERROR;
exports.FOR = (0, localizationFile_1.localize)('mongo.migration.for', 'for');
exports.ASSESSMENT_CREATED_ON = (0, localizationFile_1.localize)('mongo.migration.created.on', 'Assessment created on');
exports.ASSESSMENT = (0, localizationFile_1.localize)('mongo.migration.assessment', 'Assessment');
exports.CLEAR = (0, localizationFile_1.localize)('mongo.migration.clear', "Clear");
//Confirm settings
exports.CONFIRM_SETTINGS_TITLE = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.title', "Confirm Settings");
exports.CONFIRM_SETTINGS_STEPS = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.steps', "To ensure a smooth data migration process using Azure Database Migration Service, please follow these steps:");
exports.CONFIRM_SETTINGS_ALLOW_CONNECTIONS = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.allow.connections', "1. Configure both the source and target MongoDB instances to allow connections from global Azure datacenters. For detailed instructions, refer to the documentation on {0}");
exports.CONFIRM_SETTINGS_FIREWALL_EXCEPTIONS = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.firewall.exceptions', "2. Add firewall exceptions to the Azure Cosmos DB for MongoDB vCore target account to permit connections from global Azure datacenters. For more information, consult documentation on {1}");
exports.CONFIRM_SETTINGS_IMPORTANT = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.important', "Important:");
exports.CONFIRM_SETTINGS_PRIVATE_ENDPOINT = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.private.endpoint', "-The migration tool does not support Private Endpoint enabled instances for either source or target MongoDB.");
exports.CONFIRM_SETTINGS_ENSURE = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.ensure', "Please ensure these settings are configured correctly to avoid any connectivity issues during the migration process.");
exports.CONFIRM_SETTINGS_CONFIRM = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.confirm', "Select Continue to confirm your settings and initiate the migration process.");
exports.CONFIRM_SETTINGS_AZURE_IP = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.azure.ip', "global Azure IP address ranges");
exports.CONFIRM_SETTINGS_IP_FIREWALL = (0, localizationFile_1.localize)('mongo.migration.confirm.settings.ip.firewall', "configuring an IP firewall for your Azure Cosmos DB account");
//Feedback
exports.FEEDBACK_TEXT = (0, localizationFile_1.localize)('mongo.migration.feedback.text', "Contact cdbmigrationsupport@microsoft.com . For quick response, provide the issue description, steps to repro and actual vs expected behavior.");
//Help + Support
exports.SUPPORT_RESOURCES = (0, localizationFile_1.localize)('mongo.migration.support.resources', 'Support resources');
exports.EXPLORE_DOCUMENTATION = (0, localizationFile_1.localize)('mongo.migration.explore.documentation', 'Explore documentation');
exports.SUPPORT_REQUEST = (0, localizationFile_1.localize)('mongo.migration.support.request', 'Support request');
exports.CREATE_SUPPORT_REQUEST = (0, localizationFile_1.localize)('mongo.migration.create.support.request', 'Create a support request');
exports.SUPPORT_NOTE = (0, localizationFile_1.localize)('mongo.migration.support.note', 'Note: If you login with microsoft account, please select "General question" in the "Resource" field. In case you do not have an Azure subscription, contact cdbmigrationsupport@microsoft.com with the issue.\n');
//Assessment Report
exports.ASSESSMENT_ID = (0, localizationFile_1.localize)('mongo.migration.id', 'Assessment Id');
exports.ASSESSMENT_CATEGORY = (0, localizationFile_1.localize)('mongo.migration.category', "Assessment Category");
exports.ASSESSMENT_SEVERITY = (0, localizationFile_1.localize)('mongo.migration.severity', "Assessment Severity");
exports.ASSESSMENT_MESSAGE = (0, localizationFile_1.localize)('mongo.migration.message', "Assessment Message");
exports.ASSESSMENT_ADDITIONAL_DETAILS = (0, localizationFile_1.localize)('mongo.migration.assessment.additional.details', "Assessment Additional Details");
exports.ASSESSMENT_RESULTS_SELECT_DATABASES = (0, localizationFile_1.localize)('mongo.migration.assessment.results.select.databases', "The assessment report below highlights the incompatibilities that require your attention before initiating the migration process. To view instance-wide incompatibilities, click on the instance name. To limit the results to database-specific incompatibilities, click on a database name. Use the check boxes to select the databases you wish to migrate.");
function ASSESSMENT_NO_INCOMPATIBILITY(assessmentTitle) {
    return (0, localizationFile_1.localize)('mongo.migration.no.incompatibilities', '{0} assessment is complete and there were no findings to report. Make sure you go through the other assessment reports for additional findings.', assessmentTitle);
}
exports.ASSESSMENT_NO_INCOMPATIBILITY = ASSESSMENT_NO_INCOMPATIBILITY;
exports.ASSESSMENT_DATA = (0, localizationFile_1.localize)('mongo.migration.data', 'Assessment Data');
exports.SERVER_UP_TIME = (0, localizationFile_1.localize)('mongo.migration.server.up.time', 'Server Uptime (ms)');
function ASSESSMENT_REPORT_LOG_TEXT(logFolderPath) {
    return (0, localizationFile_1.localize)('mongo.migration.summary.log.text', 'The assessments in <b>Feature Compatibility</b> category were based on features extracted from log files present in path {0}', logFolderPath);
}
exports.ASSESSMENT_REPORT_LOG_TEXT = ASSESSMENT_REPORT_LOG_TEXT;
function ASSESSMENT_REPORT_SERVER_STATUS_TEXT(serverStartTime) {
    return (0, localizationFile_1.localize)('mongo.migration.summary.server.status.text', 'Below assessments were performed using information collected through commands like serverStatus, listIndexes. The assessments in <b>Feature Compatibility</b> category only capture features used after {0}', serverStartTime);
}
exports.ASSESSMENT_REPORT_SERVER_STATUS_TEXT = ASSESSMENT_REPORT_SERVER_STATUS_TEXT;
exports.SOURCE_LOG_FOLDER_PATH = (0, localizationFile_1.localize)('mongo.migration.source.log.folder.path', 'MongoDB log folder path');
//Assessment Summary
exports.ASSESSMENT_SUMMARY = (0, localizationFile_1.localize)('mongo.migration.assessment.summary', 'Assessment summary');
exports.ASSESSMENT_TITLE = (0, localizationFile_1.localize)('mongo.migration.assessment.title', 'Assessment overview');
function ASSESSMENT_CARD_TITLE(targetType) {
    return (0, localizationFile_1.localize)('mongo.migration.assessment.card.title', 'Assessment for {0}', targetType);
}
exports.ASSESSMENT_CARD_TITLE = ASSESSMENT_CARD_TITLE;
exports.ASSESSMENT_DURATION_SUBTITLE = (0, localizationFile_1.localize)('mongo.migration.assessment.duration.subtitle', 'Total assessment time taken is ');
exports.SEARCH_FILTER = (0, localizationFile_1.localize)('mongo.migration.databases.search', 'Filter Databases');
exports.MONGO_SERVER_INSTANCE = (0, localizationFile_1.localize)('mongo.migration.server.instance', "MongoDB Instance");
exports.INSTANCE = (0, localizationFile_1.localize)('mongo.migration.instance', "Instance");
exports.FINDINGS = (0, localizationFile_1.localize)('mongo.migration.findings', "Findings");
exports.ASSESSMENT_TYPE_LABEL = (0, localizationFile_1.localize)('mongo.migration.assessment.type.label', 'Assessment type');
exports.ASSESSMENT_TYPE_ALL = (0, localizationFile_1.localize)('mongo.migration.assessment.type.all', 'All');
exports.ASSESSMENT_TYPE_SCHEMA = (0, localizationFile_1.localize)('mongo.migration.assessment.type.schema', 'Schema');
exports.ASSESSMENT_TYPE_FEATURES = (0, localizationFile_1.localize)('mongo.migration.assessment.type.all', 'Features');
exports.ASSESSMENT_TYPE_DATA = (0, localizationFile_1.localize)('mongo.migration.assessment.type.all', 'Data');
exports.DATABASES_TABLE_TILE = (0, localizationFile_1.localize)('mongo.migration.databases.table.title', "Databases");
exports.DATABASE = (0, localizationFile_1.localize)('mongo.migration.database', "Database");
exports.ISSUES_DETAILS = (0, localizationFile_1.localize)('mongo.migration.issues.details', "Details");
exports.MIGRATION_READINESS_HEADING = (0, localizationFile_1.localize)('mongo.migration.migration.readiness.heading', "Migration Readiness of assessed databases in the Instance");
exports.SERVER_ISSUES_SUMMARY_TEXT = (0, localizationFile_1.localize)('mongo.migration.server.issues.summary.text', "Instance assessment issues summary");
exports.ISSUE_BY_SEVERITY = (0, localizationFile_1.localize)('mongo.migration.issue.by.severity', "Issues by Severity");
exports.SUMMARY = (0, localizationFile_1.localize)('mongo.migration.server.summary', "Summary");
exports.DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.description', "Description");
exports.ADDITIONAL_DETAILS = (0, localizationFile_1.localize)('mongo.migration.additional.details', "Additional Details");
exports.MORE_INFO = (0, localizationFile_1.localize)('mongo.migration.more.info', "More info");
function MORE_INFO_ANNOUNCEMENT(linkLabel) {
    return (0, localizationFile_1.localize)('mongo.migration.more.info.announcement', "For more info on ({0}), please click this link", linkLabel);
}
exports.MORE_INFO_ANNOUNCEMENT = MORE_INFO_ANNOUNCEMENT;
function BLOCKING_ISSUES_HEADING_WITH_COUNT(totalCount) {
    return (0, localizationFile_1.localize)('mongo.migration.blocking.issues.heading.with.count', "Blocking Issues ({0})", totalCount);
}
exports.BLOCKING_ISSUES_HEADING_WITH_COUNT = BLOCKING_ISSUES_HEADING_WITH_COUNT;
function WARNING_ISSUES_HEADING_WITH_COUNT(totalCount) {
    return (0, localizationFile_1.localize)('mongo.migration.warning.issues.heading.with.count', "Warning Issues ({0})", totalCount);
}
exports.WARNING_ISSUES_HEADING_WITH_COUNT = WARNING_ISSUES_HEADING_WITH_COUNT;
function INFORMATIONAL_ISSUES_HEADING_WITH_COUNT(totalCount) {
    return (0, localizationFile_1.localize)('mongo.migration.informational.issues.heading.with.count', "Informational Issues ({0})", totalCount);
}
exports.INFORMATIONAL_ISSUES_HEADING_WITH_COUNT = INFORMATIONAL_ISSUES_HEADING_WITH_COUNT;
function SEVERITY_WITH_PREFIX(name) {
    return (0, localizationFile_1.localize)('mongo.migration.severity.with.prefix', "Severity: {0}", name);
}
exports.SEVERITY_WITH_PREFIX = SEVERITY_WITH_PREFIX;
function DATABASE_WITH_PREFIX(name) {
    return (0, localizationFile_1.localize)('mongo.migration.database.with.prefix', "Database: {0}", name);
}
exports.DATABASE_WITH_PREFIX = DATABASE_WITH_PREFIX;
function COLLECTION_WITH_PREFIX(name) {
    return (0, localizationFile_1.localize)('mongo.migration.collection.with.prefix', "Collection: {0}", name);
}
exports.COLLECTION_WITH_PREFIX = COLLECTION_WITH_PREFIX;
function ASSESSED_DATABASES() {
    return (0, localizationFile_1.localize)('mongo.migration.assessed.databases.with.count', "Assessed Databases: ");
}
exports.ASSESSED_DATABASES = ASSESSED_DATABASES;
function TOTAL_ISSUES_FOUND() {
    return (0, localizationFile_1.localize)('mongo.migration.total.issues.found', "Total issues found: ");
}
exports.TOTAL_ISSUES_FOUND = TOTAL_ISSUES_FOUND;
function READY_TEXT() {
    return (0, localizationFile_1.localize)('mongo.migration.ready.text', "Ready: ");
}
exports.READY_TEXT = READY_TEXT;
function READY_WITH_CONDITION() {
    return (0, localizationFile_1.localize)('mongo.migration.ready.with.condition', "Ready with conditions: ");
}
exports.READY_WITH_CONDITION = READY_WITH_CONDITION;
function NOT_READY() {
    return (0, localizationFile_1.localize)('mongo.migration.not.ready', "Not Ready: ");
}
exports.NOT_READY = NOT_READY;
function ASSESSMENT_SUMMARY_DESCRIPTION(databasesCount) {
    return (0, localizationFile_1.localize)('mongo.migration.assessment.summary.description', "1 instance and {0} databases were assessed", databasesCount);
}
exports.ASSESSMENT_SUMMARY_DESCRIPTION = ASSESSMENT_SUMMARY_DESCRIPTION;
function BLOCKING_ISSUE_TEXT() {
    return (0, localizationFile_1.localize)('mongo.migration.blocking.issues.text', "Blocking: ");
}
exports.BLOCKING_ISSUE_TEXT = BLOCKING_ISSUE_TEXT;
function WARNING_ISSUE_TEXT() {
    return (0, localizationFile_1.localize)('mongo.migration.warning.issue.with.count', "Warning: ");
}
exports.WARNING_ISSUE_TEXT = WARNING_ISSUE_TEXT;
function INFO_TEXT() {
    return (0, localizationFile_1.localize)('mongo.migration.info.with.count', "Info: ");
}
exports.INFO_TEXT = INFO_TEXT;
//Feedback
exports.FEEDBACK_TITLE = (0, localizationFile_1.localize)('mongo.migration.feedback.title', 'Feedback on Azure Cosmos DB Migration for MongoDB Extension Experience');
//Assessments tab
exports.NEW_MIGRATION = (0, localizationFile_1.localize)('mongo.migration.new.migration', 'New migration');
exports.EXCEEDING_LENGTH = (0, localizationFile_1.localize)('mongo.migration.exceeding.length', 'Exceeded the length limit.');
//HTML Report
exports.INSTANCE_SUMMMARY = (0, localizationFile_1.localize)('mongo.migration.instance.summary', 'Instance Summary');
exports.TOTAL_DATABASE_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.total.database.count', 'Total Database Count');
exports.TOTAL_COLLECTION_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.total.collection.count', 'Total Collection Count');
exports.TOTAL_VIEWS_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.total.views.count', 'Total Views Count');
exports.TOTAL_TIME_SERIES_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.total.timeseries.count', 'Total Timeseries Count');
exports.TOTAL_INDEX_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.total.index.count', 'Total Index Count');
exports.NUMBER_OF_COLLECTIONS = (0, localizationFile_1.localize)('mongo.migration.summary.number.of.collections', 'Number Of Collections');
exports.DATABASE_NAME = (0, localizationFile_1.localize)('mongo.migration.summary.database.name', 'Database Name');
exports.COLLECTION_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.collection.count', 'Collection Count');
exports.VIEW_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.view.count', 'View Count');
exports.TIME_SERIES_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.timeseries.count', 'TimeSeries Count');
exports.DATA_SIZE = (0, localizationFile_1.localize)('mongo.migration.summary.data.size', 'Data Size (GB)');
exports.COLLECTION_NAME = (0, localizationFile_1.localize)('mongo.migration.summary.collection.name', 'Collection Name');
exports.COLLECTION_TYPE = (0, localizationFile_1.localize)('mongo.migration.summary.collection.type', 'Type');
exports.IS_SHARDED = (0, localizationFile_1.localize)('mongo.migration.summary.is.sharded', 'Is Sharded');
exports.SHARD_KEY = (0, localizationFile_1.localize)('mongo.migration.summary.shard.key', 'Shard Key');
exports.DOCUMENT_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.document.count', 'Document Count');
exports.INDEX_COUNT = (0, localizationFile_1.localize)('mongo.migration.summary.index.count', 'Index Count');
exports.INDEX_SIZE = (0, localizationFile_1.localize)('mongo.migration.summary.index.size', 'Index Size (GB)');
exports.AVERAGE_DOCUMENT_SIZE = (0, localizationFile_1.localize)('mongo.migration.summary.average.document.size', 'Average Document Size (Byte)');
exports.ASSESSMENT_OVERVIEW = (0, localizationFile_1.localize)('mongo.migration.assessment.overview', 'Assessment overview');
exports.DATABASE_SUMMARY = (0, localizationFile_1.localize)('mongo.migration.database.summary', 'Database summary');
exports.COLLECTION_SUMMARY = (0, localizationFile_1.localize)('mongo.migration.collection.summary', 'Collection summary');
exports.DATABASE_SUMMARY_TABLE_CAPTION = (0, localizationFile_1.localize)('mongo.migration.summary.table.caption', '(Data and index sizes are uncompressed)');
exports.EXPANDED = (0, localizationFile_1.localize)('mongo.migration.expanded', 'Expanded');
exports.COLLAPSED = (0, localizationFile_1.localize)('mongo.migration.collapsed', 'Collapsed');
//Error details
exports.ERROR_DETAILS = (0, localizationFile_1.localize)('mongo.migration.error.details', 'Error details');
exports.VIEW_ERROR_DETAILS = (0, localizationFile_1.localize)('mongo.migration.view.error.details', 'Click to view error details');
exports.POSSIBLE_CAUSES = (0, localizationFile_1.localize)('mongo.migration.possible.causes', "Possible causes");
exports.ERROR_MESSAGE = (0, localizationFile_1.localize)('mongo.migration.error.message', "Description");
exports.FEEDBACK_QUESTION = (0, localizationFile_1.localize)('mongo.migration.feedback.question', "Still having trouble?");
exports.FEEDBACK_NOTE = (0, localizationFile_1.localize)('mongo.migration.feedback.note', "Visit the help and support center to create or track a support incident.");
exports.QNA = (0, localizationFile_1.localize)('mongo.migration.qna.note', "You can submit ideas or suggestions for improvement, and other feedback, including bugs in the Azure Q&A - ");
exports.DMS_Link = (0, localizationFile_1.localize)('mongo.migration.dms.link', "Database migration service.");
exports.COPIED_MESSAGE = (0, localizationFile_1.localize)('mongo.migration.copied.message', "Copied error details");
exports.MORE_INFORMATION = (0, localizationFile_1.localize)('mongo.migration.more.information', "For more information about this error, please refer ");
exports.REMEDIATION_ACTIONS = (0, localizationFile_1.localize)('mongo.migration.remediation.actions', 'Remediation actions');
// Migration Service Section Dialog
exports.MIGRATION_SERVICE_SELECT_TITLE = (0, localizationFile_1.localize)('mongo.migration.select.service.title', 'Select Database Migration Service');
exports.MIGRATION_SERVICE_SELECT_APPLY_LABEL = (0, localizationFile_1.localize)('mongo.migration.select.service.apply.label', 'Apply');
exports.MIGRATION_SERVICE_CLEAR = (0, localizationFile_1.localize)('mongo.migration.select.service.delete.label', 'Clear');
exports.MIGRATION_SERVICE_SELECT_HEADING = (0, localizationFile_1.localize)('mongo.migration.select.service.heading', 'Filter the migration list by Database Migration Service');
exports.DMS_SUBSCRIPTION_INFO = (0, localizationFile_1.localize)('mongo.migration.dms.subscription', "Subscription name for your Azure Database Migration Service");
exports.DMS_RESOURCE_GROUP_INFO = (0, localizationFile_1.localize)('mongo.migration.dms.resource_group', "Resource group for your Azure Cosmos DB target. Only resource groups that contain a service will be shown.");
exports.SELECT_ACCOUNT_ERROR = (0, localizationFile_1.localize)('mongo.migration.select.service.select.account.error', "An error occurred while loading available Azure accounts.");
exports.SELECT_TENANT_ERROR = (0, localizationFile_1.localize)('mongo.migration.select.service.select.tenant.error', "An error occurred while loading available Azure account tenants.");
exports.SELECT_SUBSCRIPTION_ERROR = (0, localizationFile_1.localize)('mongo.migration.select.service.select.subscription.error', "An error occurred while loading account subscriptions. Please check your Azure connection and try again.");
exports.SELECT_RESOURCE_GROUP_ERROR = (0, localizationFile_1.localize)('mongo.migration.select.service.select.resource.group.error', "An error occurred while loading available resource groups. Please check your Azure connection and try again.");
exports.SELECT_SERVICE_ERROR = (0, localizationFile_1.localize)('mongo.migration.select.service.select.service.error', "An error occurred while loading available database migration services. Please check your Azure connection and try again.");
exports.OFFLINE = (0, localizationFile_1.localize)('mongo.migration.select.service.offline', "Offline");
exports.ONLINE = (0, localizationFile_1.localize)('mongo.migration.select.service.online', "Online");
exports.OFFLINE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.select.service.offline.description', "Offline migration captures a snapshot of the database at the beginning, offering a simpler and predictable approach. It works well when using a static copy of the database is acceptable, and latest updates are not essential.");
exports.ONLINE_DESCRIPTION = (0, localizationFile_1.localize)('mongo.migration.select.service.online.description', "Online migration copies collection data, ensuring latest updates are also replicated during the process. This method is advantageous with minimal downtime, allowing continuous operations for business continuity. It's preferred when ongoing operations are crucial, and reducing downtime is a priority.");
function COLLECTION_SUMMARY_LINK_TEXT(numberOfCollections) {
    return (0, localizationFile_1.localize)('mongo.migration.collection.summary.text', "Please click to see the summary of {0} collections", numberOfCollections);
}
exports.COLLECTION_SUMMARY_LINK_TEXT = COLLECTION_SUMMARY_LINK_TEXT;
// mirrors MigrationState as defined in RP
var MigrationState;
(function (MigrationState) {
    MigrationState["Canceled"] = "Canceled";
    MigrationState["Canceling"] = "Canceling";
    MigrationState["Creating"] = "Creating";
    MigrationState["Failed"] = "Failed";
    MigrationState["InProgress"] = "InProgress";
    MigrationState["Succeeded"] = "Succeeded";
    MigrationState["Dropping"] = "Dropping";
    MigrationState["CosmosDbCheckpointInProgress"] = "CosmosDbCheckpointInProgress";
    MigrationState["CosmosDbBulkCopyInProgress"] = "CosmosDbBulkCopyInProgress";
    MigrationState["CosmosDbReplicationInProgress"] = "CosmosDbReplicationInProgress";
    MigrationState["CosmosDbCutoverInProgress"] = "CosmosDbCutoverInProgress";
    MigrationState["ReadyForCutover"] = "ReadyForCutover";
})(MigrationState = exports.MigrationState || (exports.MigrationState = {}));
exports.MigrationStatusLookup = {
    [MigrationState.Canceled]: (0, localizationFile_1.localize)('mongo.migration.status.canceled', 'Canceled'),
    [MigrationState.Canceling]: (0, localizationFile_1.localize)('mongo.migration.status.canceling', 'Canceling'),
    [MigrationState.Creating]: (0, localizationFile_1.localize)('mongo.migration.status.creating', 'Creating'),
    [MigrationState.Failed]: (0, localizationFile_1.localize)('mongo.migration.status.failed', 'Failed'),
    [MigrationState.InProgress]: exports.MIGRATION_STATE_IN_PROGRESS,
    [MigrationState.CosmosDbCheckpointInProgress]: exports.MIGRATION_STATE_IN_PROGRESS,
    [MigrationState.CosmosDbBulkCopyInProgress]: exports.MIGRATION_STATE_IN_PROGRESS,
    [MigrationState.CosmosDbReplicationInProgress]: exports.MIGRATION_STATE_REPLICATING,
    [MigrationState.CosmosDbCutoverInProgress]: exports.MIGRATION_STATE_REPLICATING,
    [MigrationState.ReadyForCutover]: exports.MIGRATION_STATE_REPLICATING,
    [MigrationState.Succeeded]: (0, localizationFile_1.localize)('mongo.migration.status.succeeded', 'Succeeded'),
    [MigrationState.Dropping]: (0, localizationFile_1.localize)('mongo.migration.status.dropping', 'Deleting'),
    default: undefined
};
var CollectionState;
(function (CollectionState) {
    CollectionState["NotStarted"] = "NotStarted";
    CollectionState["Failed"] = "Failed";
    CollectionState["InProgress"] = "InProgress";
    CollectionState["Completed"] = "Completed";
})(CollectionState = exports.CollectionState || (exports.CollectionState = {}));
var CollectionStateOnline;
(function (CollectionStateOnline) {
    CollectionStateOnline["InitialLoadInProgress"] = "InitialLoadInProgress";
    CollectionStateOnline["ReplicationWaiting"] = "ReplicationWaiting";
    CollectionStateOnline["ReplicationInProgress"] = "ReplicationInProgress";
})(CollectionStateOnline = exports.CollectionStateOnline || (exports.CollectionStateOnline = {}));
exports.CollectionStatusLookup = {
    [CollectionState.NotStarted]: (0, localizationFile_1.localize)('mongo.migration.collection.status.failed', 'Not started'),
    [CollectionState.Failed]: (0, localizationFile_1.localize)('mongo.migration.collection.status.failed', 'Failed'),
    [CollectionState.InProgress]: (0, localizationFile_1.localize)('mongo.migration.collection.status.inprogress', 'In progress'),
    [CollectionStateOnline.InitialLoadInProgress]: (0, localizationFile_1.localize)('mongo.migration.collection.status.initial.load.inprogress', 'Initial load - In progress'),
    [CollectionStateOnline.ReplicationWaiting]: (0, localizationFile_1.localize)('mongo.migration.collection.status.replication.waiting', 'Replication - Waiting'),
    [CollectionStateOnline.ReplicationInProgress]: (0, localizationFile_1.localize)('mongo.migration.collection.status.replication.inprogress', 'Replication - In progress'),
    [CollectionState.Completed]: (0, localizationFile_1.localize)('mongo.migration.collection.status.completed', 'Completed'),
    default: undefined
};
// telemetry error messages, shouldn't localize
exports.EMPTY_MIGRATIONS_ERROR_MESSAGE = "migrations list retrieved during auto refresh is empty or undefined";
//# sourceMappingURL=strings.js.map