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

import * as type from '../type/index';
import * as userInput from './userInput';
import { hcl2json } from '../command/shell/terraform';

export const path = require('path');
export const fs = require('fs');
const tar = require('tar');

export const secureDirName = '.vscode-ibmcloud-schematics';
export const tarFilename = 'schematics.tar';
export const credFilename = 'credentials.json';
export const schematicsWorkspaceFilename = 'workspace.json';
export const versionsFilename = 'version.json';
export const versionsTFFilename = 'versions.tf';
export const cloneFilename = 'clone.json';
export const originalWorkspaceFilename = 'original_workspace.json';

let flag: number = 0;
const apiEndpoints = ['cloud.ibm.com'];
const schematicsEndpoints = [
    'https://schematics.cloud.ibm.com',
    'https://schematics.test.cloud.ibm.com',
];

export function getWorkspaceName(): any {
    return vscode.workspace.name;
}

export function getWorkspacePath(): string | Error {
    let workspaceFolder = vscode.workspace.workspaceFolders;

    if (workspaceFolder && workspaceFolder.length === 1) {
        return workspaceFolder[0].uri.fsPath;
    }

    return new Error('Path error');
}

export async function getCredentials() {
    const env: any = await readEnv();
    let serviceURL = schematicsEndpoints[0]; // By default production endpoint

    const enableStageEndpoint =
        env?.IBMCLOUD_SCHEMATICS_VSCE_ENABLE_STAGE_ENDPOINT;
    if (enableStageEndpoint) {
        if (!apiEndpoints.includes('test.cloud.ibm.com')) {
            apiEndpoints.push('test.cloud.ibm.com');
        }
    } else {
        if (apiEndpoints.includes('test.cloud.ibm.com')) {
            apiEndpoints.splice(1, 1);
        }
    }

    // Get API endpoint
    const endpoint = await vscode.window.showQuickPick(apiEndpoints, {
        ignoreFocusOut: true,
        placeHolder: 'Select target API to deploy',
    });

    if (!endpoint) {
        return Promise.reject('Credentials not entered.');
    }

    if (endpoint?.includes('test')) {
        serviceURL = schematicsEndpoints[1];
    }

    // Get the API key
    const apiKey = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        password: true,
        placeHolder: 'Enter API key for ' + endpoint,
        prompt: 'Enter API key',
    });

    if (!!serviceURL && !!apiKey) {
        const cred: type.Account = {
            serviceURL: serviceURL,
            apiKey: apiKey,
        };

        return Promise.resolve(cred);
    }

    return Promise.reject('Credentials not entered.');
}

export function createCredentialFile(): any {
    if (hasCredentialsFile()) {
        verifyCredentials().then((isValid) => {
            if (!isValid) {
                return getCredentials().then((acc: type.Account) =>
                    saveToAccount(acc)
                );
            }

            Promise.resolve('present');
        });
    } else {
        return getCredentials().then((acc: type.Account) => saveToAccount(acc));
    }
}

export function getCredentialsPath(): string {
    const wsPath = getWorkspacePath();
    return wsPath + path.sep + secureDirName + path.sep + credFilename;
}

export function getSchematicsWorkspacePath(): string {
    const wsPath = getWorkspacePath();
    return (
        wsPath +
        path.sep +
        secureDirName +
        path.sep +
        schematicsWorkspaceFilename
    );
}

export function getSecureDirectoryPath(): string {
    const wsPath = getWorkspacePath();
    return wsPath + path.sep + secureDirName;
}

export function getTarFilePath(): string {
    return (
        getWorkspacePath() + path.sep + secureDirName + path.sep + tarFilename
    );
}

export function getTarCwd(): string {
    return path.resolve(getWorkspacePath(), '..');
}

export function createSecureDirectory(): void {
    const secureDirPath = getSecureDirectoryPath();

    if (!fs.existsSync(secureDirPath)) {
        fs.mkdir(secureDirPath, { recursive: true }, (err: any) => {
            if (err) {
                console.error('Error creating secure directory', err);
                throw err;
            }
        });
    } else {
        console.log('Secure directory present!');
    }
}

export function writeToFile(path: any, payload: object) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        fs.writeFile(path, data, (err: any) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}

export function readFile(path: any) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err: any, data: string) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

export async function readEnv(): Promise<any> {
    const envpath = getWorkspacePath() + path.sep + '.env';
    return new Promise((resolve, reject) => {
        fs.readFile(envpath, 'utf8', (err: any, data: string) => {
            if (err) {
                resolve(undefined);
            } else {
                const env: any = {};
                const list = data.split('\n');
                list.forEach((variable) => {
                    const seg = variable.split('=');
                    const key = seg[0].trim();
                    const value = seg[1].trim();
                    env[key] = value;
                });

                resolve(env);
            }
        });
    });
}

export function saveToAccount(acc: type.Account) {
    createSecureDirectory();
    const path = getCredentialsPath();
    return writeToFile(path, acc);
}

export async function saveToClonedAccount(
    acc: type.Account,
    repoPath: string,
    template: string
) {
    let repoFolder = getRepositoryName(template);
    const secureDirPath =
        repoPath + path.sep + repoFolder + path.sep + secureDirName;
    if (!fs.existsSync(secureDirPath)) {
        fs.mkdir(secureDirPath, { recursive: true }, (err: any) => {
            if (err) {
                console.error('Error creating secure directory', err);
                throw err;
            }
            const credPath = secureDirPath + path.sep + credFilename;
            return writeToFile(credPath, acc);
        });
    } else {
        console.log('Secure directory present!');
    }
}

export async function saveOriginalWorkspace(
    workspace: any,
    repoPath: string,
    template: string
) {
    let repoFolder = getRepositoryName(template);
    const secureDirPath =
        repoPath + path.sep + repoFolder + path.sep + secureDirName;
    const originalPAth = secureDirPath + path.sep + originalWorkspaceFilename;
    return writeToFile(originalPAth, workspace);
}

export function hasCredentialsFile(): boolean {
    const credPath = getCredentialsPath();
    return fs.existsSync(credPath);
}

export function readCredentials(): any {
    return new Promise(function (resolve, reject) {
        const credPath = getCredentialsPath();
        readFile(credPath).then((data: any) => {
            resolve(data);
        });
    });
}

export function hasSchematicsWorkspace(): boolean {
    const schmtxwsPath = getSchematicsWorkspacePath();
    return fs.existsSync(schmtxwsPath);
}

export function readSchematicsWorkspace(): any {
    return new Promise(function (resolve, reject) {
        const schmtxwsPath = getSchematicsWorkspacePath();
        readFile(schmtxwsPath).then((data: any) => {
            resolve(data);
        });
    });
}

export function verifyCredentials() {
    return new Promise(function (resolve, reject) {
        const credPath = getCredentialsPath();
        readFile(credPath)
            .then((data: any) => {
                if (!!data.serviceURL) {
                    reject(false);
                }
                if (!!data.apiKey) {
                    reject(false);
                }
                resolve(true);
            })
            .catch((err) => reject(err));
    });
}

export async function saveSchematicsWorkspace(workspace: any) {
    createSecureDirectory();
    const path = getSchematicsWorkspacePath();
    return writeToFile(path, workspace);
}

export function getSuffixedWorkspaceName() {
    let name: string = getWorkspaceName();
    name = name.split('.').join('_');
    return name + '-' + Math.random().toString(36).substring(7);
}

export function getWorkspaceVersionsFilePath(): string {
    return (
        getWorkspacePath() +
        path.sep +
        secureDirName +
        path.sep +
        versionsFilename
    );
}

export function getVersionsTFFilePath(): string {
    return getWorkspacePath() + path.sep + versionsTFFilename;
}

export function hasVersionsTFFile(): boolean {
    const path = getVersionsTFFilePath();
    return fs.existsSync(path);
}

export function hasWorkspaceVersionsFile(): boolean {
    const path = getWorkspaceVersionsFilePath();
    return fs.existsSync(path);
}

export function saveTerraformVersion(version: any) {
    createSecureDirectory();
    const path = getWorkspaceVersionsFilePath();
    return writeToFile(path, version);
}

export function readTerraformVersion(): any {
    return new Promise(function (resolve, reject) {
        const path = getWorkspaceVersionsFilePath();
        readFile(path).then((data: any) => {
            resolve(data);
        });
    });
}

export function getCloneWorkspaceFilePath(): string {
    return (
        getWorkspacePath() + path.sep + secureDirName + path.sep + cloneFilename
    );
}

export function saveCloneType(cloneType: any) {
    createSecureDirectory();
    const path = getCloneWorkspaceFilePath();
    return writeToFile(path, cloneType);
}

export function readCloneType(): any {
    return new Promise(function (resolve, reject) {
        const path = getCloneWorkspaceFilePath();
        readFile(path).then((data: any) => {
            resolve(data);
        });
    });
}

export function getOriginalWorkspacePath(): string {
    const wsPath = getWorkspacePath();
    return (
        wsPath + path.sep + secureDirName + path.sep + originalWorkspaceFilename
    );
}

export function readOriginalWorkspace(): any {
    return new Promise(function (resolve, reject) {
        const schmtxwsPath = getOriginalWorkspacePath();
        readFile(schmtxwsPath).then((data: any) => {
            resolve(data);
        });
    });
}

export function hasOriginalWorkspace(): boolean {
    const originalwsPath = getOriginalWorkspacePath();
    return fs.existsSync(originalwsPath);
}

export function isCloned(): boolean {
    const scrapebookwspath = getSchematicsWorkspacePath();
    const originalwsPath = getOriginalWorkspacePath();
    return fs.existsSync(originalwsPath) && fs.existsSync(scrapebookwspath);
}

export function isDirectoryEmpty(dirPath: any): boolean {
    return fs.readdirSync(dirPath).length === 0;
}

export async function getPathToClone(): Promise<string> {
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
                reject('Please select the folder where you want to clone');
            }
        });
    });
}

export async function importTemplate() {
    const value = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        placeHolder: 'Type repository URL or existing workspace ID to clone',
        prompt: 'URL of the GitHub, GitLab or Bitbucket repository that hosts your Terraform configuration files OR existing workspace ID',
    });

    if (!!value) {
        return Promise.resolve(value);
    } else {
        return Promise.reject('Input not provided');
    }
}

export function getRepositoryName(repoURL: string) {
    const list = repoURL.split('/');
    let repoName = String(list.pop());
    if (!repoName) {
        return String(list[list.length - 1]);
    }
    repoName = repoName.split('.').join('_');
    return repoName;
}

export async function openClonedRepository(
    repoURL: string,
    pathToClone: string
) {
    let repoFolder = getRepositoryName(repoURL);
    const pathToOpenFolder = pathToClone + path.sep + repoFolder;
    let uri = vscode.Uri.file(pathToOpenFolder);
    let success = await vscode.commands.executeCommand(
        'vscode.openFolder',
        uri,
        { forceNewWindow: false }
    );
    if (!success) {
        Promise.reject('Could not open the cloned folder');
    } else {
        vscode.window.showInformationMessage('Cloned successfully!');
    }
}

export async function isGITRepo(url: string) {
    const validGITDomains: string[] = [
        'github.com',
        'github.ibm.com',
        'gitlab.com',
        'bitbucket.org',
        'dev.azure.com',
        'git.cloud.ibm',
    ];

    const matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    if (matches && validGITDomains.includes(matches[1])) {
        return true;
    } else {
        return false;
    }
}

export function isCatalogWorkspace(obj: any): boolean {
    if (obj.hasOwnProperty('catalog_ref')) {
        return true;
    }

    return false;
}

export function isArchiveUploadedWorkspace(obj: any): boolean {
    if (obj?.template_repo?.has_uploadedgitrepotar) {
        return true;
    }

    return false;
}

export function getTemplateRepoFromWorkspace(obj: any) {
    if (!obj.template_repo.full_url) {
        return obj.template_repo.url;
    }

    return obj.template_repo.full_url;
}

export function isDeployed(): boolean {
    const path = getSchematicsWorkspacePath();
    return fs.existsSync(path);
}

export async function createTarFile(): Promise<string> {
    const fileList = getWorkspaceName();
    const cwd = getTarCwd();
    const file = getTarFilePath();

    const options = {
        gzip: false,
        file,
        cwd,
        filter: (path: string, stat: any) => {
            return !/(^|\/)\.[^\/\.]/g.test(path);
        },
    };

    return new Promise((resolve, reject) => {
        tar.c(options, [fileList], () => {})
            .then(() => {
                resolve('tar created');
            })
            .catch((error: any) => {
                console.log('createTarFile error: ', error);
                reject(error);
            });
    });
}

export function removeTarFile(): any {
    const fp = getTarFilePath();

    if (fs.existsSync(fp)) {
        fs.unlink(fp, (err: any) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
}

// TODO: Revisit the logic for detecting terraform version as the hcl2json shell command is not working
export async function detectTerraformVersion(tfversions: any) {
    const deployed = isDeployed();
    if (deployed) {
        Promise.resolve('Workspace is present');
        return;
    }

    return new Promise(async (resolve, reject) => {
        userInput
            .showTFVersionsQuickPick(tfversions)
            .then((version) => {
                resolve(saveTerraformVersion({ version }));
            })
            .catch((err) => reject(err));
    });
}

export function readUIAssetManifest(path: string): any {
    return new Promise(function (resolve, reject) {
        readFile(path).then((data: any) => {
            resolve(data);
        });
    });
}
