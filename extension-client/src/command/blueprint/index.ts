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

import * as api from '../../api';
import * as util from '../../util';
export * from './job';

export async function createBlueprint(): Promise<void> {
    const isBlueprintCreated = util.blueprint.isBlueprintCreated();
    if (isBlueprintCreated) {
        Promise.resolve('blueprint already created');
        return;
    }

    console.log('inside createBlueprint index.ts file');
    const payload = {
        blueprint: {
            name: 'bp-demo2',
            schema_version: '1.0.0',
            source: {
                source_type: 'git_hub',
                git: {
                    git_repo_url:
                        'https://github.com/Cloud-Schematics/blueprint-basic-example',
                    git_repo_folder: 'basic-blueprint.yaml',
                    git_branch: 'master',
                },
            },
            inputs: [
                {
                    name: 'resource_group_name',
                    value: 'default',
                },
                {
                    name: 'provision_rg',
                    value: 'false',
                },
                {
                    name: 'cos_instance_name',
                    value: 'blueprint-basic-cos',
                },
                {
                    name: 'cos_storage_plan',
                    value: 'lite',
                },
            ],
            description: 'Deploys a simple two module blueprint',
            resource_group: 'Default',
        },
    };

    return new Promise((resolve, reject) => {
        api.createBlueprint(payload)
            .then(async (resp) => {
                await util.blueprint.saveSchematicsBlueprint(resp);
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}
