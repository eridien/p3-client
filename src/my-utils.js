
import Vue from 'vue';

import * as ModalDialogs       from 'vue-modal-dialogs';
Vue.use(ModalDialogs);
import {create as createPopup} from 'vue-modal-dialogs';
import MessageBox              from './components/popup.vue';

let currentPopup;

export default {
  popup(msg) {
    if(currentPopup) currentPopup.close();
    currentPopup = createPopup(MessageBox, 'content')(msg);
  },
  closePopup() {
    if(currentPopup) currentPopup.close();
    currentPopup = null;
  },
  
  sleep(ms)  {return new Promise((res) => setTimeout(res, ms))},
}
