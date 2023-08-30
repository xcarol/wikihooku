<template>
  <v-app-bar
    clipped-left
    theme="dark"
    app
  >
    <home-button @home="home" />
    <feedback-button @feedback="feedback" />
    <v-spacer />
    <toolbar-menu
      @logout="logout"
      @register="register"
    />
  </v-app-bar>
</template>

<script setup>
import HomeButton from './HomeButton.vue';
import FeedbackButton from './FeedbackButton.vue';
import ToolbarMenu from './ToolbarMenu.vue';

const emits = defineEmits(['logout', 'register', 'home', 'feedback']);
const feedback = () => emits('feedback');
const home = () => emits('home');
const logout = () => emits('logout');
const register = () => emits('register');
</script>
