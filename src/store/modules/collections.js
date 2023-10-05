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
  activeCollectionName(state, activeCollectionName) {
    state.activeCollectionName = activeCollectionName;
  },
};

const actions = {
  save({ commit }, collectionInfo) {
    return api.saveCollection(collectionInfo.userId, collectionInfo.name, collectionInfo.items)
      .then((res) => {
        const { collection } = res.data;
        commit('activeCollectionName', collection.name);
        commit('viewTitle', collection.name, { root: true });
      });
  },
  getAllCollectionNames({ commit }) {
    return api.getAllCollectionNames().then((res) => {
      const { collectionNames } = res.data;
      commit('collectionNames', collectionNames);
    });
  },
  getUserCollectionNames({ commit }, userId) {
    return api.getUserCollectionNames(userId).then((res) => {
      const { collectionNames } = res.data;
      commit('collectionNames', collectionNames);
    });
  },
  selectCollection({ commit }, id) {
    return api.getCollection(id).then((res) => {
      const { collection } = res.data;
      commit('activeCollectionName', collection.name);
      commit('viewTitle', collection.name, { root: true });
      commit('wiki/persons', collection.items, { root: true });
    });
  },
  clearActiveCollection({ commit }) {
    commit('activeCollectionName', '');
    commit('viewTitle', '', { root: true });
    commit('wiki/persons', [], { root: true });
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
