<template>
  <q-layout view="hHh LpR lFf">
    <!-- Displaying Error -->
    <div v-if="defined(display_error)">
      <q-dialog ref="dialog" model-value persistent>
        <q-card>
          <q-card-section class="text-h5">Something bad happened and MacLogic doesn't know why!</q-card-section>
          <q-card-section>
            Please copy this message and send it to adjorlolo.k@northeastern.edu with the subject "MacLogic II Bug".
            Include a brief description of what you were doing before you encountered this message.
          </q-card-section>
          <q-card-section>
              {{ display_error.error }}
          </q-card-section>
          <q-card-section>
            Component:
            <pre>
{{ JSON.stringify(display_error.vm, null, 2) }}
            </pre>
          </q-card-section>
          <q-card-section>
            State:
            <pre>
{{ JSON.stringify(display_maclogic_state(state), null, 2) }}
            </pre>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <div v-if="defined(state.error)">
      <div v-if="state.error.type === 'VariableAlreadyUsed'"></div>
      <div v-else-if="state.error.type === 'NoUnifyingConclusion'">
        <no-unifying-conclusion-found-dialog
          :tactic-display="tactic_display"
          :pattern="ast_to_display(state.error.pattern)"
          :conclusion="current_problem_display.conclusion"
          :cancel-dialog="() => ic.forgetful_undo()"
        />
      </div>
      <div v-else-if="state.error.type === 'NoUnifyingAssumptionsFound'">
        <no-unifying-assumptions-found-dialog
          :tactic-display="tactic_display"
          :pattern="ast_to_display(state.error.pattern)"
          :cancel-dialog="() => ic.forgetful_undo()"
        />
      </div>
      <div v-else-if="state.error.type === 'NoUnifyingAssumptionsOrConclusionFound'">
        <no-unifying-assumptions-or-conclusion-found-dialog
          :tactic-display="tactic_display"
          :pattern="ast_to_display(state.error.pattern)"
          :cancel-dialog="() => ic.forgetful_undo()"
        />
      </div>
      <div v-else-if="state.error.type === 'VariableIsNotFree'">
        <!-- This error shouldn't occur anymore, since user input is checked before start can be pressed -->
        <!-- <variable-is-not-free-dialog
          :current-problem="current_problem_string"
          :constant-name="state.error.name"
          :cancel-dialog="() => ic.forgetful_undo()"
        /> -->
      </div>
    </div>
    <!-- Displaying Request -->
    <div v-else-if="defined(state.request)">
      <div v-if="state.request.type === 'UnusedFreeVariable'">
        <unused-variable-dialog
          :tactic-display="tactic_to_display(selected_tactic)"
          :current-problem-display="current_problem_string"
          :possible-names="state.request.possible_names"
          :cancel-dialog="() => ic.forgetful_undo()"
          :selected-name="(name_index) => ic.step({ type: 'UnusedFreeVariable', value: name_index })"
        />
      </div>
      <div v-else-if="state.request.type === 'AnyFreeVariable'">
        <any-variable-dialog
          :tactic-display="tactic_to_display(selected_tactic)"
          :names-to-avoid="state.request.bound_variables.map((bv) => bv.id)"
          :current-problem-display="current_problem_string"
          :confirmed-name="(new_name) => ic.step({ type: 'AnyFreeVariable', value: new_name})"
          :cancel-dialog="() => ic.forgetful_undo()"
        />
      </div>
      <div v-else-if="state.request.type === 'UnifyingAssumption'">
        <unifying-assumption-dialog
          :tacticDisplay="tactic_to_display(selected_tactic)"
          :current-problem-display="current_problem_string"
          :unifying-assumption-displays="state.request.uas.map((ua) => defined(state.request) && state.request.type === 'UnifyingAssumption' ? unifying_assumption_instance_to_display(state.request.pattern, ua.unifier) : 'ERROR')"
          :cancelDialog="() => ic.forgetful_undo()"
          :selected-assumption="(ua_index) => ic.step({ type: 'UnifyingAssumption', value: ua_index })"
        />
      </div>
      <div v-else-if="state.request.type === 'UnifyingAssumptionOrConclusion'">
        <unifying-assumption-or-conclusion-dialog
          :tactic-display="tactic_to_display(selected_tactic)"
          :current-problem-display="current_problem_string"
          :unifying-assumption-displays="state.request.uas.map((ua) => defined(state.request) && state.request.type === 'UnifyingAssumptionOrConclusion' ? unifying_assumption_instance_to_display(state.request.pattern, ua.unifier) : 'ERROR')"
          :unifying-conclusion-display="defined(state.request) && defined(state.request.uc) && state.request.type === 'UnifyingAssumptionOrConclusion' ? unifying_assumption_instance_to_display(state.request.pattern, state.request.uc) : undefined"
          :cancel-dialog="() => ic.forgetful_undo()"
          :selected-assumption-or-conclusion="(uac_index) => ic.step({ type: 'UnifyingAssumptionOrConclusion', value: uac_index })"
        />
      </div>
      <div v-else-if="state.request.type === 'SequentOrTheoremSubstitution'">
        <sequent-or-theorem-substitution-dialog
          :input-parser="ip"
          :problem-ctx="state.problem_ctx"
          :tactic-display="tactic_to_display(selected_tactic)"
          :current-problem-display="current_problem_string"
          :variable-ids="state.request.variable_ids"
          :rule-ast="assert_def(selected_tactic_rule)"
          :cancel-dialog="() => ic.forgetful_undo()"
          :created-substitution="(sub) => ic.step({ type: 'SequentOrTheoremSubstitution', value: sub })"
        />
      </div>
      <div v-else-if="state.request.type === 'QuantifierShiftSubstitution'">
        <quantifier-shift-substitution-dialog
          :input-parser="ip"
          :display-statement="ast_to_display"
          :problem-ctx="state.problem_ctx"
          :tactic="selected_tactic"
          :tactic-display="tactic_to_display(selected_tactic)"
          :current-problem-display="current_problem_string"
          :cancel-dialog="() => ic.forgetful_undo()"
          :created-substitution="(ps) => ic.step({ type: 'QuantifierShiftSubstitution', value: ps })"
        />
      </div>
      <div v-else-if="state.request.type === 'AlphabeticVarianceSubstitution'">
        <alphabetic-variance-substitution-dialog
          :input-parser="ip"
          :display-statement="ast_to_display"
          :problem-ctx="state.problem_ctx"
          :tactic="selected_tactic"
          :tactic-display="tactic_to_display(selected_tactic)"
          :current-problem-display="current_problem_string"
          :cancel-dialog="() => ic.forgetful_undo()"
          :created-substitution="(old_v, ps) => ic.step({ type: 'AlphabeticVarianceSubstitution', value: { old_variable: old_v.id, proven_sequent: ps } })"
        />
      </div>
    </div>

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" data-cy="leftMenu" />

        <q-toolbar-title>
          MacLogic II
        </q-toolbar-title>

      </q-toolbar>

      <!-- <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs> -->
    </q-header>

    <q-drawer class="column" show-if-above v-model="leftDrawerOpen" side="left" :breakpoint="700" bordered>
      <problem-browser
        :input-parser="ip"
        :initial_directory="root_directory"
        :problem_selected="problem_selected"
        :sequent_entered="start"
        :clear_selection="custom_problem_pressed"
        :show_custom_problem_dialog="show_custom_problem_dialog"
      />
      <!-- <q-list separator class="q-pa-md">
        <q-item class="row" v-for="(problem, index) in problems" :key="index" clickable bordered separator v-ripple>
          <q-item-section>{{ `${problem_to_display(problem.assumptions, problem.conclusion)} ` }}</q-item-section>
        </q-item>
      </q-list> -->
    </q-drawer>

    <q-drawer :value="true" show-if-above side="right" :breakpoint="700" bordered persistent>
      <div class="q-pa-md">
        <div class="row" v-for="(row, index) in visible_tactics" :key="index">
          <hr style="width: 100%;" v-if="!defined(row)" />
          <div v-else-if="is_string(row)">{{ row }}</div>
          <div v-else>
            <q-radio
              :disable="state.mode !== 'EnterTactic'"
              v-for="(id, index) in row"
              :key="index"
              v-model="selected_tactic"
              :label="tactic_to_display(id)"
              @keyup.enter="run_tactic(id)"
              :val="id"
              :data-cy="`${id}Tactic`"
            />
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <!-- <router-view /> -->
      <q-splitter
        v-model="splitter_model"
        horizontal
        class="window-height"
      >

        <template v-slot:before>
          <div class="q-pa-md">
            <current-problem-display v-if="state.mode === 'EnterTactic'"
              :assumptions="current_problem_display.assumptions ?? []"
              :conclusion="current_problem_display.conclusion ?? ''"
            />
            <div class="text-h5" v-else-if="state.mode === 'EnterProblem'">
              Select a Problem using the Menu on the Left
            </div>
            <div v-if="state.mode === 'Finished'">
              <proof
                :key="main_problem_string"
                :proof="assert_def(state.proof)"
                :statement_to_string="ast_to_display"
                :reason_map="constant_name_ml_reason"
              ></proof>
            </div>
          </div>
        </template>

        <template v-slot:after v-if="state.mode === 'EnterTactic' || state.mode === 'Finished'">
          <div class="q-pa-md">
            <derivation-display :derivation-tree="derivation_tree" :problem-ids="expanded_derivation_ids"></derivation-display>
          </div>
        </template>

      </q-splitter>
    </q-page-container>

    <!--
    1985A1
    4C5C68
    46494C
    C5C3C6
    DCDCDD
    -->

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div v-if="state.mode === 'EnterTactic'">Proving {{ main_problem_string }}</div>
          <div v-if="state.mode === 'Finished'">Finished Proving {{ main_problem_string }}</div>
        </q-toolbar-title>
        <q-btn :disable="state.mode === 'EnterProblem' || !state.can_undo" @click="restart_problem()" class="q-mr-md" label="Restart" data-cy="restart" />
        <!-- If a control in the footer or main view is focused, enter should still run tactics, even though this looks weird visually. -->
        <q-btn :disable="!can_undo" @mousedown.prevent="ic.undo()" type="button" class="q-mr-md" label="Undo" data-cy="undo" />
        <q-btn :disable="!can_redo" @mousedown.prevent="ic.redo()" type="button" class="q-mr-md" label="Redo" data-cy="redo" />
        <q-btn ref="runTacticButton" :disable="!can_run_tactic" @click="run_tactic(selected_tactic)" class="q-mr-md" color="primary" label="Run" data-cy="runTactic" />
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">
import { Ref, ref, computed, watchEffect, onMounted, onUnmounted, onErrorCaptured } from 'vue'

import CurrentProblemDisplay from 'src/components/MacLogicConstructor/panels/CurrentProblemDisplay.vue'
import DerivationDisplay from 'src/components/MacLogicConstructor/panels/DerivationDisplay.vue'
import Proof from 'src/components/MacLogicConstructor/panels/Proof.vue'
import ProblemBrowser from 'src/components/MacLogicConstructor/panels/ProblemBrowser.vue';

import UnusedVariableDialog from 'src/components/MacLogicConstructor/dialogs/UnusedVariableDialog.vue';
import AnyVariableDialog from 'src/components/MacLogicConstructor/dialogs/AnyVariableDialog.vue';
import UnifyingAssumptionDialog from 'src/components/MacLogicConstructor/dialogs/UnifyingAssumptionDialog.vue';
import UnifyingAssumptionOrConclusionDialog from 'src/components/MacLogicConstructor/dialogs/UnifyingAssumptionOrConclusionDialog.vue';
import SequentOrTheoremSubstitutionDialog from 'src/components/MacLogicConstructor/dialogs/SequentOrTheoremSubstitutionDialog.vue';
import NoUnifyingConclusionFoundDialog from 'src/components/MacLogicConstructor/dialogs/NoUnifyingConclusionFoundDialog.vue';
import NoUnifyingAssumptionsFoundDialog from 'src/components/MacLogicConstructor/dialogs/NoUnifyingAssumptionsFoundDialog.vue';
import NoUnifyingAssumptionsOrConclusionFoundDialog from 'src/components/MacLogicConstructor/dialogs/NoUnifyingAssumptionsOrConclusionFoundDialog.vue';

import { first, is_empty, is_string } from 'coastline/src/utilities'
import { interaction, MacLogicInput, MacLogicState, sig, TacticId } from 'src/components/MacLogicConstructor/construction_interaction'
import { defined } from 'coastline/src/utilities'
import { SubProblem } from 'coastline/src/construction/check_proof_insert'
import { apply_substitution_ast, Substitution } from 'coastline/src/unification/first_order'
import { Ast, Lambda } from 'coastline/src/lambda_pi/ast'
import { is_closed_problem, is_current_problem, is_open_problem, is_split_problem, ProblemTree } from 'src/components/MacLogicConstructor/problem_tree';
import { MacLogicIIDisplay } from 'src/components/MacLogicConstructor/interfaces/maclogic_ii_display';
import { root_directory } from 'assets/maclogic_problems'
import { InteractionController } from 'src/components/MacLogicConstructor/interaction_controller';
import { con } from 'coastline/src/lambda_pi/shorthands';
import { ProblemCommand, ProblemDescription } from 'src/components/MacLogicConstructor/problem_browser';
import { Sequent } from 'coastline/src/construction/sequent';
import { MacLogicIIInputerParser } from 'src/components/MacLogicConstructor/interfaces/maclogic_ii_input_parser';
import { QBtn } from 'quasar';
import QuantifierShiftSubstitutionDialog from '../components/MacLogicConstructor/dialogs/QuantifierShiftSubstitutionDialog.vue';
import AlphabeticVarianceSubstitutionDialog from 'src/components/MacLogicConstructor/dialogs/AlphabeticVarianceSubstitutionDialog.vue';
import { display_maclogic_state } from 'src/components/MacLogicConstructor/construction_interaction'

const { tactic_to_display, ast_to_display, sequent_to_display, current_problem_to_display } = new MacLogicIIDisplay()
// const { tactic_to_display, ast_to_display, sequent_to_display, current_problem_to_display } = new LambdaPiDisplay()

const ip = new MacLogicIIInputerParser()

const unifying_assumption_instance_to_display = (pattern: Ast, unifier: Substitution) => {
  const instance = apply_substitution_ast(unifier, pattern)
  return ast_to_display(instance)
}

const runTacticButton: Ref<HTMLElement | null> = ref(null)

const keyup_event_listener = (event) => {
  if (event.code === 'Enter' && runTacticButton.value !== null && can_run_tactic.value && !defined(state.value.request))
    // @ts-ignore
    runTacticButton.value.click()
}

onMounted(() => {
  window.addEventListener('keyup', keyup_event_listener)
})

onUnmounted(() => {
  window.removeEventListener('keyup', keyup_event_listener)
})

const selected_tactic_rule: Ref<Ast | undefined> = computed(() => sig.lookup(con(selected_tactic.value)))
const main_problem_string_split = computed(() => main_problem_string.value.split('⊢').map((s) => s.trim()))
const main_problem_string = computed(() => defined(state.value.main_problem) ? sequent_to_display(state.value.main_problem) : '')
const current_problem_string = computed(() => current_problem_display_from_state(state.value))

const ic = ref(new InteractionController(interaction))
const state = computed(() => ic.value.state)

const maclogic_inputs_to_problem_command_string = (inputs: MacLogicInput[]): string => {
  const input_to_problem_command = (input: MacLogicInput): ProblemCommand => {
    if (input.type === 'SequentOrTheoremSubstitution')
      return { type: 'SequentOrTheoremSubstitution', value: Object.entries(input.value).map(([key, ps]) => [key, ast_to_display(ps.proof)]) }
    if (input.type === 'QuantifierShiftSubstitution') {
      const l = input.value.proof as Lambda
      return { type: 'QuantifierShiftSubstitution', value: { variable: l.bound.id, scope: ast_to_display(l.scope) } }
    }
    // Dangerous cast, but should be fine in most cases.
    return input as ProblemCommand
  }
  const problem_command_to_string = (pc: ProblemCommand): string => {
    return `{ type: '${pc.type}', value: ${pc.type === 'SequentOrTheoremSubstitution' ? `[${pc.value.map(([key, ast]) => `['${key}', '${ast}']`)}]` : is_string(pc.value) ? `'${pc.value}'` : pc.value} }`
  }
  return `[\n\t${inputs.map((input) => `${problem_command_to_string(input_to_problem_command(input))}`).join(',\n\t')}\n]`
}

watchEffect(() => {
  if (state.value.mode === 'Finished') {
    console.log(maclogic_inputs_to_problem_command_string(state.value.inputs))
  }
})

const custom_problem_pressed = () => {
  show_custom_problem_dialog.value = true
  visible_tactics.value = tactic_options
  ic.value.restart()
}

const show_custom_problem_dialog = ref(false)

const restart_problem = () => {
  const [as, c] = main_problem_string_split.value
  ic.value.restart()
  start_with_text(as, c)
}

const can_undo = computed(() => state.value.can_undo)
const can_redo = computed(() => state.value.can_redo)
const can_run_tactic = computed(() => selected_tactic.value !== '' && state.value.mode === 'EnterTactic')

const start = (s: Sequent) => {
  ic.value.restart()
  visible_tactics.value = tactic_options
  start_with_sequent(s)
}

type ErrorToDisplay = {
  error: Error
  vm: any
  info: string
}

const display_error: Ref<ErrorToDisplay | undefined> = ref(undefined)

// selected_tactic_rule
// main_problem_string_split
// main_problem_string
// current_problem_string
// show_custom_problem_dialog
// can_undo
// can_redo
// can_run_tactic
// display_error
// leftDrawerOpen
// selected_tactic
// visible_tactic
// display_tactic
// tactic_options
// splitter_model
// current_problem
// current_problem_display
// expanded_derivation_ids
// derivation_tree

onErrorCaptured((error: Error, vm, info: string) => {
  display_error.value = {
    error,
    vm,
    info
  }
  return false
})

const run_tactic = (t: TacticId) => {
  ic.value.step({ type: 'Tactic', value: t })
}

const start_with_sequent = (s: Sequent) => {
  show_custom_problem_dialog.value = false
  ic.value.step({ type: 'Problem', value: s })
}

const leftDrawerOpen = ref(true)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const start_with_text = (as: string, c: string) => {
  const s = ip.parse_and_elaborate_sequent(as, c)
  start(s as Sequent)
}

const problem_selected = (description: ProblemDescription) => {
  ic.value.restart()
  start_with_text(description.assumptions, description.conclusion)
  /* Uncomment the code in this function to enable hidden Tactics. */
  // if (description.allowed_tactics.length === 0) {
    visible_tactics.value = tactic_options
  // } else {
  //   visible_tactics.value = []
  //   for (const tactic_row of tactic_options) {
  //     if (is_string(tactic_row) || !defined(tactic_row)) continue
  //     const visible_row = tactic_row.filter((possible_id) => description.allowed_tactics.some((t) => t === possible_id))
  //     if (!is_empty(visible_row))
  //       visible_tactics.value.push(visible_row)
  //   }
  // }
}

type TacticRow = TacticId[] | string | undefined

const selected_tactic: Ref<TacticId | ''> = ref('')
const visible_tactics: Ref<TacticRow[]> = ref([])
const tactic_display = computed(() => tactic_to_display(selected_tactic.value))
const tactic_options: TacticRow[] = [
  'Rules of Inference',
  ['impi', 'impe'],
  ['andi', 'ande', 'df'],
  ['noti', 'note', 'dn'],
  ['oril', 'orir', 'ore'],
  ['foralli', 'foralle'],
  ['existsi', 'existse'],
  undefined,
  'Sequents and Theorems',
  ['lemma'],
  ['ds', 'mt', 'dn+'],
  ['lem', 'efq'],
  ['avu', 'ave'],
  ['qs1', 'qs2'],
  ['qs3', 'qs4'],
  ['com_and', 'com_or', 'com_bic'],
  ['pmi1', 'pmi2'],
  ['dem1', 'dem2'],
  ['dem3', 'dem4'],
  ['dem5', 'dem6'],
  ['dem7', 'dem8'],
  ['imp1', 'imp2'],
  ['neg_imp1', 'neg_imp2'],
  ['dist1', 'dist2'],
  ['dist3', 'dist4'],
  ['sdn_and1', 'sdn_and2'],
  ['sdn_and3', 'sdn_and4'],
  ['sdn_and5', 'sdn_and6'],
  ['sdn_or1', 'sdn_or2'],
  ['sdn_or3', 'sdn_or4'],
  ['sdn_or5', 'sdn_or6'],
  ['sdn_con1', 'sdn_con2'],
  ['sdn_con3', 'sdn_con4'],
  ['sdn_con5', 'sdn_con6'],
  ['sdn_bic1', 'sdn_bic2'],
  ['sdn_bic3', 'sdn_bic4'],
  ['sdn_bic5', 'sdn_bic6'],
]

const constant_name_ml_reason = (name: string): string => ({
    'andel': '&E',
    'ander': '&E',
    'andi': '&I',
    'impe': '→E',
    'impi': '→I',
    'note': '~E',
    'noti': '~I',
    'dn': 'DN',
    'oril': '∨I_left',
    'orir': '∨I_right',
    'ore': '∨E',
    'dfl': 'defn',
    'dfr': 'defn',
    'existse': '∃E',
    'existsi': '∃I',
    'foralle': '∀E',
    'foralli': '∀I',
    'efq': 'EFQ',
    'lem': 'LEM',
    'mt': 'MT',
    'lemma': 'Lemma',
    'qs1': 'QS 1',
    'qs2': 'QS 2',
    'qs3': 'QS 3',
    'qs4': 'QS 4',
    'avu': '∀ AV',
    'ave': '∃ AV',
    'pmi1': 'PMI 1',
    'pmi2': 'PMI 2',
    'dem1': 'DeM 1',
    'dem2': 'DeM 2',
    'dem3': 'DeM 3',
    'dem4': 'DeM 4',
    'dem5': 'DeM 5',
    'dem6': 'DeM 6',
    'dem7': 'DeM 7',
    'dem8': 'DeM 8'
}[name] ?? name)

const splitter_model = ref(50)

const current_problem_from_state = (state: MacLogicState): SubProblem => {
  return first(state.problem_stack)
}

const current_problem_display_from_state = (state: MacLogicState): string => {
  const current_problem: SubProblem = current_problem_from_state(state)
  if (!defined(current_problem))
    return 'N/A'
  return sequent_to_display(current_problem.sequent)
}

const current_problem = computed(() => !is_empty(state.value.problem_stack.length) ? current_problem_from_state(state.value) : undefined)
const current_problem_display = computed(() => defined(current_problem.value) ? current_problem_to_display(current_problem.value.sequent) : {
  assumptions: [],
  conclusion: ''
})

let expanded_derivation_ids: Ref<number[]> = ref([])
const derivation_tree = computed(() => {
  expanded_derivation_ids.value = [...expanded_derivation_ids.value, ...state.value.problem_stack.map((problem) => problem.meta_variable.get_index())]
  return derivation_tree_from_problem_tree(state.value.problem_tree)
})

const derivation_tree_from_problem_tree = (tree: ProblemTree | undefined) => {
  if (!defined(tree))
    return []
  const seq_string = sequent_to_display(tree.seq)
  if (is_current_problem(tree))
    return [{ id: tree.id, label: `${seq_string} --- Current Problem` }]
  if (is_open_problem(tree))
    // @ts-ignore because tree is never for no reason
    return [{ id: tree.id, label: seq_string }]
  if (is_closed_problem(tree))
    // @ts-ignore because tree is never for no reason
    return [{ id: tree.id, label: `${seq_string} ■` }]
  if (is_split_problem(tree))
    return [{ 
      // @ts-ignore because tree is never for no reason
      id: tree.id,
      // @ts-ignore because tree is never for no reason
      label: `${seq_string} | Using ${tactic_to_display(tree.reason)}`,
      // @ts-ignore because tree is never for no reason
      children: tree.children.map(derivation_tree_from_problem_tree).reduce((acc, nodes) => [...acc, ...nodes]),
      expanded: true,
      expandable: true
    }]
  return []
}

const assert_def = <T>(t: T | undefined | null): T => {
  if (!defined(t) || t === null) throw new Error('Value not defined!')
  return t
}
</script>
