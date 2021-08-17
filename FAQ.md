# Frequently Asked Questions

As a maintainers of this repository, we often see a lot of questions that surface repeatedly. This FAQ document is an attempt to gather some of those and provide some answers!

### What is IBM Cloud Schematics extension for Visual Studio Code?

IBM Cloud Schematics extension (plug-in) for Visual Studio Code allows you to iteratively develop, deploy and test your Terraform configurations (in other word templates) with IBM Cloud Schematics service from within Visual Studio Code.

### What are the Prerequisites tools needed to be installed to use IBM Cloud Schematics extension for Visual Studio Code?

-   Terraform: [Install and configure Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli#install-terraform) – You will need a local copy of Terraform to integrate your local development environment
-   IBM Cloud provider plugin for Terraform: [Download and configure IBM Cloud provider](https://github.com/IBM-Cloud/terraform-provider-ibm#download-the-provider-manually-option-2)
-   GIT: [Install GIT CLI](https://git-scm.com/downloads)
-   Visual Studio Code: Install the version of [Visual Studio Code](https://code.visualstudio.com/download) that is appropriate for your machine

### How do I install IBM Cloud Schematics extension for Visual Studio Code?

You can install the extension by following below steps:

1. Download the latest release of `.vsix` file from the [releases](https://github.com/IBM-Cloud/vscode-ibmcloud-schematics/releases)
2. Launch Visual Studio Code
3. Click on the `Extensions` side menu (keyboard shortcut - ⇧⌘X on macOS or Ctrl+Shift+X on Windows)
4. Click on the three horizontal dots
5. Select `Install from VSIX...` sub menu
6. Choose the downloaded extension (from step 1)

### How do I verify if the extension is installed?

1. Select Extensions side menu (keyboard shortcut - ⇧⌘X on macOS or Ctrl+Shift+X on Windows)
2. Enter “@installed IBM Cloud Schematics” in the search text box
3. The IBM Cloud Schematics extension will appear in the list of installed extensions

### How do I use this extension? Is there a tutorial I can read?

Yes. You can read [our tutorial](tutorial/README.md) on how to get started with this extension.

### Why do I see `No ... tasks found. Go back` when I try to Run tasks?

IBM Cloud Schematics extension `Run tasks` are enabled only when you have a Terraform configuration opened in VS Code window (This is usually just your terraform project root folder). To open a terraform configuration:

1. Go to menu `File` > `Open ...` or `Open workspace ...`
2. Choose the path to the folder where your Terraform configuration exists on your system.

You will now be able to access all Run tasks.

### I am not able to clone a GIT repository with a sub-folder or a branch. I see `Failure! Clone error` and `fatal: repository not found` error on the terminal. Why?

Cloning a sub-folder or a branch is not yet supported by the extension. Please make sure the GIT Repository URL has terraform configuration as root. For instance [Multitier VPC Example](https://github.com/Cloud-Schematics/multitier-vpc-example) is a valid GIT Repository URL

### I cloned an existing IBM Cloud Schematics workspace into VS Code. But when I deployed it, a new workspace was created. Why ?

This is a expected behaviour. Assume this new workspace as a scrapbook workspace which you can use to iteratively develop and test. And then once your development is done, you can commit your changes to original GIT Repository and then scrap (or delete) this test workspace.

### IBM Cloud Schematics console (UI) has `Pull latest` button. How do I `Pull latest` on the deployed Schematics workspace?

You just use the `Deploy` Run task to re-deploy the latest changes. The changes will reflect in the already deployed workspace. No new Schematics workspace will be created.

### How do I perform workspace specific tasks like Run plan, Apply plan or View Jobs/Activities from the extension?

We have provided additional VS code commands to perform workspace specific tasks like Run plan, Apply plan or View Jobs/Activities. To see and run the list of VS code commands, you need to open the VS Code Command Palette. Follow the below steps to open the palette:

1. Select `View` > `Command Palette...` from VS Code menu bar ( Keyboard Shortcut: ⇧⌘P on macOS or Ctrl+Shift+P on Windows)
2. Search for “IBM Cloud Schematics”

Please see [Tutorial 4: A palette of VS Code commands for IBM Cloud Schematics](tutorial/README.md#tutorial-4-a-palette-of-vs-code-commands-for-ibm-cloud-schematics) for more details
