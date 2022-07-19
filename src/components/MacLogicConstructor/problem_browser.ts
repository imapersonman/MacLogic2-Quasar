import { defined, first, is_empty, is_object, is_string, rest } from 'coastline/src/utilities'
import { Continue, StartInteraction, UserInput, WaitFor, While } from 'coastline/src/interaction/interaction'

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProblemDirectory {
    type: 'ProblemDirectory'
    name: string
    entries: ProblemEntry[]
}

export interface ProblemDescription {
    type: 'ProblemDescription'
    name: string
    assumptions: string
    conclusion: string
    allowed_tactics: string[]
    test_scripts?: ProblemCommand[][]
}

export type ProblemEntry = ProblemDirectory | ProblemDescription

export const is_problem_description = (d: any): d is ProblemDescription =>
    'type' in d && d.type === 'ProblemDescription'
    && 'name' in d && typeof d.name === 'string'
    && 'assumptions' in d && typeof d.assumptions === 'string'
    && 'conclusion' in d && typeof d.conclusion === 'string'
    && 'allowed_tactics' in d

export const is_problem_directory = (d: any): d is ProblemDirectory =>
    'type' in d && d.type === 'ProblemDirectory'
    && 'name' in d && typeof d.name === 'string'
    && 'entries' in d

export type ProblemCommand =
    | { type: 'Tactic', value: string }
    | { type: 'UnifyingAssumption', value: number }
    | { type: 'UnifyingAssumptionOrConclusion', value: number }
    | { type: 'AnyFreeVariable', value: string }
    | { type: 'UnusedFreeVariable', value: number }
    | { type: 'SequentOrTheoremSubstitution', value: [string, string][] }
    | { type: 'QuantifierShiftSubstitution', value: { variable: string, scope: string } }

export const is_problem_command = (p: any): p is ProblemCommand =>
    (p.type === 'Tactic' && typeof p.value === 'string')
    || (p.type === 'UnifyingAssumption' && typeof p.value === 'number')
    || (p.type === 'UnifyingAssumptionOrConclusion' && typeof p.value === 'number')
    || (p.type === 'AnyVariable' && typeof p.value === 'string')
    || (p.type === 'UnusedVariable' && typeof p.value === 'number')
    || (p.type === 'SequentOrTheoremSubstitution' && is_object(p.value) && (Object.values(p.value).length === 0 || is_string(Object.values(p.value)[0])))

export interface ProblemBrowserState {
    current_directory: ProblemDirectory
    parent_stack: ProblemDirectory[]
    selected_problem_description: ProblemDescription | undefined
}

export type ProblemBrowserInput =
    | { type: 'SelectEntry', value: string }
    | { type: 'GoToParent' }
    | { type: 'ClearSelection' }

export const initial_browser = (directory: ProblemDirectory): ProblemBrowserState => ({
    current_directory: directory,
    parent_stack: [],
    selected_problem_description: undefined
})

export const non_existent_entry_message = (entry_name: string, directory_name: string) =>
    `ProblemDirectoryEntry '${entry_name}' does not exist in ProblemDirectory '${directory_name}'`

export const mk_browser_interaction = (directory: ProblemDirectory) =>
    StartInteraction<ProblemBrowserState, ProblemBrowserInput>(
        initial_browser(directory),
        While(() => true, WaitFor(UserInput((state, input) => {
            if (input.type === 'SelectEntry') {
                const entry = state.current_directory.entries.find((child) => child.name === input.value)
                if (!defined(entry))
                    throw new Error(non_existent_entry_message(input.value, state.current_directory.name))
                if (is_problem_description(entry))
                    return Continue({ ...state, selected_problem_description: entry })
                if (is_problem_directory(entry))
                    return Continue({
                        ...state,
                        current_directory: entry,
                        parent_stack: [state.current_directory, ...state.parent_stack],
                        selected_problem_description: undefined
                    })
                throw new Error(`Entry to Select is neither a ProblemDescription nor a ProblemDirectory:\n${JSON.stringify(entry)}`)
            } else if (input.type === 'GoToParent') {
                if (is_empty(state.parent_stack))
                    return Continue(state)
                return Continue({ ...state, parent_stack: rest(state.parent_stack), current_directory: first(state.parent_stack) })
            } else if (input.type === 'ClearSelection') {
                return Continue({ ...state, selected_problem_description: undefined })
            } throw new Error('Unrecognized input type')
        })))
    )
