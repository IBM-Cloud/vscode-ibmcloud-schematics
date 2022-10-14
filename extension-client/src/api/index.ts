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

const schematicsV1 = require('@ibm-cloud/ibm-schematics/dist/schematics/v1');
const schematicsV2 = require('@ibm-cloud/ibm-schematics/dist/schematics/v2');

import * as auth from '../auth/auth';
import * as type from '../type/index';
import * as util from '../util';

let intervalId: any;

export async function createWorkspace(payload: any) {
    const schematicsService = await auth.getSchematicsService();

    return new Promise(function (resolve, reject) {
        schematicsService
            .createWorkspace(payload)
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function uploadTar(payload: any): Promise<any> {
    const schematicsService = await auth.getSchematicsService();

    return new Promise(function (resolve, reject) {
        schematicsService
            .templateRepoUpload(payload)
            .then(() => {
                resolve('Workspace updated');
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function getWorkspace(id: string, credentials: any = undefined) {
    const schematicsService = await auth.getSchematicsService(credentials);

    return new Promise(function (resolve, reject) {
        schematicsService
            .getWorkspace({
                wId: id,
            })
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function pollState(): Promise<string> {
    const pollStates = ['DRAFT', 'CONNECTING', 'SCANNING', 'INPROGRESS'];
    const stopStates = ['TEMPLATE_ERROR', 'FAILED'];
    const continueStates = ['INACTIVE', 'ACTIVE'];

    const credentials: type.Account = await util.workspace.readCredentials();
    const wsData = await util.workspace.readSchematicsWorkspace();

    return new Promise((resolve, reject) => {
        intervalId = setInterval(function () {
            getWorkspace(wsData.id, credentials)
                .then((res: any) => {
                    const status = res.status;
                    const isWorkspaceLocked = res.workspace_status.locked;
                    if (continueStates.includes(status) && !isWorkspaceLocked) {
                        clearInterval(intervalId);
                        resolve(status);
                    }
                    if (stopStates.includes(status)) {
                        clearInterval(intervalId);
                        reject('Workspace state is ' + status);
                    }
                })
                .catch((err: any) => {
                    reject(err);
                });
        }, 4250);
    });
}

export async function pollStateBlueprintJobs(): Promise<string> {
    const pollStates = [
        'DRAFT',
        'CREATE_INPROGRESS',
        'PENDING',
        'UPDATE_INPROGRESS',
        'FULFILMENT_INPROGRESS',
    ];
    const continueUserStatusCode = [
        'CREATE_SUCCESS',
        'UPDATE_SUCCESS',
        'FULFILMENT_SUCCESS',
    ];
    const stopStates = [
        'TEMPLATE_ERROR',
        'CREATE_FAILED',
        'UPDATE_FAILED',
        'FULFILMENT_FAILED',
    ];

    const credentials: type.Account = await util.workspace.readCredentials();
    const bpData = await util.blueprint.readSchematicsBlueprint();

    return new Promise((resolve, reject) => {
        intervalId = setInterval(function () {
            getBlueprint(bpData.blueprint_id, credentials)
                .then((res: any) => {
                    const status = res.state;
                    if (status.hasOwnProperty('status_code')) {
                        const statusCode = status.status_code;
                        if (continueUserStatusCode.includes(statusCode)) {
                            clearInterval(intervalId);
                            resolve(statusCode);
                        }
                        if (stopStates.includes(status)) {
                            clearInterval(intervalId);
                            reject('Blueprint state is ' + status);
                        }
                    }
                })
                .catch((err: any) => {
                    reject(err);
                });
        }, 4250);
    });
}

export async function getWorkspaceJobs() {
    const wsData = await util.workspace.readSchematicsWorkspace();
    const schematicsService = await auth.getSchematicsService();

    return new Promise(function (resolve, reject) {
        schematicsService
            .listWorkspaceActivities({
                wId: wsData.id,
            })
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((err: any) => {
                console.error(err);
                reject(err);
            });
    });
}

export async function getActivityLog(activityId: string) {
    let activity: any;
    let actionId: string = activityId;
    const isDeployed = util.workspace.isDeployed();

    if (!isDeployed) {
        Promise.reject('workspace not deployed');
        return;
    }

    const wsData = await util.workspace.readSchematicsWorkspace();
    const schematicsService = await auth.getSchematicsService();

    if (!actionId) {
        activity = await getLatestActivity();
        actionId = activity.action_id;
    }

    return new Promise(function (resolve, reject) {
        schematicsService
            .getTemplateActivityLog({
                wId: wsData.id,
                tId: wsData.template_data[0].id,
                activityId: actionId,
            })
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((err: any) => {
                console.error(err);
                reject(err);
            });
    });
}

export async function getLatestActivity(): Promise<object> {
    const activities: any = await getWorkspaceJobs();
    return new Promise(function (resolve, reject) {
        resolve(activities.actions[0]);
    });
}

export async function getWorkspaceResources(id: string) {
    const schematicsService = await auth.getSchematicsService();

    return new Promise(function (resolve, reject) {
        schematicsService
            .getWorkspaceResources({ wId: id })
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}

export async function runPlan(id: string): Promise<string> {
    const schematicsService = await auth.getSchematicsService();
    const refreshToken = await auth.getRefreshToken();

    const params = {
        wId: id,
        refreshToken,
    };

    return new Promise((resolve, reject) => {
        schematicsService
            .planWorkspaceCommand(params)
            .then((res: any) => {
                resolve('Plan initiated');
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function runApply(id: string): Promise<string> {
    const schematicsService = await auth.getSchematicsService();
    const refreshToken = await auth.getRefreshToken();

    const params = {
        wId: id,
        refreshToken,
    };

    return new Promise((resolve, reject) => {
        schematicsService
            .applyWorkspaceCommand(params)
            .then((res: any) => {
                resolve('Apply initiated');
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function pullLatest(data: any) {
    const schematicsService = await auth.getSchematicsService();

    const params = {
        wId: data.id,
        templateRepo: {
            url: data.template_repo.url,
        },
    };

    return new Promise((resolve, reject) => {
        schematicsService
            .replaceWorkspace(params)
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}

export async function versions() {
    const schematicsService = await auth.getSchematicsService();
    return new Promise((resolve, reject) => {
        schematicsService
            .getSchematicsVersion()
            .then((res: any) => {
                const tfvers = res.result.supported_template_types.map(
                    (obj: any) => obj.template_name
                );
                resolve(tfvers);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function deleteWorkspace(id: string): Promise<string> {
    const schematicsService = await auth.getSchematicsService();
    const refreshToken = await auth.getRefreshToken();

    const params = {
        wId: id,
        refreshToken,
        destroyResources: false,
        deleteWorkspace: true,
    };

    return new Promise((resolve, reject) => {
        schematicsService
            .deleteWorkspace(params)
            .then((res: any) => {
                resolve('Delete initiated');
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function destroyResources(id: string): Promise<string> {
    const schematicsService = await auth.getSchematicsService();
    const refreshToken = await auth.getRefreshToken();

    const params = {
        wId: id,
        refreshToken,
    };

    return new Promise((resolve, reject) => {
        schematicsService
            .destroyWorkspaceCommand(params)
            .then((res: any) => {
                resolve('Destroy initiated');
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function saveVariables(wsData: any, variables: any) {
    const schematicsService = await auth.getSchematicsService();

    const params = {
        wId: wsData.id,
        tId: wsData.template_data[0].id,
        variablestore: variables,
    };

    return new Promise((resolve, reject) => {
        schematicsService
            .replaceWorkspaceInputs(params)
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((error: any) => {
                reject(error);
            });
    });
}

export async function getStatefile(payload: any) {
    const credentials: type.Account = await util.workspace.readCredentials();
    const schematicsService = await auth.getSchematicsService(credentials);

    return new Promise(function (resolve, reject) {
        schematicsService
            .getWorkspaceTemplateState(payload)
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((err: any) => {
                resolve(1);
            });
    });
}

export async function createBlueprint(payload: any) {
    const schematicsService = await auth.getSchematicsServiceV2();

    return new Promise(function (resolve, reject) {
        schematicsService
            .createBlueprint(payload)
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function createJob(payload: any): Promise<string> {
    const schematicsService = await auth.getSchematicsServiceV2();
    const refreshToken = await auth.getRefreshToken();

    const params = {
        refreshToken,
        job: payload,
    };

    return new Promise((resolve, reject) => {
        schematicsService
            .createJob(params)
            .then((res: any) => {
                resolve('Job created');
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function getBlueprint(id: string, credentials: any = undefined) {
    const schematicsService = await auth.getSchematicsServiceV2(credentials);

    return new Promise(function (resolve, reject) {
        schematicsService
            .getBlueprint({
                blueprintId: id,
            })
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}
