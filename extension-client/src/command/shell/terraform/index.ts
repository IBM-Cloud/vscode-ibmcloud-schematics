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

import { openStdin } from 'process';
import * as shell from '..';
import * as util from '../../../util';
import { posix } from 'path';
import * as vscode from 'vscode';
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


export async function estimateCost(): Promise<any> {
    
    const TERRAFORM_PLAN_COMMAND = 'terraform plan --out tfplan.binary';
    const TERRAFORM_SHOW_COMMAND = 'terraform show -json tfplan.binary > tfplan.json';
    const TERRAFORM_API_COMMAND = 'IC_API_KEY=';
    const TERRAFORM_COST_COMMAND = 'tfcost plan tfplan.json --json';
    
    await util.workspace.createCredentialFile();
    await shell.execute(TERRAFORM_INIT_COMMAND);
    await shell.execute(TERRAFORM_PLAN_COMMAND);
    await shell.execute(TERRAFORM_SHOW_COMMAND);
    await util.workspace.readCredentials().then(async (rs: any)=>{
        const key = rs.apiKey;
        var API_EXPORT_COMMAND: string;
        if (os.platform() === 'darwin' || os.platform() === 'linux'){
            API_EXPORT_COMMAND = "export "+TERRAFORM_API_COMMAND +key+" && "+ TERRAFORM_COST_COMMAND;
        }
        else{
            API_EXPORT_COMMAND = "set "+TERRAFORM_API_COMMAND + key + " & "+ TERRAFORM_COST_COMMAND;
        }
        await shell.execute(API_EXPORT_COMMAND);
    }).catch((error: Error) => {
        return error;
    });

    return util.workspace.readFile(path.join(util.workspace.getWorkspacePath(),"cost.json"));
}
