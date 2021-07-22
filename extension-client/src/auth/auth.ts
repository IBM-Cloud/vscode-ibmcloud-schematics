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

import * as type from '../type/index';

const {
    IamAuthenticator: iamAuthnticator,
} = require('@ibm-cloud/ibm-schematics/dist/auth/index');
const iamEndpoint = {
    prod: 'https://iam.cloud.ibm.com/identity/token',
    stage: 'https://iam.test.cloud.ibm.com/identity/token',
};

export function getAuthenticator(credentials: type.Account) {
    let authenticator;
    if (credentials.serviceURL?.includes('test')) {
        // Create IAM authenticator for staging.
        authenticator = new iamAuthnticator({
            url: iamEndpoint.stage,
            apikey: credentials.apiKey,
            clientId: 'bx',
            clientSecret: 'bx',
        });
    } else {
        // Create IAM authenticator for production.
        authenticator = new iamAuthnticator({
            url: iamEndpoint.prod,
            apikey: credentials.apiKey,
            clientId: 'bx',
            clientSecret: 'bx',
        });
    }
    return authenticator;
}
