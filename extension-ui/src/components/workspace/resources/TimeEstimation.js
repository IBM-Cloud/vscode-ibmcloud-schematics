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
} from 'carbon-components-react';

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
        header: 'Estimated time (in sec)',
    },
    {
        key: 'Action',
        header: 'Action',
    },
    {
        key: 'AccuracyPercentage',
        header: 'Accuracy (%)',
    },
];

const mockData = require('./time-estimation-mock.json');

const TimeEstimation = ({ result }) => {
    result = result ? result : mockData;
    const totalTime = result.totalTimeEstimation;
    const rows = result.resources.length ? result.resources : [];

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
                            'This is a estimated time. Actual time may differ.'
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
