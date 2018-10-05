
import {rejectedPromise} from './main.js';

const wsToStr = (code) => ['connecting','open','closing','closed'][code];

const pending = {};
let socket;

export const wsInit = () => {
  socket = new WebSocket('ws://192.168.1.179:3535');

  let connectReject;
  setTimeout( ()=> {
    if(socket.readyState !== WebSocket.OPEN) {
      const wstate = wsToStr(socket.readyState);
      socket.close();
      connectReject(`Timeout while waiting for server connection (websocket is ${wstate}).`);
    }
  }, 5000);

  return new Promise( (resolve, reject) => {
    connectReject = reject;

    socket.onopen = () => {
      socket.onerror = (err) => console.error('websocket error:', err);

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
          case "rej": pend.reject(msgObj.err);                          break;
          case "err": console.error("rpc returned error:", {msgObj});   break;
          default: console.error("rpc response type invalid:", {msgObj});
        }
      };
      resolve();
    };
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
            pending[id] = {resolve, reject};
            socket.send(JSON.stringify(msg));
          });
}

export const motRpc = (func, ...args) => rpc('motor', func, args);

