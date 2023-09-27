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
                :disabled="!accountVerified"
                :items="locales"
                :label="$t('account.locale')"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="fullname"
                :disabled="!accountVerified"
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
                :disabled="!accountVerified"
                type="password"
                :hint="currentPasswordHint"
                :label="currentPasswordLabel"
                :rules="currentPasswordRules"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPassword"
                :disabled="!accountVerified"
                type="password"
                :hint="newPasswordHint"
                :label="newPasswordLabel"
                :rules="newPasswordRules"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="newPasswordRepeat"
                :disabled="!accountVerified"
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
            outlined
            :disabled="!accountVerified || canSave() === false"
            @click.stop="save()"
          >
            {{ $t('global.save') }}
          </v-btn>
          <v-btn
            color="accent"
            text
            @click.stop="closeWithoutSaving()"
          >
            {{ $t('global.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useField } from 'vee-validate';
import * as yup from 'yup';
import { useApi } from '../plugins/api';
import { MAX_USER_NAME_LEN, MIN_PASSWORD_LEN } from '../lib/const';

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
const locale = ref(i18nlocale);
const appLocale = i18nlocale.value;
const locales = availableLocales
  .map((availableLocale) => ({ value: availableLocale, title: $t(availableLocale) }))
  .filter((availableLocale) => availableLocale.title !== availableLocale.value);

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

const {
  value: fullname,
  meta: fullnameMeta,
  resetField: fullnameReset,
} = useField('fullname', fullnameRules);

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

const { value: currentPassword, meta: currentPasswordMeta } = useField(
  'currentPassword',
  currentPasswordRules,
);

const newPasswordRules = [
  async (value) => {
    try {
      await yup
        .string()
        .test(
          'min',
          $t('account.newPasswordLength').replace('%s', MIN_PASSWORD_LEN),
          (minValue) =>
            minValue === undefined || minValue.length === 0 || minValue.length >= MIN_PASSWORD_LEN,
        )
        .test(
          'notOneOf',
          $t('account.newPasswordRule'),
          (passwordValue) =>
            passwordValue === undefined ||
            passwordValue.length === 0 ||
            passwordValue !== currentPassword.value,
        )
        .validate(value);
      return true;
    } catch (error) {
      return error.message;
    }
  },
];

const { value: newPassword, meta: newPasswordMeta } = useField('newPassword', newPasswordRules);

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

const { value: newPasswordRepeat, meta: newPasswordRepeatMeta } = useField(
  'newPasswordRepeat',
  newPasswordRepeatRules,
);

fullnameReset({ value: account.fullname });

const localeChanged = () => locale.value !== appLocale;

const validationInProgress = () =>
  fullnameMeta.pending ||
  currentPasswordMeta.pending ||
  newPasswordMeta.pending ||
  newPasswordRepeatMeta.pending;

const nothingToSave = () =>
  !fullnameMeta.dirty &&
  !currentPasswordMeta.dirty &&
  !newPasswordMeta.dirty &&
  !newPasswordRepeatMeta.dirty &&
  !localeChanged();

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
  (localeChanged() || (canSaveFullname() && passwordFieldsEmpty()) || canSavePasswords());

const goHome = () => {
  router.push({ path: '/' });
};

const closeWithoutSaving = () => {
  i18nlocale.value = appLocale;
  goHome();
};

const snackMessage = (message) => {
  store.commit('snackMessage', message);
};

const sessionUser = (newSessionUser) => {
  store.commit('session/user', newSessionUser);
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
