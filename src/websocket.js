
import util from './my-utils.js';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';

const wsToStr = (code) => ['connecting','open','closing','closed'][code];

const pending = {};
let socket, resolveConn, rejectConn;

export const wsInit = () => {
  const tryToConnect = async () => {
    socket = new WebSocket('ws://192.168.1.179:3535');
    socket.onopen = () => {
      socket.onerror = (err) => console.error('websocket error:', err);
      pending[id] = {resolve, reject};
      socket.send(JSON.stringify(msg));
      resolveConn();
    },
    socket.onmessage = (event) => {
      const message = event.data;
      // console.debug("WebSocket message received:", message);
      let msgObj;
      try {
        msgObj = JSON.parse(message);
      } catch(err) {
        console.error("rpc message parse error:", {err, message});
        return;
      }
      const {id, type} = msgObj;
      if(!id) {
        console.error("rpc response id missing:", {message});
        return;
      }
      const pend = pending[id];
      delete pending[id];
      switch(type) {
        case "res": pend.resolve(msgObj.val);                         break;
        case "rej": throw (msgObj.err);
        case "err": console.error("rpc returned error:", {msgObj});   break;
        default: console.error("rpc response type invalid:", {msgObj});
      }
    };
  }
  const chkConn = async (retry = false) => {
    if(socket.readyState !== WebSocket.OPEN) {
      const wstate = wsToStr(socket.readyState);
      socket.close();
      if(!retry) util.popup(`
        Timeout while waiting for the server connection (the websocket is ${wstate}). 
        I will keep trying to connect.  
        The indicator in the top right of the page shows connection status.
      `);
      setTimeout(chkConn, 3000, true);
      tryToConnect();
    }
  }
  setTimeout(chkConn, 5000);

  return new Promise( (resolve, reject) => {
    resolveConn = resolve;
    rejectConn  = reject;
    tryToConnect();
  });
}

let lastId = Date.now(); 

const rpc = (mod, func, args) => {
  const id = lastId++;
  const msg = {id, mod, func, args};
  if(!socket)
    throw 'rpc error: Socket not ready';
  else
    return new Promise( (resolve, reject) => {
      setupListeners();
    });
}

export const motRpc = (func, ...args) => rpc('motor', func, args);

