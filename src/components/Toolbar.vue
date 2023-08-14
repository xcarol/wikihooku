<template>
  <v-app-bar
    clipped-left
    theme="dark"
    app
  >
    <v-app-bar-nav-icon @click.stop="toggleDrawer()" />
    <v-btn
      v-if="$vuetify.display.mdAndUp"
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
      v-if="$vuetify.display.mdAndUp"
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

<script setup>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useApi } from '../plugins/api';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { TIMELINE, AGE } from '../global/const';

const { getters, commit } = useStore();
const { t: $t } = useI18n();
const api = useApi();
const router = useRouter();

const props = defineProps({
  view: {
    type: String,
    default: TIMELINE,
  },
});

const emits = defineEmits([
  'login',
  'feedback',
  'register',
  'selected',
  'switchView',
]);

const showMenu = ref(false);
const items = ref([]);
const isLoading = ref(false);
const search = ref(null);
const errorMessage = ref('');
const toggle_exclusive = ref(0);

const loggedUser = computed(() => getters['session/isLoggedIn']);

const userMenuOptions = computed(() => [
  {
    icon: '$settings',
    title: $t('menu.account'),
    action: account,
  },
  {
    icon: '$logout',
    title: $t('menu.logout'),
    action: logout,
  },
]);

const anonymousMenuOptions = computed(() => [
  {
    icon: '$register',
    title: $t('register.title'),
    action: register,
  },
  {
    icon: '$login',
    title: $t('login.title'),
    action: login,
  },
]);

const toggleDrawer = () => commit('toggleDrawer');
const resetSession = () => commit('session/reset');

const viewToggle = (value) => {
  emits('switchView', value === 0 ? TIMELINE : AGE);
};

const menuAction = (action) => {
  showMenu.value = false;
  action();
};

const goHome = () => {
  const currentPath = router.currentRoute.path;
  if (currentPath === '/') {
    router.go();
  } else {
    router.push({ path: '/' });
  }
};

const logout = () => {
  resetSession();
  goHome();
};

const account = () => {
  router.push({ name: 'Account' });
};

const feedback = () => {
  emits('feedback');
};

const register = () => {
  emits('register');
};

const login = () => {
  emits('login');
};

const input = (item) => {
  if (item) {
    emits('selected', item);
  }
};

const setAge = () => {
  viewToggle(AGE);
};

const setTimeline = () => {
  viewToggle(TIMELINE);
};

watch(search, async (val) => {
  items.value = [];

  if (!val || val.length < 5) {
    errorMessage.value = '';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    const result = await api.searchPerson(val, 0, 50);

    if (result.status !== 200) {
      throw new Error(result.statusText);
    }

    if (result.data.query) {
      result.data.query.pages.forEach((message) => {
        if (message.revisions[0].slots.main.content.includes('birth_date')) {
          items.value.push({
            title: message.title,
            value: message.pageid,
            content: message.revisions[0].slots.main.content,
          });
        }
      });
    }
  } catch (error) {
    errorMessage.value = error.message;
  }

  isLoading.value = false;
});
</script>
