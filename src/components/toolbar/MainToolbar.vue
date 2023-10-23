<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click.stop="toggleDrawer()" />
    <v-btn-toggle
      v-model="toggleExclusive"
      dense
      @update:model-value="viewToggle"
    >
      <v-btn
        :icon="'$timeline'"
        :outlined="true"
        @click-stop="setAge"
      />
      <v-btn
        :icon="'$age'"
        :outlined="true"
        @click-stop="setTimeline"
      />
    </v-btn-toggle>
    <v-autocomplete
      v-model:search="search"
      :error-messages="errorMessage"
      :items="items"
      :loading="isLoading()"
      :placeholder="$t('searchHint')"
      class="ma-2"
      clearable
      hide-no-data
      no-filter
      return-object
      @update:model-value="input"
      @update:search="updateItems"
      @click:clear="reset"
    />
    <v-btn
      :icon="'$save'"
      :disabled="anonymousUser || noPerson"
      @click.stop="saveCollection"
    />
    <v-btn
      :icon="'$deleteForever'"
      @click.stop="clearActiveCollection"
    />
    <v-btn
      :icon="'$add'"
      @click.stop="newPerson"
    />
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useApi } from '../../plugins/api';
import { TIMELINE, AGE } from '../../lib/const';
import WikiPerson from '../../lib/wikiPerson';

const { getters, commit, dispatch } = useStore();
const { t: $t } = useI18n();
const api = useApi();

defineProps({
  view: {
    type: String,
    default: TIMELINE,
  },
});

const emits = defineEmits(['selected', 'switchView', 'newPerson', 'saveCollection']);

const items = ref([]);
const searchesInProgress = ref(0);
const search = ref(null);
const errorMessage = ref('');
const toggleExclusive = ref(0);
const lastSearch = ref('');

const toggleDrawer = () => commit('toggleDrawer');
const newPerson = () => emits('newPerson');
const saveCollection = () => emits('saveCollection');
const viewToggle = (value) => emits('switchView', value === 0 ? TIMELINE : AGE);
const anonymousUser = computed(() => getters['session/isLoggedIn'] === false);
const noPerson = computed(() => getters['wiki/persons'].length === 0);

const input = (item) => {
  if (item) {
    emits('selected', item);
  }
};

const reset = () => {
  items.value = [];
  lastSearch.value = '';
};

const setAge = () => {
  viewToggle(AGE);
};

const setTimeline = () => {
  viewToggle(TIMELINE);
};

const isEqualText = (text1, text2) => text1.toLocaleLowerCase() === text2.toLocaleLowerCase();

const isLoading = () => searchesInProgress.value > 1;

const checkErrorStatus = (result) => {
  if (result.status !== 200) {
    errorMessage.value = result.statusText;
    return true;
  }
  return false;
};

const addPersonAtTop = (message) => {
  items.value.unshift({
    title: message.title,
    value: message.pageid,
    content: message.revisions[0].slots.main.content,
  });
};

const addPersonAtBotton = (message) => {
  items.value.push({
    title: message.title,
    value: message.pageid,
    content: message.revisions[0].slots.main.content,
  });
};

const addPerson = (message, val) => {
  const person = new WikiPerson();

  person.setFromSearch(message.revisions[0].slots.main);

  if (person.getBirthDate()) {
    if (isEqualText(message.title, val)) {
      addPersonAtTop(message);
    } else {
      addPersonAtBotton(message);
    }
  }
};

const updateItems = (searchName) => {
  if (searchName.length < 5 || isEqualText(searchName, lastSearch.value)) {
    errorMessage.value = '';
    return;
  }

  errorMessage.value = '';
  searchesInProgress.value += 1;

  api
    .searchPerson(searchName, 0, 50)
    .then((result) => {
      if (isLoading() || checkErrorStatus(result)) {
        return;
      }

      items.value = [];
      if (result.data.query) {
        result.data.query.pages.forEach((message) => {
          if (message.revisions[0].slots.main.content.includes('birth_date')) {
            addPerson(message, searchName);
          }
        });
      }

      lastSearch.value = searchName;
    })
    .catch((error) => {
      errorMessage.value = error.message;
    })
    .finally(() => {
      searchesInProgress.value -= 1;
    });
};

const clearActiveCollection = () => {
  dispatch('collections/clearActiveCollection', {});
};
</script>
