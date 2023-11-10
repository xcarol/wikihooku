<template>
  <v-list class="timeline-list">
    <vue-draggable-next
      :value="persons"
      handle=".draggable-time-line"
      @start="drag = true"
      @end="drag = false"
    >
      <v-list-item
        v-for="(person, index) in persons"
        :id="person.id"
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
          :start="birthYear(person)"
          :end="deathYear(person)"
        />
      </v-list-item>
    </vue-draggable-next>
  </v-list>
</template>

<script setup>
import { computed, onUpdated } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useStore } from 'vuex';
import { TIMELINE, AGE } from '../../lib/const';
import TimelineWidget from '../../components/TimelineWidget.vue';
import { wikiDate } from '../../lib/wikiPerson';

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

const remPerson = (person) => commit('wiki/remPerson', person);

const persons = computed({
  get: () => getters['wiki/persons'],
  set: () => {},
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

const birthYear = (person) => wikiDate(person.birthDate).getFullYear();
// const deathYear = (person) => person.deathDate ? wikiDate(person.deathDate).getFullYear() : new Date().getFullYear();
const deathYear = (person) => wikiDate(person.deathDate).getFullYear();

onUpdated(() => {
  if (props.visibleItem) {
    document.getElementById(props.visibleItem).scrollIntoView();
  }
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
