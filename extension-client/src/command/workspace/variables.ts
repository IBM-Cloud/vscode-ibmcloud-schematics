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
import VariablesView from '../../webview/workspace/VariablesView';

export async function variables(
    context: vscode.ExtensionContext,
    data: any
): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        const ws = await util.workspace.readSchematicsWorkspace();
        const creds: type.Account = await util.workspace.readCredentials();
        const varsView = new VariablesView(context, ws.id, creds);

        if (data && data.reload) {
            varsView.reloadComponent();
        } else {
            varsView.openView(true);
        }
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export async function saveVariables(
    context: vscode.ExtensionContext,
    data: any
): Promise<void> {
    const isDeployed = util.workspace.isDeployed();
    if (!isDeployed) {
        vscode.window.showErrorMessage(
            'Workspace not deployed. Make sure you have deployed your workspace.'
        );
        return;
    }

    try {
        const ws = await util.workspace.readSchematicsWorkspace();
        const creds: type.Account = await util.workspace.readCredentials();
        await api.saveVariables(ws, data);
        const wsdata = await api.getWorkspace(ws.id, creds);
        util.workspace.saveSchematicsWorkspace(wsdata);
        await vscode.commands.executeCommand('schematics.workspace.variables', {
            reload: true,
        });
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}
