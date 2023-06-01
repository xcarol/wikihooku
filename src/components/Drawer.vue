<template>
  <v-navigation-drawer
    :value="drawerVisible"
    :fixed="$vuetify.breakpoint.mdAndDown"
    :bottom="$vuetify.breakpoint.xsOnly"
    @input="updateDrawer"
  >
  <!-- <v-list dense>
      <template v-for="item in items">
        <v-layout
          v-if="item.heading"
          :key="item.heading"
          row
          align-center
        >
          <v-flex xs6>
            <v-subheader v-if="item.heading">
              {{ item.heading }}
            </v-subheader>
          </v-flex>
          <v-flex
            xs6
            class="text-xs-center"
          >
            <a
              href="#!"
              class="body-2 black--text"
            >
              EDIT
            </a>
          </v-flex>
        </v-layout>
        <v-list-group
          v-else-if="item.children"
          :key="item.text"
          v-model="item.model"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon=""
        >
          <v-list-item slot="activator">
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-for="(child, i) in item.children"
            :key="i"
          >
            <v-list-item-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ child.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          v-else
          :key="item.text"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list> -->
  </v-navigation-drawer>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'DrawerComponent',
  data: () => ({
    items: [
      {
        icon: 'mdi-contacts',
        'icon-alt': 'mdi-contacts',
        text: 'People',
        children: [
          { text: 'Venues' },
          { text: 'Bands' },
        ],
      },
    ],
  }),
  computed: {
    ...mapGetters([
      'drawerVisible',
    ]),
  },
  methods: {
    ...mapMutations({
      showDrawer: 'drawerVisible',
    }),
    updateDrawer(status) {
      this.showDrawer(status);
    },
  },
};
</script>
