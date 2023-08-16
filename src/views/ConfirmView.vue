<template>
  <v-dialog
    v-model="confirmSuccess"
    width="500"
    :fullscreen="$vuetify.display.xs"
    scrollable
    persistent
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        {{ $t('registerConfirmation.successTitle') }}
      </v-card-title>

      <v-card-text>
        {{ $t('registerConfirmation.successBody') }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click.stop="goHome"
        >
          {{ $t('global.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="confirmError"
    width="500"
    :fullscreen="$vuetify.display.xs"
    scrollable
    persistent
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        {{ $t('registerConfirmation.errorTitle') }}
      </v-card-title>

      <v-card-text>
        {{ $t('registerConfirmation.errorBody') }}
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click.stop="goHome"
        >
          {{ $t('global.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { dispatch } = useStore();
const { query } = useRoute();
const router = useRouter();
const { locale: i18nlocale, t: $t } = useI18n();

const confirmSuccess = ref(false);
const confirmError = ref(false);

const { lang, email, token } = query;
i18nlocale.value = lang;

onMounted(async () => {
  try {
    await dispatch('session/confirm', {
      email,
      token,
    });
    confirmSuccess.value = true;
  } catch (error) {
    confirmError.value = true;
  }
});

const goHome = () => {
  router.push({ path: '/' });
};
</script>
