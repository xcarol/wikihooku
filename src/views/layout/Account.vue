<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-alert
        v-show="!accountVerified"
        type="error"
      >
        {{ $t('account.notVerified') }}
      </v-alert>
      <v-card flat>
        <v-card-title>
          <v-row>
            <v-col grow>
              <span class="headline">
                {{ $t('account.title') }}
              </span>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="locale"
                :items="locales"
                :label="$t('account.locale')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="fullname"
                type="text"
                :counter="100"
                :hint="fullnameHint"
                :label="fullnameLabel"
                :error-messages="fullnameErrors"
                :rules="fullnameRules"
                @keyup.enter="saveUser"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="currentPassword"
                type="password"
                :hint="$t('account.currentPasswordHint')"
                :label="currentPasswordLabel"
                :error-messages="currentPasswordErrors"
                :rules="currentPasswordRules"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPassword"
                type="password"
                :hint="newPasswordHint"
                :label="newPasswordLabel"
                :error-messages="newPasswordErrors"
                :rules="newPasswordRules"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPasswordRepeat"
                type="password"
                :hint="newPasswordRepeatHint"
                :label="newPasswordRepeatLabel"
                :error-messages="newPasswordRepeatErrors"
                :rules="newPasswordRepeatRules"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="saving"
            color="secondary"
            text
            tabindex="5"
            outlined
            :disabled="!canSave"
            @click.stop="save()"
          >
            {{ $t('global.save') }}
          </v-btn>
          <v-btn
            color="accent"
            text
            tabindex="6"
            @click.stop="goHome()"
          >
            {{ $t('global.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { useField } from 'vee-validate';
import * as yup from 'yup';
import { MAX_USER_NAME_LEN, MIN_PASSWORD_LEN } from '../../global/const';

export default {
  name: 'AccountView',
  data() {
    return {
      locale: '',
      saving: false,
      currentPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
      errorMessage: '',
      account: null,
      fullname: '',
      fullnameErrors: [],
      fullnameRules: [],
      currentPasswordErrors: [],
      currentPasswordRules: [],
      newPasswordErrors: [],
      newPasswordRules: [],
      newPasswordRepeatErrors: [],
      newPasswordRepeatRules: [],
    };
  },
  mounted() {
    const { value: fullname, errorMessage: fullnameError } = useField('fullname');
    const { value: currentPassword, errorMessage: currentPasswordError } =
      useField('currentPassword');
    const { value: newPassword, errorMessage: newPasswordError } = useField('newPassword');
    const { value: newPasswordRepeat, errorMessage: newPasswordRepeatError } =
      useField('newPassword');

    this.fullname = fullname;
    this.fullnameErrors = fullnameError;

    this.fullnameRules = [
      async (value) => {
        try {
          await yup
            .string()
            .required()
            .max(
              MAX_USER_NAME_LEN,
              this.$t('account.usernameLength').replace('%s', MAX_USER_NAME_LEN)
            )
            .validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];

    this.currentPassword = currentPassword;
    this.currentPasswordErrors = currentPasswordError;

    this.currentPasswordRules = [
      async (value) => {
        try {
          await yup
            .string()
            .required()
            .min(
              MIN_PASSWORD_LEN,
              this.$t('account.passwordLength').replace('%s', MIN_PASSWORD_LEN)
            )
            .validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];

    this.newPassword = newPassword;
    this.newPasswordErrors = newPasswordError;

    this.newPasswordRules = [
      async (value) => {
        try {
          await yup
            .string()
            .required()
            .min(
              MIN_PASSWORD_LEN,
              this.$t('account.passwordLength').replace('%s', MIN_PASSWORD_LEN)
            )
            .notOneOf([yup.ref('currentPassword')])
            .validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];

    this.newPasswordRepeat = newPasswordRepeat;
    this.newPasswordRepeatErrors = newPasswordRepeatError;

    this.newPasswordRepeatRules = [
      async (value) => {
        try {
          await yup
            .string()
            .required()
            .min(
              MIN_PASSWORD_LEN,
              this.$t('account.passwordLength').replace('%s', MIN_PASSWORD_LEN)
            )
            .oneOf([yup.ref('newPassword')])
            .validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];
  },
  computed: {
    ...mapGetters({
      user: 'session/user',
    }),
    isUsingSamePassword() {
      const same =
        (this.currentPassword !== '' || this.newPassword !== '') &&
        this.currentPassword === this.newPassword;

      return same;
    },
    newPasswordMatch() {
      return (
        (this.newPassword !== '' || this.newPasswordRepeat !== '') &&
        this.newPassword === this.newPasswordRepeat
      );
    },
    fullnameLabel() {
      return this.$t('account.name');
    },
    fullnameHint() {
      return this.$t('account.nameHint');
    },
    currentPasswordLabel() {
      return this.$t('account.currentPassword');
    },
    newPasswordLabel() {
      return this.$t('account.newPassword');
    },
    newPasswordHint() {
      return this.$t('account.newPasswordHint');
    },
    newPasswordRepeatLabel() {
      return this.$t('account.newPasswordRepeat');
    },
    newPasswordRepeatHint() {
      return this.$t('account.newPasswordRepeatHint');
    },
    anyFieldChanged() {
      if (
        this.fullname === this.account.fullname &&
        this.currentPassword.length === 0 &&
        this.newPassword.length === 0 &&
        this.newPasswordRepeat.length === 0
      ) {
        return false;
      }

      return true;
    },
    needToSavePassord() {
      return (this.currentPassword || this.newPassword || this.newPasswordRepeat) !== '';
    },
    localeChanged() {
      return (
        (this.locale !== this.account.locale && this.account.locale !== undefined) ||
        (this.locale !== this.$i18n.locale && this.account.locale === undefined)
      );
    },
    accountVerified() {
      return this.user.verified;
    },
    canSave() {
      if (
        !this.accountVerified ||
        (!this.anyFieldChanged && !this.localeChanged) ||
        (this.needToSavePassord &&
          (this.currentPassword === '' || this.isUsingSamePassword || !this.newPasswordMatch))
      ) {
        return false;
      }

      return true;
    },
    locales() {
      return this.$i18n.availableLocales
        .map((locale) => ({ value: locale, title: this.$t(locale) }))
        .filter((locale) => locale.title !== locale.value);
    },
  },
  beforeMount() {
    this.account = { ...this.user };
    this.fullname = this.user.fullname;
    this.locale = this.account.locale || this.$i18n.locale;
  },
  methods: {
    ...mapMutations({
      snackMessage: 'snackMessage',
      sessionUser: 'session/user',
    }),
    goHome() {
      this.$router.push({ path: '/' });
    },
    save() {
      this.saving = true;

      this.$root.$i18n.locale = this.locale;
      this.account.locale = this.locale;
      this.account.fullname = this.fullname;
      this.api
        .saveUser(this.account, this.currentPassword, this.newPassword)
        .then(() => {
          this.saving = false;

          this.user.locale = this.account.locale;
          this.user.fullname = this.account.fullname;
          this.sessionUser(this.user);
          this.goHome();
        })
        .catch((error) => {
          this.saving = false;
          this.snackMessage(this.api.getErrorMessage(error));
        });
    },
  },
};
</script>
