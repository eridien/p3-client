
import {motRpc}         from './websocket.js'
import util             from './my-utils.js';

let motors = null;

export const getMotors = async () => {
  while(!motors) {
    try{
      motors = await motRpc('motors');
    }
    catch(err) {
      await util.sleep(100);
    }
  }
  return motors;
}
