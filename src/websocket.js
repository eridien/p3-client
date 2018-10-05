
import util from './my-utils.js';

const wsToStr = (code) => ['connecting','open','closing','closed'][code];

const pending = {};
let socket;

const socketError = (retry = false) => {
  for(let {key, val} in pending) val.reject('rpc failed because of socket error');
  const wstate = (socket ? wsToStr(socket.readyState) : 'not open');
  if(socket) socket.close();
  if(!retry) util.popup(`
    Timeout while waiting for the server connection (the websocket is ${wstate}). 
    I will keep retrying.  
    The indicator in the top right of the page shows connection status.
  `);
  setTimeout(chkConn, 2000, true);
  tryToConnect();
}

const tryToConnect = async () => {
  socket = new WebSocket('ws://192.168.1.179:3535');

  socket.onopen = () => {
    socket.onerror = (err) => {
      console.error('websocket error:', err);
      socketError();
    }
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
  if(socket.readyState !== WebSocket.OPEN) socketError(retry);
}

export const wsInit = () => {
  setTimeout(chkConn, 5000);
  tryToConnect();
}

let lastId = Date.now(); 

const rpc = async (mod, func, args) => {
  const id = lastId++;
  const msg = {id, mod, func, args};
  if(!socket) throw 'rpc call with no socket';
  return new Promise( (resolve, reject) => {
    pending[id] = {resolve, reject};
    socket.send(JSON.stringify(msg));
  });
}

export const motRpc = (func, ...args) => rpc('motor', func, args);

