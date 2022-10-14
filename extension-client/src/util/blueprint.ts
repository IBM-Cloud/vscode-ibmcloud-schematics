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
import * as workspace from './workspace';

export const fs = require('fs');
export const path = require('path');

export const secureDirName = '.vscode-ibmcloud-schematics';
export const schematicsBlueprintFilename = 'blueprint.json';

export function getSchematicsBlueprintPath(): string {
    const wsPath = workspace.getWorkspacePath();
    return (
        wsPath +
        path.sep +
        secureDirName +
        path.sep +
        schematicsBlueprintFilename
    );
}

export async function saveSchematicsBlueprint(blueprint: any) {
    workspace.createSecureDirectory();
    const path = getSchematicsBlueprintPath();
    return workspace.writeToFile(path, blueprint);
}

export function isBlueprintCreated(): boolean {
    const path = getSchematicsBlueprintPath();
    return fs.existsSync(path);
}

export function readSchematicsBlueprint(): any {
    return new Promise(function (resolve, reject) {
        const schmtxbpPath = getSchematicsBlueprintPath();
        workspace.readFile(schmtxbpPath).then((data: any) => {
            resolve(data);
        });
    });
}
