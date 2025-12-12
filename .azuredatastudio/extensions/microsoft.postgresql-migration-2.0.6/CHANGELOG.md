# Change Log
All notable changes to the Azure PostgreSQL migration extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [2.0.6] - 2023-07-17
### Added
- Perform assessments with multiple target Azure PostgreSQL versions
- PostgreSQL version 15 support
- Bug Fixes Includes -
    - SKU Recommendation fixes
    - Collation fixes

## [2.0.5] - 2023-04-03
### Added
- Telemetry Module version update to 3.0.1

## [2.0.4] - 2023-03-23
### Added
- Bug Fixes Includes -
  - UI Layout fixes for Windows, Linux and Mac.
  - UI Fixes for ADS dark mode, Assessment button, Support Request, Manual Collection null/0 values.
  - Disable Save Assessment Button for Failed Assessment scenario.
- Telemetry Enhancement
- Added Confidence rating and Percentile Utilization in Recommendation view details.

## [2.0.3] - 2023-02-28 - Public Preview
### Added
- For PostgreSQL instances running on Linux, support for Automatic data collection and performance-based Azure target recommendation.
- Providing Recommendation reasoning, introducing Actual, Used source properties in UI and the assessment report.
- Assessment Summary UI improvements.
- Scale factor, Confidence Rating and Percentile Utilization.
- User provided time duration for collecting performance data.
- Minor UI and Bug Fixes.

## [1.2.2] - 2023-01-09 - Private Preview
### Added
- Ability to connect PostgreSQL Server instance, assess and provide migration readiness for Azure Database for PostgreSQL - Flexible server.
- Support for manual performance data collection to recommend rightsized Azure target.
- Assess the following aspects:
  - Server Parameters Compatibility
  - Provide features as best practices.
  - Database Compatibility based on encoding, extensions, and collation.
- Assessment Summary
- Allows users to download the assessment report as a html document.