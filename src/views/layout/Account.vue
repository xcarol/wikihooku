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
                :counter="MAX_USER_NAME_LEN"
                :hint="fullnameHint"
                :label="fullnameLabel"
                :rules="fullnameRules"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="currentPassword"
                type="password"
                :hint="currentPasswordHint"
                :label="currentPasswordLabel"
                :rules="currentPasswordRules"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPassword"
                type="password"
                :hint="newPasswordHint"
                :label="newPasswordLabel"
                :rules="newPasswordRules"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPasswordRepeat"
                type="password"
                :hint="newPasswordRepeatHint"
                :label="newPasswordRepeatLabel"
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
            :disabled="canSave() === false"
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

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useField } from 'vee-validate';
import { useApi } from '../../plugins/api'
import * as yup from 'yup';
import { MAX_USER_NAME_LEN, MIN_PASSWORD_LEN } from '../../global/const';

const store = useStore();
const router = useRouter();
const { locale: i18nlocale, availableLocales, t: $t } = useI18n();
const api = useApi();

const fullnameLabel = computed(() => $t('account.name'));
const fullnameHint = computed(() => $t('account.nameHint'));
const currentPasswordLabel = computed(() => $t('account.currentPassword'));
const currentPasswordHint = computed(() => $t('account.currentPasswordHint'));
const newPasswordLabel = computed(() => $t('account.newPassword'));
const newPasswordHint = computed(() => $t('account.newPasswordHint'));
const newPasswordRepeatLabel = computed(() => $t('account.newPasswordRepeat'));
const newPasswordRepeatHint = computed(() => $t('account.newPasswordRepeatHint'));

const user = store.getters['session/user'];
const accountVerified = user.verified;

let saving = false;
const account = { ...user };

const fullnameRules = [
  async (value) => {
    try {
      await yup
        .string()
        .required()
        .max(MAX_USER_NAME_LEN, $t('account.usernameLength').replace('%s', MAX_USER_NAME_LEN))
        .validate(value);
      return true;
    } catch (error) {
      return error.message;
    }
  },
];

const currentPasswordRules = [
  async (value) => {
    try {
      await yup.string().validate(value);
      return true;
    } catch (error) {
      return error.message;
    }
  },
];

const newPasswordRules = [
  async (value) => {
    try {
      await yup
        .string()
        .test('min', $t('account.newPasswordLength').replace('%s', MIN_PASSWORD_LEN), (value) => {
          return value === undefined || value.length === 0 || value.length >= MIN_PASSWORD_LEN;
        })
        .test('notOneOf', $t('account.newPasswordRule'), (value) => {
          return value === undefined || value.length === 0 || value !== currentPassword.value;
        })
        .validate(value);
      return true;
    } catch (error) {
      return error.message;
    }
  },
];

const newPasswordRepeatRules = [
  async (value) => {
    try {
      await yup
        .string()
        .oneOf([newPassword.value], $t('account.newPasswordRepeatRule'))
        .validate(value);
      return true;
    } catch (error) {
      return error.message;
    }
  },
];

const {
  value: fullname,
  meta: fullnameMeta,
  resetField: fullnameReset,
} = useField('fullname', fullnameRules);
const { value: currentPassword, meta: currentPasswordMeta } = useField(
  'currentPassword',
  currentPasswordRules
);
const { value: newPassword, meta: newPasswordMeta } = useField('newPassword', newPasswordRules);
const { value: newPasswordRepeat, meta: newPasswordRepeatMeta } = useField(
  'newPasswordRepeat',
  newPasswordRepeatRules
);

fullnameReset({ value: account.fullname });

const locale = account.locale || i18nlocale;
const locales = availableLocales
  .map((locale) => ({ value: locale, title: $t(locale) }))
  .filter((locale) => locale.title !== locale.value);

const validationInProgress = () =>
  fullnameMeta.pending ||
  currentPasswordMeta.pending ||
  newPasswordMeta.pending ||
  newPasswordRepeatMeta.pending;

const nothingToSave = () =>
  !fullnameMeta.dirty &&
  !currentPasswordMeta.dirty &&
  !newPasswordMeta.dirty &&
  !newPasswordRepeatMeta.dirty;

const passwordFieldsEmpty = () =>
  (!currentPasswordMeta.dirty || !currentPassword.value?.length) &&
  (!newPasswordMeta.dirty || !newPassword.value?.length) &&
  (!newPasswordRepeatMeta.dirty || !newPasswordRepeat.value?.length);

const canSaveFullname = () => fullnameMeta.dirty && fullnameMeta.valid;

const canSavePasswords = () =>
  currentPasswordMeta.valid &&
  currentPassword.value?.length &&
  newPasswordMeta.valid &&
  newPassword.value?.length &&
  newPasswordRepeatMeta.valid &&
  newPasswordRepeat.value?.length;

const canSave = () =>
  !(validationInProgress() || nothingToSave()) &&
  ((canSaveFullname() && passwordFieldsEmpty()) || canSavePasswords());

const goHome = () => {
  router.push({ path: '/' });
};

const snackMessage = (message) => {
  store.commit('snackMessage', message);
};

const sessionUser = (user) => {
  store.commit('session/user', user);
};

const save = async () => {
  saving = true;

  account.locale = locale.value;
  account.fullname = fullname.value;
  try {
    await api.saveUser(account, currentPassword.value, newPassword.value);
    saving = false;

    user.locale = account.locale;
    user.fullname = account.fullname;
    sessionUser(user);
    goHome();
  } catch (error) {
    saving = false;
    snackMessage(api.getErrorMessage(error));
  }
};
</script>
