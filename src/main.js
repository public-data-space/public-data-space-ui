import Vue from 'vue';
import axios from './plugins/axios';
import App from './App.vue';

import vueNcform from '@ncform/ncform';
import ncformStdComps from '@ncform/ncform-theme-elementui';

import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import vuetify from '@/plugins/vuetify';
import VueProgressBar from 'vue-progressbar';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import RuntimeConfiguration from './runtimeconfig';
import { glueConfig as GLUE_CONFIG } from '../config/user-config';

import router from './router';
import store from './store';

import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

Vue.component("vue-json-pretty", VueJsonPretty);

Vue.use(vuetify);
Vue.config.productionTip = false;
Vue.config.devtools = true;

const progressBarOptions = {
  thickness: '5px',
  autoRevert: false,
  transition: {
    speed: '1.0s',
    opacity: '0.5s',
    termination: 500,
  },
};

Vue.use(VueProgressBar, progressBarOptions);
Vue.use(Element);
Vue.use(RuntimeConfiguration, { baseConfig: GLUE_CONFIG, debug: false });
Vue.use(vueNcform, { extComponents: ncformStdComps, /*lang: 'zh-cn'*/ });

window.$http = Vue.prototype.$http = axios;

Vue.axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.status && error.response.status === 401) {
    Vue.$store.dispatch('updateStatus', {'status': 'error', 'text': 'Session expired.' });
    localStorage.removeItem('jwt');
    Vue.$store.dispatch('logout');
    Vue.$router.push({ name: 'Login' });
  }
  return Promise.reject(error);
});

export default new Vue({
  router,
  vuetify,
  store,
  axios,
  render: h => h(App),
}).$mount('#app');
