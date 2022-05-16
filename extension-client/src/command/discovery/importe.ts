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


import * as shell from '../shell';

import * as vscode from 'vscode';
import ImportResourcesView from '../../webview/discovery/ImportResourcesView';
import { Terminal } from '../../util/terminal';
import  * as discovery from '../shell/discovery/index';
import * as command from '..';
import * as util from '../../util';


 // todo: @srikar - change this to discovery docs
const DISCOVERY_INSTALL_DOC = 'https://github.com/IBM-Cloud/configuration-discovery#installation';
const DISCOVERY_USAGE_DOC = 'https://github.com/IBM-Cloud/configuration-discovery#installation';


export async function importe(context: vscode.ExtensionContext): Promise<void> {
    try {
        const writeEmitter = new vscode.EventEmitter<string>();
        const closeEmitter = new vscode.EventEmitter<number>();
        const pty = {
            onDidWrite: writeEmitter.event,
            onDidClose: closeEmitter.event,
            open: async() => {
                await importConfig(writeEmitter, closeEmitter).then(async (r)=>{
                    await new ImportResourcesView(context).openView(false);
                }).catch((err: any) => {
                    vscode.window.showErrorMessage(String(err));
                });
            },
            close: () => {}
        };
        await (<any>vscode.window).createTerminal({ pty }).show();
        }
    catch(error){
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}

async function importConfig(writeEmitter:any,closeEmitter:any): Promise<any> { 
    var terminal = new Terminal(writeEmitter, closeEmitter);
    const API_KEY = 'IC_API_KEY=';
    try{
        try{
            await discovery.isInstalled();
        }
        catch{
        showDiscoveryInstallationModal(terminal);
        return new Promise((resolve, reject) => {
            reject(new Error("Install discovery and try again."));
        });
    }
        await util.discover.createDiscoveryCredentialFile();  // todo: @srikar - why are we using workspace
        terminal.printHeading('Please provide services and details to import');
        // await util.workspace.createDiscoveryCredentialFile();
        // const tfversions: any = await api.versions();
        // await util.workspace.detectTerraformVersion(tfversions);
        const services = await util.discover.chooseServices();  // todo: @srikar - can do resources?
        const configDir = await util.discover.chooseConfigDir();
        // const configName = await util.discover.chooseConfigName();
        const configName = 'test';
        terminal.printHeading('Importing resources');
        await util.workspace.readCredentials().then(async (rs: any)=>{ // todo: @srikar - why workspace
        const key = rs.apiKey;
        //  // todo: @srikar - get and set the region
        // todo: @srikar - how to export key: Is the double export of the key needed?
        console.log(`HEre::: Calling shell fn`);
        terminal.printHeading('Importing resources after exporting api key first time');
        await command.discovery.importConfig(services, configDir, configName, key); 
        terminal.printSuccess("Imported resources");
        terminal.fireClose(1);
    });

    }catch(error: any){
    terminal.printFailure('Discovery error');
        var text = error;            
        if (typeof error !== 'string') {
            text = error.toString();
        }
        var lines: string[] = text.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            terminal.printText(lines[i]);
        }
        terminal.fireClose(1); // todo: @srikar - is this needed
    }
    // todo: @srikar - what is this?
    return "";
}


export async function showDiscoveryInstallationModal(terminal: Terminal): Promise<any> {
    const msg = `This feature requires you to install discovery. Details of installation can be found at ` 
    + DISCOVERY_INSTALL_DOC +`. Do you want to open the URL ?`;
    
     await vscode.window.showInformationMessage(
        msg,
        { modal: true },
        "OK"
        )
        .then((answer) => {
          if (answer?.toUpperCase() === "OK" ) {
            vscode.env.openExternal(vscode.Uri.parse(DISCOVERY_INSTALL_DOC));
          }else{
            terminal.printFailure("Install discovery and try again. See "+DISCOVERY_INSTALL_DOC+ " for details");
          }
        });
    return;
}
