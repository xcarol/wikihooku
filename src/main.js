import { createApp } from 'vue';
// import './plugins/axios';
// import './vee-validate';
// import './plugins/api';
import App from './App.vue';
import router from './router';
// import store from './store/config';
import vuetify from './plugins/vuetify';
import i18n from './i18n';

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(i18n);

app.mount('#app');
