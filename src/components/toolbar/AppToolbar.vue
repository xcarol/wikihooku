<template>
  <v-app-bar
    theme="dark"
  >
    <home-button @home="home" />
    <feedback-button @feedback="feedback" />
    <help-button @help="help" />
    <v-spacer />
    <p class="text-button font-weight-bold">{{ title }}</p>
    <v-spacer />
    <app-toolbar-menu
      @login="login"
      @logout="logout"
      @register="register"
    />
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import HomeButton from './HomeButton.vue';
import FeedbackButton from './FeedbackButton.vue';
import AppToolbarMenu from './AppToolbarMenu.vue';
import HelpButton from './HelpButton.vue';

const emits = defineEmits(['login', 'logout', 'register', 'home', 'feedback', 'help']);
const feedback = () => emits('feedback');
const help = () => emits('help');
const home = () => emits('home');
const login = () => emits('login');
const logout = () => emits('logout');
const register = () => emits('register');

const store = useStore();

const title = computed(() => store.getters.viewTitle);
</script>
