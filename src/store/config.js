import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import session from './modules/session';
import collections from './modules/collections';
import wiki from './modules/wiki';

const store = createStore({
  state: {
    drawerVisible: false,
    snackMessage: '',
    viewTitle: '',
  },
  mutations: {
    toggleDrawer(state) {
      state.drawerVisible = !state.drawerVisible;
    },
    snackMessage(state, message) {
      state.snackMessage = message;
    },
    viewTitle(state, title) {
      state.viewTitle = title;
    },
  },
  getters: {
    drawerVisible: (state) => state.drawerVisible,
    snackMessage: (state) => state.snackMessage,
    viewTitle: (state) => state.viewTitle,
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
    new VuexPersistence({
      storage: window.localStorage,
    }).plugin,
  ],
});

export default store;
