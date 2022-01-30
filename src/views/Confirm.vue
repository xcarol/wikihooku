<template>
  <v-flex>
    <v-dialog
      v-model="success"
      width="500"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          {{ $t('registerConfirmation.successTitle') }}
        </v-card-title>

        <v-card-text>
          {{ $t('registerConfirmation.successBody') }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click.stop="goHome"
          >
            {{ $t('global.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="error"
      width="500"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          {{ $t('registerConfirmation.errorTitle') }}
        </v-card-title>

        <v-card-text>
          {{ $t('registerConfirmation.errorBody') }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click.stop="goHome"
          >
            {{ $t('global.ok') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script>
import { mapActions } from 'vuex';
import { localeFallback, getBrowserLang } from '../i18n';

export default {
  data() {
    return {
      success: false,
      error: false,
    };
  },
  created() {
    const { lang, email, token } = this.$route.query;
    this.$i18n.locale = localeFallback(lang) || getBrowserLang();
    this.confirm({
      email,
      token,
    })
      .then(() => {
        this.success = true;
      })
      .catch(() => {
        this.error = true;
      });
  },
  methods: {
    ...mapActions({
      confirm: 'session/confirm',
    }),
    goHome() {
      this.$router.push({ path: '/' });
    },
  },
};
</script>
