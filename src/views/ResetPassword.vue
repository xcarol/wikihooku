<template>
  <v-dialog
    v-model="showDialog"
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
        <span class="headline">{{ $t('resetPassword.title') }}</span>
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md>
          <v-row wrap>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                type="password"
                :label="passwordLabel"
                :rules="passwordRules"
                @keyup.enter="resetPassword"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="passwordRepeat"
                type="password"
                :label="passwordLabelRepeat"
                :rules="passwordRepeatRules"
                @keyup.enter="resetPassword"
              />
            </v-col>
            <v-col cols="12">
              <vue-recaptcha
                :sitekey="recaptchaKey"
                @verify="verifyCaptcha"
                @expire="expireRecaptcha"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-alert
        :model-value="errorMessage !== ''"
        closable
        variant="outlined"
        type="error"
      >
        {{ errorMessage }}
      </v-alert>
      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          :loading="loading"
          :disabled="!canReset()"
          @click.stop="resetPassword"
        >
          {{ $t('resetPassword.button') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useField } from 'vee-validate';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import VueRecaptcha from 'vue3-recaptcha2';
import { useApi } from '../plugins/api';
import { MIN_PASSWORD_LEN } from '../global/const';

const { dispatch } = useStore();
const { query } = useRoute();
const { locale: i18nlocale, t: $t } = useI18n();
const api = useApi();
const router = useRouter();

const { lang, email, token } = query;
i18nlocale.value = lang;

const passwordRules = [
  async (value) => {
    try {
      await yup
        .string()
        .required()
        .min(MIN_PASSWORD_LEN, 'register.passwordMinLenght')
        .validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];

const { value: password, meta: passwordMeta } = useField('password', passwordRules);

const passwordRepeatRules = [
  async (value) => {
    try {
      await yup
        .string()
        .test('passwords-match', 'register.passwordsMatch', (passwordValue) => password.value === passwordValue)
        .required()
        .validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];

const { value: passwordRepeat, meta: passwordRepeatMeta } = useField(
  'passwordRepeat',
  passwordRepeatRules
);

const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;
const recaptchaResponse = ref(null);
const loading = ref(false);
const showDialog = ref(true);
const errorMessage = ref('');

const goHome = () => {
  router.push({ path: '/' });
};

const verifyCaptcha = (response) => {
  recaptchaResponse.value = response;
};

const expireRecaptcha = () => {
  recaptchaResponse.value = null;
};

const canReset = () =>
  passwordMeta.valid &&
  password.value?.length > 0 &&
  passwordRepeatMeta.valid &&
  passwordRepeat.value?.length > 0 &&
  password.value === passwordRepeat.value &&
  recaptchaResponse.value !== null;

const passwordLabel = $t('resetPassword.password');
const passwordLabelRepeat = $t('resetPassword.passwordRepeat');

const resetPassword = async () => {
  errorMessage.value = '';

  loading.value = true;
  try {
    await dispatch('session/resetPassword', {
      email,
      password: password.value,
      token,
    });
    goHome();
  } catch (error) {
    loading.value = false;
    errorMessage.value = $t(api.getErrorMessage(error));
  }
};
</script>
