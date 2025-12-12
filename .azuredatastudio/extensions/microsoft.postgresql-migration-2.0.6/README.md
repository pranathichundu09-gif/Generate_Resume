# Azure PostgreSQL migration
The Azure PostgreSQL migration extension in Azure Data Studio brings together a mechanism for simplified assessment and recommendation of PostgreSQL Server instance for migration to Azure. This preview version delivers the following capabilities:
- A responsive user interface that provides an easy-to-navigate step-by-step wizard to deliver an integrated assessment and Azure SKU recommendation experience.
- An enhanced assessment engine that can assess PostgreSQL Server instances and identify databases that are ready for migration to Azure PostgreSQL Managed Instance.
- SKU recommendation engine to collect performance data from the source PostgreSQL Server instance to generate right-sized target recommendation.
- Create HTML reports on assessments results and SKU recommendations.

## Installation
From Azure Data Studio marketplace, install the latest version of Azure PostgreSQL migration extension and launch the wizard as shown below.

![postgresql-assessment-gif](https://user-images.githubusercontent.com/38867337/218935763-e82cd3b0-5c69-488b-86a3-7c58b03567ee.gif)

## Telemetry

This extension collects telemetry data, which is used to help understand how to improve the product. For example, this usage data helps to debug issues, such as slow start-up times, and to prioritize new features. While we appreciate the insights this data provides, we also know that not everyone wants to send usage data and you can disable telemetry as described in the Azure Data Studio [disable telemetry reporting](https://github.com/Microsoft/azuredatastudio/wiki/How-to-Disable-Telemetry-Reporting#how-to-disable-telemetry-reporting) documentation.

## Privacy Statement

To learn more about our Privacy Statement visit [this link](https://go.microsoft.com/fwlink/?LinkID=824704).

## Need assistance or have questions/feedback
For questions and feedback please reach out to [epgsupport@microsoft.com](mailto:epgsupport@microsoft.com) with the subject "Database Migration for PostgreSQL Feedback". You can submit ideas/suggestions for improvement and other feedback (including bugs) to the Azure Community forum — Azure Database Migration Service.

## License
Copyright (c) Microsoft Corporation. All rights reserved.
This extension is licensed under the [EULA](https://dsct.blob.core.windows.net/extensions/postgresql-migration/2.0.5/LICENSE.rtf). This license file is also present offline in the installation directory. It is an RTF file so downloading and opening with a Rich Text Supporting editor would be best for viewing.