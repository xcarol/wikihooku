<template>
  <v-list class="timeline-list">
    <vue-draggable-next
      v-model="persons"
      handle=".draggable-time-line"
      @start="drag = true"
      @end="drag = false"
    >
      <v-list-item
        v-for="(person, index) in persons"
        :id="person.pageid"
        :key="index"
      >
        <template #prepend>
          <v-icon
            :icon="'$del'"
            @click="remPerson(person)"
          ></v-icon>
        </template>
        <template #append>
          <v-icon
            class="draggable-time-line"
            :icon="'$drag'"
          ></v-icon>
        </template>
        <timeline-widget
          :view="view"
          :name="person.name"
          :min="min"
          :max="max"
          :start="person.start"
          :end="person.end"
        />
      </v-list-item>
    </vue-draggable-next>
  </v-list>
</template>

<script setup>
import { computed, onUpdated } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useStore } from 'vuex';
import { TIMELINE, AGE } from '../../global/const';
import TimelineWidget from '../../components/TimelineWidget.vue';

const props = defineProps({
  view: {
    type: String,
    default: TIMELINE,
  },
  visibleItem: {
    type: String,
    default: '',
  },
});

const { getters, commit } = useStore();

const setEntities = (entities) => commit('wiki/entities', entities);
const remPerson = (person) => commit('wiki/remEntity', person);

const persons = computed({
  get: () => getters['wiki/entities'],
  set: (newValue) => {
    setEntities(newValue);
  },
});

const min = computed(() => {
  switch (props.view) {
    case AGE:
      return 0;
    case TIMELINE:
    default:
      return getters['wiki/start'];
  }
});

const max = computed(() => {
  switch (props.view) {
    case AGE:
      return getters['wiki/larger'];
    case TIMELINE:
    default:
      return getters['wiki/end'];
  }
});

onUpdated(() => {
  document.getElementById(props.visibleItem).scrollIntoView();
});
</script>

<style>
.timeline-list {
  width: 100%;
  padding-top: 2em !important;
}
.v-list-item__content {
  overflow: visible !important;
}
</style>
