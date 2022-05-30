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

import * as cp from 'child_process';
import * as util from '../../util';
var os = require('os');

const nodejsUtil = require('util');
const exec = nodejsUtil.promisify(cp.exec);
const spawn = nodejsUtil.promisify(cp.spawn);

export async function execute(cmd: string): Promise<string | Error> {
    let path = util.workspace.getWorkspacePath();
    const { stdout, stderr } = await exec(cmd, { cwd: path });
    if (stderr) {
        console.log(`stderr`, stderr);
        return new Error(stderr);
    }
    return stdout;
}

export function exportEnvironmentVariables(key: string, value: string): string {
    var exportCommand = `set ${key}=${value} & call`;
    if (os.platform() === 'darwin' || os.platform() === 'linux') {
        exportCommand = `export ${key}=${value} &&`;
    }
    return exportCommand;
}

// This function will output the lines from the command 
// AS is runs, AND will return the full combined output
// as well as exit code when it's done
// todo: @srikar - check if this fn is fine
// todo: @srikar - Adding the log to a file is to be done?
export async function run_cmd(cmd: string): Promise<string | Error> {
    console.log("Starting Process.");
    let path = util.workspace.getWorkspacePath();
    cmd = "discovery metronome";
    var child = await spawn(cmd, { cwd: path });

    let scriptOutput = "";
    const outputChannel = new util.OutputChannel();  // todo: @srikar - shouldn't we give the name of discovery here

    // Close stdin, otherwise in case of error sbt will block waiting for the
    // user input to reload or exit the build.
    child.stdin.end();
    
    // child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data: Buffer) => {  // todo: @srikar - is data buffer or string
      let msg = data.toString().trim();
      outputChannel.appendLine(msg);  // todo: @srikar - see if we can give colours in the output for stderr
      scriptOutput+=msg+`\n`;
    });

    // child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data: Buffer) => {
      let msg = data.toString().trim();
      outputChannel.appendLine(msg);
      scriptOutput+=msg+`\n`;
    });

    child.on('close', (code: number) => {
      if (code != 0) {
        let msg = `Couldn't run import cmd'${ cmd }' (exit code ${ code }).`;
        outputChannel.appendLine(msg);
        return new Error(msg);
      } else {
          return scriptOutput;
      }
    });
    return child.then(() => { return scriptOutput; });
}