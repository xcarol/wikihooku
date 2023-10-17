<template>
  <v-app>
    <app-toolbar
      @home="home"
      @register="openRegisterDialog"
      @login="openLoginDialog"
      @feedback="openFeedbackDialog"
      @logout="logout"
    />
    <v-main>
      <router-view />
    </v-main>
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
    <app-footer />
  </v-app>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import { useTheme } from 'vuetify';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const AppToolbar = defineAsyncComponent(() => import('./components/toolbar/AppToolbar.vue'));
const FeedbackDialog = defineAsyncComponent(() => import('./components/FeedbackDialog.vue'));
const RegisterDialog = defineAsyncComponent(() => import('./components/auth/RegisterDialog.vue'));
const LoginDialog = defineAsyncComponent(() => import('./components/auth/LoginDialog.vue'));
const AppFooter = defineAsyncComponent(() => import('./components/AppFooter.vue'));

const theme = useTheme();
const store = useStore();
const router = useRouter();

if (import.meta.env.VITE_THEME !== undefined) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    theme.global.name.value = event.matches ? 'dark' : 'light';
  });
}

const showFeedbackDialog = ref(false);
const showLoginDialog = ref(false);
const showRegisterDialog = ref(false);

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

const home = () => {
  router.push({ path: '/' });
};

const logout = () => {
  store.commit('session/reset');
  home();
};
</script>
