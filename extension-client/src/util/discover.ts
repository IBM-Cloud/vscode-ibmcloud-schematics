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
import { openStdin } from 'process';

const fs = require('fs');
var path = require('path');
 
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
        console.log('Got services: ' + servicesPicked);
        services = servicesPicked.join(","); // 
        vscode.window.showInformationMessage('concatenated services: ' + services);
        console.log('***joined services: ' + services);
        return services;  
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
    return services;
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
                resolve(fileUri[0].fsPath);
            } else {
                reject('Import cancelled');
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


 // todo: @srikar - fix this 
//  TypeError: The "path" argument must be of type string. Received an instance of Dirent
// 	at new NodeError (/Users/srikar/friday/vscode-ibmcloud-schematics/lib/internal/errors.js:371:5)
// 	at validateString (/Users/srikar/friday/vscode-ibmcloud-schematics/lib/internal/validators.js:119:11)
// 	at Object.extname (/Users/srikar/friday/vscode-ibmcloud-schematics/lib/path.js:1386:5)
// 	at Object.containsTFFiles (/Users/srikar/friday/vscode-ibmcloud-schematics/extension-client/src/util/discover.ts:161:18)
// 	at /Users/srikar/friday/vscode-ibmcloud-schematics/extension-client/src/command/discovery/importe.ts:104:31
// 	at Generator.next (<anonymous>)
// 	at fulfilled (/Users/srikar/friday/vscode-ibmcloud-schematics/dist/extension.js:56761:58)
// 	at processTicksAndRejections (node:internal/process/task_queues:96:5) {code: 'ERR_INVALID_ARG_TYPE', vslsStack: Array(8), stack: 'TypeError: The "path" argument must be of typ…ions (node:internal/process/task_queues:96:5)', message: 'The "path" argument must be of type string. Received an instance of Dirent', toString: ƒ, …}

// arg0:TypeError: The "path" argument must be of type string. Received an instance of Dirent\n\tat new NodeError (node:internal/errors:371:5)\n\tat validateString (node:internal/validators:119:11)\n\tat Object.extname (node:path:1386:5)\n\tat Object.containsTFFiles (/Users/srikar/friday/vscode-ibmcloud-schematics/dist/extension.js:54653:22)\n\tat /Users/srikar/friday/vscode-ibmcloud-schematics/dist/extension.js:56840:35\n\tat Generator.next (<anonymous>)\n\tat fulfilled (/Users/srikar/friday/vscode-ibmcloud-schematics/dist/extension.js:56761:58)\n\tat processTicksAndRejections (node:internal/process/task_queues:96:5) {code: 'ERR_INVALID_ARG_TYPE', vslsStack: Array(8), stack: 'TypeError: The "path" argument must be of typ…ions (node:internal/process/task_queues:96:5)', message: 'The "path" argument must be of type string. Received an instance of Dirent', toString: ƒ, …}
// <anonymous> @ /Applications/Visual Studio Code.app/Contents/Resources/app/out/bootstrap-fork.js:5:6
export function containsTFFiles(dirPath: any): boolean {
    // const fileList = fs.readdirSync(dirPath, { withFileTypes: true });
    // fileList.forEach(file => {
    //     console.log(file)
    //     if (path.extname(file) === ".tf") {
    //         return true
    //     }
    //   });

    // try {
    //     const fileList = fs.readdirSync(dirPath, { withFileTypes: true });
    //     for (const file of fileList)
    //     if (path.extname(file) === ".tf") {
    //                 return true
    //             }
    // } catch (err) {
    //     console.error(err);
    // }

    // for (let i = 0; i < fileList.length; i++) {
    //     if (path.extname(fileList[i]) === ".tf") {
    //         return true
    //     }
    // }
    return true;
}


export function isDirectoryEmpty(dirPath: any): boolean {
    return fs.readdirSync(dirPath).length === 0;
}

export function getBaseName(dirPath: any): string {
    return path.basename(dirPath);
}


export function splitBaseName(dirPath: any): [string, string] {
    var basename = path.basename(dirPath);  // todo: @srikar - better the logic in this fn
    var parentName = dirPath.replace(path.sep +basename, '');
    return [parentName, basename];
}


// https://nodejs.org/api/fs.html#fsstatpath-options-callback
// https://www.typescriptlang.org/play?#code/LAKAZgrgdgxgLgSwPZQAQGcAOAbBcBCAhugKYByhAtiQBQAmCATgAqFwAWAXKoVAJ4BKbgG10cRgigBzADQZxkqQF1UAb1CpNqAG6FGqAEbESUKiVQBeVACJsAawBW6bHWsatu-Zj0m4FapaoDCxs7AB0jCQ4hDC0APQAJKr2Ti4AvglxcgDk2QIA3O6akXAQjGjC3pFQfmZyRqSm1EqgaaDtIB0wKOhI2CRh2EhSNFi4BMb+tNaEjujsdGDYhE52YHEpzq4CAh2gQA


 // todo: @srikar - fill the path ways after choosing eadch option
export async function showBrownFieldModal(dirName: string): Promise<any> {
    var msg = dirName + ` contains some files already`;
    const selection = await vscode.window.showInformationMessage(
        msg,
        { modal: true },
        'Create a new folder and import',  // todo: @srikar - grammar
        'I want to choose another folder with tf files to import and merge with'
    );

    return new Promise(async (resolve, reject) => {
        if (!selection) {
            reject('Discovery import cancelled');
        } else {
            resolve(selection);
        }
    });
}


export async function showBrownFieldModalTFFiles(dirName: string): Promise<any> {
    var msg = dirName + ` contains some files already, some tf files`;
    const selection = await vscode.window.showInformationMessage(
        msg,
        { modal: true },
        'Create a new folder and import',  // todo: @srikar - grammar
        'Import and merge with tf files',
        'I want to choose another folder with tf files to import and merge with'
    );

    return new Promise(async (resolve, reject) => {
        if (!selection) {
            reject('Discovery import cancelled');
        } else {
            resolve(selection);
        }
    });
}

export function hasNoUnhiddenFiles(dirPath: any): boolean {
    return false;  // todo: @srikar - fix this error
    // &&&&&&%%%%%% Inside the catch blaock TypeError: fs.readdirSync(...).then is not a function
	// at Object.hasUnhiddenFiles (/Users/srikar/friday/vscode-ibmcloud-schematics/extension-client/src/util/discover.ts:239:40)
	// at /Users/srikar/friday/vscode-ibmcloud-schematics/extension-client/src/command/discovery/importe.ts:93:27
	// at Generator.next (<anonymous>)
	// at fulfilled (/Users/srikar/friday/vscode-ibmcloud-schematics/dist/extension.js:56754:58)
	// at processTicksAndRejections (node:internal/process/task_queues:96:5) {vslsStack: Array(5), stack: 'TypeError: fs.readdirSync(...).then is not a …ions (node:internal/process/task_queues:96:5)', message: 'fs.readdirSync(...).then is not a function'}
    // var list = fs.readdirSync(dirPath).then((list:any) => list.filter((item:any) => !/(^|\/)\.[^/.]/g.test(item)));
    // return list.length === 0;
}