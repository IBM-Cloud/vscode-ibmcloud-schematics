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
import { BuildTaskProvider } from './task/build/buildTaskProvider';
import { DeployTaskProvider } from './task/deploy/deployTaskProvider';
import { CloneTaskProvider } from './task/clone/cloneTaskProvider';

import * as command from './command';

let buildTaskProvider: vscode.Disposable | undefined;
let deployTaskProvider: vscode.Disposable | undefined;
let cloneTaskProvider: vscode.Disposable | undefined;

let activitiesPanelWebview: vscode.Disposable | undefined;
let logPanelWebview: vscode.Disposable | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Your extension "IBM Cloud Schematics" is now active!');

    // Register build and deploy task providers
    buildTaskProvider = vscode.tasks.registerTaskProvider(
        BuildTaskProvider.taskType,
        new BuildTaskProvider()
    );
    deployTaskProvider = vscode.tasks.registerTaskProvider(
        DeployTaskProvider.taskType,
        new DeployTaskProvider()
    );
    cloneTaskProvider = vscode.tasks.registerTaskProvider(
        CloneTaskProvider.taskType,
        new CloneTaskProvider()
    );

    // Register commands
    let jobsCmd = vscode.commands.registerCommand(
        'schematics.workspace.jobs',
        () => command.workspace.jobs(context)
    );
    context.subscriptions.push(jobsCmd);

    let logCmd = vscode.commands.registerCommand(
        'schematics.workspace.job.log',
        (data) => command.workspace.log(context, data)
    );
    context.subscriptions.push(logCmd);

    let latestLogCmd = vscode.commands.registerCommand(
        'schematics.workspace.job.latestLog',
        () => command.workspace.latestLog(context)
    );
    context.subscriptions.push(latestLogCmd);

    var resourcesCmd = vscode.commands.registerCommand(
        'schematics.workspace.resources',
        () => command.workspace.resources(context)
    );
    context.subscriptions.push(resourcesCmd);

    var planCmd = vscode.commands.registerCommand(
        'schematics.workspace.plan',
        () => command.workspace.plan()
    );
    context.subscriptions.push(planCmd);

    var applyCmd = vscode.commands.registerCommand(
        'schematics.workspace.apply',
        () => command.workspace.apply()
    );
    context.subscriptions.push(applyCmd);

    var wsDeleteCmd = vscode.commands.registerCommand(
        'schematics.workspace.delete',
        () => command.workspace.deleteWorkspace()
    );
    context.subscriptions.push(wsDeleteCmd);

    var wsDestroyResourcesCmd = vscode.commands.registerCommand(
        'schematics.workspace.destroyResources',
        () => command.workspace.destroyResources()
    );
    context.subscriptions.push(wsDestroyResourcesCmd);

    let variablesCmd = vscode.commands.registerCommand(
        'schematics.workspace.variables',
        (data) => command.workspace.variables(context, data)
    );
    context.subscriptions.push(variablesCmd);

    let saveVariablesCmd = vscode.commands.registerCommand(
        'schematics.workspace.variables.save',
        (data) => command.workspace.saveVariables(context, data)
    );
    context.subscriptions.push(saveVariablesCmd);

    var wsDetailsCmd = vscode.commands.registerCommand(
        'schematics.workspace.details',
        () => command.workspace.read(context)
    );
    context.subscriptions.push(wsDetailsCmd);
}

// This method is called when your extension is deactivated
export function deactivate() {
    // Dispose task providers after deactivation
    if (buildTaskProvider) {
        buildTaskProvider.dispose();
    }
    if (deployTaskProvider) {
        deployTaskProvider.dispose();
    }
    if (cloneTaskProvider) {
        cloneTaskProvider.dispose();
    }

    // Dispose webview panels after deactivation
    if (activitiesPanelWebview) {
        activitiesPanelWebview.dispose();
    }
    if (logPanelWebview) {
        logPanelWebview.dispose();
    }
}
