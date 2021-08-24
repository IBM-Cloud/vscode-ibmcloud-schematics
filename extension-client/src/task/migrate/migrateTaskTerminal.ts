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
            terminal.printHeading('Validating, to migrate, terraform version ');
            const terraform_version = await command.terraform.init();

            if (terraform_version == "Terraform v0.12.0"){
                const wsData = await util.workspace.readSchematicsWorkspace();

            }
            else{
                throw new Error(
                    'You need to install Terraform v0.12.0 in order to migrate'
                );
            }

            const ws = await util.workspace.readSchematicsWorkspace();
            const creds: type.Account = await util.workspace.readCredentials();
            const wsData = await api.getWorkspace(ws.id, creds);
            
            const template_id = wsData.template_data[0].id
            const payload = {
                wId: ws.id,
                tId: template_id,
            };
            
            // util.workspace.saveSchematicsWorkspace(wsData);

            // wsData.template_data[0].id
            // wsData.runtime_data[0].state_store_url

            // const wsData = await util.workspace.readSchematicsWorkspace();
            console.log(wsData)
            const store_file=await api.getStatefile(payload)
            
            fs.writeFile('terraform.tfstate', store_file, 'utf8');

            await command.terraform.upgrade();

            //pop-up and info -> user needs to commit the changes
            //tar it and upload tar -> create a new workspace and upload. 

            await util.workspace.createCredentialFile();
            const tfversions: any = await api.versions();

            await util.workspace.detectTerraformVersion(tfversions);
            

            //need to implement to tar and create workspace
            await command.workspace.create();
            terminal.printSuccess('Workspace created');

            terminal.printHeading('Plan initiated');
            await command.workspace.plan();
            await api.pollState();
            terminal.printSuccess('Plan generated');
            await command.workspace.apply();
            terminal.printHeading('Apply initiated');
            await api.pollState();
            terminal.printSuccess('Plan applied');
            util.workspace.removeTarFile();
            terminal.fireClose(1);
        } catch (error) {
            terminal.printFailure('Deploy error');
            terminal.printError(error);
            terminal.fireClose(1);
        }
    }
}
