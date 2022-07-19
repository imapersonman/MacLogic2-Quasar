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
            <q-input :error="variable_input_is_invalid" v-model="variable_input" label="x" data-cy="variable" />
            <q-input autofocus :error="statement_input_is_invalid" v-model="statement_input" label="Φx" data-cy="scope" />
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn @click="cancelDialog()" label="Cancel Tactic" v-close-popup data-cy="cancelTactic" />
        <q-btn color="primary" ref="okayButton" @click="okayPressed()" :disable="should_disable" label="OK" v-close-popup data-cy="closeQuantifierShiftSubstitutionDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { free_variables } from 'coastline/src/lambda_pi/free_variables';
import { app, la, ov } from 'coastline/src/lambda_pi/shorthands';
import { defined, string_in_array } from 'coastline/src/utilities';
import { Ctx } from 'coastline/src/logical_framework/ctx';
import Parsimmon from 'parsimmon'
import { TacticId } from '../construction_interaction';
import { InputParser } from '../interfaces/input_parser';
import { MLElaborationErrorV1 } from '../interfaces/maclogic_ii_input_parser';
import { ProvenSequent } from '../proven_sequent';
import { is_valid_variable_name } from '../valid_names';
import { exists, forall, i, not, pred } from '../maclogic_shorthands';
import { QBtn } from 'quasar';
import { Ast } from 'coastline/src/lambda_pi/ast';

const props = defineProps<{
  inputParser: InputParser<Parsimmon.Failure, MLElaborationErrorV1>
  displayStatement: (ast: Ast) => string
  problemCtx: Ctx
  tactic: TacticId
  tacticDisplay: string
  currentProblemDisplay: string
  cancelDialog(): void
  createdSubstitution(ps: ProvenSequent): void
}>()

const okayButton = ref(null)

const keyup_event_listener = (event) => {
  if (event.code === 'Enter' && !should_disable.value && defined(okayButton.value))
    // @ts-ignore
    okayButton.value.click()
}

onMounted(() => {
  addEventListener('keyup', keyup_event_listener)
})

onUnmounted(() => {
  removeEventListener('keyup', keyup_event_listener)
})

const variable_input = ref('')
const statement_input = ref('')

const { problemCtx, inputParser, tactic, displayStatement, createdSubstitution } = props

const subbed_rule_f = (v, s) => ({
  'qs1': `${displayStatement(forall(v, not(s)))} ⊢ ${displayStatement(not(exists(v, s)))}`,
  'qs2': `${displayStatement(not(exists(v, s)))} ⊢ ${displayStatement(forall(v, not(s)))}`,
  'qs3': `${displayStatement(exists(v, not(s)))} ⊢ ${displayStatement(not(forall(v, s)))}`,
  'qs4': `${displayStatement(not(forall(v, s)))} ⊢ ${displayStatement(exists(v, not(s)))}`
}[tactic])

const default_variable = ov('x')
const default_statement = app(ov('Φ'), ov('x'))

const subbed_rule = computed(() => subbed_rule_f(
  variable_input_is_invalid.value ? default_variable : variable_to_use.value,
  statement_input_is_invalid.value ? default_statement : parsed_statement.value
))

const variable_to_use = computed(() =>
  variable_input.value.length === 0 ? default_variable
  : !is_valid_variable_name(variable_input.value) ? undefined
  : ov(variable_input.value))

const parsed_statement = computed(() => {
  if (variable_input_is_invalid.value)
    return undefined
  const parsed = inputParser.parse_ast(statement_input.value)
  if (inputParser.is_parse_error(parsed))
    return undefined
  return parsed
})

const elaborated_statement = computed(() => {
  if (!defined(parsed_statement.value) || !defined(variable_to_use.value))
    return undefined
  const parsed = parsed_statement.value
  const fvs = free_variables([], parsed).map((v) => v.id)
  if (!string_in_array(fvs, variable_to_use.value.id))
    return undefined
  const elaborated = inputParser.elaborate_ast_with_sort(problemCtx, la(variable_to_use.value, i, parsed), pred(1))
  console.log(elaborated)
  if (inputParser.is_parse_error(elaborated) || inputParser.is_elaboration_error(elaborated))
    return undefined
  return elaborated
})

const variable_input_is_invalid = computed(() => !defined(variable_to_use.value))
const statement_input_is_invalid = computed(() => !defined(elaborated_statement.value))

const should_disable = computed(() =>
  variable_input_is_invalid.value 
  || statement_input_is_invalid.value
)

const okayPressed = () => {
  if (defined(elaborated_statement.value) && !should_disable.value) {
    createdSubstitution(elaborated_statement.value)
  }
}
</script>
