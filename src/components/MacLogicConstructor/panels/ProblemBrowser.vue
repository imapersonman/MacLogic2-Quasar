<template>
  <div v-if="show_custom_problem_dialog">
    <problem-entry-dialog
      :input-parser="inputParser"
      :start-pressed="sequent_entered"
      :cancel-pressed="() => show_custom_problem_dialog = false"
    />
  </div>
  <div class="column">
    <q-btn @click="custom_problem_pressed()" class="q-mx-md q-mt-md justify-center" data-cy="newProblem">Custom Problem</q-btn>
    <q-list separator class="col q-pa-md">
      <q-item v-if="!in_root_directory" @click="go_back()" clickable bordered separate v-ripple>← Back</q-item>
      <q-item
        class="row"
        v-for="(browser_entry, index) in current_directory.entries"
        :key="browser_entry.name"
        :active="defined(selected_problem_description) && browser_entry.name === selected_problem_description.name"
        clickable bordered separator v-ripple
        @click="select_problem(browser_entry)"
        :data-cy="`problemDescription${index}`"
      >
        <div v-if="is_problem_description(browser_entry)">
          <q-item-section v-if="is_problem_description(browser_entry)">
            {{ `${problem_to_display(browser_entry.assumptions.split(',').map((as) => as.trim()), browser_entry.conclusion)} ` }}
          </q-item-section>
          <q-item-label>
            {{ browser_entry.name }}
          </q-item-label>
        </div>
        <div v-else-if="is_problem_directory(browser_entry)">
          <q-item-section>
            {{ browser_entry.name }}
          </q-item-section>
        </div>
        <q-item-section v-else>Neither a ProblemDescription nor a ProblemDirectory</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import ProblemEntryDialog from '../dialogs/ProblemEntryDialog.vue';

import { is_problem_directory, is_problem_description, mk_browser_interaction, ProblemDescription, ProblemDirectory, ProblemEntry } from '../problem_browser';
import { problem_to_display } from '../problem_to_display'
import { defined, is_empty } from 'coastline/src/utilities'
import { InteractionController } from '../interaction_controller';
import { InputParser } from '../interfaces/input_parser';
import Parsimmon from 'parsimmon'
import { MLElaborationErrorV1 } from '../interfaces/maclogic_ii_input_parser';
import { Sequent } from 'coastline/src/construction/sequent';

const { initial_directory, problem_selected } = defineProps<{
  inputParser: InputParser<Parsimmon.Failure, MLElaborationErrorV1>,
  initial_directory: ProblemDirectory
  problem_selected(description: ProblemDescription): void
  sequent_entered(seq: Sequent): void
}>()

const ic = ref(new InteractionController(mk_browser_interaction(initial_directory)))
const state = computed(() => ic.value.state)

const go_back = () => {
  ic.value.step({ type: 'GoToParent' })
}

const select_problem = (entry: ProblemEntry) => {
  if (is_problem_description(entry))
    problem_selected(entry)
  ic.value.step({ type: 'SelectEntry', value: entry.name })
}

const custom_problem_pressed = () => {
  show_custom_problem_dialog.value = true
  ic.value.step({ type: 'ClearSelection' })
}

const problem_description = (name: string, assumptions: string, conclusion: string): ProblemDescription => ({
  type: 'ProblemDescription',
  name,
  assumptions,
  conclusion,
  allowed_tactics: [],
})

const current_directory = computed(() => state.value.current_directory)
// an entry_sequent_pair is one of
// - a { description: ProblemDescription, sequent: Sequent }
// - a ProblemDirectory
// const entry_sequent_pairs = computed(() => )
// I NEED TO RETHINK THE PARSE, ELABORATE, UNELABORATE, UNPARSE CHAIN IS PARAMETERIZED.
const selected_problem_description = computed(() => state.value.selected_problem_description)
const in_root_directory = computed(() => is_empty(state.value.parent_stack))
const show_custom_problem_dialog = ref(false)
</script>
