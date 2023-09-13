import ApiPlugin from '../../plugins/api';

const { api } = ApiPlugin;

const getters = {
  activeCollectionName: (state) => state.activeCollection.name,
  activeCollection: (state) => state.activeCollection,
  collectionNames: (state) => state.collectionNames,
};

const mutations = {
  collectionNames(state, collectionNames) {
    state.collectionNames = collectionNames;
  },
  activeCollection(state, collection) {
    state.activeCollection = collection;
  },
};

const actions = {
  save({ commit }, collectionInfo) {
    return api.saveCollection(collectionInfo.userId, collectionInfo.name, collectionInfo.items)
      .then((res) => {
        const { collection } = res.data;
        commit('activeCollection', collection);
        commit('viewTitle', collection.name, { root: true });
      });
  },
  getAllCollectionNames({ commit }) {
    return api.getAllCollectionNames().then((res) => {
      const { collectionNames } = res.data;
      commit('collectionNames', collectionNames);
    });
  },
  selectCollection({ commit }, id) {
    return api.getCollection(id).then((res) => {
      const { collection } = res.data;
      commit('activeCollection', collection);
      commit('wiki/entities', collection.items, { root: true });
    });
  },
};

const state = {
  activeCollection: {},
  collectionNames: [],
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
