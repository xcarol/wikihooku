<template>
  <v-hover>
    <template #default="{ isHovering, props }">
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

<script setup>
import { computed } from 'vue';
import { AGE, TIMELINE } from '../global/const';

const TimelineProps = defineProps({
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
});

const emits = defineEmits(['remove']);

const range = computed(() => {
  switch (TimelineProps.view) {
    case AGE: {
      return [0, TimelineProps.end - TimelineProps.start];
    }
    case TIMELINE:
    default:
      return [TimelineProps.start, TimelineProps.end];
  }
});

const remove = () => {
  emits.remove(TimelineProps.name);
};
</script>
