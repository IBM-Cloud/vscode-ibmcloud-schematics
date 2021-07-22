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

import { Row, Column } from 'carbon-components-react';

const Summary = ({ count, text }) => {
    if (!count) {count = 0; }

    return (
        <>
            <h2 className="bx--counter">{count}</h2>
            <span className="bx--counter-text">{text}</span>
        </>
    );
};

const JobSummary = ({ summary }) => {
    const added = summary?.resources_added;
    const modified = summary.resources_modified;
    const destroyed = summary.resources_destroyed;

    return (
        <Row>
            <Column>
                <Summary count={added} text="resource added" />
            </Column>
            <Column>
                <Summary count={modified} text="modified" />
            </Column>
            <Column>
                <Summary count={destroyed} text="resource destroyed" />
            </Column>
        </Row>
    );
};

export default JobSummary;
