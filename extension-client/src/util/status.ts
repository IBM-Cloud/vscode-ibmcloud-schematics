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

/* eslint-disable @typescript-eslint/naming-convention */
const activityStatus: any = {
    PLAN_CREATED: 'Plan will begin generating shortly',
    PLAN_INPROGRESS: 'Plan is generating',
    PLAN_COMPLETED: 'Plan generated',
    PLAN_FAILED: 'Failed to generate plan',
    APPLY_CREATED: 'Plan will begin being applied shortly',
    APPLY_INPROGRESS: 'Applying plan',
    APPLY_COMPLETED: 'Plan applied',
    APPLY_FAILED: 'Failed to apply plan',
    APPLY_STOP_PENDING: 'Stopping apply',
    APPLY_STOPPED: 'Apply stopped',
    DESTROY_CREATED: 'Resource deletion will begin shortly',
    DESTROY_INPROGRESS: 'Resource deletion is in progress',
    DESTROY_COMPLETED: 'Resource deleted',
    DESTROY_FAILED: 'Resource deletion failed',
    WORKSPACE_UPDATE_CREATED: 'Workspace will begin updating shortly',
    WORKSPACE_UPDATE_INPROGRESS: 'Workspace is updating',
    WORKSPACE_UPDATE_COMPLETED: 'Workspace updated',
    WORKSPACE_UPDATE_FAILED: 'Workspace update failed',
    WORKSPACE_CREATE_CREATED: 'Workspace will begin creation shortly',
    WORKSPACE_CREATE_INPROGRESS: 'Workspace creation is in progress',
    WORKSPACE_CREATE_COMPLETED: 'Workspace created',
    WORKSPACE_CREATE_FAILED: 'Workspace create failed',
    TAR_WORKSPACE_UPLOAD_CREATED: 'Workspace will begin updating shortly',
    TAR_WORKSPACE_UPLOAD_INPROGRESS: 'Workspace is updating',
    TAR_WORKSPACE_UPLOAD_COMPLETED: 'Workspace updated',
    TAR_WORKSPACE_UPLOAD_FAILED: 'Workspace update failed',
    TERRAFORM_COMMANDS_CREATED: 'Commands will begin executing shortly',
    TERRAFORM_COMMANDS_INPROGRESS: 'Commands executing',
    TERRAFORM_COMMANDS_COMPLETED: 'Commands executed',
    TERRAFORM_COMMANDS_FAILED: 'Commands failed',
};

const statusIcons: any = {
    CREATED: `<svg fill="#42be65" class="bx--inline-notification__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.293-11.332L6.75 9.21 4.707 7.168 3.293 8.582 6.75 12.04l5.957-5.957-1.414-1.414z"
      fill-rule="evenodd" />
    </svg>`,
    INPROGRESS: `<svg class="bx--inline-notification__icon bx--loading__svg bx--spin" width="16" height="16" viewBox="0 0 100 100"><title>Active loading indicator</title><circle class="bx--loading__background" cx="50%" cy="50%" r="42"></circle><circle class="bx--loading__stroke" cx="50%" cy="50%" r="42"></circle></svg>`,
    COMPLETED: `<svg fill="#42be65" class="bx--inline-notification__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm3.293-11.332L6.75 9.21 4.707 7.168 3.293 8.582 6.75 12.04l5.957-5.957-1.414-1.414z"
      fill-rule="evenodd" />
    </svg>`,
    FAILED: `<svg fill="#fa4d56" class="bx--inline-notification__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM3.293 4.707l8 8 1.414-1.414-8-8-1.414 1.414z" fill-rule="evenodd" />
    </svg>`,
    STOPPED: `<svg fill="#f1c21b" class="bx--inline-notification__icon" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M.75 16a.75.75 0 0 1-.67-1.085L7.33.415a.75.75 0 0 1 1.34 0l7.25 14.5A.75.75 0 0 1 15.25 16H.75zm6.5-10v5h1.5V6h-1.5zM8 13.5A.75.75 0 1 0 8 12a.75.75 0 0 0 0 1.5z"
      fill-rule="nonzero" />
  </svg>`,
};

export function getActivtyStatus(activity: string): string {
    return activityStatus[activity];
}

export function getStatusIcon(status: string): string {
    return statusIcons[status];
}
