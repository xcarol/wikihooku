<template>
    <v-btn
      v-if="$vuetify.display.mdAndUp"
      text
      rounded
      @click.stop="help()"
    >
      {{ $t('global.help') }}
    </v-btn>
    <v-btn
      v-else
      text
      :icon="'$help'"
      @click.stop="help()"
    />
</template>

<script setup>
const emits = defineEmits(['help']);
const help = () => emits('help');
</script>