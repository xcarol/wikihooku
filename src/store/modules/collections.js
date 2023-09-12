import ApiPlugin from '../../plugins/api';

const { api } = ApiPlugin;

const getters = {
  activeCollectionName: (state) => state.activeCollectionName,
  collectionNames: (state) => state.collectionNames,
};

const mutations = {
  collectionNames(state, collectionNames) {
    state.collectionNames = collectionNames;
  },
  activeCollectionName(state, collectionName) {
    state.activeCollectionName = collectionName;
  },
};

const actions = {
  save({ commit }, collectionInfo) {
    return api.saveCollection(collectionInfo.userId, collectionInfo.name, collectionInfo.items)
      .then((res) => {
        const collectionName = res.data.collection.name;
        commit('activeCollectionName', collectionName);
        commit('viewTitle', collectionName, { root: true });
      });
  },
  getAllCollectionNames({ commit }) {
    return api.getAllCollectionNames().then((res) => {
      const { collectionNames } = res.data;
      commit('collectionNames', collectionNames);
    });
  },
};

const state = {
  activeCollectionName: '',
  collectionNames: [],
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
