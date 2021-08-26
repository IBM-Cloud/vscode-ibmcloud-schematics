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

const schematicsV1 = require('@ibm-cloud/ibm-schematics/dist/schematics/v1');

import * as auth from '../auth/auth';
import * as type from '../type/index';
import * as util from '../util';

let intervalId: any;

export async function createWorkspace(payload: any) {
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

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
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

    return new Promise(function (resolve, reject) {
        schematicsService
            .uploadTemplateTar(payload)
            .then(() => {
                resolve('Workspace updated');
            })
            .catch((err: any) => {
                reject(err);
            });
    });
}

export async function getWorkspace(id: string, credentials: any = undefined) {
    if (!credentials) {
        credentials = await util.workspace.readCredentials();
    }

    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

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
                    if (continueStates.includes(status)) {
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
        }, 4000);
    });
}

export async function getWorkspaceJobs() {
    const wsData = await util.workspace.readSchematicsWorkspace();
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

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
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    if (!actionId) {
        activity = await getLatestActivity();
        actionId = activity.action_id;
    }

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

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
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

    return new Promise(function (resolve, reject) {
        schematicsService
            .getWorkspaceResources({ wId: id })
            .then((res: any) => {
                resolve(res.result);
            })
            .catch((error: any) => {
                console.log(error);
                reject(error);
            });
    });
}

export async function runPlan(id: string): Promise<string> {
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

    return new Promise((resolve, reject) => {
        authenticator.tokenManager.requestToken().then(function (resp: any) {
            const params = {
                wId: id,
                refreshToken: resp.result.refresh_token,
            };

            schematicsService
                .planWorkspaceCommand(params)
                .then((res: any) => {
                    resolve('Plan initiated');
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    });
}

export async function runApply(id: string): Promise<string> {
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

    return new Promise((resolve, reject) => {
        authenticator.tokenManager.requestToken().then(function (resp: any) {
            const params = {
                wId: id,
                refreshToken: resp.result.refresh_token,
            };

            schematicsService
                .applyWorkspaceCommand(params)
                .then((res: any) => {
                    resolve('Apply initiated');
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    });
}

export async function pullLatest(data: any) {
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

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
                console.log(error);
                reject(error);
            });
    });
}

export async function versions() {
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

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
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

    return new Promise((resolve, reject) => {
        authenticator.tokenManager.requestToken().then(function (resp: any) {
            const params = {
                wId: id,
                refreshToken: resp.result.refresh_token,
                destroyResources: false,
                deleteWorkspace: true,
            };

            schematicsService
                .deleteWorkspace(params)
                .then((res: any) => {
                    resolve('Delete initiated');
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    });
}

export async function destroyResources(id: string): Promise<string> {
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

    return new Promise((resolve, reject) => {
        authenticator.tokenManager.requestToken().then(function (resp: any) {
            const params = {
                wId: id,
                refreshToken: resp.result.refresh_token,
            };

            schematicsService
                .destroyWorkspaceCommand(params)
                .then((res: any) => {
                    resolve('Destroy initiated');
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    });
}

export async function saveVariables(wsData: any, variables: any) {
    const credentials: type.Account = await util.workspace.readCredentials();
    const authenticator = auth.getAuthenticator(credentials);

    const schematicsService = new schematicsV1({
        authenticator,
        serviceUrl: credentials.serviceURL,
    });

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
                console.log(error);
                reject(error);
            });
    });
}
