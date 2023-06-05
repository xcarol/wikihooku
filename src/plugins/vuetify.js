import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ca from 'vuetify/lib/locale/ca.mjs';
import en from 'vuetify/lib/locale/en.mjs';
import es from 'vuetify/lib/locale/es.mjs';
import colors from 'vuetify/lib/util/colors.mjs';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import {
  mdiHome,
  mdiPlus,
  mdiCloseCircleOutline,
  mdiCloseCircle,
  mdiAlignHorizontalLeft,
  mdiDistributeVerticalCenter,
  mdiMessageAlert,
  mdiAccountCircleOutline,
  mdiAccountCircle,
  mdiAccountPlusOutline,
  mdiLoginVariant,
  mdiLogoutVariant,
} from '@mdi/js';

const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      home: mdiHome,
      add: mdiPlus,
      del: mdiCloseCircleOutline,
      close: mdiCloseCircle,
      age: mdiAlignHorizontalLeft,
      timeline: mdiDistributeVerticalCenter,
      messageAlert: mdiMessageAlert,
      settings: mdiAccountCircle,
      account: mdiAccountCircleOutline,
      register: mdiAccountPlusOutline,
      login: mdiLoginVariant,
      logout: mdiLogoutVariant,
    },
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme,
    themes: {
      light: {
        colors: {
          primary: colors.grey.darken3,
          secondary: colors.grey.base,
        },
      },
      dark: {
        colors: {
          primary: colors.grey.darken3,
          secondary: colors.grey.base,
        },
      },
    },
  },
  lang: {
    locales: { ca, en, es },
    current: 'ca',
  },
});

export default vuetify;
