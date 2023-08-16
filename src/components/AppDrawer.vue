<template>
  <v-navigation-drawer
    v-model="drawerVisible"
    :fixed="$vuetify.display.mdAndDown"
    :bottom="$vuetify.display.xs"
    @input="updateDrawer"
  >
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const drawerVisible = computed(() => store.state.drawerVisible);
const updateDrawer = (status) => {
  store.commit('showDrawer', status);
};
</script>
