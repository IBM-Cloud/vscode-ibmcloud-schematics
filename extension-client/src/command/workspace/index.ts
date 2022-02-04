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
import * as util from '../../util';

export * from './resources';
export * from './log';
export * from './job';
export * from './variables';

import DetailsView from '../../webview/workspace/DetailsView';

const fs = require('fs');

export async function create(): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (isDeployed) {
        Promise.resolve('workspace already deployed');
        return;
    }

    const type: any = await util.workspace.readTerraformVersion();
    const payload = {
        name: util.workspace.getSuffixedWorkspaceName(),
        type: [type.version],
        templateData: [
            {
                folder: '.',
                type: type.version,
                variablestore: [],
            },
        ],
    };

    return new Promise((resolve, reject) => {
        api.createWorkspace(payload)
            .then(async (resp) => {
                await util.workspace.saveSchematicsWorkspace(resp);
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function createMigratedWorkspace(workspaceData: any): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (isDeployed) {
        Promise.resolve('workspace already deployed');
        return;
    }

    const type: any = await util.workspace.readTerraformVersion();
    const payload = {
        name: util.workspace.getSuffixedWorkspaceName(),
        description: workspaceData.description,
        tags: workspaceData.tags,
        type: [type.version],
        templateData: [
            {
                folder: '.',
                type: type.version,
                variablestore: workspaceData.template_data[0].variablestore,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                env_values: workspaceData.template_data[0].env_values,
            },
        ],
    };

    return new Promise((resolve, reject) => {
        api.createWorkspace(payload)
            .then(async (resp) => {
                await util.workspace.saveSchematicsWorkspace(resp);
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export async function pullLatest() {
    if (util.workspace.hasOriginalWorkspace()) {
        const wsData = await util.workspace.readOriginalWorkspace();

        util.userInput
            .showConfirmPullLatestModal(wsData.id)
            .then(async () => {
                try {
                    await api.pullLatest(wsData);
                    vscode.window.showInformationMessage(
                        `Pull latest initiated successfully on workspace ${wsData.id}`
                    );
                } catch (error) {
                    console.log(error);
                    vscode.window.showErrorMessage(String(error));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        vscode.window.showInformationMessage(
            'Use deploy task to update your workspace'
        );
    }
}

export async function uploadTAR(): Promise<string> {
    const wsData = await util.workspace.readSchematicsWorkspace();
    const fileStream = fs.createReadStream(util.workspace.getTarFilePath());

    const payload = {
        wId: wsData.id,
        tId: wsData.template_data[0].id,
        fileContentType: 'multipart/form-data',
        file: fileStream,
    };

    return await api.uploadTar(payload);
}

export async function deleteWorkspace(): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }
    try {
        const ws = await util.workspace.readSchematicsWorkspace();

        util.userInput
            .showConfirmDeleteWorkspace()
            .then(async () => {
                await api.deleteWorkspace(ws.id);
                vscode.window.showInformationMessage('Delete initiated!');
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export async function read(context: vscode.ExtensionContext): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        const ws = await util.workspace.readSchematicsWorkspace();
        const view = new DetailsView(context, ws.id);
        view.openView(true);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}
