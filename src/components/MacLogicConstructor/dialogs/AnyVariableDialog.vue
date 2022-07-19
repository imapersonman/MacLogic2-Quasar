<template>
  <q-dialog ref="dialog" model-value data-cy="anyVariableDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section class="column">
        <div class="text-h6 row">Type in the name of the Constant to use with {{ tacticDisplay }}</div>
        <div class="row">Current Problem: {{ currentProblemDisplay }}</div>
        <q-input autofocus v-model="picked_variable" :error="should_disable" label="Any Constant Name" data-cy="anyVariableInput"></q-input>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn @click="cancelDialog()" label="Cancel Tactic" v-close-popup data-cy="cancelTactic" />
        <q-btn ref="okayButton" :disable="should_disable" @click="confirmedName(picked_variable)" label="Set Name" v-close-popup data-cy="closeAnyVariableDialog" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { is_valid_constant_name, is_valid_variable_name } from '../valid_names';

const okayButton = ref(null)
const dialog = ref(null)

const keyup_event_listener = (event) => {
  event.stopPropagation()
  if (event.code === 'Enter' && dialog.value !== null && okayButton.value !== null && !should_disable.value) {
    // @ts-ignore
    okayButton.value.click()
    // @ts-ignore
    dialog.value.hide()
  }
}

onMounted(() => {
  addEventListener('keyup', keyup_event_listener)
})

onUnmounted(() => {
  removeEventListener('keyup', keyup_event_listener)
})

const { namesToAvoid } = defineProps<{
  tacticDisplay: string
  currentProblemDisplay: string
  namesToAvoid: string[]
  confirmedName(name: string): void
  cancelDialog(): void
}>()

const picked_variable = ref('')

const should_disable = computed(() => !is_valid_constant_name(picked_variable.value, namesToAvoid))
</script>
