<template>
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
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const { t: $t } = useI18n();
const { getters } = useStore();
const router = useRouter();

const emits = defineEmits(['login', 'logout', 'register']);

const showMenu = ref(false);
const loggedUser = computed(() => getters['session/isLoggedIn']);

const menuAction = (action) => {
  showMenu.value = false;
  action();
};

const account = () => {
  router.push({ name: 'Account' });
};

const logout = () => emits('logout');
const register = () => emits('register');
const login = () => emits('login');

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
</script>