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

const newLine = '\r\n';
const extraNewline = '\n';

export class Terminal {
    private writeEmitter;
    private closeEmitter;

    constructor(
        we: vscode.EventEmitter<string>,
        ce: vscode.EventEmitter<number>
    ) {
        this.writeEmitter = we;
        this.closeEmitter = ce;
    }

    public printHeading(text: string) {
        this.writeEmitter.fire('\x1b[1m\x1b[33m' + text + '\x1b[0m' + newLine);
    }

    public printSuccess(text: string) {
        this.writeEmitter.fire(
            '\x1b[1m\x1b[32mSuccess!\x1b[0m ' + text + newLine + extraNewline
        );
    }

    public printFailure(text: string) {
        this.writeEmitter.fire(
            '\x1b[1m\x1b[31mFailure!\x1b[0m ' + text + newLine
        );
    }

    public printError(text: any) {
        if (typeof text !== 'string') {
            text = text.toString();
        }
        var lines: string[] = text.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            this.writeEmitter.fire(lines[i] + newLine);
        }
    }

    public printText(text: string) {
        this.writeEmitter.fire(text + newLine);
    }

    public fireClose(data: number): void {
        this.closeEmitter.fire(data);
    }
}
