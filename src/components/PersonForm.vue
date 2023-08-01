<template>
  <v-container
    fluid
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
                <v-text-field
                  v-model="fullname"
                  type="text"
                  required
                  :label="fullnameLabel"
                  :error-messages="fullnameErrors"
                  :rules="fullnameRules"
                  @keyup.enter="addPersona"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-btn-toggle>
                <v-col>
                  <v-select
                    v-model="birthday"
                    :items="days"
                    :label="$t('global.day')"
                    :hint="$t('persona.birthdate')"
                    required
                    persistent-hint
                  />
                </v-col>
                <v-col>
                  <v-select
                    v-model="birthmonth"
                    :items="months"
                    :label="$t('global.month')"
                    required
                  />
                </v-col>
                <v-col>
                  <v-select
                    v-model="birthyear"
                    :items="years"
                    :label="$t('global.year')"
                    required
                  />
                </v-col>
              </v-btn-toggle>
            </v-row>
            <v-row>
              <v-btn-toggle>
                <v-col>
                  <v-select
                    v-model="deathday"
                    :items="days"
                    :label="$t('global.day')"
                    :hint="$t('persona.deathdate')"
                    persistent-hint
                  />
                </v-col>
                <v-col>
                  <v-select
                    v-model="deathmonth"
                    :items="months"
                    :label="$t('global.month')"
                  />
                </v-col>
                <v-col>
                  <v-select
                    v-model="deathyear"
                    :items="years"
                    :label="$t('global.year')"
                  />
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
                <v-row justify="end">
                  <v-btn
                    color="blue darken-1"
                    text
                    @click.stop="close"
                  >
                    {{ $t('global.close') }}
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
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
import { useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  name: 'PersonForm',
  emits: {
    add: null,
    close: null,
  },
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
  mounted() {
    const { value: fullname, errorMessage: fullnameError } = useField('fullname');

    this.fullname = fullname;
    this.fullnameErrors = fullnameError;

    this.fullnameRules = [
      async (value) => {
        try {
          await yup.string().required().validate(value);
          return true;
        } catch (error) {
          return this.$t(error.message);
        }
      },
    ];
  },
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
    ...mapMutations(['snackMessage']),
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
