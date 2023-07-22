<template>
  <v-hover>
    <template v-slot:default="{ isHovering, props }">
      <v-range-slider
        v-model="range"
        v-bind="props"
        :step="1"
        :hint="name"
        :max="max"
        :min="min"
        :thumb-label="isHovering ? 'always' : ''"
        persistent-hint
        readonly
        @click:prepend="remove"
      />
    </template>
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
