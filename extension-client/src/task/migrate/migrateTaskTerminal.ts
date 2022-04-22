/**
 * IBM Cloud Schematics
 * (C) Copyright IBM Corp. 2022 All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';

import * as command from '../../command';
import * as util from '../../util';
import * as api from '../../api';
import { Terminal } from '../../util/terminal';
import * as type from '../../type/index';
import { isCloned, isDirectoryEmpty } from '../../util/workspace';
import { delay } from '../../util/userInput';
var fs = require('fs');


export default class MigrateTaskTerminal implements vscode.Pseudoterminal {
    private writeEmitter = new vscode.EventEmitter<string>();
    onDidWrite: vscode.Event<string> = this.writeEmitter.event;
    private closeEmitter = new vscode.EventEmitter<number>();
    onDidClose?: vscode.Event<number> = this.closeEmitter.event;

    constructor() {}

    open(initialDimensions: vscode.TerminalDimensions | undefined): void {
        this.doMigrate();
    }

    close(): void {}

    private async migrationStep(terminal: any, ws: any, deploy: any) {
        terminal.printHeading('IBM Cloud Schematics - Migrating Terraform v.0.11 to v.0.12');
        var terraformVersionCheck = new String();
        terminal.printHeading('Migration started');
        terminal.printHeading('Checking terraform version in local machine.');
        terraformVersionCheck = String(await command.terraform.checkVersion());
        var tfMatchVersion = "0.12";
        var tfTargetVersion = { "version": "terraform_v0.12" };
        if ((terraformVersionCheck).indexOf(tfMatchVersion) !== -1) {
            terminal.printSuccess('Verified Terraform v0.12.x');


            if (deploy === false) {
                terminal.printHeading('Upgrading locally..');
                await command.terraform.init();
                await command.terraform.upgrade();
                terminal.printSuccess('Terraform version upgraded locally');
                terminal.fireClose(1);
            }
            else {
                try {
                    if (!util.workspace.hasCredentialsFile()) {
                        await util.workspace.createCredentialFile();
                    }
                    const creds: type.Account = await util.workspace.readCredentials();
                    terminal.printHeading('Searching for workspace...');
                    var workspaceData: any = await api.getWorkspace(ws, creds);
                    console.log(workspaceData);
                    if (!workspaceData.hasOwnProperty("id")) {
                        terminal.printHeading('Workspace id is not matching');
                        terminal.printError("Workspace ID provided is not found. Please check.");
                        terminal.fireClose(1);
                    }
                    else if (workspaceData.type[0] === "terraform_v0.12") {
                        terminal.printHeading('Workspace is already on v12. No migration required');
                        terminal.printError("Workspace is already on v12. Please select the workspace deployed with v11");
                        terminal.fireClose(1);
                    }
                    else {

                        var templateId = workspaceData.template_data[0].id;
                        var workspaceVariableStore = workspaceData.template_data[0].variablestore;
                        const payload = {
                            wId: ws,
                            tId: templateId,
                        };
                        terminal.printHeading('Downloading statefile from workspace...');
                        var storeFile: any = await api.getStatefile(payload);

                        const workspacePath = util.workspace.getWorkspacePath();
                        if (storeFile !== 1) {
                            storeFile = JSON.stringify(storeFile);
                            util.userInput.writeStateFile(storeFile, workspacePath);
                            terminal.printSuccess('Downloaded statefile');
                        }
                        else {
                            terminal.printHeading('There is no statefile present for the workspace...');
                        }
                        try {
                            terminal.printHeading('Upgrading locally..');
                            await command.terraform.init();
                            terminal.printSuccess('Terraform initialized');
                            await command.terraform.upgrade();
                            terminal.printSuccess('Terraform version upgraded locally');

                            terminal.printHeading('Checking the configurations...');
                            await command.terraform.validate();
                            terminal.printSuccess('Configurations are valid');

                            await util.workspace.createCredentialFile();
                            await util.workspace.saveTerraformVersion(tfTargetVersion);

                            terminal.printHeading('Preparing deploy...');
                            await util.workspace.createTarFile();
                            terminal.printSuccess('TAR created');

                            terminal.printHeading('Deploy started');
                            await command.workspace.createMigratedWorkspace(workspaceVariableStore);
                            terminal.printSuccess('Workspace created');

                            terminal.printHeading('TAR upload started');
                            await command.workspace.uploadTAR();
                            terminal.printSuccess('TAR uploaded');

                            terminal.printHeading('Verifying workspace');
                            await api.pollState();
                            terminal.printSuccess('Workspace verified');

                            terminal.printHeading('Plan initiated');
                            await command.workspace.plan();
                            await api.pollState();
                            terminal.printSuccess('Plan generated');
                            await command.workspace.apply();
                            terminal.printHeading('Apply initiated');
                            await api.pollState();
                            terminal.printSuccess('Plan applied. IMPORTANT INSTRUCTIONS: Workspace has created with the TAR created from locally. You need to manually add and commit into the github repository. \n Please delete the existing workspace created.');
                            util.workspace.removeTarFile();
                            terminal.fireClose(1);

                        }
                        catch (error) {
                            terminal.printFailure('Migration error:');
                            terminal.printError(error);
                            terminal.fireClose(1);
                        }


                    }
                }
                catch (error) {
                    terminal.printFailure('Workspace error:');
                    terminal.printError(error);
                    terminal.fireClose(1);
                }

            }




        }

    }

    private async doMigrate(): Promise<void> {
        var self = this;
        var terminal = new Terminal(self.writeEmitter, self.closeEmitter);
        try {
            if (isDirectoryEmpty(util.workspace.getWorkspacePath())) {
                terminal.printHeading('Migration status:');
                terminal.printError('Migration cannot be started from an empty folder. Please clone the repository using "Clone" task and start "Migrate" task');
                terminal.fireClose(1);
            }
            else if (util.workspace.isWorkspaceExist()) {
                var deploy = true;
                var workspaceid: any = await util.workspace.readWorkspaceFile(util.workspace.getSchematicsWorkspacePath());
                const ws = JSON.parse(workspaceid).id;
                this.migrationStep(terminal, ws, deploy);
            }
            else {
                try {
                    var gitRepoCheck = String(await command.git.repoCheck());
                    const isValidRepoURL = await util.workspace.isGITRepo(gitRepoCheck);
                    if (isValidRepoURL) {
                    }
                    else {
                        const ws = await vscode.window.showInputBox({
                            ignoreFocusOut: true,
                            placeHolder: 'Enter the Workspace ID you want to migrate:'
                        });
                        if (!ws) {
                            vscode.window
                                .showInformationMessage(
                                    "Do you want migrate it locally?",
                                    ...["Yes", "No"]
                                )
                                .then((answer) => {
                                    if (answer === "Yes" || answer === "yes") {
                                        var deploy = false;
                                        this.migrationStep(terminal, ws, deploy);
                                    }
                                    else if (answer === "No" || answer === "no") {
                                        terminal.printHeading('Migration status:');
                                        terminal.printError("Migration needs workspace ID to proceed. Please retry migration with the input of workspace ID.");
                                        terminal.fireClose(1);
                                    }
                                    else {
                                        terminal.printHeading('Migration status:');
                                        terminal.printError("Please input correct value [Yes/No]. Retry migration.");
                                        terminal.fireClose(1);
                                    }
                                });
                        }
                        else {
                            var deploy = true;
                            this.migrationStep(terminal, ws, deploy);
                        }
                    }
                }
                catch (giterror) {
                    terminal.printError("Migration requires you to first clone a git repository or existing workspace. Please use the 'Clone' task prior to 'Migrate'");
                    terminal.fireClose(1);
                }
            }
        }
        catch (error) {
            terminal.printFailure('Migration error');
            terminal.printError(error);
            terminal.fireClose(1);
        }
    }
}
