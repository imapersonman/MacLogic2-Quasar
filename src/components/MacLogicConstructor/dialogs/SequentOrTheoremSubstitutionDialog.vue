<template>
  <q-dialog ref="dialog" model-value data-cy="sequentOrTheoremSubstitutionDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section class="column">
        <div class="text-h6 row">Substitute values in to use with {{ tacticDisplay }}</div>
        <div class="row">Current Problem: {{ currentProblemDisplay }}</div>
        <div class="row">Rule: {{ subbed_rule }}</div>
      </q-card-section>
      <q-card-section>
        <q-card>
          <q-card-section class="column">
            <div class="row" v-for="(variable_id, index) in variableIds">
              <!-- <q-input class="col-12" :rules="[is_valid_prop_substitution_string]" v-model="sequent_substitutions[variable_id]" :label="`${variable_id}`" :key="index" :data-cy="`substitution${variable_id}`"></q-input> -->
              <q-input class="col-12" :autofocus="index === 0" :error="!is_valid_substitution_at_variable_id(variable_id)" v-model="sequent_substitutions[variable_id]" :label="`${variable_id}`" :key="index" :data-cy="`substitution${variable_id}`"></q-input>
            </div>
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn @click="cancelDialog()" label="Cancel Tactic" v-close-popup data-cy="cancelTactic" />
        <q-btn color="primary" ref="okayButton" @click="createdSubstitution(transformed_sub)" :disable="some_substitution_string_is_invalid" label="OK" v-close-popup data-cy="closeSequentOrTheoremSubstitutionDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Ref, ref, computed, onMounted, onUnmounted } from 'vue'
import { defined, is_empty } from 'coastline/src/utilities';
import { Ast } from 'coastline/src/lambda_pi/ast'
import { instantiate_rule_directly } from '../instantiate_rule';
import { unelaborate } from '../elaborate';
import { unparse } from '../parser';
import { Substitution } from 'coastline/src/unification/first_order';
import { is_valid_prop_string } from '../is_valid_prop';
import { ProvenSequentSubstitution } from '../construction_interaction';
import { parse_sequent_substitution } from '../parse_sequent_substitution';
import Parsimmon from 'parsimmon'
import { InputParser } from '../interfaces/input_parser';
import { MLElaborationErrorV1 } from '../interfaces/maclogic_ii_input_parser';
import { Ctx } from 'coastline/src/logical_framework/ctx';
import { is_proven_sequent, ProvenSequent } from '../proven_sequent';

const { ruleAst, variableIds, inputParser, problemCtx } = defineProps<{
  inputParser: InputParser<Parsimmon.Failure, MLElaborationErrorV1>
  problemCtx: Ctx
  tacticDisplay: string
  currentProblemDisplay: string
  variableIds: string[]
  ruleAst: Ast
  cancelDialog(): void
  createdSubstitution(sub: ProvenSequentSubstitution): void
}>()

const dialog = ref(null)
const okayButton = ref(null)

const keyup_event_listener = (event) => {
  event.stopPropagation()
  if (event.code === 'Enter' && dialog.value !== null && okayButton.value !== null && !some_substitution_string_is_invalid.value) {
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

const elaboration_pss: Ref<{ [variable_id: string]: ProvenSequent | Parsimmon.Failure | MLElaborationErrorV1 }> = computed(() => {
  let elaborations = {}
  let current_ctx: Ctx = problemCtx
  const sequent_substitution_entries = Object.entries(sequent_substitutions.value)
  let index = 0
  for (index = 0; index < sequent_substitution_entries.length; index++) {
    const id = sequent_substitution_entries[index][0]
    const instance_text = sequent_substitution_entries[index][1].length === 0
      ? id
      : sequent_substitution_entries[index][1]
    const elaborated = inputParser.parse_and_elaborate_with_ctx(current_ctx, instance_text)
    elaborations[id] = elaborated
    if (inputParser.is_parse_error(elaborated) || inputParser.is_elaboration_error(elaborated))
      break
    current_ctx = elaborated.assumptions
  }
  index++
  for (let rest_index = index; rest_index < sequent_substitution_entries.length; rest_index++)
    elaborations[sequent_substitution_entries[index][0]] = undefined
  return elaborations
})

const is_valid_substitution_at_variable_id = (id: string): boolean => {
  return !inputParser.is_parse_error(elaboration_pss.value[id]) && !inputParser.is_elaboration_error(elaboration_pss.value[id])
}

const concrete_is_valid_prop_string = is_valid_prop_string(inputParser)

const is_valid_prop_substitution_string = (s: string) => !defined(s) || concrete_is_valid_prop_string(s) || s.trim().length === 0
const some_substitution_string_is_invalid = computed(() => {
  const result = Object.values(elaboration_pss.value).some((ps) => !is_proven_sequent(ps))
  const found = Object.values(elaboration_pss.value).find((ps) => !is_proven_sequent(ps))
  return result
})

const sequent_substitutions: Ref<{ [variable_id: string]: string }> = ref({})
const subbed_rule = computed(() => { 
  const proven_sequent_sub_to_substitution = (pss: ProvenSequentSubstitution): Substitution => Object.entries(pss).reduce((acc, [id, ps]) => ({ ...acc, [id]: ps.proof }), {})
  const instance = instantiate_rule_directly(ruleAst, proven_sequent_sub_to_substitution(transformed_sub.value))
  const assumption_strings = instance[0].map(unelaborate).map(unparse)
  const conclusion_string = unparse(unelaborate(instance[1]))
  return `${assumption_strings.join(', ')}${is_empty(instance[0]) ? '' : ' '}⊢ ${conclusion_string}`
})
const transformed_sub = computed(() => {
  return parse_sequent_substitution(variableIds, sequent_substitutions.value)
})
</script>
