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
import EstimateCostView from '../../webview/workspace/EstimateCostView';
import { Terminal } from '../../util/terminal';
import * as terraform from '../shell/terraform/index';
import * as tfcost from '../shell/tfcost/index';
import * as util from '../../util';
import { path } from '../../util/workspace';
var os = require('os');

const TCOST_INSTALL_DOC = 'https://github.com/IBM-Cloud/terraform-cost-estimator#using-the-cli';

export async function cost(context: vscode.ExtensionContext): Promise<void> {
    try {
        const writeEmitter = new vscode.EventEmitter<string>();
        const closeEmitter = new vscode.EventEmitter<number>();
        const pty = {
            onDidWrite: writeEmitter.event,
            onDidClose: closeEmitter.event,
            open: async () => {
                await estimateCost(writeEmitter, closeEmitter).then(async (r) => {
                    await new EstimateCostView(context).openView(false);
                }).catch((err: any) => {
                    vscode.window.showErrorMessage(String(err));
                });
            },
            close: () => { }
        };
        await (<any>vscode.window).createTerminal({ pty }).show();
    }
    catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }


}

async function estimateCost(writeEmitter: any, closeEmitter: any): Promise<any> {
    var terminal = new Terminal(writeEmitter, closeEmitter);

    try {
        try {
            await tfcost.isInstalled();
        }
        catch {
            showTFCostInstallationModal(terminal);
            return new Promise((resolve, reject) => {
                reject(new Error("Install tfcost and try again."));
            });
        }

        await util.workspace.createCredentialFile();
        const cred = await util.workspace.readCredentials();

        terminal.printHeading("Running terraform init");
        await terraform.init();
        terminal.printSuccess("terraform init");

        terminal.printHeading("Running terraform plan");
        await terraform.createPlan(cred.apiKey);
        terminal.printSuccess("terraform plan");

        terminal.printHeading("Creating cost.json file");
        await terraform.convertPlanToJSON(cred.apiKey);
        await tfcost.calculateCost(cred.apiKeys);
        terminal.printSuccess("cost.json file created");

        terminal.fireClose(1);
    } catch (error: any) {
        terminal.printFailure("Cost Estimation Error");
        var text = error;
        if (typeof error !== 'string') {
            text = error.toString();
        }
        var lines: string[] = text.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            terminal.printText(lines[i]);
        }
    }

    return util.workspace.readFile(path.join(util.workspace.getWorkspacePath(), "cost.json"));
}


export async function showTFCostInstallationModal(terminal: Terminal): Promise<any> {
    const msg = `This feature requires you to install tfcost. Details of installtion can be found at https://github.com/IBM-Cloud/terraform-cost-estimator#using-the-cli. Do you want to open the URL ?`;

    await vscode.window.showInformationMessage(
        msg,
        { modal: true },
        "OK"
    )
        .then((answer) => {
            if (answer?.toUpperCase() === "OK") {
                vscode.env.openExternal(vscode.Uri.parse(TCOST_INSTALL_DOC));
            } else {
                terminal.printFailure("Install tfcost and try again. See " + TCOST_INSTALL_DOC + " for details");
            }
        });
    return;
}
