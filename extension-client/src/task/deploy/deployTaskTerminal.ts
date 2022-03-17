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

export default class DeployTaskTerminal implements vscode.Pseudoterminal {
    private writeEmitter = new vscode.EventEmitter<string>();
    onDidWrite: vscode.Event<string> = this.writeEmitter.event;
    private closeEmitter = new vscode.EventEmitter<number>();
    onDidClose?: vscode.Event<number> = this.closeEmitter.event;

    constructor() {}

    open(initialDimensions: vscode.TerminalDimensions | undefined): void {
        this.doDeploy();
    }

    close(): void {}

    private async doDeploy(): Promise<void> {
        var self = this;
        var terminal = new Terminal(self.writeEmitter, self.closeEmitter);

        try {
            terminal.printHeading('Validating deploy');
            await command.terraform.init();
            await command.terraform.validate();
            terminal.printSuccess('The configuration is valid');

            await util.workspace.createCredentialFile();
            const inputResourceGrp: string = await util.workspace.getResourceGroupInput();
            terminal.printHeading(inputResourceGrp);
            const tfversions: any = await api.versions();
            await util.workspace.detectTerraformVersion(tfversions);
            terminal.printHeading('Preparing deploy');
            await util.workspace.createTarFile();
            terminal.printSuccess('TAR created');
            terminal.printHeading('Deploy started');
            await command.workspace.create(inputResourceGrp);
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
