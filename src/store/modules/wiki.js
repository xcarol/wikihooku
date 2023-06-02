const wikiEntity = (pageid, name, start, end) => ({
  pageid,
  name,
  start,
  end,
});

export { wikiEntity };

const mutations = {
  entities(state, entities) {
    state.entities = entities;
  },
  addEntity(state, entity) {
    state.entities.push(entity);
  },
  remEntity(state, entity) {
    state.entities.splice(state.entities.indexOf(entity), 1);
  },
};

const getters = {
  entities: (state) => state.entities,
  larger: (state) => state.entities.reduce((larger, entity) => Math.max(larger, entity.end - entity.start), 0),
  start: (state) => {
    const min = state.entities.reduce((year, entity) => Math.min(year, entity.start), state.curYear);
    return min;
  },
  end: (state) => {
    const max = state.entities.reduce((year, entity) => Math.max(year, entity.end), state.curYear);
    return max;
  },
};

const state = {
  entities: [],
  curYear: new Date().getFullYear(),
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
