<template>
  <v-app-bar
  >
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
      :loading="isLoading"
      :placeholder="$t('searchHint')"
      class="ma-2"
      clearable
      hide-no-data
      no-filter
      return-object
      @update:model-value="input"
    />
    <v-btn
      variant="tonal"
      :icon="'$save'"
      :disabled="anonymousUser || noPerson"
      @click.stop="saveCollection"
    />
    <v-btn
      variant="tonal"
      :icon="'$deleteForever'"
      @click.stop="clearActiveCollection"
    />
    <v-btn
      variant="tonal"
      :icon="'$add'"
      @click.stop="newPerson"
    />
  </v-app-bar>
</template>

<script setup>
import { ref, watch,computed } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useApi } from '../../plugins/api';
import { TIMELINE, AGE } from '../../lib/const';

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
const isLoading = ref(false);
const search = ref(null);
const errorMessage = ref('');
const toggleExclusive = ref(0);

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

const setAge = () => {
  viewToggle(AGE);
};

const setTimeline = () => {
  viewToggle(TIMELINE);
};

watch(search, async (val) => {
  items.value = [];

  if (!val || val.length < 5) {
    errorMessage.value = '';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    const result = await api.searchPerson(val, 0, 50);

    if (result.status !== 200) {
      throw new Error(result.statusText);
    }

    if (result.data.query) {
      result.data.query.pages.forEach((message) => {
        if (message.revisions[0].slots.main.content.includes('birth_date')) {
          items.value.push({
            title: message.title,
            value: message.id,
            content: message.revisions[0].slots.main.content,
          });
        }
      });
    }
  } catch (error) {
    errorMessage.value = error.message;
  }

  isLoading.value = false;
});

const clearActiveCollection = () => {
  dispatch('collections/clearActiveCollection', {});
};
</script>
