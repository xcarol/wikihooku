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
          <span class="headline">{{ $t('register.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <ValidationProvider
                  name="fullname"
                  rules="required|max:100"
                >
                  <v-text-field
                    v-model="fullname"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="1"
                    :counter="100"
                    :label="fullnameLabel"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="registerUser"
                  />
                </ValidationProvider>
              </v-flex>
              <v-flex xs12>
                <ValidationProvider
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="username"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="2"
                    type="email"
                    :label="usernameLabel"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="registerUser"
                  />
                </ValidationProvider>
              </v-flex>
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
                    tabindex="3"
                    type="password"
                    :label="passwordLabel"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="registerUser"
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
                    tabindex="4"
                    type="password"
                    :label="passwordLabelRepeat"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="registerUser"
                  />
                </ValidationProvider>
              </v-flex>
              <v-flex xs12>
                <vue-recaptcha
                  :sitekey="recaptchaKey"
                  :load-recaptcha-script="true"
                  tabindex="6"
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
            tabindex="8"
            @click.stop="close"
          >
            {{ $t('global.close') }}
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            tabindex="7"
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
      :fullscreen="$vuetify.breakpoint.xsOnly"
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
  </v-layout>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import { mapActions } from 'vuex';

export default {
  name: 'Register',
  components: {
    VueRecaptcha,
  },
  data: () => ({
    fullname: '',
    username: '',
    password: '',
    passwordRepeat: '',
    errorMessage: '',
    loading: false,
    showDialog: true,
    recaptchaKey: process.env.VUE_APP_RECAPTCHA_KEY,
    recaptchaResponse: null,
    registerSuccess: false,
  }),
  computed: {
    canRegister() {
      return this.fullname.length > 0
        && this.username.length > 0
        && this.password.length > 0
        && this.passwordRepeat.length > 0
        && this.passwordEqual
        && this.recaptchaResponse !== null;
    },
    fullnameLabel() {
      return this.$t('register.fullname');
    },
    usernameLabel() {
      return this.$t('register.username');
    },
    passwordLabel() {
      return this.$t('register.password');
    },
    passwordLabelRepeat() {
      return this.$t('register.passwordRepeat');
    },
    passwordEqual() {
      return this.password === this.passwordRepeat;
    },
  },
  watch: {
    showDialog(newValue) {
      if (newValue === false && this.registerSuccess === false) {
        this.close();
      }
    },
  },
  methods: {
    ...mapActions({
      register: 'session/register',
    }),
    async registerUser() {
      this.errorMessage = '';

      this.loading = true;
      this.register({
        fullname: this.fullname,
        username: this.username,
        password: this.password,
      })
        .then(() => {
          this.registerSuccess = true;
          this.showDialog = false;
        })
        .catch((error) => {
          this.loading = false;
          this.errorMessage = this.$t(this.api.getErrorMessage(error));
          this.error = true;
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
