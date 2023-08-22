<template>
  <v-container fluid>
    <app-toolbar
      :view="viewToggle"
      @selected="selected"
      @switch-view="switchView"
      @register="openRegisterDialog"
      @login="openLoginDialog"
      @feedback="openFeedbackDialog"
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
    <feedback-dialog
      v-if="showFeedbackDialog"
      @close="closeFeedbackDialog"
    />
    <login-dialog
      v-if="showLoginDialog"
      @close="closeLoginDialog"
    />
    <register-dialog
      v-if="showRegisterDialog"
      @close="closeRegisterDialog"
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
    <app-drawer />
    <router-view :view="viewToggle" />
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import dayjs from 'dayjs';
import parseInfo from 'infobox-parser';

import { TIMELINE } from '../global/const';
import { wikiEntity } from '../store/modules/wiki';

import AppDrawer from '../components/AppDrawer.vue';
import AppToolbar from '../components/AppToolbar.vue';
import FeedbackDialog from '../components/FeedbackDialog.vue';
import RegisterDialog from '../components/auth/RegisterDialog.vue';
import LoginDialog from '../components/auth/LoginDialog.vue';

const nowTimeout = 0;
const snackTimeout = 6000;
const loading = ref(false);
const view = ref(TIMELINE);
const showFeedbackDialog = ref(false);
const showLoginDialog = ref(false);
const showRegisterDialog = ref(false);

const { t: $t } = useI18n();
const store = useStore();

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

const openFeedbackDialog = () => {
  showFeedbackDialog.value = true;
};

const closeFeedbackDialog = () => {
  showFeedbackDialog.value = false;
};

const openLoginDialog = () => {
  showLoginDialog.value = true;
};

const closeLoginDialog = () => {
  showLoginDialog.value = false;
};

const openRegisterDialog = () => {
  showRegisterDialog.value = true;
};

const closeRegisterDialog = () => {
  showRegisterDialog.value = false;
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
