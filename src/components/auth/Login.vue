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
          <span class="headline">{{ $t('login.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <ValidationProvider
                  name="email"
                  rules="email|required"
                >
                  <v-text-field
                    v-model="username"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="1"
                    type="email"
                    :label="usernameLabel"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="loginUser"
                  />
                </ValidationProvider>
              </v-flex>
              <v-flex xs12>
                <ValidationProvider
                  name="password"
                  rules="min:8|required"
                >
                  <v-text-field
                    v-model="password"
                    slot-scope="{
                      errors,
                      valid
                    }"
                    tabindex="2"
                    type="password"
                    :label="passwordLabel"
                    :error-messages="errors"
                    :success="valid"
                    @keyup.enter="loginUser"
                  />
                </ValidationProvider>
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
          <v-container>
            <v-layout wrap>
              <v-flex xs12>
                <v-btn
                  text
                  color="secondary"
                  :loading="recovering"
                  :disabled="!canRecoverPassword"
                  @click.stop="recoverPassword"
                >
                  {{ $t('login.recoverPassword') }}
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  color="blue darken-1"
                  text
                  tabindex="4"
                  @click.stop="close"
                >
                  {{ $t('global.close') }}
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  tabindex="3"
                  :loading="loading"
                  :disabled="!canLogin"
                  @click.stop="loginUser"
                >
                  {{ $t('login.button') }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    errorMessage: '',
    loading: false,
    recovering: false,
    showDialog: true,
  }),
  computed: {
    ...mapGetters({
      user: 'session/user',
    }),
    canRecoverPassword() {
      return this.username.length > 0;
    },
    canLogin() {
      return this.username.length > 0
        && this.password.length > 0;
    },
    usernameLabel() {
      return this.$t('login.username');
    },
    passwordLabel() {
      return this.$t('login.password');
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
    ...mapActions({
      login: 'session/login',
    }),
    async loginUser() {
      this.errorMessage = '';

      this.loading = true;
      this.login({
        username: this.username,
        password: this.password,
      })
        .then(() => {
          if (this.user.locale) {
            this.$root.$i18n.locale = this.user.locale;
          }
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
    async recoverPassword() {
      this.errorMessage = '';

      this.recovering = true;
      this.api.recoverPassword(this.username)
        .then(() => {
          this.snackMessage(this.$t('login.recovered'));
          this.close();
        })
        .catch((error) => {
          this.recovering = false;
          this.errorMessage = this.$t(this.api.getErrorMessage(error));
          this.error = true;
        });
    },
  },
};
</script>
