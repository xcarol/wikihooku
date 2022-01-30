/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { api } from '../../plugins/api';

const mutations = {
  user(state, user) {
    state.user = user;
  },
  token(state, token) {
    state.token = token;
  },
  reset(state) {
    state.token = '';
    state.user = {};
  },
};

const getters = {
  user: (state) => state.user,
  token: (state) => state.token,
  isLoggedIn: (state) => !!state.token,
};

const actions = {
  login({ commit }, credentials) {
    return api.login(credentials.username, credentials.password)
      .then((res) => {
        commit('token', res.data.token);
        commit('user', res.data.user);
      });
  },
  register({ commit }, credentials) {
    return api.register(
      credentials.fullname,
      credentials.username,
      credentials.password,
    )
      .then((res) => {
        commit('token', res.data.token);
        commit('user', res.data.user);
      });
  },
  confirm({ commit }, credentials) {
    return api.confirmRegister(credentials.email, credentials.token)
      .then((res) => {
        commit('token', res.data.token);
        commit('user', res.data.user);
      });
  },
  resetPassword({ commit }, credentials) {
    return api.resetPassword(credentials.email, credentials.password, credentials.token)
      .then((res) => {
        commit('token', res.data.token);
        commit('user', res.data.user);
      });
  },
};

const state = {
  user: {},
  token: '',
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
