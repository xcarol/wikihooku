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

<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import { AGE, TIMELINE } from '../global/const';

const props = defineProps({
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
  switch (props.view) {
    case AGE: {
      return [0, props.end - props.start];
    }
    case TIMELINE:
    default:
      return [props.start, props.end];
  }
});

const remove = () => {
  emits.remove(props.name);
};
</script>
