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

var os = require('os');

const TERRAFORM_VERSION_COMMAND = 'terraform -version';

const FIND_AND_UPGRADE = '. -name "*.tf" -printf "%h\n" | uniq | sort -ur | xargs -n1 terraform 0.12upgrade -yes';

const hcltojson = require('hcl-to-json');

const TERRAFORM_COMMAND = 'terraform';
const TERRAFORM_INIT_COMMAND = TERRAFORM_COMMAND + ' init';
const TERRAFORM_VALIDATE_COMMAND = TERRAFORM_COMMAND + ' validate';
const TERRAFORM_PLAN_COMMAND = TERRAFORM_COMMAND + ' plan';
const TERRAFORM_SHOW_COMMAND = TERRAFORM_COMMAND + ' show';

const commandLineFlag = {
    out: '-out',
    json: '-json',
};

const FILE_TFPLAN_BIN = 'tfplan.binary';
const FILE_TFPLAN_JSON = 'tfplan.json';

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
    if (os.platform() == 'darwin'){
        EXEC_COMMAND_TF_MAC='gfind '+FIND_AND_UPGRADE
    }
    else{
        EXEC_COMMAND_TF_MAC='find '+FIND_AND_UPGRADE
    }
    return shell.execute(EXEC_COMMAND_TF_MAC);
}

export async function hcltojsonFunc() {
    const tfData = await util.workspace.readTFFile();
    const jsonData = hcltojson(tfData);
    const versionsPath = util.workspace.getWorkspaceVersionsFilePath();
    return util.workspace.writeToFile(versionsPath, jsonData);
}

// Run plan and save the generated plan to a file on disk
export function generateAndSavePlanToFile(): Promise<string | Error> {
    const plan = [
        TERRAFORM_PLAN_COMMAND,
        commandLineFlag.out,
        FILE_TFPLAN_BIN,
    ].join(' ');

    return shell.execute(plan);
}

// Generate JSON representation of plan
export function generateJSONPlan(): Promise<string | Error> {
    const show = [
        TERRAFORM_SHOW_COMMAND,
        commandLineFlag.json,
        FILE_TFPLAN_BIN,
        '>',
        FILE_TFPLAN_JSON,
    ].join(' ');

    return shell.execute(show);
}
