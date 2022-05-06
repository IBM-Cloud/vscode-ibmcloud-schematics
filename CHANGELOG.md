# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.3.0](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases/tag/v1.3.0)

### Added

-   Support to specify target resource group during schematics:deploy task
    https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/issues/19
-   New VS Code command `IBM Cloud Schematics workspace: Estimate Cost`
-   Added tutorial on how to use command `IBM Cloud Schematics workspace: Estimate Cost` to get estimated cost of your terraform resources

### Bug fixes

-   Fix extension icon to make use of transparent image
-   Fix npm vulnerabilities

## [v1.2.0](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases/tag/v1.2.0)

### Added

-   Track requests from vscode
-   Added new task `ibmcloud-schematics-migrate` for migrating terraform 11 to terraform 12
-   Added tutorial on how to use `ibmcloud-schematics-migrate` task to migrate terraform 11 to terraform 12

### Bug fixes

-   Fix licence issues
-   Fix issue with detecting terraform version automatically

## [v1.1.3](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases/tag/v1.1.3)

### Added

-   Updated extension icon

## [v1.1.2](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases/tag/v1.1.2)

### Added

-   New VS Code command `IBM Cloud Schematics workspace: Details`

## [v1.1.1](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases/tag/v1.1.1)

### Bug fixes

-   Removed pull latest command
-   Fixed hcl2json command not found error by removing hcl2json logic check for detecting terraform version

## [v1.1.0](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases/tag/v1.1.0)

### Added

-   New VS Code task `Build`
-   New VS Code task `Deploy`
-   New VS Code task `Clone`
-   New VS Code command `IBM Cloud Schematics workspace: View jobs`
-   New VS Code command `IBM Cloud Schematics workspace: View log`
-   New VS Code command `IBM Cloud Schematics workspace: View latest log`
-   New VS Code command `IBM Cloud Schematics workspace: Pull latest`
-   New VS Code command `IBM Cloud Schematics workspace: Resources`
-   New VS Code command `IBM Cloud Schematics workspace: Plan`
-   New VS Code command `IBM Cloud Schematics workspace: Apply`
-   New VS Code command `IBM Cloud Schematics workspace: Destroy resources`
-   New VS Code command `IBM Cloud Schematics workspace: Delete`
-   New VS Code command `IBM Cloud Schematics workspace: View variables`
-   Integrated React [Carbon Design System] for the extension webview

[comment]: <Below are the list of links>
[carbon design system]: https://www.carbondesignsystem.com/
