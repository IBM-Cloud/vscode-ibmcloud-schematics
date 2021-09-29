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
import * as api from '../../api';
import * as util from '../../util';
import ResourcesView from '../../webview/workspace/ResourcesView';
import TimeEstimationView from '../../webview/workspace/TimeEstimationView';

export async function resources(
    context: vscode.ExtensionContext
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
        const resourcesView = new ResourcesView(context, ws.id);
        resourcesView.openView(true);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export async function destroyResources(): Promise<void> {
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
            .showConfirmDestroyResourcesModal(ws.id)
            .then(async () => {
                await api.destroyResources(ws.id);
                vscode.window.showInformationMessage('Destroy initiated!');
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

export async function estimateTimeToProvision(
    context: vscode.ExtensionContext
): Promise<void> {
    // const isDeployed = util.workspace.isDeployed();
    // if (!isDeployed) {
    //     vscode.window.showErrorMessage(
    //         'Workspace not deployed. Make sure you have deployed your workspace.'
    //     );
    //     return;
    // }
    try {
        await command.terraform.outputPlan();
        // await command.terraform.outputJSONPlan();
        const tfplanJson = await util.workspace.readTFPlan();
        const resp: any = await api.createTimeEstimation(tfplanJson);
        const teView = new TimeEstimationView(context, resp.jobID);
        teView.openView(true);
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}
