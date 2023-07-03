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
          <span class="headline">{{ $t('login.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-row wrap>
              <v-col xs12>
                <v-text-field
                  v-model="username"
                  tabindex="-1"
                  type="email"
                  required
                  :label="usernameLabel"
                  @keyup.enter="loginUser"
                />
              </v-col>
              <v-col xs12>
                <v-text-field
                  v-model="password"
                  tabindex="-2"
                  type="password"
                  required
                  :label="passwordLabel"
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
            <v-row wrap>
              <v-col xs12>
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
              <v-col xs12>
                <v-btn
                  color="blue darken-1"
                  text
                  tabindex="-4"
                  @click.stop="close"
                >
                  {{ $t('global.close') }}
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  tabindex="-3"
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

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'LoginComponent',
  emits: ['close'],
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
      return this.username.length > 0 && this.password.length > 0;
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
    ...mapMutations(['snackMessage']),
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
      this.api
        .recoverPassword(this.username)
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
