
import util from './my-utils.js';

const wsToStr = (code) => ['connecting','open','closing','closed'][code];

const pendingRpcs = {};
let socket, monConn;

const socketError = (retry = false) => {
  const wstate = (socket ? wsToStr(socket.readyState) : 'not open');
  console.log('socketError', {retry, wstate});
  if(monConn) clearInterval(monConn);
  for (const [, val] of Object.entries(pendingRpcs)) {
    console.log('rejecting rpc:', val.msg);
    val.reject('rpc failed because of socket error');
  }
  // if(socket.readyState < WebSocket.CLOSING) socket.close();
  if(!retry) { 
    util.popup(`
      Timeout while waiting for the server connection (the websocket is ${wstate}). 
      I will keep retrying.  
      The indicator in the top right of the page shows connection status.
    `);
    console.debug('connection down');
  }
  setTimeout(chkConn, 2000, true);
  tryToConnect();
}

const chkConn = async (retry = false) => {
  if(socket.readyState !== WebSocket.OPEN) socketError(retry);
}

const tryToConnect = async () => {
  socket = new WebSocket('ws://192.168.1.179:3535');

  socket.onopen = () => {
    util.closePopup();
    console.debug('connection up');
    if(monConn) clearInterval(monConn);
    monConn = setInterval(chkConn, 2000);

    socket.onerror = (err) => {
      console.error('websocket error:', err);
      socketError();
    }  
  }
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
    const pend = pendingRpcs[id];
    delete pendingRpcs[id];
    if(!pend) console.log("rpc id not in pending table:", {message});
    else switch(type) {
      case "res": pend.resolve(msgObj.val); break;
      case "rej": 
        console.error("rpc rejected:",  msgObj);
        pend.reject (msgObj.err); break;
      case "err": console.error("rpc error:", {msgObj}); break;
      default: console.error("rpc response type invalid:", {msgObj});
    }
  };
}

export const wsInit = () => {
  setTimeout(chkConn, 5000);
  tryToConnect();
}

let lastId = Date.now(); 

const rpc = async (mod, func, args) => {
  const id = lastId++;
  const msg = {id, mod, func, args};
  if(!socket || socket.readyState != WebSocket.OPEN) 
    throw `${mod}:${func} rpc call with no open socket.`;
  return new Promise( (resolve, reject) => {
    pendingRpcs[id] = {resolve, reject, msg};
    try{ socket.send(JSON.stringify(msg)); }
    catch(err) {
      delete pendingRpcs[id];
      reject(`socket.send error: ${err}`);
    }
  });
}

export const motRpc = (func, ...args) => rpc('motor', func, args);

