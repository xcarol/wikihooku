<template>
  <v-row justify="center">
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      :fullscreen="$vuetify.display.xs"
      scrollable
      @keydown="closeIfEscape"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('login.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="username"
                  type="text"
                  required
                  :label="usernameLabel"
                  :rules="usernameRules"
                  @keyup.enter="loginUser"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  type="password"
                  required
                  :label="passwordLabel"
                  :rules="passwordRules"
                  @keyup.enter="loginUser"
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
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-btn
                  text
                  color="secondary"
                  :loading="recovering"
                  :disabled="!canRecoverPassword"
                  @click.stop="recoverPassword"
                >
                  {{ $t('login.recoverPassword') }}
                </v-btn>
              </v-col>
              <v-col cols="12">
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
                  :disabled="!canLogin"
                  @click.stop="loginUser"
                >
                  {{ $t('login.button') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApi } from '../../plugins/api';
import { useStore } from 'vuex';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

const emit = defineEmits(['close'])
const { commit, dispatch } = useStore();
const { t: $t } = useI18n();
const api = useApi();

const showDialog = true;
let errorMessage = ref('');
let loading = false;
let recovering = false;

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

const passwordRules = [
  async (value) => {
    try {
      await yup.string().required().validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];

const { value: username, meta: usernameMeta } = useField('username', usernameRules);
const { value: password, meta: passwordMeta } = useField('password', passwordRules);

const canRecoverPassword = computed(() => usernameMeta.valid && username.value?.length > 0);
const canLogin = computed(
  () =>
    usernameMeta.valid &&
    username.value?.length > 0 &&
    passwordMeta.valid &&
    password.value?.length > 0
);
const usernameLabel = computed(() => $t('login.username'));
const passwordLabel = computed(() => $t('login.password'));

const snackMessage = (message) => {
  commit('snackMessage', message);
};

const loginUser = async () => {
  errorMessage.value = '';

  loading = true;
  try {
    await dispatch('session/login', {
      username: username.value,
      password: password.value,
    });
    close();
  } catch (error) {
    loading = false;
    errorMessage.value = $t(api.getErrorMessage(error));
  }
};

const recoverPassword = async () => {
  errorMessage.value = '';

  recovering = true;
  try {
    await api.recoverPassword(username);
    snackMessage($t('login.recovered'));
    close();
  } catch (error) {
    recovering = false;
    errorMessage.value = $t(api.getErrorMessage(error));
    error.value = true;
  }
};

const close = () => {
  emit('close');
};

const closeIfEscape = (key) => {
  if (key.keyCode === 27) {
    close();
  }
};
</script>
