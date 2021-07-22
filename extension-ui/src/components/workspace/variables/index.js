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

import React, { useState } from 'react';

import {
    Checkbox,
    TextInput,
    TextArea,
    Row,
    Column,
    Button,
} from 'carbon-components-react';

const mock = require('./mock.json');

const squash = (metadata, store) => {
    if (!metadata) return [];
    if (!store) store = [];

    const newList = metadata.reduce((accumulator, currentValue) => {
        const item = store.find((a) => a.name === currentValue.name);

        if (item) {
            accumulator.push({
                ...currentValue,
                id: currentValue.name,
                secure: item.secure || false,
                uiSecure: item.secure || false,
                value: item.value || '',
                use_default: false,
            });
        } else {
            accumulator.push({
                ...currentValue,
                id: currentValue.name,
                secure: false,
                uiSecure: false,
                value: '',
                use_default: true,
            });
        }

        return accumulator;
    }, []);

    return newList;
};

const tableHeader = (
    <Row className="bx--variables-table-head">
        <Column md={1} lg={2}>
            <h6>Name</h6>
        </Column>
        <Column md={1} lg={2}>
            <h6>Description</h6>
        </Column>
        <Column md={1} lg={1}>
            <h6>Type</h6>
        </Column>
        <Column md={1} lg={1}>
            <h6>Default</h6>
        </Column>
        <Column md={1} lg={1}>
            <h6>Use Default</h6>
        </Column>
        <Column md={2} lg={4}>
            <h6>Override Value</h6>
        </Column>
        <Column md={1} lg={1}>
            <h6>Secure</h6>
        </Column>
    </Row>
);

const Variables = ({ result }) => {
    if (!result) {
        result = mock;
    }
    const metadata = result.template_data[0].values_metadata;
    const store = result.template_data[0].variablestore;
    const squashed = squash(metadata, store);

    const [variables, setVariables] = useState(squashed);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const onTextAreaChange = (event, index) => {
        const newVariables = [...variables];
        const inputValue = event.target.value;
        newVariables[index].value = inputValue;
        newVariables[index].changed = true;
        setVariables(newVariables);
    };

    const onSecureCheckboxChange = (event, index) => {
        const newVariables = [...variables];
        const inputChecked = event;
        newVariables[index].secure = inputChecked;
        newVariables[index].changed = true;
        setVariables(newVariables);
    };

    const onDefaultCheckboxChange = (event, index) => {
        const newVariables = [...variables];
        const inputChecked = event;
        newVariables[index].use_default = inputChecked;
        newVariables[index].changed = true;
        setVariables(newVariables);
    };

    const onSaveVariables = () => {
        const variablesToSave = variables.filter((v) => v.changed === true);

        if (variablesToSave.length) {
            setIsSubmit(true);
            const event = new CustomEvent('ui-message', {
                detail: {
                    command: 'schematics.workspace.variables.save',
                    variables: variablesToSave,
                },
            });

            window.dispatchEvent(event);
        }
    };

    const onSearchChange = (event) => {
        const query = event.target.value;
        if (!query) {
            setIsSearch(false)
        } else {
            setIsSearch(true);
        }
        const metadata = result.template_data[0].values_metadata;
        const store = result.template_data[0].variablestore;
        const newVariables = squash(metadata, store);

        if (!query) {
            setVariables(newVariables);
        } else {
            const filtered = newVariables.filter(
                (v) => v.name.indexOf(query) !== -1
            );

            if (filtered.length) {
                setVariables(filtered);
            } else {
                setVariables([]);
            }
        }
    };

    return (
        <div className="bx--variables">
            <h3>Variables</h3>
            <p>
                The values of the variables can be edited so that a new
                Terraform template can be generated or applied.
            </p>

            <div className="bx--variables-wrapper">
                <Row className="bx--variables-header">
                    <Column md={6} lg={10} className="bx--variables-search-bar">
                        <TextInput
                            id="variable-search"
                            placeholder="Search by Variable Name"
                            labelText=""
                            onChange={onSearchChange}
                            disabled={!variables.length && !isSearch}
                        />
                    </Column>
                    <Column md={2} lg={2} className="bx--variables-save-btn">
                        <Button
                            size="field"
                            onClick={onSaveVariables}
                            disabled={isSubmit || !variables.length}
                        >
                            {isSubmit
                                ? 'Saving variables...'
                                : 'Save variables'}
                        </Button>
                    </Column>
                </Row>
                {tableHeader}
                {
                    !isSearch && !variables.length && 
                    <div className="bx--variables-table-row empty">There are no variables defined for the workspace</div>
                }
                {
                    isSearch && !variables.length && 
                    <div className="bx--variables-table-row empty">There are no variables for the search query</div>
                }
                {!!variables.length && variables.map((variable, index) => (
                    <Row key={index} className="bx--variables-table-row">
                        <Column  md={1} lg={2}>{variable.name}</Column>
                        <Column  md={1} lg={2}>{variable.description}</Column>
                        <Column  md={1} lg={1}>{variable.type}</Column>
                        <Column  md={1} lg={1}>{variable.default}</Column>
                        <Column  md={1} lg={1}>
                            <Checkbox
                                id={'default-checkbox-' + index}
                                labelText="Use default value"
                                hideLabel
                                defaultChecked={variable.use_default}
                                onChange={(evt) => {
                                    onDefaultCheckboxChange(evt, index);
                                }}
                            />
                        </Column>
                        <Column  md={2} lg={4}>
                            {variable.use_default ? (
                                <span>Default value is used</span>
                            ) : (
                                <TextArea
                                    rows={1}
                                    labelText=""
                                    placeholder={
                                        variable.uiSecure ? 'Secure value' : ''
                                    }
                                    value={
                                        variable.uiSecure
                                            ? variable.changed &&
                                              variable.use_default
                                                ? variable.value
                                                : ''
                                            : variable.value
                                    }
                                    id={'textinput-' + index}
                                    onChange={(evt) => {
                                        onTextAreaChange(evt, index);
                                    }}
                                />
                            )}
                        </Column>
                        <Column  md={1} lg={1}>
                            <Checkbox
                                id={'checkbox-' + index}
                                labelText="Secure"
                                hideLabel
                                defaultChecked={variable.secure}
                                disabled={
                                    variable.use_default || variable.uiSecure
                                }
                                onChange={(evt) => {
                                    onSecureCheckboxChange(evt, index);
                                }}
                            />
                        </Column>
                    </Row>
                ))}
            </div>
        </div>
    );
};

export default Variables;
