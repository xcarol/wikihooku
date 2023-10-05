<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      :fullscreen="$vuetify.display.xs"
      scrollable
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('register.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="fullname"
                  type="text"
                  :counter="100"
                  :label="fullnameLabel"
                  :rules="fullnameRules"
                  @keyup.enter="registerUser"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="username"
                  type="email"
                  :label="usernameLabel"
                  :rules="usernameRules"
                  @keyup.enter="registerUser"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :ref="password"
                  v-model="password"
                  type="password"
                  :label="passwordLabel"
                  :rules="passwordRules"
                  @keyup.enter="registerUser"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="passwordRepeat"
                  type="password"
                  :label="passwordLabelRepeat"
                  :rules="passwordRepeatRules"
                  @keyup.enter="registerUser"
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
            @click.stop="close"
          >
            {{ $t('global.close') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :loading="loading"
            :disabled="!canRegister"
            @click.stop="registerUser"
          >
            {{ $t('register.button') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="registerSuccess"
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
          {{ $t('register.successTitle') }}
        </v-card-title>

        <v-card-text>
          {{ $t('register.successBody') }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click.stop="close"
          >
            {{ $t('global.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import VueRecaptcha from 'vue3-recaptcha2';
import * as yup from 'yup';
import { useApi } from '../../plugins/api';
import { MIN_PASSWORD_LEN, MAX_USER_NAME_LEN } from '../../lib/const';

const emits = defineEmits(['close']);
const { dispatch } = useStore();
const { t: $t } = useI18n();
const api = useApi();

const showDialog = ref(true);
const registerSuccess = ref(false);
const recaptchaResponse = ref(null);
const errorMessage = ref('');
const loading = ref(false);

const fullnameLabel = computed(() => $t('register.fullname'));
const usernameLabel = computed(() => $t('register.username'));
const passwordLabel = computed(() => $t('register.password'));
const passwordLabelRepeat = computed(() => $t('register.passwordRepeat'));

const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;

const fullnameRules = [
  async (value) => {
    try {
      await yup
        .string()
        .required()
        .max(MAX_USER_NAME_LEN, 'register.fullnameMaxLength')
        .validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];

const { value: fullname, meta: fullnameMeta } = useField('fullname', fullnameRules);

const usernameRules = [
  async (value) => {
    try {
      await yup.string().required().email().validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];

const { value: username, meta: usernameMeta } = useField('username', usernameRules);

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
        .test(
          'passwords-match',
          'register.passwordsMatch',
          (passwordValue) => password.value === passwordValue,
        )
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
  passwordRules,
);

const canRegister = computed(
  () =>
    fullnameMeta.valid &&
    fullname.value?.length > 0 &&
    usernameMeta.valid &&
    username.value?.length > 0 &&
    passwordMeta.valid &&
    password.value?.length > 0 &&
    passwordRepeatMeta.valid &&
    passwordRepeat.value?.length > 0 &&
    password.value === passwordRepeat.value &&
    recaptchaResponse.value !== null,
);

const registerUser = async () => {
  errorMessage.value = '';

  loading.value = true;
  try {
    await dispatch('session/register', {
      fullname: fullname.value,
      username: username.value,
      password: password.value,
    });

    registerSuccess.value = true;
    showDialog.value = false;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    errorMessage.value = $t(api.getErrorMessage(error));
  }
};

const verifyCaptcha = (response) => {
  recaptchaResponse.value = response;
};

const expireRecaptcha = () => {
  recaptchaResponse.value = null;
};

const close = () => emits('close');

watch(showDialog, (val) => {
  if (val === false) {
    close();
  }
});
</script>
