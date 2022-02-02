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

import * as cp from 'child_process';
import * as util from '../../util';
var os = require('os');

const nodejsUtil = require('util');
const exec = nodejsUtil.promisify(cp.exec);

export async function execute(cmd: string): Promise<string | Error> {
    let path = util.workspace.getWorkspacePath();
    const { stdout, stderr } = await exec(cmd, { cwd: path });
    if (stderr) {
        console.log(`stderr`, stderr);
        return new Error(stderr);
    }
    return stdout;
}

export function exportVariables(key: string, value: string): Promise<string | Error> {

    var API_EXPORT_COMMAND = `set ${key}=${value}`;
    if (os.platform() === 'darwin' || os.platform() === 'linux'){
        API_EXPORT_COMMAND = `export ${key}=${value}`;
    }
    return execute(API_EXPORT_COMMAND);
}

