// eslint-disable-next-line import/extensions, import/no-unresolved
import 'vuetify/styles';
// eslint-disable-next-line import/extensions, import/no-unresolved
import * as components from 'vuetify/components';
// eslint-disable-next-line import/extensions, import/no-unresolved
import * as directives from 'vuetify/directives';
// eslint-disable-next-line import/extensions, import/no-unresolved
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { createVuetify } from 'vuetify';
import ca from 'vuetify/lib/locale/ca.mjs';
import en from 'vuetify/lib/locale/en.mjs';
import es from 'vuetify/lib/locale/es.mjs';
import colors from 'vuetify/lib/util/colors.mjs';
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
  mdiDragVertical,
  mdiContentSave,
  mdiAccountDetails,
  mdiDeleteForever,
} from '@mdi/js';

const defaultTheme = import.meta.env.VITE_THEME || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

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
      settings: mdiAccountDetails,
      accountIn: mdiAccountCircle,
      accountOut: mdiAccountCircleOutline,
      register: mdiAccountPlusOutline,
      login: mdiLoginVariant,
      logout: mdiLogoutVariant,
      drag: mdiDragVertical,
      save: mdiContentSave,
      deleteForever: mdiDeleteForever,
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
