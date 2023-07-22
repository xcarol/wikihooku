<template>
  <v-list width="100%">
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
