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



import * as vscode from 'vscode';
import { Terminal } from '../../util/terminal';
import  * as discovery from '../shell/discovery/index';
import * as command from '..';
import * as util from '../../util';


const DISCOVERY_INSTALL_DOC = 'https://github.com/IBM-Cloud/configuration-discovery#installation';
// const DISCOVERY_USAGE_DOC = 'https://github.com/IBM-Cloud/configuration-discovery#usage';


export async function importe(context: vscode.ExtensionContext): Promise<void> {
    try {
        const writeEmitter = new vscode.EventEmitter<string>();
        const closeEmitter = new vscode.EventEmitter<number>();
        const pty = {
            onDidWrite: writeEmitter.event,
            onDidClose: closeEmitter.event,
            open: async() => {
                await importConfig(writeEmitter, closeEmitter).then(async (r)=>{
                    // await new ImportResourcesView(context).openView(false);
                }).catch((err: any) => {
                    console.log(String(err));
                    // vscode.window.showErrorMessage();  // todo: @srikar - check
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
        await util.discover.createDiscoveryCredentialFile();
        terminal.printHeading('Please provide services and details to import');
        const services = await util.discover.chooseServices();  // todo: @srikar - can do resources?

        console.log('services ' + services);

        
        const vsWorkspacePath = util.workspace.getWorkspacePath();

        console.log('workspace path is sdlkjfs ' + vsWorkspacePath);

        let confDirEnvVal: string = ""; 
        let configName: string = "";
        let mergeFlag: boolean = false;
        let chooseFolBrown: boolean = false;

        console.log('workspace path is ' + vsWorkspacePath);
        terminal.printHeading('workspace path is ' + vsWorkspacePath);

        if (util.discover.hasNoUnhiddenFiles(vsWorkspacePath)) {
            // if the current working directory is completely empty, consider config name to be the base name of current dir
            // and the DISC CONF DIR to be the parent.
            terminal.printHeading('Empty Workspace, importing into WS');
            [confDirEnvVal, configName] = util.discover.splitBaseName(vsWorkspacePath);
            console.log("Is this changing", vsWorkspacePath);

            terminal.printHeading("Split into these names: GREEN FIELD "+ confDirEnvVal+" config folder name "+ configName);
            console.log("Split into these names: GREEN FIELD", confDirEnvVal, configName); 
        } else {
            
            // If the current working directory is not empty and has tf files,
            if (util.discover.containsTFFiles(vsWorkspacePath)) {
                util.discover.showBrownFieldModal(vsWorkspacePath as string)
                .then((chosenOption) => {
                    
                    terminal.printHeading("here after choosing " + chosenOption);
                    try {
                        switch(chosenOption) {
                            case "Create a new folder and import":
                                console.log("Wants to create a new folder");
                                confDirEnvVal = vsWorkspacePath as string;
                                console.log("Split into these names: Green FIELD", confDirEnvVal, configName); 
                                break;
                            case "I want to choose another folder with tf files to import and merge with":
                                console.log("User wants to choose folder with tf files");
                                chooseFolBrown = true;
                                break;
                            default: // todo: @srikar - why is it getting stuck after this point
                          } 
                    } catch (error) {
                        console.log(error);
                        vscode.window.showErrorMessage(String(error));
                        return;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    vscode.window.showErrorMessage(String(error));
                    return;
                });
            } else {
                util.discover.showBrownFieldModalTFFiles(vsWorkspacePath as string)
                .then((chosenOption) => {
                    terminal.printHeading("here afterr choosing " + chosenOption);
                    try {
                        switch(chosenOption) {
                            case "Create a new folder and import":
                                console.log("Wants to create a new folder");
                                confDirEnvVal = vsWorkspacePath as string;
                                console.log("Split into these names: Green FIELD", confDirEnvVal, configName); 
                                break;
                            case "Import and merge with tf files":
                                [confDirEnvVal, configName] = util.discover.splitBaseName(vsWorkspacePath);
                                mergeFlag = true;
                                terminal.printHeading("Split into these names: BROWN FIELD "+ confDirEnvVal+" config folder name "+ configName);
                                console.log("Split into these names: BROWN FIELD", confDirEnvVal, configName); 
                                break;
                            case "I want to choose another folder with tf files to import and merge with":
                                console.log("User wants to choose folder with tf files");
                                chooseFolBrown = true;
                                break;
                            default:
                        }  // todo: @srikar - why is it getting stuck after this point
                    } catch (error) {
                        console.log(error);
                        vscode.window.showErrorMessage(String(error));
                        return;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    vscode.window.showErrorMessage(String(error));
                    return;
                });
            }
        }

        if (chooseFolBrown)  {
            console.log("Asking user to choose folder");
            const choosenDirName = await util.discover.chooseConfigName();
            if (util.discover.containsTFFiles(choosenDirName)) {
                mergeFlag = true;
                terminal.printHeading(choosenDirName + ' contains terraform files, importing and merging');
                [confDirEnvVal, configName] = util.discover.splitBaseName(choosenDirName);
                terminal.printHeading("Splitt into these names: BROWN FIELD "+ confDirEnvVal+" config folder name "+ configName);
            } else {
                // exit and return
                terminal.printError(`There are no tf files in ${ choosenDirName }. Exiting`);
                return;
            }
        }

        terminal.printHeading('Importing resources');
        await util.workspace.readCredentials().then(async (rs: any)=>{ // todo: @srikar - why workspace
        const key = rs.apiKey;
        // todo: @srikar - get and set the region.. or it will be a tag?
        
        console.log(`HEre::: Calling shell fn`);
        terminal.printHeading('Importing resources after exporting api key first time');
        await command.discovery.importConfig(services, configName, key, confDirEnvVal, mergeFlag); 
        console.log("&&&&&&%%%%%%%%%%% Done with the import config command");
        terminal.printSuccess("Imported resources");
        terminal.fireClose(1);
    });

    }catch(error: any){
        console.log("&&&&&&%%%%%%%%%%% Inside the catch block", error);
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
    return ""; // todo: @srikar - what is this?
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