<template>
  <v-container fluid>
    <main-toolbar
      :view="viewToggle"
      @selected="selected"
      @switch-view="switchView"
      @new-person="openNewPersonDialog"
      @save-collection="openSaveCollectionDialog"
    />
    <v-overlay
      v-model="loading"
      contained
      class="align-center justify-center"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </v-overlay>
    <v-snackbar
      color="primary"
      :model-value="errorMessage !== ''"
    >
      {{ $t(errorMessage) }}
      <template #actions>
        <v-btn
          color="secondary"
          variant="text"
          @click.stop="clearErrorMessage"
        >
          {{ $t('global.close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <main-drawer />
    <timeline-layout
      :view="viewToggle"
      :visible-item="visibleItem"
    />
    <person-dialog
      v-if="showNewPersonDialog"
      @add="addNewPerson"
      @close="closeNewPersonDialog"
    />
    <collection-dialog
      v-if="showCollectionDialog"
      :current-name="collectionName"
      @close="closeCollectionDialog"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { uuid } from 'vue-uuid';

import parseInfo from 'infobox-parser';
import dayjs from 'dayjs';

import { TIMELINE } from '../global/const';
import { wikiEntity } from '../store/modules/wiki';

import MainDrawer from '../components/MainDrawer.vue';
import MainToolbar from '../components/toolbar/MainToolbar.vue';
import PersonDialog from '../components/PersonDialog.vue';
import TimelineLayout from './layouts/TimelineLayout.vue';
import CollectionDialog from '../components/CollectionDialog.vue';

const nowTimeout = 0;
const snackTimeout = 6000;
const loading = ref(false);
const view = ref(TIMELINE);

const { t: $t } = useI18n();
const store = useStore();

const collectionName = computed(() => store.getters['collections/activeCollectionName']);
const showNewPersonDialog = ref(false);
const showCollectionDialog = ref(false);
const visibleItem = ref('');

const viewToggle = computed(() => view.value);
const switchView = (newView) => {
  view.value = newView;
};

const snackMessage = computed(() => store.state.snackMessage);

const errorMessage = computed(() => {
  if (snackMessage.value?.length) {
    store.dispatch('resetSnackMessage', snackTimeout);
  }
  return snackMessage.value || '';
});

const clearErrorMessage = () => {
  store.dispatch('resetSnackMessage', nowTimeout);
};

onBeforeMount(() => {
  store.commit('viewTitle', collectionName.value);
});

const selected = async (item) => {
  loading.value = true;
  let startDate;
  let endDate = new Date();

  try {
    const infoBox = parseInfo(item.content);

    if (
      infoBox.general.birthDate &&
      infoBox.general.birthDate.date &&
      dayjs(infoBox.general.birthDate.date).isValid()
    ) {
      startDate = new Date(infoBox.general.birthDate.date);
    } else {
      throw new Error($t('character.noBirthDateFound'));
    }

    if (
      infoBox.general.deathDate &&
      infoBox.general.birthDate.date &&
      dayjs(infoBox.general.birthDate.date).isValid()
    ) {
      endDate = new Date(infoBox.general.deathDate.date);
    }

    store.commit(
      'wiki/addEntity',
      wikiEntity(item.value, item.title, startDate.getFullYear(), endDate.getFullYear()),
    );
    visibleItem.value = item.value.toString();
  } catch (error) {
    store.commit('snackMessage', error.message);
  }
  loading.value = false;
};

const closeNewPersonDialog = () => {
  showNewPersonDialog.value = false;
};

const openNewPersonDialog = () => {
  showNewPersonDialog.value = true;
};

const addNewPerson = (person) => {
  const entityUuid = uuid.v4();

  store.commit(
    'wiki/addEntity',
    wikiEntity(entityUuid, person.fullname, person.start.getFullYear(), person.end.getFullYear()),
  );
  closeNewPersonDialog();
  visibleItem.value = entityUuid;
};

const openSaveCollectionDialog = () => {
  showCollectionDialog.value = true;
};

const closeCollectionDialog = () => {
  showCollectionDialog.value = false;
};
</script>
