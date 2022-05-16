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

import * as shell from '..';
// import { pathToBinary } from '../../extension'
var os = require('os');

const DISCOVERY_COMMAND = 'discovery';
const DISCOVERY_IMPORT_COMMAND = ' import ';

 // todo: @srikar - How are config name and config dir related and used.
export function importConfig(
    services: string,
    configDir: string,
    configName: string,
    key: string,
    ): Promise<string | Error> {

    console.log(`HEre::: Inside shell fn`);

    const apikey = 'IC_API_KEY=';
    // todo: @srikar - use async fn synchronously
    // todo: @srikar - change to this when installation is automated
    // let prefix: Promise<string> = pathToBinary();  
    // prefix.then((value) => {
    //     console.log(value);

        // if (!value) {
        //     value =  DISCOVERY_IMPORT_COMMAND
        // } else {
        //     value = value + " import "
        // }

        const cmd: string =
            // prefix +
            DISCOVERY_COMMAND + 
            DISCOVERY_IMPORT_COMMAND +
            ' --services ' +
            services +
            ' --config_dir ' +
            configDir + 
            ' command default';
            // ' --config_name ' +
            // configName;
        console.log(`cmd`, cmd);

         // todo: @srikar - export the api key only if it is non empty
        var command: string;
        if (os.platform() === 'darwin' || os.platform() === 'linux'){
            command = `export ${apikey}${key} && ${cmd}`;
        }
        else{
            command = `set "${apikey}${key}" & call ${cmd}`;
        }
    
        // let key: string = "hardvalue";
        // const credentials: type.Account = util.workspace.readCredentials();
        // return shell.execute('export IC_API_KEY= '+ credentials.apiKey+'; '+cmd);

        console.log(`HERE: here is the api key getting used`, key);
        return shell.execute(command);  // todo: @srikar - @vishwa why is the stdout not coming

    // })
    // .catch((error) => console.log("couldn't get binary path", error));
    // return shell.execute("echo import failed");  // todo: @srikar - better this
}


export function isInstalled(): Promise<string | Error> {
    return   shell.execute(DISCOVERY_COMMAND); 
}