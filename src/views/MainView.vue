<template>
  <v-container fluid>
    <main-toolbar
      :view="viewToggle"
      @selected="selected"
      @switch-view="switchView"
      @new-person="newPerson"
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
    <router-view 
      :view="viewToggle"
      :visible-item="visibleItem"
      />
    <person-dialog
      v-if="showNewPersonDialog"
      @add="addNewPerson"
      @close="closeNewPersonDialog"
    />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { uuid } from "vue-uuid";

import dayjs from 'dayjs';
import parseInfo from 'infobox-parser';

import { TIMELINE } from '../global/const';
import { wikiEntity } from '../store/modules/wiki';

import MainDrawer from '../components/MainDrawer.vue';
import MainToolbar from '../components/toolbar/MainToolbar.vue';
import PersonDialog from '../components/PersonDialog.vue';

const nowTimeout = 0;
const snackTimeout = 6000;
const loading = ref(false);
const view = ref(TIMELINE);

const { t: $t } = useI18n();
const store = useStore();

const showNewPersonDialog = ref(false);
const visibleItem = ref('');

const viewToggle = computed(() => view.value);
const switchView = (newView) => { view.value = newView };

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
      wikiEntity(item.value, item.title, startDate.getFullYear(), endDate.getFullYear())
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

const newPerson = () => {
  showNewPersonDialog.value = true;
};

const addNewPerson = (person) => {
  const entityUuid = uuid.v4();

  store.commit(
    'wiki/addEntity',
    wikiEntity(entityUuid, person.fullname, person.start.getFullYear(), person.end.getFullYear())
  );
  closeNewPersonDialog();
  visibleItem.value = entityUuid;
};
</script>
