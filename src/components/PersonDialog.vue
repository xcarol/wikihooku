<template>
  <v-container fluid>
    <v-dialog
      v-model="showDialog"
      max-width="600px"
      :fullscreen="$vuetify.display.xs"
      scrollable
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('person.title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="fullname"
                  type="text"
                  required
                  :label="$t('person.fullname')"
                  :rules="fullnameRules"
                  @keyup.enter="addPerson"
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
                    :hint="$t('person.birthdate')"
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
                    :hint="$t('person.deathdate')"
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
                    :disabled="!canSave"
                    @click.stop="addPerson"
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

<script setup>
import { ref, computed, watch } from 'vue';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { uuid } from 'vue-uuid';
import * as yup from 'yup';
import WikiPerson from '../lib/wikiPerson';

const emits = defineEmits(['add', 'close']);
const { t: $t } = useI18n();

const showDialog = ref(true);
const birthday = ref('');
const birthmonth = ref('');
const birthyear = ref('');
const deathday = ref('');
const deathmonth = ref('');
const deathyear = ref('');

const fullnameRules = [
  async (value) => {
    try {
      await yup.string().required().validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];
const { value: fullname, meta: fullnameMeta } = useField('fullname', fullnameRules);

const days = [...Array(30)].map((_, i) => i + 1);
const months = [...Array(12)].map((_, i) => i + 1);
const years = [...Array(new Date().getFullYear() - 1899)].map(
  (_, i) => new Date().getFullYear() - i,
);

const canSave = computed(
  () =>
    fullname.value && fullnameMeta.valid && birthday.value && birthmonth.value && birthyear.value,
);

const addPerson = () => {
  const person = new WikiPerson();
  const start = new Date(birthyear.value, birthmonth.value - 1, birthday.value);
  let end;

  if (deathyear.value && deathmonth.value && deathday.value) {
    end = new Date(deathyear.value, deathmonth.value - 1, deathday.value);
  }

  person.setPerson(`WH-${uuid.v4()}`, fullname.value, start.toJSON(), end?.toJSON());
  emits('add', person);
};

const close = () => emits('close');

watch(showDialog, (val) => {
  if (val === false) {
    close();
  }
});
</script>
