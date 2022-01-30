import Vue from 'vue';
import './plugins/axios';
import './vee-validate';
import './plugins/api';
import App from './App';
import router from './router';
import store from './store/config';
import vuetify from './plugins/vuetify';
import i18n from './i18n';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
