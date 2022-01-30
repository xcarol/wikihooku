/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["state"] }] */
import { api } from '../../plugins/api';

const getters = {
  collection: (state) => (collection) => {
    const current = state.collections.find((item) => item.name === collection);
    return current ? current.items : [];
  },
};

const mutations = {
  collection(state, collection) {
    const current = state.collections.find((elem) => elem.name === collection.name);
    if (current) {
      const index = state.collections.indexOf(current);
      state.collections.splice(index, 1);
    }
    state.collections.push(collection);
  },
};

const actions = {
  retrieveCollection({ commit, state }, collection) {
    const current = state.collections.find((item) => item.name === collection.name);
    if (current) {
      return Promise.resolve();
    }
    return api.getCollection(collection.name)
      .then((res) => {
        const { items } = res.data;

        commit('collection', {
          name: res.data.type,
          items,
        });
      })
      .catch((error) => {
        commit('snackMessage', api.getErrorMessage(error), { root: true });
      });
  },
};

const state = {
  collections: [],
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
