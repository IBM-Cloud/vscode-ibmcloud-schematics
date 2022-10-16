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
import * as type from '../../type/index';
import * as util from '../../util';
import JobsView from '../../webview/workspace/JobsView';

export function jobs(context: vscode.ExtensionContext): void {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        const jobs = new JobsView(context);
        jobs.openView(false);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export async function plan(): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        const ws = await util.workspace.readSchematicsWorkspace();
        await api.runPlan(ws.id);
        vscode.window.showInformationMessage('Plan initiated!');
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export async function apply(): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        const ws = await util.workspace.readSchematicsWorkspace();
        await api.runApply(ws.id);
        vscode.window.showInformationMessage('Apply initiated!');
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export async function getStateFile(): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }
    const ws = await util.workspace.readSchematicsWorkspace();
    const creds: type.Account = await util.workspace.readCredentials();
    const wsdata: any = await api.getWorkspace(ws.id, creds);

    const payload = {
        jobId: wsdata.last_activity_id,
        fileType: 'state_file',
    };

    return new Promise((resolve, reject) => {
        api.getOutputFile(payload)
            .then(async (resp: any) => {
                if (resp.hasOwnProperty('file_content')) {
                    var fileContent: any = JSON.parse(resp.file_content);
                    await util.workspace.saveSchematicsWorkspaceStateFile(
                        fileContent
                    );
                    vscode.window.showInformationMessage(
                        'State File downloaded!'
                    );
                }

                resolve();
            })
            .catch((error) => {
                console.log(error);
                vscode.window.showErrorMessage(String(error));
            });
    });
}
