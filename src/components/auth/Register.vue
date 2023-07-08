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
                  :error-messages="fullnameErrors"
                  :rules="fullnameRules"
                  @keyup.enter="registerUser"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="username"
                  type="email"
                  :label="usernameLabel"
                  :error-messages="usernameErrors"
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
                  :error-messages="passwordErrors"
                  :rules="passwordRules"
                  @keyup.enter="registerUser"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="passwordRepeat"
                  type="password"
                  :label="passwordLabelRepeat"
                  :error-messages="passwordRepeatErrors"
                  :rules="passwordRepeatRules"
                  @keyup.enter="registerUser"
                />
              </v-col>
              <v-col cols="12">
                <vue-recaptcha
                  :sitekey="recaptchaKey"
                  @verify="verifyCaptcha"
                  @expired="expireRecaptcha"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-alert
          :model-value="errorMessage !== ''"
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

<script>
import VueRecaptcha from 'vue3-recaptcha2';
import { mapActions } from 'vuex';
import { useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  name: 'RegisterComponent',
  components: {
    VueRecaptcha,
  },
  emits: { close: null },
  data: () => ({
    fullname: '',
    username: '',
    password: '',
    passwordRepeat: '',
    errorMessage: '',
    loading: false,
    showDialog: true,
    recaptchaKey: import.meta.env.VITE_RECAPTCHA_KEY,
    recaptchaResponse: null,
    registerSuccess: false,
    fullnameErrors: [],
    fullnameRules: [],
    usernameErrors: [],
    usernameRules: [],
    passwordErrors: [],
    passwordRules: [],
    passwordRepeatErrors: [],
    passwordRepeatRules: [],
  }),
  computed: {
    canRegister() {
      return (
        this.fullname && this.fullname.length > 0
        && this.username && this.username.length > 0
        && this.password && this.password.length > 0
        && this.passwordRepeat && this.passwordRepeat.length > 0
        && this.passwordEqual
        && this.recaptchaResponse !== null
      );
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
  mounted() {
    const { value: fullname, errorMessage: fullnameError } = useField('fullname');
    const { value: username, errorMessage: usernameError } = useField('username');
    const { value: password, errorMessage: passwordError } = useField('password');
    const { value: passwordRepeat, errorMessage: passwordRepeatError } = useField('passwordRepeat');

    this.fullname = fullname;
    this.fullnameErrors = fullnameError;
    this.username = username;
    this.usernameErrors = usernameError;
    this.password = password;
    this.passwordErrors = passwordError;
    this.passwordRepeat = passwordRepeat;
    this.passwordRepeatErrors = passwordRepeatError;

    this.fullnameRules = [
      async (value) => {
        try {
          await yup.string().required().max(100, this.$t('register.fullnameMaxLength')).validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];

    this.usernameRules = [
      async (value) => {
        try {
          await yup.string().required().email().validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];

    this.passwordRules = [
      async (value) => {
        try {
          await yup.string().required().min(8, this.$t('register.passwordMinLenght')).validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];

    this.passwordRepeatRules = [
      async (value) => {
        try {
          await yup.string().test('passwords-match', this.$t('register.passwordsMatch'), (value) => this.password === value).required().validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];
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
