<template>
  <v-container
    fluid
    class="padded-container"
  >
    <v-layout
      justify-start
      align-start
    >
      <v-list width="100%">
        <vue-draggable-next
          v-model="persons"
          group="persons"
          handle=".draggable-time-line"
          ghost-class="ghost"
          @start="drag = true"
          @end="drag = false"
        >
          <v-list-item
            v-for="(person, index) in persons"
            :key="index"
          >
            <timeline
              :view="view"
              :name="person.name"
              :min="min"
              :max="max"
              :start="person.start"
              :end="person.end"
              @remove="remPerson(person)"
            />
            <v-icon
              class="draggable-time-line"
              :icon="'$drag'"
            />
          </v-list-item>
        </vue-draggable-next>
      </v-list>
    </v-layout>
  </v-container>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next';
import { mapGetters, mapMutations } from 'vuex';
import { TIMELINE, AGE } from '../../global/const';
import Timeline from '../../components/Timeline.vue';

export default {
  name: 'HomeView',
  components: {
    VueDraggableNext,
    Timeline,
  },
  props: {
    view: {
      type: String,
      default: TIMELINE,
    },
  },
  computed: {
    ...mapGetters({
      entities: 'wiki/entities',
      larger: 'wiki/larger',
      start: 'wiki/start',
      end: 'wiki/end',
    }),
    persons: {
      get() {
        return this.entities;
      },
      set(newValue) {
        this.setEntities(newValue);
      },
    },
    min() {
      switch (this.view) {
        case AGE:
          return 0;
        case TIMELINE:
        default:
          return this.start;
      }
    },
    max() {
      switch (this.view) {
        case AGE:
          return this.larger;
        case TIMELINE:
        default:
          return this.end;
      }
    },
  },
  methods: {
    ...mapMutations({
      setEntities: 'wiki/entities',
      remPerson: 'wiki/remEntity',
    }),
  },
};
</script>

<style scoped>
.padded-container {
  padding-top: 2em;
}

.ghost {
  opacity: 0;
}
</style>
