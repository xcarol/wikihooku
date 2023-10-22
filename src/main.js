import { createApp } from 'vue';
import VueCookies from 'vue-cookies';
import axios from './plugins/axios';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n';
import store from './store/config';
import api from './plugins/api';

const app = createApp(App);

app.use(VueCookies);
app.use(router);
app.use(vuetify);
app.use(i18n);
app.use(store);
app.use(axios);
app.use(api, { axios: app.config.globalProperties.axios });

app.mount('#app');
