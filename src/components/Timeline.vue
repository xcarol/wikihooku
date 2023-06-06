<template>
  <v-hover>
    <!-- <v-hover v-slot:default="{ hover }"> -->
    <!-- <v-range-slider
      v-model="range"
      :height="10"
      :hint="name"
      :max="max"
      :min="min"
      :thumb-label="hover ? 'always' : ''"
      :prepend-icon="$vuetify.icons.values.del"
      persistent-hint
      readonly
      @click:prepend="remove"
    /> -->
  </v-hover>
</template>

<script>
import { AGE, TIMELINE } from '../global/const';

export default {
  name: 'TimelineComponent',
  props: {
    view: {
      type: String,
      default: TIMELINE,
    },
    name: {
      type: String,
      default: '',
    },
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
  },
  emits: { remove: null },
  computed: {
    range() {
      switch (this.view) {
        case AGE: {
          return [0, this.end - this.start];
        }
        case TIMELINE:
        default:
          return [this.start, this.end];
      }
    },
  },
  methods: {
    remove() {
      this.$emit('remove', this.name);
    },
  },
};
</script>
