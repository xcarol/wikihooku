/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import session from './modules/session';
import collections from './modules/collections';
import wiki from './modules/wiki';

Vue.use(Vuex);

export const storeConfig = {
  state: {
    drawerVisible: true,
    snackMessage: '',
  },
  mutations: {
    toggleDrawer(state) {
      state.drawerVisible = !state.drawerVisible;
    },
    drawerVisible(state, show) {
      state.drawerVisible = show;
    },
    snackMessage(state, message) {
      state.snackMessage = message;
    },
  },
  getters: {
    drawerVisible: (state) => state.drawerVisible,
    snackMessage: (state) => state.snackMessage,
  },
  actions: {
    resetSnackMessage({ commit }, timeout) {
      setTimeout(() => { commit('snackMessage', ''); }, timeout);
    },
  },
  modules: {
    session,
    collections,
    wiki,
  },
  plugins: [
    new VuexPersistence().plugin,
  ],
};

const store = new Vuex.Store(storeConfig);
export default store;
