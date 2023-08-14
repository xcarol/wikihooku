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
        :key="index"
      >
        <template v-slot:prepend>
          <v-icon
            @click="remPerson(person)"
            :icon="'$del'"
          ></v-icon>
        </template>
        <template v-slot:append>
          <v-icon
            class="draggable-time-line"
            :icon="'$drag'"
          ></v-icon>
        </template>
        <timeline
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
import { VueDraggableNext } from 'vue-draggable-next';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { TIMELINE, AGE } from '../../global/const';
import Timeline from '../../components/Timeline.vue';

const props = defineProps({
  view: {
    type: String,
    default: TIMELINE,
  },
});

const { getters, commit } = useStore();

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

const setEntities = (entities) => commit('wiki/entities', entities);
const remPerson = (person) => commit('wiki/remEntity', person);
</script>

<style>
.timeline-list {
  width: 100%;
  padding-top: 2em;
}
.v-list-item__content {
  overflow: visible !important;
}
</style>
