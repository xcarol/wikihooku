<template>
  <v-app-bar
    clipped-left
    dark
    app
  >
    <v-toolbar-title
      style="width: 300px"
    >
      <v-app-bar-nav-icon
        @click.stop="toggleDrawer()"
      />
      <v-btn
        v-if="$vuetify.breakpoint.smAndUp"
        text
        rounded
        @click.stop="goHome()"
      >
        Wikihooku
      </v-btn>
      <v-btn
        v-if="$vuetify.breakpoint.xsOnly"
        text
        icon
        @click.stop="goHome()"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn
        v-if="$vuetify.breakpoint.smAndUp"
        text
        rounded
        @click.stop="feedback()"
      >
        {{ $t('global.feedback') }}
      </v-btn>
      <v-btn
        v-if="$vuetify.breakpoint.xsOnly"
        text
        icon
        @click.stop="feedback()"
      >
        <v-icon>mdi-message-alert</v-icon>
      </v-btn>
    </v-toolbar-title>
    <v-btn-toggle
      v-model="viewToggle"
      dense
    >
      <v-btn
        :outlined="true"
      >
        <v-icon
          @click-stop="setAge"
        >
          mdi-distribute-vertical-center
        </v-icon>
      </v-btn>
      <v-btn
        :outlined="true"
      >
        <v-icon
          @click-stop="setTimeline"
        >
          mdi-align-horizontal-left
        </v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-spacer />
    <v-autocomplete
      v-model="model"
      return-object
      :items="items"
      :loading="isLoading"
      :search-input.sync="searchInput"
      color="secondary"
      clear-icon="mdi-close-circle"
      clearable
      hide-no-data
      no-filter
      :error-messages="errorMessage"
      :placeholder="$t('searchHint')"
      @input="input"
    />
    <v-spacer />
    <v-menu
      v-model="showMenu"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>
      </template>

      <v-list
        v-if="loggedUser"
      >
        <v-list-item
          v-for="(option, i) in userMenuOptions"
          :key="i"
          @click.stop="menuAction(option.action)"
        >
          <v-list-item-action>
            <v-icon v-if="option.icon">
              {{ option.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-title :name="`toolbar.menu.option.${option.title}`">
            {{ option.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list
        v-else
      >
        <v-list-item
          v-for="(option, i) in anonymousMenuOptions"
          :key="i"
          @click.stop="menuAction(option.action)"
        >
          <v-list-item-action>
            <v-icon v-if="option.icon">
              {{ option.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-title :name="`toolbar.menu.option.${option.title}`">
            {{ option.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import { TIMELINE, AGE } from '../global/const';

export default {
  name: 'Toolbar',
  props: {
    view: {
      type: String,
      default: TIMELINE,
    },
  },
  data: () => ({
    showMenu: false,
    items: [],
    isLoading: false,
    model: null,
    searchInput: null,
    errorMessage: '',
  }),
  computed: {
    ...mapGetters({
      loggedUser: 'session/isLoggedIn',
      user: 'session/user',
    }),
    userMenuOptions() {
      const toolbar = this;
      return [
        {
          icon: 'mdi-account-circle',
          title: this.$t('menu.account'),
          action() {
            toolbar.account();
          },
        },
        {
          icon: 'mdi-logout-variant',
          title: this.$t('menu.logout'),
          action() {
            toolbar.logout();
          },
        },
      ];
    },
    anonymousMenuOptions() {
      const toolbar = this;
      return [
        {
          icon: 'mdi-account-plus-outline',
          title: this.$t('register.title'),
          action() {
            toolbar.register();
          },
        },
        {
          icon: 'mdi-login-variant',
          title: this.$t('login.title'),
          action() {
            toolbar.login();
          },
        },
      ];
    },
    viewToggle: {
      get() {
        return 0;
      },
      set(newValue) {
        this.$emit('switchView', newValue === 0 ? TIMELINE : AGE);
      },
    },
  },
  watch: {
    async searchInput(val) {
      this.items = [];

      if (!val || val.length < 5) {
        this.errorMessage = '';
        return;
      }

      this.errorMessage = '';
      this.isLoading = true;

      try {
        const result = await this.api.searchPerson(val, 0, 50);

        if (result.status !== 200) {
          throw new Error(result.statusText);
        }

        if (result.data.query) {
          result.data.query.pages.forEach((message) => {
            if (message.revisions[0].content.includes('birth_date')) {
              this.items.push({
                text: message.title,
                value: message.pageid,
                content: message.revisions[0].content,
              });
            }
          });
        }
      } catch (error) {
        this.errorMessage = error.message;
      }

      this.isLoading = false;
    },
  },
  methods: {
    ...mapMutations({
      toggleDrawer: 'toggleDrawer',
      resetSession: 'session/reset',
    }),
    menuAction(action) {
      this.showMenu = false;
      action();
    },
    goHome() {
      if (this.$router.currentRoute.path === '/') {
        this.$router.go();
      } else {
        this.$router.push({ path: '/' });
      }
    },
    logout() {
      this.resetSession();
      this.goHome();
    },
    account() {
      this.$router.push({ name: 'Account' });
    },
    feedback() {
      this.$emit('feedback');
    },
    register() {
      this.$emit('register');
    },
    login() {
      this.$emit('login');
    },
    input(item) {
      if (item) {
        this.$emit('selected', item);
      }
    },
    setAge() {
      this.$emit('switchView', AGE);
    },
    setTimeline() {
      this.$emit('switchView', TIMELINE);
    },
  },
};
</script>
