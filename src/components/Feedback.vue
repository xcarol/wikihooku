<template>
  <v-row
    row
    justify-center
  >
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      :fullscreen="$vuetify.display.xs"
      scrollable
      @keydown="closeIfEscape"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('feedback.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-row wrap>
              <v-col
                v-if="anonymousUser"
                cols="12"
              >
                <v-text-field
                  v-model="email"
                  type="text"
                  required
                  :label="emailLabel"
                  :error-messages="emailErrors"
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
                  :error-messages="feedbackErrors"
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
            tabindex="5"
            @click.stop="close"
          >
            {{ $t('global.close') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            tabindex="4"
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

<script>
import VueRecaptcha from 'vue3-recaptcha2';
import { mapGetters, mapMutations } from 'vuex';
import { useField } from 'vee-validate';
import * as yup from 'yup';
import { MIN_FEEDBACK_LEN } from '../global/const';

export default {
  name: 'FeedbackComponent',
  components: {
    VueRecaptcha,
  },
  emits: ['close'],
  data: () => ({
    email: '',
    feedback: '',
    errorMessage: '',
    loading: false,
    showDialog: true,
    recaptchaKey: import.meta.env.VITE_RECAPTCHA_KEY,
    recaptchaResponse: null,
    emailErrors: [],
    emailRules: [],
    feedbackErrors: [],
    feedbackRules: [],
  }),
  computed: {
    ...mapGetters({
      loggedUser: 'session/isLoggedIn',
      user: 'session/user',
    }),
    anonymousUser() {
      return this.loggedUser === false;
    },
    canSendFeedback() {
      if (this.anonymousUser) {
        return (
          this.email &&
          this.email.length > 0 &&
          this.feedback &&
          this.feedback.length > 0 &&
          this.recaptchaResponse !== null
        );
      }

      return this.feedback ? this.feedback.length > 0 : 0;
    },
    emailLabel() {
      return this.$t('feedback.email');
    },
    feedbackLabel() {
      return this.$t('feedback.feedback');
    },
  },
  watch: {
    showDialog(newValue) {
      if (newValue === false) {
        this.close();
      }
    },
  },
  mounted() {
    const { value: email, errorMessage: emailError } = useField('email');
    const { value: feedback, errorMessage: feedbackError } = useField('feedback');

    this.email = email;
    this.emailErrors = emailError;

    this.emailRules = [
      async (value) => {
        try {
          await yup.string().required().email().validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];

    this.feedback = feedback;
    this.feedbackErrors = feedbackError;

    this.feedbackRules = [
      async (value) => {
        try {
          await yup
            .string()
            .required()
            .min(
              MIN_FEEDBACK_LEN,
              this.$t('feedback.feedbackLength').replace('%s', MIN_FEEDBACK_LEN)
            )
            .validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];
  },
  methods: {
    ...mapMutations(['snackMessage']),
    async sendFeedback() {
      this.errorMessage = '';

      this.loading = true;
      this.api
        .sendFeedback(this.email || this.user.email, this.feedback)
        .then(() => {
          this.snackMessage(this.$t('feedback.sendsuccesfully'));
          this.close();
        })
        .catch((error) => {
          this.loading = false;
          this.errorMessage = this.$t(this.api.getErrorMessage(error));
        });
    },
    close() {
      this.$emit('close');
    },
    closeIfEscape(key) {
      if (key.keyCode === 27) {
        this.close();
      }
    },
    verifyCaptcha(response) {
      this.recaptchaResponse = response;
    },
    expireRecaptcha() {
      this.recaptchaResponse = null;
    },
  },
};
</script>
