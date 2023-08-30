<template>
    <v-btn
      v-if="$vuetify.display.mdAndUp"
      text
      rounded
      @click.stop="home()"
    >
      Wikihooku
    </v-btn>
    <v-btn
      v-else
      text
      :icon="'$home'"
      @click.stop="home()"
    />
</template>

<script setup>
const emits = defineEmits(['home']);
const home = () => emits('home');
</script>