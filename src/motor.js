
import {motRpc} from './websocket.js'
import { notDeepEqual } from 'assert';

let motors = null;

export const getMotors = async () => {
  if(!motors) motors = await motRpc('motors');
  return motors;
}
