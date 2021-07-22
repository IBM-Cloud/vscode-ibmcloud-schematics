# IBM Cloud Schematics extension for visual studio code <sup>Beta</sup>

IBM Cloud Schematics extensions for Visual Studio Code aids in automating your IBM Cloud infrastructure, service, and application stack across cloud environments. This capability is currently being released as a Beta release.

The extension is designed to provide a `build and deploy` experience to developers via [vscode custom tasks], there-by increasing developer productivity in terms of ease in Authoring, Building, Deploying and Testing their terraform configuration with IBM Cloud Schematics.

### Tasks

| Task                         | Description                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ibmcloud-schematics-build`  | initializes and validates your terraform configuration by running commands `terraform init` and `terraform validate`. Any validation errors will be displayed in the terminal. |
| `ibmcloud-schematics-deploy` | Validates and deploys your terraform configuration to IBM Cloud Schematics.                                                                                                    |
| `ibmcloud-schematics-clone`  | Clones an existing Schematics workspace or a GIT repository.                                                                                                                   |

Know more about [vscode tasks]

#### Commands

The below commands help you to interact with the deployed Schematics workspace. You can access these commands via the vscode Editor commands [ cmd + shift + p ]

| Command                           | Description                                                                                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| View and override variable values | You can use this command to view workspace variables and override the variable values.                                                                                                                  |
| View jobs                         | You can use this command to view jobs/activities of the deployed Schematics workspace.                                                                                                                  |
| View log                          | You can use this command to view logs of selected activity of the deployed Schematics workspace.                                                                                                        |
| View latest log                   | You can use this command to view logs of the latest activity executed                                                                                                                                   |
| Pull latest                       | You can use this command to update the workspace with latest configuration changes on a Schematics workspace. **Note:** The changes need to be pushed to your git repository before using this command. |
| View resources                    | You can use this command to view the resources provisioned by your workspace                                                                                                                            |
| Generate plan                     | You can use this command to create a Terraform execution plan                                                                                                                                           |
| Apply plan                        | You can use this command to run your infrastructure code                                                                                                                                                |
| Destroy resources                 | You can use this command to destroy resources                                                                                                                                                           |
| Delete workspace                  | You can use this command to delete workspace                                                                                                                                                            |

Know more about [vscode commands]

#### Changelog and releases

All notable changes to this project will be documented in [changelog]. You can find the releases in [release section]

#### Contribution

If you wish to contribute please read the [contribution document]

#### Issue reporting

If you wish to report an issue or request an enhancement,check the issue list. If the issue/enhancement is not yet already opened, please go ahead and raise a new one.

## License

Apache-2.0

[comment]: <Below are the list of links>
[vscode tasks]: https://code.visualstudio.com/docs/editor/tasks
[vscode custom tasks]: https://code.visualstudio.com/docs/editor/tasks#_custom-tasks
[vscode commands]: https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette
[contribution document]: CONTRIBUTE.md
[changelog]: CHANGELOG.md
[release section]: https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases
