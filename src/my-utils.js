
import Vue from 'vue';

import * as ModalDialogs       from 'vue-modal-dialogs';
Vue.use(ModalDialogs);
import {create as createPopup} from 'vue-modal-dialogs';
import MessageBox              from './components/popup.vue';

export const popup = (msg) => createPopup(MessageBox, 'content')(msg);
export const sleep = (ms)  => new Promise(res => setTimeout(res, ms));
