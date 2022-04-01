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

export default abstract class View {
    protected static openPanels: Array<vscode.WebviewPanel> = [];
    protected panelTitle: string;
    protected panelID: string;
    protected context: vscode.ExtensionContext;

    constructor(
        context: vscode.ExtensionContext,
        panelID: string,
        panelTitle: string
    ) {
        this.panelID = panelID;
        this.panelTitle = panelTitle;
        this.context = context;
    }

    public async openView(
        keepContext: boolean,
        viewColumn: vscode.ViewColumn = vscode.ViewColumn.One
    ): Promise<void> {
        View.openPanels = View.openPanels.filter((_panel: any) => {
            return (
                _panel['_isDisposed'] === false ||
                (_panel['_store'] && _panel['_store']['_isDisposed'] === false)
            );
        });

        let panel: vscode.WebviewPanel | undefined = View.openPanels.find(
            (tempPanel: vscode.WebviewPanel) => {
                return tempPanel.title === this.panelTitle;
            }
        );

        if (panel) {
            // Focus on the panel if it is already open
            panel.reveal(undefined);
        } else {
            // Create the panel
            panel = vscode.window.createWebviewPanel(
                this.panelID, // Identifies the type of the webview. Used internally
                this.panelTitle, // Title of the panel displayed to the user
                viewColumn, // Editor column to show the new webview panel in.
                {
                    enableScripts: true,
                    retainContextWhenHidden: keepContext,
                    enableCommandUris: true,
                }
            );

            // Keep track of the panels open
            View.openPanels.push(panel);

            // Reset when the current panel is closed
            panel.onDidDispose(
                () => {
                    // Delete the closed panel from the list of open panels
                    // View.openPanels = View.openPanels.filter(
                    //     (tempPanel: vscode.WebviewPanel) => {
                    //         return tempPanel.title !== this.panelTitle;
                    //     }
                    // );
                    let removed: vscode.WebviewPanel;
                    let removeIndex: number = -1;

                    for (
                        let index = 0;
                        index < View.openPanels.length;
                        index++
                    ) {
                        if (this.panelTitle === panel?.title) {
                            removed = View.openPanels[index];
                            removeIndex = index;
                            break;
                        }
                    }

                    if (removeIndex !== -1) {
                        View.openPanels.splice(removeIndex, 1);
                    }
                },
                null,
                this.context.subscriptions
            );

            // Set the webview's html
            panel.webview.html = await this.getHTMLString(panel.webview);
            this.loadComponent(panel);

            if (!keepContext) {
                panel.onDidChangeViewState(async () => {
                    if (panel) {
                        // Whenever the View becomes active, rebuild the UI
                        panel.webview.html = await this.getHTMLString(
                            panel.webview
                        );

                        this.loadComponent(panel);
                    }
                });
            }

            await this.openPanelInner(panel);
        }
    }

    protected abstract openPanelInner(
        panel: vscode.WebviewPanel
    ): Promise<void>;

    protected abstract getHTMLString(webview: vscode.Webview): Promise<string>;

    protected abstract loadComponent(panel: vscode.WebviewPanel): void;

    public async reloadComponent(): Promise<void> {
        let panel: vscode.WebviewPanel | undefined = View.openPanels.find(
            (tempPanel: vscode.WebviewPanel) => {
                return tempPanel.title === this.panelTitle;
            }
        );

        if (panel) {
            panel.webview.postMessage({
                path: '/loading',
            });

            this.loadComponent(panel);
        }
    }
}
