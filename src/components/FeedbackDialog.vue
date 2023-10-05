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
          <span class="headline">{{ $t('feedback.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-row>
              <v-col
                v-if="anonymousUser"
                cols="12"
              >
                <v-text-field
                  v-model="email"
                  type="text"
                  required
                  :label="emailLabel"
                  :rules="emailRules"
                  @keyup.enter="sendFeedback"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="feedback"
                  type="text"
                  required
                  :label="feedbackLabel"
                  :rules="feedbackRules"
                />
              </v-col>
              <v-col cols="12">
                <vue-recaptcha
                  v-if="anonymousUser"
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
            :disabled="!canSendFeedback"
            @click.stop="sendFeedback"
          >
            {{ $t('feedback.button') }}
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
import * as yup from 'yup';
import VueRecaptcha from 'vue3-recaptcha2';
import { MIN_FEEDBACK_LEN } from '../lib/const';
import { useApi } from '../plugins/api';

const emits = defineEmits(['close']);
const { t: $t } = useI18n();
const api = useApi();
const { getters, commit } = useStore();

const showDialog = ref(true);
const recaptchaResponse = ref(null);
const errorMessage = ref('');
const loading = ref(false);
const recaptchaKey = import.meta.env.VITE_RECAPTCHA_KEY;

const emailLabel = computed(() => $t('feedback.email'));
const feedbackLabel = computed(() => $t('feedback.feedback'));

const user = getters['session/user'];
const anonymousUser = getters['session/isLoggedIn'] === false;

const close = () => emits('close');

watch(showDialog, (val) => {
  if (val === false) {
    close();
  }
});

const verifyCaptcha = (response) => {
  recaptchaResponse.value = response;
};

const expireRecaptcha = () => {
  recaptchaResponse.value = null;
};

const emailRules = [
  async (value) => {
    try {
      await yup.string().required().email().validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];

const feedbackRules = [
  async (value) => {
    try {
      await yup
        .string()
        .required($t('this is a required field'))
        .min(MIN_FEEDBACK_LEN, $t('feedback.feedbackLength').replace('%s', MIN_FEEDBACK_LEN))
        .validate(value);
      return true;
    } catch (error) {
      return error.message;
    }
  },
];

const { value: email, meta: emailMeta } = useField('email', emailRules);
const { value: feedback, meta: feedbackMeta } = useField('feedback', feedbackRules);

const canSendFeedback = computed(() => {
  if (anonymousUser.value) {
    return (
      emailMeta.valid &&
      email.value?.length > 0 &&
      feedbackMeta.valid &&
      feedback.value?.length > 0 &&
      recaptchaResponse.value !== null
    );
  }
  return feedbackMeta.valid && feedback.value?.length > 0;
});

const snackMessage = (message) => {
  commit('snackMessage', message);
};

const sendFeedback = async () => {
  errorMessage.value = '';

  loading.value = true;
  try {
    await api.sendFeedback(email.value || user.email, feedback.value);
    snackMessage($t('feedback.sendsuccesfully'));
    close();
  } catch (error) {
    loading.value = false;
    errorMessage.value = $t(api.getErrorMessage(error));
  }
};
</script>
