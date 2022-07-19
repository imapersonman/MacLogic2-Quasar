<template>
  <q-dialog ref="dialog" model-value data-cy="unusedVariableDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section class="column">
        <div class="text-h6 row">Pick an unused Constant name to use with {{ tacticDisplay }}</div>
        <div class="row">Current Problem: {{ currentProblemDisplay }}</div>
      </q-card-section>
      <q-card-section>
        <q-card>
          <q-card-section>
            <q-radio v-for="(name, index) in possibleNames" class="row" v-model="unused_name_index" :label="name" :val="index" :data-cy="`nameIndex${index}`"></q-radio>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn @click="cancelDialog()" label="Cancel Tactic" v-close-popup data-cy="cancelTactic" />
        <q-btn ref="okayButton" @click="selectedName(unused_name_index)" label="Select" color="primary" v-close-popup data-cy="closeUnusedVariableDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  tacticDisplay: string
  currentProblemDisplay: string
  possibleNames: string[]
  cancelDialog(): void
  selectedName(name_index: number): void
}>()

const { possibleNames } = props

const dialog = ref(null)
const okayButton = ref(null)

const keyup_event_listener = (event) => {
  event.stopPropagation()
  if (event.code === 'Enter' && dialog.value !== null && okayButton.value !== null) {
    // @ts-ignore
    dialog.value.hide()
    // @ts-ignore
    okayButton.value.click()
  } else if (event.code === 'ArrowLeft' || event.code === 'ArrowUp')
    unused_name_index.value = unused_name_index.value === 0 ? possibleNames.length - 1 : (unused_name_index.value - 1) % possibleNames.length
  else if (event.code === 'ArrowRight' || event.code === 'ArrowDown')
    unused_name_index.value = unused_name_index.value === possibleNames.length - 1 ? 0 : (unused_name_index.value + 1) % possibleNames.length
}

onMounted(() => {
  addEventListener('keyup', keyup_event_listener)
  // window.addEventListener('keyup', keyup_event_listener)
})

onUnmounted(() => {
  removeEventListener('keyup', keyup_event_listener)
})

const unused_name_index = ref(0)

// const { tactic, currentProblem, cancelDialog } = props
</script>
