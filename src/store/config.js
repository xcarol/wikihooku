import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import session from './modules/session';
// import collections from './modules/collections';
import wiki from './modules/wiki';

const store = createStore({
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
    // collections,
    wiki,
  },
  plugins: [
    new VuexPersistence({
      storage: window.localStorage,
    }).plugin,
  ],
});

export default store;
