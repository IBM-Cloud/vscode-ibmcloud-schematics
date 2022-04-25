import * as shell from '..';
import * as util from '../../../util';
var os = require('os');

import {exportEnvironmentVariables} from '../index';

const TFCOST_COMMAND = 'tfcost';
const PLAN_COMMAND = 'plan';
const JSON_FLAG = '--json';


export function calculateCost(key: string): Promise<string | Error> {
  const apikey = 'IC_API_KEY=';
  const tfcostCommand = [
    TFCOST_COMMAND,
    PLAN_COMMAND,
    `${util.workspace.getSecureDirectoryPath()}/plan.json`,
    JSON_FLAG
  ].join(' ');
  return shell.execute(`${exportEnvironmentVariables(apikey,key)} ${tfcostCommand}`);
}

export function isInstalled(): Promise<string | Error> {
  return shell.execute(TFCOST_COMMAND);
}
