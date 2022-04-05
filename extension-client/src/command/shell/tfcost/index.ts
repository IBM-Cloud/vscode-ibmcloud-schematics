import * as shell from '..';
import * as util from '../../../util';
var os = require('os');

const TFCOST_COMMAND = 'tfcost';

export function calculateTFCost(key: string): Promise<string | Error> {
    const apikey = 'IC_API_KEY=';
    const tfcostCommand = `tfcost plan ${util.workspace.getSecureDirectoryPath()}/plan.json --json`;
    var command: string;
    if (os.platform() === 'darwin' || os.platform() === 'linux'){
        command = `export ${apikey}${key} && ${tfcostCommand}`;
    }
    else{
        command = `set "${apikey}${key}" & call ${tfcostCommand}`;
    }
    return shell.execute(command);
}

export function verifyBinary(): Promise<string | Error> {
  return   shell.execute(TFCOST_COMMAND); 
}