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

import {
    Button,
    Row,
    Column,
} from 'carbon-components-react';
import JobStatus from './JobStatus';
import JobSummary from './JobSummary';
import { Launch16 } from '@carbon/icons-react';

const Job = ({job}) => {
    const showJobSummary = job.status === 'COMPLETED' && ['PLAN', 'APPLY', 'DESTROY'].includes(job.name);

    const viewLog = () => {
        const event = new CustomEvent('ui-message', {
            detail: {
                command: 'schematics.workspace.job.log',
                action_id: job.action_id,
            },
        });

        window.dispatchEvent(event);
    };

    return (
        <Row className="bx--ws-job">
            <Column md={4} lg={4}>
                <JobStatus name={job.name} status={job.status} datetime={job.performed_at}/>
            </Column>
            <Column md={4} lg={5}>
                {showJobSummary && <JobSummary summary={job.templates[0].log_summary} />}
            </Column>
            <Column md={2} lg={3}>
                <Button kind='tertiary' size='small' className="bx--float-right" renderIcon={Launch16} onClick={viewLog}>View log</Button>
            </Column>
        </Row>
    );
}

export default Job;