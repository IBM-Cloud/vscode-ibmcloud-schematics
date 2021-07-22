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
import * as api from '../../api';
import { ReactView } from '../ReactView';

export default class JobsView extends ReactView {
    static viewID: string = 'workspace.jobs';
    static viewTitle: string = 'Workspace Jobs';

    constructor(context: vscode.ExtensionContext) {
        super(context, JobsView.viewID, JobsView.viewTitle);
    }

    async openPanelInner(panel: vscode.WebviewPanel): Promise<void> {
        panel.webview.onDidReceiveMessage(async (message) => {
            await vscode.commands.executeCommand(
                message.command,
                message.action_id
            );
        });

        await this.loadComponent(panel);
    }

    async loadComponent(panel: vscode.WebviewPanel): Promise<void> {
        api.getWorkspaceJobs()
            .then((result) => {
                panel.webview.postMessage({
                    path: '/workspace/jobs',
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
