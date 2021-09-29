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
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    TableContainer,
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    TooltipIcon,
} from 'carbon-components-react';
import { Information16 } from '@carbon/icons-react';

const headers = [
    {
        key: 'name',
        header: 'Resource',
    },
    {
        key: 'region',
        header: 'Region',
    },
    {
        key: 'TimeEstimation',
        header: (
            <>
                {'Estimated time'}{' '}
                <TooltipIcon
                    tooltipText="Estimated time to provision a resource in hh:mm:ss"
                    renderIcon={Information16}
                />
            </>
        ),
    },
    {
        key: 'Action',
        header: 'Action',
    },
    {
        key: 'AccuracyPercentage',
        header: (
            <>
                {'Accuracy'}{' '}
                <TooltipIcon
                    tooltipText="Accuracy in percentage defines how close the provided estimated time are close to actual estimation"
                    renderIcon={Information16}
                />
            </>
        ),
    },
];

const mockData = require('./time-estimation-mock.json');

const TimeEstimation = ({ result }) => {
    result = result ? result : mockData;
    const totalTime = result.TotalTimeEstimation;
    const rows = result.Resources.length ? result.Resources : [];

    if (true) {
        return <h5>No data available</h5>;
    }

    return (
        <>
            <DataTable rows={rows} headers={headers}>
                {({
                    rows,
                    headers,
                    getTableProps,
                    getHeaderProps,
                    getRowProps,
                    onInputChange,
                }) => (
                    <TableContainer
                        title={'Total time: ' + totalTime}
                        description={
                            'This is a estimated time. Actual time to deploy may differ.'
                        }
                    >
                        <TableToolbar>
                            <TableToolbarContent>
                                <TableToolbarSearch
                                    persistent
                                    onChange={onInputChange}
                                />
                            </TableToolbarContent>
                        </TableToolbar>
                        <Table {...getTableProps()}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header) => (
                                        <TableHeader
                                            {...getHeaderProps({
                                                header,
                                                isSortable: true,
                                            })}
                                        >
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow {...getRowProps({ row })}>
                                        {row.cells.map((cell) => (
                                            <TableCell key={cell.id}>
                                                {cell.value}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>
        </>
    );
};

export default TimeEstimation;
