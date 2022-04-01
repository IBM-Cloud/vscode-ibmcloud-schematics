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
var fs = require('fs');

export async function showJobsQuickPick(jobs: any) {
    const selectedJob = await vscode.window.showQuickPick(jobs, {
        ignoreFocusOut: true,
        placeHolder: 'Select job',
    });

    return new Promise((resolve, reject) => {
        if (!selectedJob) {
            reject('Job not selected');
        } else {
            resolve(selectedJob);
        }
    });
}

export async function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


export async function showWorkspaceInput() {
    const selectedWorkspace = await vscode.window.showInputBox( {
        ignoreFocusOut: true,
        placeHolder: 'Enter the Workspace id:',
    });

    return new Promise((resolve, reject) => {
        if (!selectedWorkspace) {
            reject('Workspace id not selected');
        } else {
            resolve(selectedWorkspace);
        }
    });
}

export async function showConfirmPullLatestModal(id: string): Promise<any> {
    const msg = `This will pull the latest on the parent workspace ${id}. Make sure you have pushed your changes to your git repo. Are you sure you want to continue?`;
    const selection = await vscode.window.showInformationMessage(
        msg,
        { modal: true },
        'Pull Latest'
    );

    return new Promise(async (resolve, reject) => {
        if (!selection) {
            reject('Confirm Pull latest modal cancelled');
        } else {
            resolve(selection);
        }
    });
}

export async function showTFVersionsQuickPick(versions: any) {
    const quickPickOptions = {
        ignoreFocusOut: true,
        placeHolder: 'Select Terraform version of workspace',
    };

    const selectedVersion = await vscode.window.showQuickPick(
        versions,
        quickPickOptions
    );

    return new Promise((resolve, reject) => {
        if (!selectedVersion) {
            reject('Terrform version not selected');
        } else {
            resolve(selectedVersion);
        }
    });
}

export async function showConfirmDestroyResourcesModal(id: string) {
    const msg = `Destroying resources will terminate all your resources. This action cannot be undone.`;

    const selection = await vscode.window.showInformationMessage(
        msg,
        { modal: true },
        'Destroy resources'
    );
    return new Promise((resolve, reject) => {
        if (!!selection) {
            resolve(selection);
        } else {
            reject('Confirm destroy resources modal cancelled');
        }
    });
}

export async function showConfirmDeleteWorkspace() {
    const msg = `Deleting a workspace removes the workspace without destroying the resources. If you need to destroy resources use the destroy command. This action cannot be undone.`;

    const selection = await vscode.window.showInformationMessage(
        msg,
        { modal: true },
        'Delete workspace'
    );
    return new Promise((resolve, reject) => {
        if (!!selection) {
            resolve(selection);
        } else {
            reject('Confirm delete workspace modal cancelled');
        }
    });
}

export async function writeStateFile(storeFile: any, workspacePath: any){
    
    fs.writeFile(workspacePath+'/terraform.tfstate', storeFile, (err: any) => {
        if (err) {
            console.log(err);
        }
        console.log(true);
    });

}
