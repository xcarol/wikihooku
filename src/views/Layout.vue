<template>
  <v-container fluid>
    <drawer />
    <toolbar
      :view="viewToggle"
      @selected="selected"
      @switch-view="switchView"
      @register="register"
      @login="showLogin = true"
      @feedback="showFeedback = true"
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
    <v-layout
      justify-start
      align-start
    >
      <router-view :view="viewToggle" />
      <v-btn
        fixed
        dark
        fab
        bottom
        right
        small
        color="primary"
        :icon="'$add'"
        @click.stop="newPerson"
      />
    </v-layout>
  </v-container>
</template>

<script>
import dayjs from 'dayjs';
import parseInfo from 'infobox-parser';
import { mapGetters, mapActions, mapMutations } from 'vuex';

import { wikiEntity } from '../store/modules/wiki';
import { TIMELINE, NO_PAGE_ID } from '../global/const';
import PersonForm from '../components/PersonForm.vue';

import Drawer from '../components/Drawer.vue';
import Toolbar from '../components/Toolbar.vue';
import Feedback from '../components/Feedback.vue';
import Register from '../components/auth/Register.vue';
import Login from '../components/auth/Login.vue';

export default {
  name: 'LayoutView',
  components: {
    Drawer,
    Toolbar,
    Register,
    Login,
    Feedback,
    PersonForm,
  },
  data: () => ({
    showRegister: false,
    showLogin: false,
    showFeedback: false,
    snackTimeout: 6000,
    now: 0,
    view: TIMELINE,
    loading: false,
    showNewPersonForm: false,
  }),
  computed: {
    ...mapGetters({
      snackMessage: 'snackMessage',
      loggedUser: 'session/isLoggedIn',
    }),
    errorMessage() {
      if (this.snackMessage.length) {
        this.resetSnackMessage(this.snackTimeout);
      }
      return this.snackMessage;
    },
    viewToggle() {
      return this.view;
    },
  },
  methods: {
    ...mapActions({
      resetSnackMessage: 'resetSnackMessage',
    }),
    ...mapMutations({
      setSnackMessage: 'snackMessage',
      addEntity: 'wiki/addEntity',
    }),
    clearErrorMessage() {
      this.resetSnackMessage(this.now);
    },
    closeRegister() {
      this.showRegister = false;
    },
    closeLogin() {
      this.showLogin = false;
      if (this.loggedUser) {
        this.$router.go();
      }
    },
    closeFeedback() {
      this.showFeedback = false;
    },
    register() {
      this.showRegister = true;
    },
    async selected(item) {
      this.loading = true;
      let startDate;
      let endDate = new Date();

      try {
        const infoBox = parseInfo(item.content);

        if (
          infoBox.general.birthDate
          && infoBox.general.birthDate.date
          && dayjs(infoBox.general.birthDate.date).isValid()
        ) {
          startDate = new Date(infoBox.general.birthDate.date);
        } else {
          throw new Error(this.$t('character.noBirthDateFound'));
        }

        if (
          infoBox.general.deathDate
          && infoBox.general.birthDate.date
          && dayjs(infoBox.general.birthDate.date).isValid()
        ) {
          endDate = new Date(infoBox.general.deathDate.date);
        }

        this.addEntity(
          wikiEntity(item.value, item.text, startDate.getFullYear(), endDate.getFullYear()),
        );
      } catch (error) {
        this.setSnackMessage(error);
      }
      this.loading = false;
    },
    newPerson() {
      this.showNewPersonForm = true;
    },
    addNewPerson(person) {
      this.addEntity(
        wikiEntity(
          NO_PAGE_ID,
          person.fullname,
          person.start.getFullYear(),
          person.end.getFullYear(),
        ),
      );
      this.closeNewPersonForm();
    },
    closeNewPersonForm() {
      this.showNewPersonForm = false;
    },
    switchView(view) {
      this.view = view;
    },
  },
};
</script>
