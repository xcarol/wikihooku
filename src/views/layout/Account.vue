<template>
  <v-layout
    row
    justify-center
  >
    <v-flex
      xs12
    >
      <v-alert
        v-show="!accountVerified"
        type="error"
      >
        {{ $t('account.notVerified') }}
      </v-alert>
      <v-card flat>
        <v-card-title>
          <v-layout wrap>
            <v-flex grow>
              <span class="headline">
                {{ $t('account.title') }}
              </span>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-card-text>
          <v-layout wrap>
            <v-flex
              xs12
            >
              <v-select
                v-model="locale"
                :items="locales"
                :label="$t('account.locale')"
              />
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <v-flex
              xs12
            >
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
                  :hint="fullnameHint"
                  :label="fullnameLabel"
                  :error-messages="errors"
                  :success="valid"
                  @keyup.enter="saveUser"
                />
              </ValidationProvider>
            </v-flex>
            <v-flex
              xs12
            >
              <ValidationProvider
                name="currentPassword"
                rules="min:8|required"
              >
                <v-text-field
                  v-model="currentPassword"
                  slot-scope="{
                    errors,
                    valid
                  }"
                  tabindex="2"
                  type="password"
                  :hint="$t('account.currentPasswordHint')"
                  :label="currentPasswordLabel"
                  :error-messages="errors"
                  :success="valid"
                />
              </ValidationProvider>
            </v-flex>
            <v-flex
              xs12
            >
              <ValidationProvider
                name="newPassword"
                rules="min:8|required|oldPassword:@currentPassword"
              >
                <v-text-field
                  ref="password"
                  v-model="newPassword"
                  slot-scope="{
                    errors,
                    valid
                  }"
                  tabindex="3"
                  type="password"
                  :hint="newPasswordHint"
                  :label="newPasswordLabel"
                  :error-messages="errors"
                  :success="valid"
                />
              </ValidationProvider>
            </v-flex>
            <v-flex
              xs12
            >
              <ValidationProvider
                name="newPasswordRepeat"
                rules="min:8|required|confirmed:newPassword"
              >
                <v-text-field
                  v-model="newPasswordRepeat"
                  slot-scope="{
                    errors,
                    valid
                  }"
                  tabindex="4"
                  type="password"
                  :hint="newPasswordRepeatHint"
                  :label="newPasswordRepeatLabel"
                  :error-messages="errors"
                  :success="valid"
                />
              </ValidationProvider>
            </v-flex>
          </v-layout>
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
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Account',
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
    };
  },
  computed: {
    ...mapGetters({
      user: 'session/user',
    }),
    isUsingSamePassword() {
      const same = (this.currentPassword !== '' || this.newPassword !== '')
        && this.currentPassword === this.newPassword;

      if (same) {
        // this.errors.add({
        //   field: 'password',
        //   msg: this.$t('account.samePasswords'),
        // });
      }

      return same;
    },
    newPasswordMatch() {
      return (this.newPassword !== '' || this.newPasswordRepeat !== '')
        && this.newPassword === this.newPasswordRepeat;
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
      if (this.fullname === this.account.fullname
        && this.currentPassword.length === 0
        && this.newPassword.length === 0
        && this.newPasswordRepeat.length === 0) {
        return false;
      }

      return true;
    },
    needToSavePassord() {
      return (this.currentPassword || this.newPassword || this.newPasswordRepeat) !== '';
    },
    localeChanged() {
      return (this.locale !== this.account.locale && this.account.locale !== undefined)
      || (this.locale !== this.$i18n.locale && this.account.locale === undefined);
    },
    accountVerified() {
      return this.user.verified;
    },
    canSave() {
      if (
        !this.accountVerified
        || (!this.anyFieldChanged && !this.localeChanged)
        || (
          this.needToSavePassord
          && (
            this.currentPassword === ''
            || this.isUsingSamePassword
            || !this.newPasswordMatch
          )
        )
      ) {
        return false;
      }

      return true;
    },
    locales() {
      return this.$i18n.availableLocales
        .map((locale) => ({ value: locale, text: this.$t(locale) }))
        .filter((locale) => locale.text !== locale.value);
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
      this.api.saveUser(this.account, this.currentPassword, this.newPassword)
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
