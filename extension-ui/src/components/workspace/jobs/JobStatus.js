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

import Moment from 'react-moment';
import { CheckmarkFilled16, ErrorFilled16 } from '@carbon/icons-react';

const statusLabels = {
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

const JobStatus = ({ name, status, datetime }) => {
    const label = [name, status].join('_');
    let statusIcon;

    switch (status) {
        case 'CREATED':
            statusIcon = <CheckmarkFilled16 className="bx--icon-success" />;
            break;
        case 'INPROGRESS':
            statusIcon = <svg class="bx--loading__svg bx--spin" width="16" height="16" viewBox="0 0 100 100"><title>Active loading indicator</title><circle class="bx--loading__background" cx="50%" cy="50%" r="42"></circle><circle class="bx--loading__stroke" cx="50%" cy="50%" r="42"></circle></svg>;
            break;
        case 'COMPLETED':
            statusIcon = <CheckmarkFilled16 className="bx--icon-success" />;
            break;
        case 'FAILED':
            statusIcon = <ErrorFilled16 className="bx--icon-fail" />;
            break;
        default:
            statusIcon = <CheckmarkFilled16 className="bx--icon-success" />;
            break;
    }

    return (
        <div className="bx--flex">
            <div className="bx--status-icon">{statusIcon}</div>
            <div>
            <h5 className="bx--status-label">{statusLabels[label]}</h5>
            <h6 className="bx--datetime">
                <Moment format="YYYY/MM/DD, H:m">
                {datetime}
                </Moment>
            </h6>
            </div>
        </div>
    );
};

export default JobStatus;
