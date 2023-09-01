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
    <v-spacer />
    <v-autocomplete
      v-model:search="search"
      :clear-icon="'$close'"
      :error-messages="errorMessage"
      :items="items"
      :loading="isLoading"
      color="secondary"
      clearable
      hide-no-data
      no-filter
      :placeholder="$t('searchHint')"
      return-object
      @update:model-value="input"
    />
    <v-btn
      size="small"
      color="primary"
      :icon="'$add'"
      class="ma-2"
      @click.stop="newPerson"
    />
  </v-app-bar>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useApi } from '../../plugins/api';
import { TIMELINE, AGE } from '../../global/const';

const { commit } = useStore();
const { t: $t } = useI18n();
const api = useApi();

defineProps({
  view: {
    type: String,
    default: TIMELINE,
  },
});

const emits = defineEmits(['selected', 'switchView', 'newPerson']);

const items = ref([]);
const isLoading = ref(false);
const search = ref(null);
const errorMessage = ref('');
const toggleExclusive = ref(0);

const toggleDrawer = () => commit('toggleDrawer');
const newPerson = () => emits('newPerson');
const viewToggle = (value) => emits('switchView', value === 0 ? TIMELINE : AGE);

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
            value: message.pageid,
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
</script>
