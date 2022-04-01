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
import { Terminal } from '../../util/terminal';
import * as api from '../../api/index';
import { openStdin } from 'process';

export default class CloneTaskTerminal implements vscode.Pseudoterminal {
    private writeEmitter = new vscode.EventEmitter<string>();
    onDidWrite: vscode.Event<string> = this.writeEmitter.event;
    private closeEmitter = new vscode.EventEmitter<number>();
    onDidClose?: vscode.Event<number> = this.closeEmitter.event;

    constructor() {}

    open(initialDimensions: vscode.TerminalDimensions | undefined): void {
        this.doClone();
    }

    close(): void {}

    private async doClone(): Promise<void> {
        var self = this;
        var terminal = new Terminal(self.writeEmitter, self.closeEmitter);

        try {
            const pathToClone = await util.workspace.getPathToClone();
            const template = await util.workspace.importTemplate();
            const isValidRepoURL = await util.workspace.isGITRepo(template);

            if (isValidRepoURL) {
                terminal.printHeading('Clone started');
                terminal.printText('Repository URL: ' + template);
                await command.git.clone(template, pathToClone);
                await util.workspace.openClonedRepository(
                    template,
                    pathToClone
                );

            } else {
                const creds = await util.workspace.getCredentials();
                const wsdata = await api.getWorkspace(template, creds);

                if (util.workspace.isCatalogWorkspace(wsdata)) {
                    throw new Error(
                        'Cloning a catalog workspace is not yet supported'
                    );
                }

                if (util.workspace.isArchiveUploadedWorkspace(wsdata)) {
                    throw new Error(
                        'Cloning a tar uploaded workspace is not yet supported'
                    );
                }

                terminal.printHeading('Clone started');
                terminal.printText('Cloning workspace: ' + template);
                const templateRepo =
                    util.workspace.getTemplateRepoFromWorkspace(wsdata);
                await command.git.clone(templateRepo, pathToClone);
                await util.workspace.saveToClonedAccount(
                    creds,
                    pathToClone,
                    templateRepo
                );
                await util.workspace.saveOriginalWorkspace(
                    wsdata,
                    pathToClone,
                    templateRepo
                );
                await util.workspace.openClonedRepository(
                    templateRepo,
                    pathToClone
                );

            }
            terminal.fireClose(1);
        } catch (error) {
            terminal.printFailure('Clone error');
            terminal.printError(error);
            terminal.fireClose(0);
        }
    }
}
