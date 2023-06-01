// import Vue from 'vue';
// import VueI18n from 'vue-i18n';
// import { localize, ValidationProvider } from 'vee-validate';
// import localeCa from 'vee-validate/dist/locale/ca.json';
// import localeEn from 'vee-validate/dist/locale/en.json';
// import localeEs from 'vee-validate/dist/locale/es.json';
// import store from './store/config';

// Vue.use(VueI18n);

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

// const messages = loadLocaleMessages();
// const messagesKeys = Object.keys(messages);

// function getUserLanguage() {
//   return store.getters['session/user'].locale;
// }

// export function localeFallback(locale) {
//   let fallbackLocale = messagesKeys.find((key) => key === locale);
//   if (!fallbackLocale) {
//     const [messagesLocaleKey] = messagesKeys;
//     // eslint-disable-next-line security/detect-object-injection
//     const messagesLocale = messages[messagesLocaleKey][locale];
//     if (messagesLocale) {
//       const fallback = messagesLocale.split(':');
//       if (fallback.shift() === 'fallback') {
//         fallbackLocale = fallback.pop();
//       }
//     }
//   }

//   return fallbackLocale;
// }

// export function getBrowserLang() {
//   let browserLocale = navigator.language;

//   if (navigator.languages !== undefined) {
//     [browserLocale] = navigator.languages;
//   }

//   return localeFallback(browserLocale);
// }

// const locale = getUserLanguage() || getBrowserLang() || process.env.VUE_APP_I18N_LOCALE || 'en';
// const i18n = new VueI18n({
//   locale,
//   fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
//   messages,
//   silentFallbackWarn: true,
// });

// localize({
//   ca: { code: localeCa.code, messages: { ...messages.ca.messages, ...localeCa.messages }, names: { ...messages.ca.fields } },
//   es: { code: localeEs.code, messages: { ...messages.es.messages, ...localeEs.messages }, names: { ...messages.es.fields } },
//   en: { code: localeEn.code, messages: { ...messages.en.messages, ...localeEn.messages }, names: { ...messages.en.fields } },
// });

// localize(locale);

// Vue.component('ValidationProvider', ValidationProvider);

// export default i18n;
