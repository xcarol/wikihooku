/* This file was generated by 'vue add axios' command */
/* Therefore instead of fixing lint errors we prefer to disable them */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

import Vue from 'vue';
import axios from 'axios';
import store from '../store/config';

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

const _axios = axios.create();

_axios.interceptors.request.use(
  function (_config) {
    _config.headers = {
      Authorization: `bearer ${store.getters['session/token']}`,
      'Content-Type': 'application/json',
    };
    return _config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.status === 401) {
      store.commit('session/reset');
    }
    return Promise.reject(error);
  },
);

const AxiosPlugin = {
  install(VueInstance, options) {
    VueInstance.axios = _axios;
    window.axios = _axios;
    Object.defineProperties(Vue.prototype, {
      axios: {
        get() {
          return _axios;
        },
      },
      $axios: {
        get() {
          return _axios;
        },
      },
    });
  },
};

Vue.use(AxiosPlugin);

export default AxiosPlugin;
