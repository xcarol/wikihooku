<template>
  <v-layout
    row
    justify-center
  >
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      scrollable
      @keydown="closeIfEscape"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('feedback.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex
                v-if="anonymousUser"
                xs12
              >
                <ValidationProvider
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="1"
                    type="email"
                    :label="emailLabel"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="sendFeedback"
                  />
                </ValidationProvider>
              </v-flex>
              <v-flex xs12>
                <ValidationProvider
                  name="feedback"
                  rules="min:30|required"
                >
                  <v-textarea
                    v-model="feedback"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="2"
                    type="feedback"
                    :label="feedbackLabel"
                    :error-messages="errors"
                    :success="valid"
                  />
                </ValidationProvider>
              </v-flex>
              <v-flex xs12>
                <vue-recaptcha
                  v-if="anonymousUser"
                  :sitekey="recaptchaKey"
                  :load-recaptcha-script="true"
                  tabindex="3"
                  @verify="verifyCaptcha"
                  @expired="expireRecaptcha"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-alert
          :value="errorMessage !== ''"
          dismissible
          outlined
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
  </v-layout>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Feedback',
  components: {
    VueRecaptcha,
  },
  data: () => ({
    email: '',
    feedback: '',
    errorMessage: '',
    loading: false,
    showDialog: true,
    recaptchaKey: process.env.VUE_APP_RECAPTCHA_KEY,
    recaptchaResponse: null,
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
        return this.email.length > 0
          && this.feedback.length > 0
          && this.recaptchaResponse !== null;
      }

      return this.feedback.length > 0;
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
  methods: {
    ...mapMutations([
      'snackMessage',
    ]),
    async sendFeedback() {
      this.errorMessage = '';

      this.loading = true;
      this.api.sendFeedback(this.email || this.user.email, this.feedback)
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
