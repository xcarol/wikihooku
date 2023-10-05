import dayjs from 'dayjs';

const mutations = {
  persons(state, persons) {
    state.persons = persons;
  },
  addPerson(state, person) {
    state.persons.push(person);
  },
  remPerson(state, person) {
    state.persons.splice(state.persons.indexOf(person), 1);
  },
};

const getters = {
  persons: (state) => state.persons,
  larger: (state) => state.persons.reduce((larger, person) => Math.max(larger, dayjs(person.deathDate).year() - dayjs(person.birthDate).year()), 0),
  start: (state) => {
    const min = state.persons.reduce((year, person) => Math.min(year, dayjs(person.birthDate).year()), state.curYear);
    return min;
  },
  end: (state) => {
    const max = state.persons.reduce((year, person) => Math.max(year, dayjs(person.deathDate).year()), state.curYear);
    return max;
  },
};

const state = {
  persons: [],
  curYear: new Date().getFullYear(),
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
