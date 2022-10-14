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
import * as util from '../../util';

export async function blueprintInit(): Promise<void> {
    const isBlueprintCreated = util.blueprint.isBlueprintCreated();
    if (!isBlueprintCreated) {
        vscode.window.showErrorMessage(
            'Blueprint not created. Make sure you have created your blueprint.'
        );
        return;
    }

    try {
        const bp = await util.blueprint.readSchematicsBlueprint();

        const payload = {
            command_name: 'blueprint_create_init',
            command_object: 'blueprint',
            command_object_id: bp.blueprint_id,
        };
        await api.createJob(payload);
        vscode.window.showInformationMessage('Init Job created!');
    } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage(String(error));
    }
}
