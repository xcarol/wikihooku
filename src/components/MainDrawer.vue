<template>
  <v-navigation-drawer
    v-model="drawerVisible"
    :fixed="$vuetify.display.mdAndDown"
    :bottom="$vuetify.display.xs"
  >
    <v-list v-model="collectionNames">
      <v-list-item
        class="list-item"
        v-for="(collectionName, index) in collectionNames"
        :key="index"
      >
        <v-btn flat class="collection">{{ collectionName.name }}</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, watch, onActivated, onBeforeMount, onBeforeUpdate, onMounted, onUpdated } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const drawerVisible = computed(() => store.state.drawerVisible);
const collectionNames = computed(() => store.getters['collections/collectionNames']);

onBeforeUpdate(async () => {
  if ( drawerVisible.value === true) {
    await store.dispatch('collections/getAllCollectionNames');
  }
});
</script>

<style scoped>
.list-item {
  padding: 0px !important;
}
.collection {
  justify-content: left;
  width: 100%;
  text-transform: none;
}
</style>