# IBM Cloud Schematics extension for visual studio code <sup>Beta</sup>

IBM Cloud Schematics extensions for Visual Studio Code aids in automating your IBM Cloud infrastructure, service, and application stack across cloud environments. This capability is currently being released as a Beta release.

The extension is designed to provide a `build and deploy` experience to developers via [vscode custom tasks](https://code.visualstudio.com/docs/editor/tasks#_custom-tasks), there-by increasing developer productivity in terms of ease in Authoring, Building, Deploying and Testing their terraform configuration with IBM Cloud Schematics.

### Tasks

| Task                          | Description                                                                                                                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ibmcloud-schematics-build`   | initializes and validates your terraform configuration by running commands `terraform init` and `terraform validate`. Any validation errors will be displayed in the terminal. |
| `ibmcloud-schematics-deploy`  | Validates and deploys your terraform configuration to IBM Cloud Schematics.                                                                                                    |
| `ibmcloud-schematics-clone`   | Clones an existing Schematics workspace or a GIT repository.                                                                                                                   |
| `ibmcloud-schematics-migrate` | Migrates your existing templates from Terraform 11 to Terraform 12                                                                                                             |

Know more about [vscode tasks](https://code.visualstudio.com/docs/editor/tasks)

#### Commands

The below commands help you to interact with the deployed Schematics workspace. You can access these commands via the vscode Editor commands [ cmd + shift + p ]

| Command                           | Description                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| View and override variable values | You can use this command to view workspace variables and override the variable values.           |
| View jobs                         | You can use this command to view jobs/activities of the deployed Schematics workspace.           |
| View log                          | You can use this command to view logs of selected activity of the deployed Schematics workspace. |
| View latest log                   | You can use this command to view logs of the latest activity executed                            |
| View resources                    | You can use this command to view the resources provisioned by your workspace                     |
| Generate plan                     | You can use this command to create a Terraform execution plan                                    |
| Apply plan                        | You can use this command to run your infrastructure code                                         |
| Destroy resources                 | You can use this command to destroy resources                                                    |
| Delete workspace                  | You can use this command to delete workspace                                                     |
| Estimate Cost                     | You can use this command to get cost estimate of the resources from the terraform template     |


Know more about [vscode commands](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)

#### Getting started

For next steps on how to get started with the Visual Studio Code extension for IBM Cloud Schematics, please see the [Getting started tutorial](tutorial/README.md)

#### Changelog and releases

All notable changes to this project will be documented in [changelog](CHANGELOG.md). You can find the releases in [release section](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases)

#### Contribution

If you wish to contribute please read the [contribution document](CONTRIBUTE.md)

#### FAQ

For general questions on extension please see the [Frequently Asked Questions](FAQ.md)

#### Report a Issue / Feature request

-   Is something broken? Have a issue/bug to report? use the [Bug report](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/issues/new?assignees=&labels=&template=bug_report.md&title=) link. But before raising a issue, please check the [issues list](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/issues) to see if the issue is already raised by someone
-   Do you have a new feature or enhancement you would like to see? use the [Feature request](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/issues/new?assignees=&labels=&template=feature_request.md&title=) link.

## License

[Apache-2.0](LICENSE)
