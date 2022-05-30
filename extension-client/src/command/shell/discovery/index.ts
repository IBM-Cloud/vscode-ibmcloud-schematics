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
const apikey = 'IC_API_KEY=';
const configDirEnv = 'DISCOVERY_CONFIG_DIR=';

export function importConfig(
    services: string,
    configName: string,
    key: string,
    confDirEnvVal: string,
    mergeFlag: boolean
    ): Promise<string | Error> {

    console.log(`HEre::: Inside shell fn`);

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

        var cmd: string =
            // prefix +
            DISCOVERY_COMMAND + 
            DISCOVERY_IMPORT_COMMAND +
            ' --services ' +
            services +
            ' --compact';  // todo: @srikar - do we take this from user
        
        if (mergeFlag) {
            cmd = cmd + ' --merge';
        }

        if (configName !== "") {
            cmd = cmd + 
            ' --config_name ' +
            configName;  
        }
        
        console.log(`cmd`, cmd);
        
        // todo: @srikar - export the api key only if it is non empty - no problem
        console.log("setting disc. config dir env var", confDirEnvVal);
        var command: string;
        if (os.platform() === 'darwin' || os.platform() === 'linux'){
            command = `export ${apikey}${key} && export ${configDirEnv}${confDirEnvVal} && ${cmd}`; 
        }
        else{
            command = `set "${apikey}${key}" & set ${configDirEnv}${confDirEnvVal} & call ${cmd}`;
        }
    
        console.log(`**HERE: here is the api key and config dir and config name getting used`, key, confDirEnvVal, configName);
        return shell.run_cmd(command);  // todo: @srikar - @vishwa why is the stdout not coming

    // })
    // .catch((error) => console.log("couldn't get binary path", error));
    // return shell.execute("echo import failed");  // todo: @srikar - better this
}


export function isInstalled(): Promise<string | Error> {
    return   shell.execute(DISCOVERY_COMMAND); 
}