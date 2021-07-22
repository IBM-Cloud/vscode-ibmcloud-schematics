## Contribution

If you wish to contibute then please read further.

#### Prerequisite

Make sure you have the following installed on your system:

-   [Node.js]
-   [GIT] with SSH key added to your account in GHE
-   [Visual Studio Code]

#### Technology

Below technologies and concepts are used in developing the extension

-   [Typescript] - programming language
-   [Visual Studio Code Extension Development] - Extension development using [vscode API] and [Task Provider]

#### Development setup

Clone the repository

```
$ git clone https://github.com/IBM-Cloud/vscode-ibmcloud-schematics.git
```

Open the cloned folder in vscode

```
$ cd vscode-ibmcloud-schematics
$ code .
```

-   Install dependencies

```
$ npm install
```

#### Running locally

Before you could run vscode locally, please make sure you build and copy `extension-ui` which is necessary for the extension to work properly.

To build `extension-ui`,

```
// run this command from project root folder
$ npm run ui:build
```

To copy the built `extension-ui`

```
// run this command from project root folder
$ npm run ui:copy
```

Now from inside vscode editor root folder of the source code, press key `F5 from Run` menu OR `Run > Start debugging`, this will compile and run the extension in a new **Extension Development Host window**

In the open **Extension Development Host window**, you should be able to see the custom tasks and commands.

Open a exisiting terraform configuration workspace or download from [IBM Terraform Provider]

To run a task, select from menu `Terminal > Run task...`
To run a command, select from menu `View > Command Palette...` or use keyboard shortcut `cmd + shift + p`

#### Packaging and installing extension locally

In order to package the extension you need to install the [vscode extension manager]. To install `vsce` run below command:

```
$ npm install vsce
```

To package the extension run the below command from the project root. This will generate a file named `ibmcloud-schematics-<version>.vsix` file under `bin` folder

```
$ npm run vsce:package
```

You can now install this `.vsix` file to vscode using below command:

```
$ code --install-extension ./bin/ibmcloud-schematics-<version>.vsix
```

Note: `<version>` is the version number that will be auto generated. Make sure to edit the command to replace with the actual version number

[comment]: <Below are the list of links>
[node.js]: https://nodejs.org/en/
[git]: https://git-scm.com/
[visual studio code]: https://code.visualstudio.com/download
[vscode tasks]: https://code.visualstudio.com/docs/editor/tasks
[typescript]: https://www.typescriptlang.org/
[visual studio code extension development]: https://code.visualstudio.com/api/get-started/your-first-extension
[vscode api]: https://code.visualstudio.com/api/references/vscode-api
[task provider]: https://code.visualstudio.com/api/extension-guides/task-provider
[ibm terraform provider]: https://github.com/IBM-Cloud/terraform-provider-ibm/tree/master/examples
[vscode extension manager]: https://github.com/microsoft/vscode-vsce
