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
import * as api from '../../api';
import { ReactView } from '../ReactView';

export default class VariablesView extends ReactView {
    static viewID: string = 'workspace.variables';
    static viewTitle: string = 'Workspace Variables';
    private id: string;
    private credentials: any;

    constructor(context: vscode.ExtensionContext, id: string, creds: any) {
        super(context, VariablesView.viewID, VariablesView.viewTitle);
        this.id = id;
        this.credentials = creds;
    }

    async openPanelInner(panel: vscode.WebviewPanel): Promise<void> {
        panel.webview.onDidReceiveMessage(async (message) => {
            await vscode.commands.executeCommand(
                message.command,
                message.variables
            );
        });

        await this.loadComponent(panel);
    }

    async loadComponent(panel: vscode.WebviewPanel): Promise<void> {
        api.getWorkspace(this.id, this.credentials)
            .then((result) => {
                panel.webview.postMessage({
                    path: '/workspace/variables',
                    message: result,
                });
            })
            .catch((error) => {
                console.log(error);
                panel.webview.postMessage({
                    path: '/error',
                    message: String(error),
                });
            });
    }
}
