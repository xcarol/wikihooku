<template>
  <v-card flat>
    <div v-if="curLocale === 'ca'">
      <help-ca />
    </div>
    <div v-else-if="curLocale === 'es'">
      <help-es />
    </div>
    <div v-else>
      <help-en />
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import HelpCa from '../assets/help/caHelp.vue';
import HelpEs from '../assets/help/esHelp.vue';
import HelpEn from '../assets/help/enHelp.vue';

const { locale } = useI18n();
const store = useStore();

const curLocale = computed(() => {
  store.commit('viewTitle', '');
  return locale.value;
});
</script>
