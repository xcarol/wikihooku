<template>
  <v-dialog
    v-model="showDialog"
    max-width="600px"
    :fullscreen="$vuetify.display.xs"
    scrollable
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('collection.title') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="collectionName"
                type="text"
                required
                :label="collectionNameLabel"
                :rules="collectionNameRules"
                @keyup.enter="saveCollection"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-alert
        :model-value="errorMessage !== ''"
        closable
        variant="outlined"
        type="error"
      >
        {{ errorMessage }}
      </v-alert>
      <v-divider />
      <v-card-actions>
        <v-spacer />
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
          :loading="loading"
          :disabled="!cansaveCollection"
          @click.stop="saveCollection"
        >
          {{ $t('collection.button') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useField } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';
import { useApi } from '../plugins/api';

const props = defineProps({
  currentName: {
    type: String,
    default: '',
  },
});

const emits = defineEmits(['close']);
const { t: $t } = useI18n();
const api = useApi();
const { getters, dispatch } = useStore();

const showDialog = ref(true);
const errorMessage = ref('');
const loading = ref(false);

const collectionNameLabel = computed(() => $t('collection.title'));

const close = () => emits('close');

watch(showDialog, (val) => {
  if (val === false) {
    close();
  }
});

const collectionNameRules = [
  async (value) => {
    try {
      await yup.string().required().validate(value);
      return true;
    } catch (error) {
      return $t(error.message);
    }
  },
];

const {
  value: collectionName,
  meta: collectionNameMeta,
  resetField: collectionNameReset,
} = useField('collectionName', collectionNameRules);

collectionNameReset({
  value: props.currentName,
});

const cansaveCollection = computed(
  () => collectionNameMeta.valid && collectionName.value?.length > 0
);

const saveCollection = async () => {
  errorMessage.value = '';

  loading.value = true;
  try {
    const entities = getters['wiki/entities'];
    const user = getters['session/user'];
    const items = entities.flat();
    await dispatch('collections/save', {
      userId: user._id,
      name: collectionName.value,
      items,
    });
    close();
  } catch (error) {
    loading.value = false;
    errorMessage.value = $t(api.getErrorMessage(error));
  }
};
</script>
