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
            <q-input :error="old_variable_input_is_invalid" v-model="old_variable_input" label="x" data-cy="old_variable" />
            <q-input autofocus :error="statement_input_is_invalid" v-model="statement_input" label="Φx" data-cy="scope" />
            <q-input :error="new_variable_input_is_invalid" v-model="new_variable_input" label="y" data-cy="new_variable" />
          </q-card-section>
        </q-card>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn @click="cancelDialog()" label="Cancel Tactic" v-close-popup data-cy="cancelTactic" />
        <q-btn color="primary" ref="okayButton" @click="okayPressed()" :disable="should_disable" label="OK" v-close-popup data-cy="closeAlphabeticVarianceSubstitutionDialog" />
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
import { ProvenSequent, proven_sequent } from '../proven_sequent';
import { is_valid_variable_name } from '../valid_names';
import { exists, forall, i, pred } from '../maclogic_shorthands';
import { QBtn } from 'quasar';
import { Ast, Variable } from 'coastline/src/lambda_pi/ast';
import { substitute } from 'coastline/src/lambda_pi/substitute';
import { bound_variables } from 'coastline/src/lambda_pi/bound_variables';
// import { ast_to_string } from 'coastline/src/lambda_pi/utilities';

const props = defineProps<{
  inputParser: InputParser<Parsimmon.Failure, MLElaborationErrorV1>
  displayStatement: (ast: Ast) => string
  problemCtx: Ctx
  tactic: TacticId
  tacticDisplay: string
  currentProblemDisplay: string
  cancelDialog(): void
  createdSubstitution(old_variable: Variable, ps: ProvenSequent): void
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

const old_variable_input = ref('')
const new_variable_input = ref('')
const statement_input = ref('')

const { problemCtx, inputParser, tactic, displayStatement, createdSubstitution } = props

const subbed_rule_f = (old_v, v, s: (v: Variable) => Ast) => ({
  'avu': `${displayStatement(forall(old_v, s(old_v)))} ⊢ ${displayStatement(forall(v, s(v)))}`,
  'ave': `${displayStatement(exists(old_v, s(old_v)))} ⊢ ${displayStatement(exists(v, s(v)))}`
}[tactic])

const default_old_variable = ov('x')
const default_new_variable = ov('y')
const default_statement = (v: Variable) => app(ov('Φ'), v)

const subbed_rule = computed(() => {
  const old_v = old_variable_input_is_invalid.value ? default_old_variable : old_variable_to_use.value!
  const new_v = new_variable_input_is_invalid.value ? default_new_variable : new_variable_to_use.value!
  return subbed_rule_f(
    old_v,
    new_v,
    statement_input_is_invalid.value ? default_statement : (v) => substitute(old_v, v, parsed_statement.value!)
  )
})

const old_variable_to_use = computed(() =>
  old_variable_input.value.length === 0 ? default_old_variable
  : !is_valid_variable_name(old_variable_input.value) ? undefined
  : ov(old_variable_input.value))

const new_variable_to_use = computed(() =>
  new_variable_input.value.length === 0 ? default_new_variable
  : !is_valid_variable_name(new_variable_input.value) ? undefined
  : ov(new_variable_input.value))

const parsed_statement = computed(() => {
  if (old_variable_input_is_invalid.value)
    return undefined
  const parsed = inputParser.parse_ast(statement_input.value)
  if (inputParser.is_parse_error(parsed))
    return undefined
  return parsed
})

const elaborated_statement = computed(() => {
  if (!defined(parsed_statement.value) || !defined(old_variable_to_use.value))
    return undefined
  const parsed = parsed_statement.value
  const fvs = free_variables([], parsed).map((v) => v.id)
  if (!string_in_array(fvs, old_variable_to_use.value.id))
    return undefined
  const elaborated = inputParser.elaborate_ast_with_sort(problemCtx, la(old_variable_to_use.value, i, parsed), pred(1))
  if (inputParser.is_parse_error(elaborated) || inputParser.is_elaboration_error(elaborated))
    return undefined
  return elaborated
})

const new_elaborated_statement = computed(() => {
  if (!defined(elaborated_statement.value) || !defined(old_variable_to_use.value) || !defined(new_variable_to_use.value) || !defined(parsed_statement.value))
    return undefined
  // the new variable should not be bound in the parsed statement!
  // if it were, substitute will rename the bound variable, which we do not want to happen.
  const elaborated = elaborated_statement.value
  const bvs = bound_variables(elaborated.proof).map((v) => v.id)
  if (string_in_array(bvs, new_variable_to_use.value.id))
    return undefined
  return proven_sequent(
    elaborated.assumptions,
    la(new_variable_to_use.value, i, substitute(old_variable_to_use.value, new_variable_to_use.value, parsed_statement.value)),
    elaborated.sort)
})

const old_variable_input_is_invalid = computed(() => !defined(old_variable_to_use.value))
const new_variable_input_is_invalid = computed(() => !defined(new_variable_to_use.value))
const statement_input_is_invalid = computed(() => !defined(new_elaborated_statement.value))

const should_disable = computed(() =>
  old_variable_input_is_invalid.value 
  || new_variable_input_is_invalid.value
  || statement_input_is_invalid.value
)

const okayPressed = () => {
  if (defined(elaborated_statement.value) && defined(old_variable_to_use.value) && new_elaborated_statement.value && !should_disable.value) {
    createdSubstitution(old_variable_to_use.value, new_elaborated_statement.value)
  }
}
</script>
