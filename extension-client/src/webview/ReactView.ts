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
import * as path from 'path';
import View from './View';
import * as util from '../util';

export abstract class ReactView extends View {
    private readonly _extensionPath: any;
    protected extensionUri: vscode.Uri;

    constructor(
        context: vscode.ExtensionContext,
        panelID: string,
        panelTitle: string
    ) {
        super(context, panelID, panelTitle);
        this.extensionUri = context.extensionUri;
        this._extensionPath = context.extensionPath;
    }

    async getHTMLString(webview: vscode.Webview): Promise<string> {
        
        const manifestPath = path.join(
            this._extensionPath,
            'dist',
            'build',
            'asset-manifest.json'
        );
        const manifest = await util.workspace.readUIAssetManifest(manifestPath);
        const mainScript = manifest['files']['main.js'];
        const mainStyle = manifest['files']['main.css'];

        const scriptPathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, 'dist', 'build', mainScript)
        );
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        const stylePathOnDisk = vscode.Uri.file(
            path.join(this._extensionPath, 'dist', 'build', mainStyle)
        );
        const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();

        return `<!DOCTYPE html>
                  <html lang="en">
                        <head>
                            <meta charset="utf-8">
                            <meta http-equiv="Content-Security-Policy" content="img-src ${
                                webview.cspSource
                            } https:; style-src ${
            webview.cspSource
        } 'unsafe-inline' http: https: data:;"/>
                            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
                            <title>React</title>
                            <link rel="stylesheet" type="text/css" href="${styleUri}">
                            <base href="${vscode.Uri.file(
                                path.join(this._extensionPath, 'dist', 'build')
                            ).with({ scheme: 'vscode-resource' })}/">
                        
                    </head>
                    <body>
                        <noscript>You need to enable JavaScript to run this app.</noscript>
                        <main class="bx--content">
                            <div id="root"></div>
                        </main>
                        <script nonce="${nonce}" src="${scriptUri}"></script>
                        <script>
                            (function() {
                                const vscode = acquireVsCodeApi();

                                window.addEventListener('ui-message', function(event) {
                                    const message = event.detail;

                                    switch (message.command) {
                                        case 'schematics.workspace.job.log':
                                            vscode.postMessage({
                                                command: 'schematics.workspace.job.log',
                                                action_id: message.action_id
                                            })
                                            break;
                                        case 'schematics.workspace.variables.save':
                                            vscode.postMessage({
                                                command: 'schematics.workspace.variables.save',
                                                variables: message.variables
                                            })
                                            break;
                                    }
                                });
                            }())
                        </script>
                    </body>
                    </html>`;
    }

    protected abstract openPanelInner(
        panel: vscode.WebviewPanel
    ): Promise<void>;

    protected abstract loadComponent(panel: vscode.WebviewPanel): void;
}

function getNonce() {
    let text = '';
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
