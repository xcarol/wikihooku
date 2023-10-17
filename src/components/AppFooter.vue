<template>
  <v-footer
    class="pa-0 flex-grow-0 flex-shrink-0"
    theme="dark"
  >
    <v-row no-gutters>
      <v-col
        class="text-left ma-4 me-auto"
        cols="12"
        sm="auto"
      >
        <span>
          {{ $t('footer.made') }}
          <v-icon size="small">
            <v-img
              :src="logoImg"
              width="100%"
              height="100%"
              class="logo"
              :inline="true"
              @click="goto('home')"
            />
          </v-icon>
        </span>
      </v-col>
      <v-col
        class="text-center ma-4"
        cols="12"
        sm="auto"
      >
        <router-link to="/legal-notice">
          {{ $t('footer.notice') }}
        </router-link>
      </v-col>
      <v-col
        class="text-center ma-4 like-link"
        cols="12"
        sm="auto"
      >
        <language-selector />
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
import LanguageSelector from './LanguageSelector.vue';
import VueIcon from '../assets/vue.svg';

const logoImg = VueIcon;
</script>

<style scoped>
.like-link {
  cursor: pointer;
}
</style>
