import ApiPlugin from '../../plugins/api';

const { api } = ApiPlugin;

const getters = {
  activeCollectionName: (state) => state.activeCollectionName,
};

const mutations = {
  activeCollectionName(state, collectionName) {
    state.activeCollectionName = collectionName;
  },
};

const actions = {
  save({ commit }, collectionInfo) {
    return api.saveCollection(collectionInfo.userId, collectionInfo.name, collectionInfo.items)
    .then((res) => {
      const collectionName = res.data.collection.name;
      commit('activeCollectionName', collectionName)
      commit('viewTitle', collectionName, { root: true });
    });
  }
};

const state = {
  activeCollectionName: '',
  collections: [],
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
