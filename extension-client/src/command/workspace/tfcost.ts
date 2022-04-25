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
import EstimateCostView from '../../webview/workspace/EstimateCostView';

export async function cost(context: vscode.ExtensionContext): Promise<void> {
    try {
        await command.tfcost.isInstalled();
        await util.workspace.createCredentialFile();
        await command.terraform.init();
        await command.terraform.validate();

        var isTfvars = util.workspace.hasTfvarsFile();
        if (!isTfvars) {
            tfvarsFileNotFound();
            return;
        }

        const cred = await util.workspace.readCredentials();
        await command.terraform.createPlan(cred.apiKey);
        await command.terraform.convertPlanToJSON(cred.apiKey);
        await command.tfcost.calculateCost(cred.apiKey);
        await new EstimateCostView(context).openView(false);
    }
    catch (error: any) {
        if (error?.message.includes('command not found')) {
            tfcostNotFound();
        } else if (error?.message.includes('Error locking state')) {
            terraformLockState();
        } else {
            vscode.window.showErrorMessage(String(error));
        }
    }
}

async function tfcostNotFound(): Promise<void> {
    const message = '\'tfcost\' not found on PATH. This feature requires you to install tfcost. Make sure it is installed.';
    const result = await vscode.window.showInformationMessage<any>(message,
        {
            title: 'Documentation',
            run: installTFcostCLI
        }
    );
    if (result && result.run) {
        result.run();
    }
}

function installTFcostCLI() {
    vscode.env.openExternal(vscode.Uri.parse('https://github.com/IBM-Cloud/terraform-cost-estimator#using-the-cli'));
}

async function tfvarsFileNotFound(): Promise<void> {
    const message = '\'terraform.tfvars\' file not found. tfcost will use the variable values from tfvars file to generate cost. Create this file and try again';
    const result = await vscode.window.showInformationMessage<any>(message,
        {
            title: 'Documentation',
            run: createTfvarsFile
        }
    );
    if (result && result.run) {
        result.run();
    }
}

function createTfvarsFile() {
    vscode.env.openExternal(vscode.Uri.parse('https://www.terraform.io/language/values/variables#variable-definitions-tfvars-files'));
}

async function terraformLockState(): Promise<void> {
    const message = '\'terraform\' has locked your state. Either delete the related lock file and .tfstate file or unlock the state';
    const result = await vscode.window.showInformationMessage<any>(message,
        {
            title: 'Documentation',
            run: gotoUnlockState
        }
    );
    if (result && result.run) {
        result.run();
    }
}

function gotoUnlockState() {
    vscode.env.openExternal(vscode.Uri.parse('https://www.terraform.io/language/state/locking'));
}
