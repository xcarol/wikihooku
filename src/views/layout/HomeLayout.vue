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
  <person-dialog
      v-if="showNewPersonDialog"
      @add="addNewPerson"
      @close="closeNewPersonDialog"
    />
  <v-btn
      position="fixed"
      location="bottom right"
      size="small"
      color="primary"
      :icon="'$add'"
      class="ma-2"
      @click.stop="newPerson"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { useStore } from 'vuex';
import { wikiEntity } from '../../store/modules/wiki';
import { TIMELINE, AGE, NO_PAGE_ID } from '../../global/const';
import TimelineWidget from '../../components/TimelineWidget.vue';
import PersonDialog from '../../components/PersonDialog.vue';

const props = defineProps({
  view: {
    type: String,
    default: TIMELINE,
  },
});

const { getters, commit } = useStore();

const showNewPersonDialog = ref(false);

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

const addNewPerson = (person) => {
  commit(
    'wiki/addEntity',
    wikiEntity(NO_PAGE_ID, person.fullname, person.start.getFullYear(), person.end.getFullYear())
  );
  closeNewPersonDialog();
};

const closeNewPersonDialog = () => {
  showNewPersonDialog.value = false;
};

const newPerson = () => {
  showNewPersonDialog.value = true;
};
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
