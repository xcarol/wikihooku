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
        v-if="$vuetify.smAndUp"
        text
        rounded
        @click.stop="goHome()"
      >
        Wikihooku
      </v-btn>
      <v-btn
        v-if="$vuetify.xsOnly"
        text
        :icon="'$home'"
        @click.stop="goHome()"
      />
      <v-btn
        v-if="$vuetify.smAndUp"
        text
        rounded
        @click.stop="feedback()"
      >
        {{ $t('global.feedback') }}
      </v-btn>
      <v-btn
        v-if="$vuetify.xsOnly"
        text
        :icon="'mdi-message-alert'"
        @click.stop="feedback()"
      />
    </v-toolbar-title>
    <v-btn-toggle
      v-model="viewToggle"
      dense
    >
      <v-btn
        :incon="'$alignTop'"
        :outlined="true"
        @click-stop="setAge"
      />
      <v-btn
        :icon="'$alignLeft'"
        :outlined="true"
        @click-stop="setTimeline"
      />
    </v-btn-toggle>
    <v-spacer />
    <v-autocomplete
      v-model="select"
      v-model:search="search"
      :clear-icon="'$close'"
      :error-messages="errorMessage"
      :items="items"
      :loading="isLoading"
      color="secondary"
      clearable
      hide-no-data
      no-filter
      :placeholder="$t('searchHint')"
      return-object
      @update:modelValue="input"
    />
    <v-spacer />
    <v-menu
      v-model="showMenu"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          :icon="'mdi-account-circle-outline'"
          v-on="on"
        />
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
  name: 'ToolbarComponent',
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
    select: null,
    search: null,
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
    async search(val) {
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
            if (message.revisions[0].slots.main.content.includes('birth_date')) {
              this.items.push({
                title: message.title,
                value: message.pageid,
                content: message.revisions[0].slots.main.content,
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
