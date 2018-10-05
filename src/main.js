import Vue      from 'vue'
import App      from './App.vue'
import router   from './router'
import * as util from './my-utils.js';
import {wsInit} from './websocket.js';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  created: wsInit,
}).$mount('#app')
