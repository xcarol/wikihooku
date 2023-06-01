import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import ca from 'vuetify/lib/locale/ca.mjs';
import en from 'vuetify/lib/locale/en.mjs';
import es from 'vuetify/lib/locale/es.mjs';
import colors from 'vuetify/lib/util/colors.mjs';

const vuetify = createVuetify({
  components,
  directives,
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

export default vuetify;
