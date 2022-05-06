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

export class OutputChannel implements vscode.OutputChannel {
    readonly name = 'IBM Cloud Schematics';
    readonly error = 'Error';
    readonly success = 'Done';
    outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel(this.name);
        this.outputChannel.clear();
        this.outputChannel.show();
    }

    append(value: string): void {
        this.outputChannel.append(value);
    }

    appendLine(value: string): void {
        value = ['[', new Date().toISOString(), ']', value].join(' ');
        this.outputChannel.appendLine(value);
    }

    replace(value: string): void {
        this.outputChannel.replace(value);
    }

    clear(): void {
        this.outputChannel.clear();
    }

    show(preserveFocus?: boolean): void;
    show(column?: vscode.ViewColumn, preserveFocus?: boolean): void;
    show(column?: any, preserveFocus?: any): void {
        this.outputChannel.show(preserveFocus);
    }

    hide(): void {
        this.outputChannel.hide();
    }

    dispose(): void {
        this.outputChannel.dispose();
    }

    fail(value?: string): void {
        value = value ? [this.error, value].join(' ') : this.error;
        this.appendLine(value);
    }

    done(value?: string): void {
        value = value ? [this.success, value].join(' ') : this.success;
        this.appendLine(value);
    }
}