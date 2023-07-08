<template>
  <v-flex>
    <!-- <v-dialog
      v-model="show"
      width="500"
      :fullscreen="$vuetify.breakpoint.xsOnly"
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
            <v-layout wrap>
              <v-flex xs12>
                <ValidationProvider
                  name="password"
                  rules="min:8|required"
                >
                  <v-text-field
                    ref="password"
                    v-model="password"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="1"
                    type="password"
                    :label="passwordLabel"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="resetPassword"
                  />
                </ValidationProvider>
              </v-flex>
              <v-flex xs12>
                <ValidationProvider
                  name="passwordRepeat"
                  rules="min:8|required|confirmed:password"
                >
                  <v-text-field
                    v-model="passwordRepeat"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="2"
                    type="password"
                    :label="passwordLabelRepeat"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="resetPassword"
                  />
                </ValidationProvider>
              </v-flex>
              <v-flex xs12>
                <vue-recaptcha
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
            tabindex="4"
            :loading="loading"
            :disabled="!canReset"
            @click.stop="resetPassword"
          >
            {{ $t('resetPassword.button') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </v-flex>
</template>

<script>
// import VueRecaptcha from 'vue-recaptcha';
import { mapActions } from 'vuex';

export default {
  components: {
    // VueRecaptcha,
  },
  data() {
    return {
      password: '',
      passwordRepeat: '',
      recaptchaKey: import.meta.env.VITE_RECAPTCHA_KEY,
      recaptchaResponse: null,
      loading: false,
      show: true,
      errorMessage: '',
    };
  },
  computed: {
    canReset() {
      return this.password.length > 0
        && this.passwordRepeat.length > 0
        && this.passwordEqual
        && this.recaptchaResponse !== null;
    },
    passwordLabel() {
      return this.$t('resetPassword.password');
    },
    passwordLabelRepeat() {
      return this.$t('resetPassword.passwordRepeat');
    },
    passwordEqual() {
      return this.password === this.passwordRepeat;
    },
  },
  created() {
    const { lang, email, token } = this.$route.query;
    this.$i18n.locale = lang;
    this.email = email;
    this.token = token;
  },
  methods: {
    ...mapActions({
      reset: 'session/resetPassword',
    }),
    async resetPassword() {
      this.errorMessage = '';

      this.loading = true;
      this.reset({
        email: this.email,
        password: this.password,
        token: this.token,
      })
        .then(() => {
          this.goHome();
        })
        .catch((error) => {
          this.loading = false;
          this.errorMessage = this.$t(this.api.getErrorMessage(error));
        });
    },
    goHome() {
      this.$router.push({ path: '/' });
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
