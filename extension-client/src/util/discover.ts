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
 import * as userInput from './userInput';
 import * as credutils from './workspace';
 import * as type from '../type/index';
 
export async function chooseServices(): Promise<string> {
    let services: string = '';
    try {
        let servicesList = [
            'ibm_kp',
            'ibm_cos',
            'ibm_iam',
            'ibm_container_vpc_cluster',
            'ibm_database_etcd',
            'ibm_database_mongo',
            'ibm_database_postgresql',
            'ibm_database_rabbitmq',
            'ibm_database_redis',
            'ibm_is_instance_group',
            'ibm_cis',
            'ibm_is_vpc',
            'ibm_is_subnet',
            'ibm_is_instance',
            'ibm_is_security_group',
            'ibm_is_network_acl',
            'ibm_is_public_gateway',
            'ibm_is_volume',
            'ibm_is_vpn_gateway',
            'ibm_is_lb',
            'ibm_is_floating_ip',
            'ibm_is_flow_log',
            'ibm_is_ike_policy',
            'ibm_is_image',
            'ibm_is_instance_template',
            'ibm_is_ipsec_policy',
            'ibm_is_ssh_key',
            'ibm_function',
            'ibm_private_dns'
        ];
        const servicesPicked: any = await userInput.showServicesForDiscoveryQuickPick(servicesList);
        vscode.window.showInformationMessage('Got services: ' + servicesPicked);
        services = servicesPicked.join(); // 
        vscode.window.showInformationMessage('concatenated services: ' + services);
        // services = 'ibm_iam'
        return services;  // todo: @srikar - why is services coming as empty
        // // todo: @srikar -  concatenate the chosen list with commas in between
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
    return services;
}
 
 
export async function chooseConfigDir(): Promise<string> {
    const openDialogOptions: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select',
        canSelectFiles: false,
        canSelectFolders: true,
    };

    return new Promise(async (resolve, reject) => {
        vscode.window.showOpenDialog(openDialogOptions).then((fileUri) => {
            if (fileUri && fileUri[0]) {
                resolve(fileUri[0].fsPath);
            } else {
                reject('Please select the folder where you want your config');
            }
        });
    });
}
 
export async function chooseConfigName(): Promise<string> {
    const openDialogOptions: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select',
        canSelectFiles: false,
        canSelectFolders: true,
    };
 
    return new Promise(async (resolve, reject) => {
        vscode.window.showOpenDialog(openDialogOptions).then((fileUri) => {
            if (fileUri && fileUri[0]) {
                // resolve(fileUri[0].fsPath);
                return 'test';
            } else {
                reject('Please select the folder inside your config for config name');
            }
        });
    });
}
 
export function config(section: string, scope?: vscode.ConfigurationScope): vscode.WorkspaceConfiguration {
    return vscode.workspace.getConfiguration(section, scope);
}

export function createDiscoveryCredentialFile(): any {
    if (credutils.hasCredentialsFile()) {
        verifyAPIKey().then((isValid) => {
            if (!isValid) {
                return getAPIKey().then((acc: type.Account) =>
                credutils.saveToAccount(acc)
                );
            }
            Promise.resolve('present');
        });
    } else {
        return getAPIKey().then((acc: type.Account) => credutils.saveToAccount(acc));
    }
}

export async function getAPIKey() {
    // Get the API key
    const apiKey = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        password: true,
        placeHolder: 'Enter API key of account to get resources from' ,
        prompt: 'Enter API key',
    });

    if (!!apiKey) {
        const cred: type.Account = {
            serviceURL: "",
            apiKey: apiKey,
        };
        return Promise.resolve(cred);
    }
    return Promise.reject('API Key not entered.');
}


export function verifyAPIKey() {
    return new Promise(function (resolve, reject) {
        const credPath = credutils.getCredentialsPath();
        credutils.readFile(credPath)
            .then((data: any) => {
                if (!!data.apiKey) {
                    reject(false);
                }
                resolve(true);
            })
            .catch((err) => reject(err));
    });
}