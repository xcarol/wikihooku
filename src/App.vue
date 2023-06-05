<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify';

const theme = useTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  theme.global.name.value = event.matches ? 'dark' : 'light';
});

</script>
