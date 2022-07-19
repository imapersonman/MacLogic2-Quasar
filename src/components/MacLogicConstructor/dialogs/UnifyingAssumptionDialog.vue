<template>
  <q-dialog ref="dialog" model-value data-cy="unifyingAssumptionDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section class="column">
        <div class="text-h6 row">Pick an Assumption to use with {{ tacticDisplay }}</div>
        <div class="row">Current Problem: {{ currentProblemDisplay }}</div>
      </q-card-section>
      <q-card-section>
        <q-card>
          <q-card-section class="column">
            <q-radio v-for="(uaDisplay, index) in unifyingAssumptionDisplays" @keyup="selectedAssumption(index)" class="row" v-model="ua_index" :label="uaDisplay" :val="index" :data-cy="`uaIndex${index}`"></q-radio>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn @click="cancelDialog()" label="Cancel Tactic" v-close-popup data-cy="cancelTactic" />
        <q-btn ref="okayButton" @click="selectedAssumption(ua_index)" label="Select" v-close-popup data-cy="closeUnifyingAssumptionDialog" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const dialog = ref(null)
const okayButton = ref(null)

const props = defineProps<{
  tacticDisplay: string
  currentProblemDisplay: string
  unifyingAssumptionDisplays: string[]
  cancelDialog(): void
  selectedAssumption(ua_index: number): void
}>()

const { unifyingAssumptionDisplays } = props

const keyup_event_listener = (event) => {
  event.stopPropagation()
  if (event.code === 'Enter' && okayButton !== null && dialog.value !== null) {
    // @ts-ignore
    okayButton.value.click()
    // @ts-ignore
    dialog.value.hide()
  } else if (event.code === 'ArrowUp' || event.code === 'ArrowLeft')
    // @ts-ignore
    ua_index.value = ua_index.value === 0 ? unifyingAssumptionDisplays.length - 1 : (ua_index.value - 1) % unifyingAssumptionDisplays.length
  else if (event.code === 'ArrowDown' || event.code === 'ArrowRight')
    // @ts-ignore
    ua_index.value = ua_index.value === unifyingAssumptionDisplays.length - 1 ? 0 : (ua_index.value + 1) % unifyingAssumptionDisplays.length
}

onMounted(() => {
  addEventListener('keyup', keyup_event_listener)
})

const ua_index = ref(0)
</script>
