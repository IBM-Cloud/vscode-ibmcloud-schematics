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
import { Terminal } from '../../../util/terminal';


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

export function createPlan(): Promise<string | Error> {
    return shell.execute(`terraform plan --out .vscode-ibmcloud-schematics/${util.workspace.getWorkspaceName()}.binary`);
}

export function calculateTFCost(): Promise<string | Error> {
    return shell.execute(`tfcost plan .vscode-ibmcloud-schematics/${util.workspace.getWorkspaceName()}.json --json`);
}

export function convertPlanToJSON(): Promise<string | Error> {
    const folderName = util.workspace.getWorkspaceName();
    return shell.execute(`terraform show -json .vscode-ibmcloud-schematics/${folderName}.binary > .vscode-ibmcloud-schematics/${folderName}.json`);
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


