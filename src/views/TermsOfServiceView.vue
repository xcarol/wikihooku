<template>
  <v-card flat>
    <div v-if="curLocale === 'ca'">
      <terms-ca />
    </div>
    <div v-else-if="curLocale === 'es'">
      <terms-es />
    </div>
    <div v-else>
      <terms-en />
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import TermsCa from '../assets/terms/caTerms.vue';
import TermsEs from '../assets/terms/esTerms.vue';
import TermsEn from '../assets/terms/enTerms.vue';

const { locale, t: $t } = useI18n();
const store = useStore();

const curLocale = computed(() => {
  store.commit('viewTitle', $t('global.terms'));
  return locale.value;
});
</script>
