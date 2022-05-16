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


 // todo: @srikar - How exactly is this file needed and used

 import * as vscode from 'vscode';
 import { ReactView } from '../ReactView';
 import * as util from '../../util';
 import { path } from '../../util/workspace';
  
  export default class ImportResourcesView extends ReactView {
      static viewID: string = 'discovery.importResources';
      static viewTitle: string = 'Import resources from IBM cloud';  // todo: @srikar - check these titles
      
  
      constructor(context: vscode.ExtensionContext) {
          super(context, ImportResourcesView.viewID, ImportResourcesView.viewTitle);
      }
  
      async openPanelInner(panel: vscode.WebviewPanel): Promise<void> {
          await this.loadComponent(panel);
      }
  
      async loadComponent(panel: vscode.WebviewPanel): Promise<void> {
         util.workspace.readFile(path.join(util.workspace.getWorkspacePath(),"cost.json"))
              .then((result) => {
                  panel.webview.postMessage({   // todo: @srikar - change this
                      path: '/workspace/cost-estimation',
                      message: result,
                  });
              })
              .catch((error) => {
                  console.log(error);
                  panel.webview.postMessage({
                      path: '/error',
                      message: String(error),
                  });
            });
      }
  }
  