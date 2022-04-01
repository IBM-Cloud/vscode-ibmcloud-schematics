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
import {
    StructuredListWrapper,
    StructuredListHead,
    StructuredListBody,
    StructuredListRow,
    StructuredListCell,
} from 'carbon-components-react';

const mockData = require('./mock.json');

function Resources({ result }) {
    result = result ? result : mockData;
    const allResources = [];

    if (result && !!result[0].null_resources) {
        allResources.push(...result[0].null_resources);
    }

    if (result && !!result[0].resources) {
        allResources.push(...result[0].resources);
    }

    if (!allResources.length) {
        return (
            <>
                <h3>There are no Resources yet</h3>
                <p>Generate and Apply your Plan first</p>
            </>
        );
    }

    return (
        <StructuredListWrapper>
            <StructuredListHead>
                <StructuredListRow head>
                    <StructuredListCell head>Resource</StructuredListCell>
                    <StructuredListCell head>Type</StructuredListCell>
                    <StructuredListCell head>URL</StructuredListCell>
                </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
                {allResources.map((resource, index) => {
                    const resourceURL = !resource.resource_controller_url
                        ? 'No URL available'
                        : resource.resource_controller_url;

                    return (
                        <StructuredListRow key={index}>
                            <StructuredListCell>
                                {resource.resource_name}
                            </StructuredListCell>
                            <StructuredListCell>
                                {resource.resource_type}
                            </StructuredListCell>
                            <StructuredListCell>
                                {resourceURL}
                            </StructuredListCell>
                        </StructuredListRow>
                    );
                })}
            </StructuredListBody>
        </StructuredListWrapper>
    );
}

export default Resources;
