<template>
    <v-btn
      v-if="$vuetify.display.mdAndUp"
      text
      rounded
      @click.stop="feedback()"
    >
      {{ $t('global.feedback') }}
    </v-btn>
    <v-btn
      v-else
      text
      :icon="'$messageAlert'"
      @click.stop="feedback()"
    />
</template>

<script setup>
const emits = defineEmits(['feedback']);
const feedback = () => emits('feedback');
</script>