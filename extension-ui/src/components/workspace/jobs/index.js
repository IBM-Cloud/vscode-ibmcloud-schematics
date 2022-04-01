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

import React from 'react';
import Job from './Job';

const mockData = require('./mock.json');

function Jobs({ result }) {
    result = result ? result : mockData;

    if (!result?.actions.length) {
        return (
            <>
                <h3>There are no jobs yet</h3>
                <p>Configure and run workspace</p>
            </>
        );
    }

    return (
        <div className="bx--ws-jobs">
            {result?.actions.map((action, index) => (
                <Job key={index} job={action} />
            ))}
        </div>
    );
}

export default Jobs;
