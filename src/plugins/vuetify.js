import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import ca from 'vuetify/es5/locale/ca';
import en from 'vuetify/es5/locale/en';
import es from 'vuetify/es5/locale/es';
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: {
      add: 'mdi-plus',
      del: 'mdi-close-circle-outline',
    },
  },
  theme: {
    themes: {
      light: {
        primary: '#424242',
        secondary: colors.grey.base,
      },
    },
  },
  lang: {
    locales: { ca, en, es },
    current: 'ca',
  },
});
