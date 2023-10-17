<template>
  <div class="d-flex justify-space-around">
    <v-btn
      color="primary"
      density="compact"
    >
    {{ curLanguage }}

      <v-menu activator="parent">
        <v-list>
          <v-list-item
            v-for="(language, index) in languages"
            :key="index"
            :value="index"
          >
            <v-list-item-title @click="changeLanguage(language)">{{ $t(`languages.${language}`) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </div>
</template>

<script setup>
import { inject, onBeforeMount,computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale: i18nlocale, t: $t } = useI18n();
const $cookies = inject('$cookies');
const curLanguage = computed(() => $t(`languages.${i18nlocale.value}`));

const languages = ['ca', 'es', 'en'];

const changeLanguage = (newLanguage) => {
  if (newLanguage === i18nlocale.value) {
    return;
  }
  i18nlocale.value = newLanguage;
  $cookies.set('locale', i18nlocale.value);
  // setLanguageLabel();
};

onBeforeMount(() => {
  // setLanguageLabel();
});
</script>
