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

import * as vscode from 'vscode';
import * as api from '../../api';
import { ReactView } from '../ReactView';

export default class TimeEstimationView extends ReactView {
    static viewID: string = 'workspace.time.estimation';
    static viewTitle: string = 'Workspace time estimation';
    private _id: string;

    constructor(context: vscode.ExtensionContext, jobID: any) {
        super(context, TimeEstimationView.viewID, TimeEstimationView.viewTitle);
        this._id = jobID;
    }

    async openPanelInner(panel: vscode.WebviewPanel): Promise<void> {
        await this.loadComponent(panel);
    }

    async loadComponent(panel: vscode.WebviewPanel): Promise<void> {
        api.getTimeEstimation(this._id)
            .then((result) => {
                console.log(`Time.json =>>> `, result.data);
                panel.webview.postMessage({
                    path: '/workspace/time-estimation',
                    message: result.data,
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