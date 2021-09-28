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

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import Loader from './components/common/loader/Loader';
import Jobs from './components/workspace/jobs';
import WorkspaceDetail from './components/workspace/detail';
import Log from './components/common/log/Log';
import Resources from './components/workspace/resources';
import Failure from './components/common/failure';
import Variables from './components/workspace/variables';
import TimeEstimation from './components/workspace/resources/TimeEstimation';

import './style/app.scss';

function App() {
    const [redirectPath, setRedirectPath] = useState('/loading');
    const [result, setResult] = useState();

    useEffect(() => {
        window.addEventListener('message', (event) => {
            setResult(event.data.message);
            if (event.data.path) setRedirectPath(event.data.path);
        });
    }, []);

    return (
        <Router>
            <Redirect to={redirectPath} />
            <Route exact path="/loading" render={() => <Loader />} />
            <Route
                exact
                path="/workspace/details"
                render={() => <WorkspaceDetail result={result} />}
            />
            <Route
                exact
                path="/workspace/jobs"
                render={() => <Jobs result={result} />}
            />
            <Route
                exact
                path="/workspace/logs"
                render={() => <Log result={result} />}
            />
            <Route
                exact
                path="/workspace/resources"
                render={() => <Resources result={result} />}
            />
            <Route
                exact
                path="/workspace/variables"
                render={() => <Variables result={result} />}
            />
            <Route
                exact
                path="/workspace/time-estimation"
                render={() => <TimeEstimation result={result} />}
            />
            <Route
                exact
                path="/error"
                render={() => <Failure result={result} />}
            />
        </Router>
    );
}

export default App;
