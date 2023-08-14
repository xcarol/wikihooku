<template>
  <v-container fluid>
    <toolbar
      :view="viewToggle"
      @selected="selected"
      @switch-view="switchView"
      @register="openRegister"
      @login="openLogin"
      @feedback="openFeedback"
    />
    <v-overlay
      :absolute="true"
      :value="loading"
    >
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </v-overlay>
    <feedback
      v-if="showFeedback"
      @close="closeFeedback"
    />
    <login
      v-if="showLogin"
      @close="closeLogin"
    />
    <register
      v-if="showRegister"
      @close="closeRegister"
    />
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
    <person-form
      v-if="showNewPersonForm"
      @add="addNewPerson"
      @close="closeNewPersonForm"
    />
    <drawer />
    <router-view :view="viewToggle" />
    <v-btn
      position="fixed"
      location="bottom right"
      size="small"
      color="primary"
      :icon="'$add'"
      class="ma-2"
      @click.stop="newPerson"
    />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import dayjs from 'dayjs';
import parseInfo from 'infobox-parser';

import { wikiEntity } from '../store/modules/wiki';
import { TIMELINE, NO_PAGE_ID } from '../global/const';
import PersonForm from '../components/PersonForm.vue';

import Drawer from '../components/Drawer.vue';
import Toolbar from '../components/Toolbar.vue';
import Feedback from '../components/Feedback.vue';
import Register from '../components/auth/Register.vue';
import Login from '../components/auth/Login.vue';

const nowTimeout = 0;
const snackTimeout = 6000;
const loading = ref(false);
const view = ref(TIMELINE);
const showFeedback = ref(false);
const showLogin = ref(false);
const showNewPersonForm = ref(false);
const showRegister = ref(false);

const { t: $t } = useI18n();
const store = useStore();

const viewToggle = computed(() => view.value);
const switchView = (newView) => (view.value = newView);

const snackMessage = computed(() => store.state.snackMessage);

const errorMessage = computed(() => {
  if (snackMessage.value?.length) {
    store.dispatch('resetSnackMessage', snackTimeout);
  }
  return snackMessage.value || '';
});

const clearErrorMessage = () => {
  resetSnackMessage(nowTimeout);
};

const openFeedback = () => {
  showFeedback.value = true;
};

const closeFeedback = () => {
  showFeedback.value = false;
};

const openLogin = () => {
  showLogin.value = true;
};

const closeLogin = () => {
  showLogin.value = false;
};

const newPerson = () => {
  showNewPersonForm.value = true;
};

const addNewPerson = (person) => {
  store.commit(
    'wiki/addEntity',
    wikiEntity(NO_PAGE_ID, person.fullname, person.start.getFullYear(), person.end.getFullYear())
  );
  closeNewPersonForm();
};
const closeNewPersonForm = () => {
  showNewPersonForm.value = false;
};

const openRegister = () => {
  showRegister.value = true;
};

const closeRegister = () => {
  showRegister.value = false;
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
  } catch (error) {
    store.commit('snackMessage', error.message);
  }
  loading.value = false;
};
</script>
