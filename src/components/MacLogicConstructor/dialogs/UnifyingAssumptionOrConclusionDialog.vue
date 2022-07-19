<template>
  <q-dialog ref="dialog" model-value data-cy="unifyingAssumptionOrConclusionDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section class="column">
        <div class="text-h6 row">Pick an Assumption or Conclusion to use with {{ tacticDisplay }}</div>
        <div class="row">Current Problem: {{ currentProblemDisplay }}</div>
      </q-card-section>
      <q-card-section>
        <q-card>
          <q-card-section class="column">
            <q-radio v-for="(ua_display, index) in unifyingAssumptionDisplays" @keyup.enter="selectedAssumptionOrConclusion(index)" class="row" v-model="uac_index" :label="ua_display" :val="index" :data-cy="`uacIndex${index}`"></q-radio>
            <q-radio v-if="defined(unifyingConclusionDisplay)" :val="unifyingAssumptionDisplays.length" @keyup.enter="selectedAssumptionOrConclusion(unifyingAssumptionDisplays.length)" v-model="uac_index" :label="unifyingConclusionDisplay" :data-cy="`uacIndex${unifyingAssumptionDisplays.length}`"></q-radio>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn @click="cancelDialog()" label="Cancel Tactic" v-close-popup data-cy="cancelTactic" />
        <q-btn ref="okayButton" @click="selectedAssumptionOrConclusion(uac_index)" label="Select" color="primary" v-close-popup data-cy="closeUnifyingAssumptionOrConclusionDialog" primary />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defined } from 'coastline/src/utilities'
import { onMounted, onUnmounted, ref } from 'vue'

const dialog = ref(null)
const okayButton = ref(null)

const props = defineProps<{
  tacticDisplay: string
  currentProblemDisplay: string
  unifyingAssumptionDisplays: string[]
  unifyingConclusionDisplay: string | undefined
  cancelDialog(): void
  selectedAssumptionOrConclusion(uac_index: number): void
}>()

const { unifyingAssumptionDisplays, unifyingConclusionDisplay } = props

const keyup_event_listener = (event) => {
  event.stopPropagation()
  if (event.code === 'Enter' && dialog.value !== null && okayButton.value !== null) {
    // @ts-ignore
    okayButton.value.click()
    // @ts-ignore
    dialog.value.hide()
  } else if (event.code === 'ArrowUp' || event.code === 'ArrowLeft')
    // @ts-ignore
    uac_index.value = uac_index.value === 0 ? unifyingAssumptionDisplays.length : (uac_index.value - 1)
  else if (event.code === 'ArrowDown' || event.code === 'ArrowRight')
    // @ts-ignore
    uac_index.value = uac_index.value === unifyingAssumptionDisplays.length ? 0 : (uac_index.value + 1) % (unifyingAssumptionDisplays.length + 1)
}

onMounted(() => {
  addEventListener('keyup', keyup_event_listener)
})

onUnmounted(() => {
  removeEventListener('keyup', keyup_event_listener)
})

const uac_index = ref(0)
</script>
