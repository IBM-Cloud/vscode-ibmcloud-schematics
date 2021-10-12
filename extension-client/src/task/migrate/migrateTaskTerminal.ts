/**
 * IBM Cloud Schematics
 * (C) Copyright IBM Corp. 2021 All Rights Reserved.
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

    private async doMigrate(): Promise<void> {
        var self = this;
        var terminal = new Terminal(self.writeEmitter, self.closeEmitter);

        try {

            terminal.printHeading('IBM Cloud Schematics - Migrating Terraform v.0.11 to v.0.12');
            var terraformVersionCheck=new String()
            terminal.printHeading('Migration started');
            terminal.printHeading('Checking terraform version in local machine.');
            terraformVersionCheck = String(await command.terraform.checkVersion());
            var tfMatchVersion= "0.12"
            var tfTargetVersion={"version":"terraform_v0.12"}

            if((terraformVersionCheck).indexOf(tfMatchVersion)!== -1){

                terminal.printSuccess('Verified Terraform v0.12.x');

                const ws= await vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    placeHolder: 'Enter the Workspace ID you want to migrate:'
                });
                if (!!ws){
                    await util.workspace.createCredentialFile();
                    const creds: type.Account = await util.workspace.readCredentials();

                    var workspaceData: any=await api.getWorkspace(ws, creds);

                    var templateId = workspaceData.template_data[0].id;

                    var workspaceVariableStore=workspaceData.template_data[0].variablestore
                    const payload = {
                        wId: ws,
                        tId: templateId,
                    };
                    terminal.printHeading('Downloading statefile from workspace...');
                    var storeFile: any=await api.getStatefile(payload);

                    const workspacePath=util.workspace.getWorkspacePath();
                    if(storeFile != 1)
                    {
                        storeFile=JSON.stringify(storeFile)
                        util.userInput.writeStateFile(storeFile,workspacePath);
                        terminal.printSuccess('Downloaded statefile');
                    }
                    else{
                        terminal.printHeading('There is no statefile present for the workspace...');
                    }

                    terminal.printHeading('Upgrading locally..');
                    await command.terraform.init();
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
            }
            else
            {
                terminal.printError('The workstation does not have Terraform V0.12.0 installed, Please update terraform version 0.12.x');
                console.log("Please update terraform version 0.12.x")
            }
        }
        catch (error) {
            terminal.printFailure('Deploy error');
            terminal.printError(error);
            terminal.fireClose(1);
        }
    }
}
