<template>
  <q-dialog ref="dialog" model-value data-cy="enterProblemDialog" @hide="cancelPressed()">
    <q-card style="width: 100%">
      <q-card-section>
        <b>Enter Problem</b>
      </q-card-section>
      <q-card-section>
        <problem-entry-advice />
      </q-card-section>
      <q-card-section class="column">
        <!-- <div class="row"> -->
          <q-input autofocus :error="is_error_in_assumptions(assumptions_ctx)" class="row" label="Assumptions separated by a comma (e.g. A, B, ...)" v-model="assumptions_text" data-cy="assumptionsText" />
        <!-- </div> -->
        <!-- <div class="row"> -->
          <q-input :error="should_disable" class="row" label="Conclusion" v-model="conclusion_text" data-cy="conclusionText" />
        <!-- </div> -->
      </q-card-section>
      <q-card-actions>
        <q-btn ref="startButton" @click="start()" :disable="should_disable" label="Start" data-cy="start" v-close-popup color="primary"></q-btn>
        <q-btn label="Dismiss" data-cy="cancel" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProblemEntryAdvice from './ProblemEntryAdvice.vue'
import Parsimmon from 'parsimmon'
import { InputParser } from '../interfaces/input_parser';
import { mk_map } from 'coastline/src/map/RecursiveMap';
import { is_error_in_assumptions } from '../sequent_error';
import { is_sequent, Sequent } from 'coastline/src/construction/sequent';
import { MLElaborationErrorV1 } from '../interfaces/maclogic_ii_input_parser';

const props = defineProps<{
  inputParser: InputParser<Parsimmon.Failure, MLElaborationErrorV1>
  startPressed(seq: Sequent): void
  cancelPressed(): void
}>()

const { inputParser, startPressed } = props

const startButton = ref(null)
const dialog = ref(null)

const keyup_event_listener = (event) => {
  event.stopPropagation()
  if (event.code === 'Enter' && startButton.value !== null)
    // @ts-ignore
    startButton.value.click()
}

onMounted(() => {
  window.addEventListener('keyup', keyup_event_listener)
})

onUnmounted(() => {
  window.removeEventListener('keyup', keyup_event_listener)
})

const assumptions_text = ref('')
const conclusion_text = ref('')
// const should_disable = computed(() => !concrete_is_valid_prop_list_string(assumptions_text.value) || !concrete_is_valid_prop_string(conclusion_text.value))
const assumptions_ctx = computed(() => inputParser.parse_and_elaborate_assumptions_with_ctx(mk_map(), assumptions_text.value))
const elaborated_conclusion = computed(() => {
  if (is_error_in_assumptions(assumptions_ctx.value))
    return assumptions_ctx.value
  console.log('compuuutted conclusion')
  return inputParser.parse_and_elaborate_conclusion_with_ctx(assumptions_ctx.value, conclusion_text.value)
})
const should_disable = computed(() => !is_sequent(elaborated_conclusion.value))

const start = () => {
  if (is_sequent(elaborated_conclusion.value)) {
    // @ts-ignore
    dialog.value.hide()
    return startPressed(elaborated_conclusion.value)
  }
}
</script>
