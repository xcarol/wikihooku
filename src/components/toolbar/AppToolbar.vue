<template>
  <v-app-bar
    theme="dark"
  >
    <home-button @home="home" />
    <feedback-button @feedback="feedback" />
    <v-spacer />
    <toolbar-menu
      @login="login"
      @logout="logout"
      @register="register"
    />
  </v-app-bar>
</template>

<script setup>
import HomeButton from './HomeButton.vue';
import FeedbackButton from './FeedbackButton.vue';
import ToolbarMenu from './ToolbarMenu.vue';

const emits = defineEmits(['login', 'logout', 'register', 'home', 'feedback']);
const feedback = () => emits('feedback');
const home = () => emits('home');
const login = () => emits('login');
const logout = () => emits('logout');
const register = () => emits('register');
</script>
