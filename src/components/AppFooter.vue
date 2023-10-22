<!-- eslint-disable vuejs-accessibility/anchor-has-content -->
<template>
  <v-footer
    class="pa-0 flex-grow-0 flex-shrink-0"
    theme="dark"
  >
    <v-row no-gutters>
      <v-col
        class="text-left ma-4 me-auto align-center"
        cols="12"
        sm="auto"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="auto"
          >
            {{ $t('global.madewith') }}
          </v-col>
          <v-col
            v-for="(logo, index) in logos"
            :key="index"
            cols="12"
            sm="auto"
            class="ml-2"
          >
            <v-tooltip
              activator="parent"
              location="top"
              >{{ logo.name }}</v-tooltip
            >
            <a
              :href="logo.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-img
                :src="logo.img"
                class="v-icon"
              />
            </a>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        class="text-center ma-4"
        cols="12"
        sm="auto"
      >
        <router-link to="/terms-of-service">
          {{ $t('global.terms') }}
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
import GithubIcon from '../assets/github.png';
import MongodbIcon from '../assets/mongodb.ico';
import RenderIcon from '../assets/render.svg';
import SendgridIcon from '../assets/sendgrid.png';
import VueIcon from '../assets/vue.svg';
import VuetifyIcon from '../assets/vuetify.svg';

const logos = [
  {
    img: VueIcon,
    url: 'https://vuejs.org/',
    name: 'Vue',
  },
  {
    img: VuetifyIcon,
    url: 'https://vuetifyjs.com/',
    name: 'Vuetify',
  },
  {
    img: GithubIcon,
    url: 'https://github.com/xcarol/wikihooku/',
    name: 'GitHub',
  },
  {
    img: MongodbIcon,
    url: 'https://www.mongodb.com/',
    name: 'MongoDb',
  },
  {
    img: RenderIcon,
    url: 'https://render.com/',
    name: 'Render',
  },
  {
    img: SendgridIcon,
    url: 'https://sendgrid.com/',
    name: 'SendGrid',
  },
];
</script>

<style scoped>
.like-link {
  cursor: pointer;
}
</style>
