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

const TERRAFORM_INIT_COMMAND = 'terraform init';
const TERRAFORM_VALIDATE_COMMAND = 'terraform validate';

export function init(): Promise<string | Error> {
    return shell.execute(TERRAFORM_INIT_COMMAND);
}

export function validate(): Promise<string | Error> {
    return shell.execute(TERRAFORM_VALIDATE_COMMAND);
}

export function hcl2json(): Promise<string | Error> {
    const cmd: string =
        'hcl2json < "' +
        util.workspace.getVersionsTFFilePath() +
        '" > "' +
        util.workspace.getWorkspaceVersionsFilePath() +
        '"';
    return shell.execute(cmd);
}
