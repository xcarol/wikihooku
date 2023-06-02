// eslint-disable-next-line import/no-extraneous-dependencies
import { createI18n } from 'vue-i18n';
// import store from './store/config';
import ca from './locales/ca.json';
import en from './locales/en.json';
import es from './locales/es.json';

const messages = { ca, en, es };

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
