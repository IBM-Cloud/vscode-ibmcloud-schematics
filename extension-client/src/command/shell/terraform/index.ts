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

import * as shell from '..';
import * as util from '../../../util';
import { path } from '../../../util/workspace';
var os = require('os');

const TERRAFORM_INIT_COMMAND = 'terraform init';
const TERRAFORM_VALIDATE_COMMAND = 'terraform validate';
const TERRAFORM_VERSION_COMMAND = 'terraform -version';
const FIND_AND_UPGRADE = '. -name "*.tf" -printf "%h\n" | uniq | sort -ur | xargs -n1 terraform 0.12upgrade -yes';
const hcltojson = require('hcl-to-json');

export function init(): Promise<string | Error> {
    return shell.execute(TERRAFORM_INIT_COMMAND);
}

export function validate(): Promise<string | Error> {
    return shell.execute(TERRAFORM_VALIDATE_COMMAND);
}
export function checkVersion(): Promise<string | Error> {
    return shell.execute(TERRAFORM_VERSION_COMMAND);
}

export async function upgrade(): Promise<string | Error> {
    var EXEC_COMMAND_TF_MAC;
    if (os.platform() === 'darwin'){
        EXEC_COMMAND_TF_MAC='gfind '+FIND_AND_UPGRADE;
    }
    else{
        EXEC_COMMAND_TF_MAC='find '+FIND_AND_UPGRADE;
    }
    return shell.execute(EXEC_COMMAND_TF_MAC);
}

export async function hcltojsonFunc() {
    const tfData = await util.workspace.readTFFile();
    const jsonData = hcltojson(tfData);
    const versionsPath = util.workspace.getWorkspaceVersionsFilePath();
    return util.workspace.writeToFile(versionsPath, jsonData);
}


export async function estimateCost(writeEmitter:any,closeEmitter:any): Promise<any> {
    
    const newLine = '\r\n';
    const extraNewline = '\n';
    const folderName = util.workspace.getWorkspaceName();

    const TERRAFORM_PLAN_COMMAND = `terraform plan --out .vscode-ibmcloud-schematics/${folderName}.binary`;
    const TERRAFORM_SHOW_COMMAND = `terraform show -json .vscode-ibmcloud-schematics/${folderName}.binary > .vscode-ibmcloud-schematics/${folderName}.json`;
    const TERRAFORM_API_COMMAND = 'IC_API_KEY=';
    const TERRAFORM_COST_COMMAND = `tfcost plan .vscode-ibmcloud-schematics/${folderName}.json --json`;
    try{
        await util.workspace.createCredentialFile();
        writeEmitter.fire('\x1b[1m\x1b[33m' + "Running terraform init" + '\x1b[0m' + newLine);
        await init();
        writeEmitter.fire('\x1b[1m\x1b[32mSuccess!\x1b[0m ' + "terraform init" + newLine + extraNewline);
        writeEmitter.fire('\x1b[1m\x1b[33m' + "Running terraform plan" + '\x1b[0m' + newLine);
        await shell.execute(TERRAFORM_PLAN_COMMAND);
        writeEmitter.fire('\x1b[1m\x1b[32mSuccess!\x1b[0m ' + "terraform plan" + newLine + extraNewline);
        writeEmitter.fire('\x1b[1m\x1b[33m' + "Creating cost.json file" + '\x1b[0m' + newLine);
        await shell.execute(TERRAFORM_SHOW_COMMAND);
        await util.workspace.readCredentials().then(async (rs: any)=>{
            const key = rs.apiKey;
            var API_EXPORT_COMMAND: string;
            if (os.platform() === 'darwin' || os.platform() === 'linux'){
                API_EXPORT_COMMAND = `export ${TERRAFORM_API_COMMAND}${key} && ${TERRAFORM_COST_COMMAND}`;
            }
            else{
                API_EXPORT_COMMAND = `set "${TERRAFORM_API_COMMAND}${key}" & call ${TERRAFORM_COST_COMMAND}`;
            }
            await shell.execute(API_EXPORT_COMMAND);
            writeEmitter.fire('\x1b[1m\x1b[32mSuccess!\x1b[0m ' + "cost.json file created" + newLine + extraNewline);
            setTimeout(()=>closeEmitter.fire(0),2000);
        }).catch((error: any) => {
            writeEmitter.fire('\x1b[1m\x1b[31mFailure!\x1b[0m ' + "Cost Estimation Error" + newLine);var text = error;            
            if (typeof error !== 'string') {
                text = error.toString();
            }
            var lines: string[] = text.split(/\r?\n/);
            for (let i = 0; i < lines.length; i++) {
                writeEmitter.fire(lines[i] + newLine);
            }
        });
    }catch(error: any){
        writeEmitter.fire('\x1b[1m\x1b[31mFailure!\x1b[0m ' + "Cost Estimation Error" + newLine);var text = error;            
        if (typeof error !== 'string') {
            text = error.toString();
        }
        var lines: string[] = text.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            writeEmitter.fire(lines[i] + newLine);
        }
    }
    
    return util.workspace.readFile(path.join(util.workspace.getWorkspacePath(),"cost.json"));
}
