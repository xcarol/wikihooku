import { createI18n } from 'vue-i18n';
// import store from './store/config';
import ca from './locales/ca.json';
import en from './locales/en.json';
import es from './locales/es.json';

// function loadLocaleMessages() {
//   const localeFiles = require.context('./locales', false, /[A-Za-z0-9-_,\s]+\.json$/i);
//   const messages = {};
//   const locales = localeFiles.keys().map((localeFile) => [localeFile, localeFile.match(/([A-Za-z0-9-_]+)\./i).pop()]);
//   locales.forEach((locale) => {
//     const [file, key] = locale;
//     // eslint-disable-next-line security/detect-object-injection
//     messages[key] = localeFiles(file);
//   });
//   return messages;
// }

const messages = { ca, en, es };
// const messagesKeys = Object.keys(messages);

function getUserLanguage() {
  return 'es';
  // return store.getters['session/user'].locale;
}

export function getBrowserLang() {
  let browserLocale = navigator.language;

  if (navigator.languages !== undefined) {
    [browserLocale] = navigator.languages;
  }

  return browserLocale;
}

const locale = getUserLanguage() || getBrowserLang() || import.meta.env.VITE_I18N_LOCALE || 'en';

const i18n = createI18n({
  locale,
  fallbackLocale: import.meta.env.VITE_I18N_FALLBACK_LOCALE || 'en',
  messages,
  silentFallbackWarn: true,
});

export default i18n;

// import { localize, ValidationProvider } from 'vee-validate';
// import localeCa from 'vee-validate/dist/locale/ca.json';
// import localeEn from 'vee-validate/dist/locale/en.json';
// import localeEs from 'vee-validate/dist/locale/es.json';

// localize({
//   ca: { code: localeCa.code, messages: { ...messages.ca.messages, ...localeCa.messages }, names: { ...messages.ca.fields } },
//   es: { code: localeEs.code, messages: { ...messages.es.messages, ...localeEs.messages }, names: { ...messages.es.fields } },
//   en: { code: localeEn.code, messages: { ...messages.en.messages, ...localeEn.messages }, names: { ...messages.en.fields } },
// });

// localize(locale);

// Vue.component('ValidationProvider', ValidationProvider);
