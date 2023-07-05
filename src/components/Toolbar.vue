<template>
  <v-app-bar
    clipped-left
    theme="dark"
    app
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer()" />
    <v-btn
      v-if="mdAndUp"
      text
      rounded
      @click.stop="goHome()"
    >
      Wikihooku
    </v-btn>
    <v-btn
      v-else
      text
      :icon="'$home'"
      @click.stop="goHome()"
    />
    <v-btn
      v-if="mdAndUp"
      text
      rounded
      @click.stop="feedback()"
    >
      {{ $t('global.feedback') }}
    </v-btn>
    <v-btn
      v-else
      text
      :icon="'$messageAlert'"
      @click.stop="feedback()"
    />
    <v-btn-toggle
      v-model="toggle_exclusive"
      dense
      @update:model-value="viewToggle"
    >
      <v-btn
        :icon="'$timeline'"
        :outlined="true"
        @click-stop="setAge"
      />
      <v-btn
        :icon="'$age'"
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
      @update:model-value="input"
    />
    <v-spacer />
    <v-menu
      v-model="showMenu"
      offset-y
    >
      <template #activator="{ props }">
        <v-btn
          :icon="'$account'"
          v-bind="props"
        />
      </template>

      <v-list v-if="loggedUser">
        <v-list-item
          v-for="(option, i) in userMenuOptions"
          :key="i"
          @click.stop="menuAction(option.action)"
        >
          <template #prepend>
            <v-icon v-if="option.icon">
              {{ option.icon }}
            </v-icon>
          </template>
          <v-list-item-title :name="`toolbar.menu.option.${option.title}`">
            {{ option.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-else>
        <v-list-item
          v-for="(option, i) in anonymousMenuOptions"
          :key="i"
          @click.stop="menuAction(option.action)"
        >
          <template #prepend>
            <v-icon v-if="option.icon">
              {{ option.icon }}
            </v-icon>
          </template>
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
import { useDisplay } from 'vuetify';
import { TIMELINE, AGE } from '../global/const';

export default {
  name: 'ToolbarComponent',
  props: {
    view: {
      type: String,
      default: TIMELINE,
    },
  },
  emits: {
    login: null,
    feedback: null,
    register: null,
    selected: null,
    switchView: null,
  },
  setup() {
    const { xs, mdAndUp } = useDisplay();
    return { xs, mdAndUp };
  },
  data: () => ({
    showMenu: false,
    items: [],
    isLoading: false,
    select: null,
    search: null,
    errorMessage: '',
    toggle_exclusive: 0,
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
          icon: '$settings',
          title: this.$t('menu.account'),
          action() {
            toolbar.account();
          },
        },
        {
          icon: '$logout',
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
          icon: '$register',
          title: this.$t('register.title'),
          action() {
            toolbar.register();
          },
        },
        {
          icon: '$login',
          title: this.$t('login.title'),
          action() {
            toolbar.login();
          },
        },
      ];
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
    viewToggle(value) {
      this.$emit('switchView', value === 0 ? TIMELINE : AGE);
    },
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
