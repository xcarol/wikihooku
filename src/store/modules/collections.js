import ApiPlugin from '../../plugins/api';

const { api } = ApiPlugin;

const getters = {
};

const mutations = {
};

const actions = {
  save({ commit }, collectionInfo) {
    return api.saveCollection(collectionInfo.userId, collectionInfo.name, collectionInfo.items)
    .then((res) => {
      commit('viewTitle', res.data.collection.name, { root: true });
    });
  }
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
