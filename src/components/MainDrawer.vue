<template>
  <v-navigation-drawer
    v-model="drawerVisible"
    :fixed="$vuetify.display.mdAndDown"
    :bottom="$vuetify.display.xs"
  >
    <v-list v-model="collectionNames">
      <v-list-item
        v-for="(collectionName, index) in collectionNames"
        :key="index"
        class="list-item"
      >
        <v-btn
          flat
          class="collection"
          @click="selectCollection(collectionName._id)"
          >{{ collectionName.name }}</v-btn
        >
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onBeforeUpdate } from 'vue';
import { useStore } from 'vuex';

const emits = defineEmits(['collectionSelected']);
const store = useStore();

const drawerVisible = computed({
  get() {
    return store.state.drawerVisible;
  },
  set(newValue) {
    store.commit('toggleDrawer', newValue);
  },
});
const collectionNames = computed(() => store.getters['collections/collectionNames']);
const user = computed(() => store.getters['session/user']);

onBeforeUpdate(async () => {
  if (drawerVisible.value === true) {
    await store.dispatch('collections/getUserCollectionNames', user.value._id);
  } else {
    store.commit('collections/collectionNames', []);
  }
});

const selectCollection = (id) => {
  emits('collectionSelected', id);
  store.commit('toggleDrawer');
};
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
