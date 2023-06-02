<template>
  <v-container
    fluid
    fill-height
  >
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      :fullscreen="$vuetify.xs"
      scrollable
      @keydown="closeIfEscape"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('persona.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <!-- <ValidationProvider
                  v-slot="{ errors }"
                  rules="required"
                  name="fullname"
                > -->
                  <v-text-field
                    v-model="fullname"
                    data-vv-validate-on="change"
                    name="fullname"
                    tabindex="-1"
                    type="text"
                    :label="fullnameLabel"
                    :data-vv-as="fullnameLabel"
                    @keyup.enter="addPersona"
                  />
                  <!-- <span>{{ errors[0] }}</span> -->
                <!-- </ValidationProvider> -->
              </v-col>
            </v-row>
            <v-row>
              <v-btn-toggle>
                <v-col>
                  <!-- <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="birthday"
                  > -->
                    <v-select
                      v-model="birthday"
                      tabindex="-2"
                      :items="days"
                      :label="$t('global.day')"
                      :hint="$t('persona.birthdate')"
                      persistent-hint
                    />
                    <!-- <span>{{ errors[0] }}</span> -->
                  <!-- </ValidationProvider> -->
                </v-col>
                <v-col>
                  <!-- <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="birthmonth"
                  > -->
                    <v-select
                      v-model="birthmonth"
                      tabindex="-3"
                      :items="months"
                      :label="$t('global.month')"
                    />
                    <!-- <span>{{ errors[0] }}</span> -->
                  <!-- </ValidationProvider> -->
                </v-col>
                <v-col>
                  <!-- <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="birthyear"
                  > -->
                    <v-select
                      v-model="birthyear"
                      tabindex="-4"
                      :items="years"
                      :label="$t('global.year')"
                    />
                    <!-- <span>{{ errors[0] }}</span> -->
                  <!-- </ValidationProvider> -->
                </v-col>
              </v-btn-toggle>
            </v-row>
            <v-row>
              <v-btn-toggle>
                <v-col>
                  <!-- <ValidationProvider
                    v-slot="{ errors }"
                    name="deathday"
                  > -->
                    <v-select
                      v-model="deathday"
                      tabindex="-5"
                      :items="days"
                      :label="$t('global.day')"
                      :hint="$t('persona.deathdate')"
                      persistent-hint
                    />
                    <!-- <span>{{ errors[0] }}</span> -->
                  <!-- </ValidationProvider> -->
                </v-col>
                <v-col>
                  <!-- <ValidationProvider
                    v-slot="{ errors }"
                    name="deathmonth"
                  > -->
                    <v-select
                      v-model="deathmonth"
                      tabindex="-6"
                      :items="months"
                      :label="$t('global.month')"
                    />
                    <!-- <span>{{ errors[0] }}</span> -->
                  <!-- </ValidationProvider> -->
                </v-col>
                <v-col>
                  <!-- <ValidationProvider
                    v-slot="{ errors }"
                    name="deathyear"
                  > -->
                    <v-select
                      v-model="deathyear"
                      tabindex="-7"
                      :items="years"
                      :label="$t('global.year')"
                    />
                    <!-- <span>{{ errors[0] }}</span> -->
                  <!-- </ValidationProvider> -->
                </v-col>
              </v-btn-toggle>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-container>
            <v-row>
              <v-spacer />
              <v-col>
                <v-row
                  justify="end"
                >
                  <v-btn
                    color="blue darken-1"
                    text
                    tabindex="-9"
                    @click.stop="close"
                  >
                    {{ $t('global.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    tabindex="-8"
                    :disabled="cannotSave"
                    @click.stop="addPersona"
                  >
                    {{ $t('global.ok') }}
                  </v-btn>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'PersonForm',
  data: () => ({
    fullname: '',
    birthday: null,
    birthmonth: null,
    birthyear: null,
    deathday: null,
    deathmonth: null,
    deathyear: null,
    showDialog: true,
  }),
  computed: {
    ...mapGetters({
      user: 'session/user',
    }),
    fullnameLabel() {
      return this.$t('persona.fullname');
    },
    birthdateLabel() {
      return this.$t('persona.birthdate');
    },
    deathdateLabel() {
      return this.$t('persona.deathdate');
    },
    days() {
      const days = [];
      for (let n = 1; n < 31; n += 1) {
        days.push(n);
      }
      return days;
    },
    months() {
      const months = [];
      for (let n = 1; n <= 12; n += 1) {
        months.push(n);
      }
      return months;
    },
    years() {
      const curYear = new Date().getFullYear();
      const years = [];
      for (let n = curYear; n >= 1900; n -= 1) {
        years.push(n);
      }
      return years;
    },
    cannotSave() {
      return !this.fullname || !this.birthday || !this.birthmonth || !this.birthyear;
    },
  },
  watch: {
    showDialog(newValue) {
      if (newValue === false) {
        this.close();
      }
    },
  },
  methods: {
    ...mapMutations([
      'snackMessage',
    ]),
    ...mapActions({
      login: 'session/login',
    }),
    async addPersona() {
      const start = new Date(this.birthyear, this.birthmonth, this.birthday);
      let end = new Date();

      if (this.deathyear && this.deathmonth && this.deathday) {
        end = new Date(this.deathyear, this.deathmonth, this.deathday);
      }

      this.$emit('add', {
        fullname: this.fullname,
        start,
        end,
      });
    },
    close() {
      this.$emit('close');
    },
    closeIfEscape(key) {
      if (key.keyCode === 27) {
        this.close();
      }
    },
  },
};
</script>
