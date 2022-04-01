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

const EstimateCost = ({ result }) => {
    result = result ? result : mockData;
    return (
        <div className="bx--cost_detail">
            <h2>Cost Estimate</h2>
            <div>
                <StructuredListWrapper>
                    <StructuredListHead>
                        <StructuredListRow head>
                            <StructuredListCell head>
                                Resource
                            </StructuredListCell>
                            <StructuredListCell head>
                                Local Name
                            </StructuredListCell>
                            <StructuredListCell head>Title</StructuredListCell>
                            <StructuredListCell head>
                                Current Cost
                            </StructuredListCell>
                            <StructuredListCell head>
                                Previous Cost
                            </StructuredListCell>
                            <StructuredListCell head>
                                Changed Cost
                            </StructuredListCell>
                        </StructuredListRow>
                    </StructuredListHead>

                    <StructuredListBody>
                        {result?.Lineitem.map((item, index) => (
                            <StructuredListRow key={index}>
                                <StructuredListCell>
                                    {item.terraformItemId}
                                </StructuredListCell>
                                <StructuredListCell>
                                    {item.id}
                                </StructuredListCell>
                                <StructuredListCell>
                                    {item.title}
                                </StructuredListCell>
                                <StructuredListCell>
                                    {item.currlineitemtotal.toFixed(2)}{' '}
                                    {result?.currency}
                                    {item.rateCardCost ? ' *' : ''}
                                </StructuredListCell>
                                <StructuredListCell>
                                    {item.prevlineitemtotal.toFixed(2)}{' '}
                                    {result?.currency}
                                    {item.rateCardCost ? ' *' : ''}
                                </StructuredListCell>
                                <StructuredListCell>
                                    {item.changelineitemtotal.toFixed(2)}{' '}
                                    {result?.currency}
                                    {item.rateCardCost ? ' *' : ''}
                                </StructuredListCell>
                            </StructuredListRow>
                        ))}
                        <StructuredListRow
                            key={result?.Lineitem.length + 1}
                        ></StructuredListRow>
                        <StructuredListCell head>
                            {' '}
                            Total estimated cost
                        </StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell>
                            {`${result?.totalcost.toFixed(2)} ${
                                result?.currency
                            }`}
                        </StructuredListCell>
                    </StructuredListBody>
                </StructuredListWrapper>
                <p>
                    The cost displayed here are just an estimated cost not an
                    actual cost. <br />* indicated cost has been derived from
                    ratecard
                </p>
            </div>
        </div>
    );
};

export default EstimateCost;
