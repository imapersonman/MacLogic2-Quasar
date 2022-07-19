import { test_partial_generator_expectation } from 'coastline/tests/generators/check_generator'
import { Input, run_interaction } from 'coastline/src/interaction/interaction';
import { TacticId } from './construction_interaction';
import { initial_browser, mk_browser_interaction, non_existent_entry_message, ProblemDescription, ProblemDirectory, ProblemEntry } from './problem_browser';

const problem_directory = (name: string, entries: ProblemEntry[]): ProblemDirectory => ({
    type: 'ProblemDirectory',
    name,
    entries
})

const empty_directory = problem_directory('This is Empty', [])

const problem_description = (name: string, assumptions: string[], conclusion: string, allowed_tactics: Set<TacticId>): ProblemDescription => ({
    type: 'ProblemDescription',
    name,
    assumptions: assumptions.join(','),
    conclusion,
    allowed_tactics: [...allowed_tactics]
})

const and_commutativity_description = problem_description(
    '& Commutativity',
    ['A & B'],
    'B & A',
    new Set<TacticId>(['ande', 'andi'])
)
const directory_with_one_problem = problem_directory(
    'One Problem', [and_commutativity_description]
)

const directory_with_one_problem_and_two_directories = problem_directory(
    'This one has two things in it',
    [directory_with_one_problem, and_commutativity_description, empty_directory]
)

const deeply_nested_directory = problem_directory(
    'root',
    [
        directory_with_one_problem_and_two_directories,
        and_commutativity_description
    ]
)

test_partial_generator_expectation('select non-existent entry in empty directory', run_interaction(mk_browser_interaction(empty_directory)), {
    yields: [
        {
            yielded: initial_browser(empty_directory),
            continued_with: Input({ type: 'SelectEntry', value: 'Does Not Exist' })
        }
    ],
    throws: non_existent_entry_message('Does Not Exist', 'This is Empty')
})

test_partial_generator_expectation('select non-existent entry in non-empty directory', run_interaction(mk_browser_interaction(directory_with_one_problem)), {
    yields: [
        {
            yielded: initial_browser(directory_with_one_problem),
            continued_with: Input({ type: 'SelectEntry', value: 'Still Does Not Exist' })
        }
    ],
    throws: non_existent_entry_message('Still Does Not Exist', 'One Problem')
})

test_partial_generator_expectation('select existing problem in directory with one problem', run_interaction(mk_browser_interaction(directory_with_one_problem)), {
    yields: [
        {
            yielded: initial_browser(directory_with_one_problem),
            continued_with: Input({ type: 'SelectEntry', value: '& Commutativity' })
        },
        {
            yielded: {
                current_directory: directory_with_one_problem,
                parent_stack: [],
                selected_problem_description: and_commutativity_description
            }
        }
    ]
})

test_partial_generator_expectation('select existing empty directory', run_interaction(mk_browser_interaction(directory_with_one_problem_and_two_directories)), {
    yields: [
        {
            yielded: initial_browser(directory_with_one_problem_and_two_directories),
            continued_with: Input({ type: 'SelectEntry', value: empty_directory.name })
        },
        {
            yielded: {
                current_directory: empty_directory,
                parent_stack: [
                    directory_with_one_problem_and_two_directories
                ],
                selected_problem_description: undefined
            }
        }
    ]
})

test_partial_generator_expectation('selecting a bunch then coming back', run_interaction(mk_browser_interaction(deeply_nested_directory)), {
    yields: [
        {
            yielded: initial_browser(deeply_nested_directory),
            continued_with: Input({ type: 'SelectEntry', value: directory_with_one_problem_and_two_directories.name })
        },
        {
            yielded: {
                current_directory: directory_with_one_problem_and_two_directories,
                parent_stack: [
                    deeply_nested_directory
                ],
                selected_problem_description: undefined
            },
            continued_with: Input({ type: 'SelectEntry', value: empty_directory.name })
        },
        {
            yielded: {
                current_directory: empty_directory,
                parent_stack: [
                    directory_with_one_problem_and_two_directories,
                    deeply_nested_directory
                ],
                selected_problem_description: undefined
            },
            continued_with: Input({ type: 'GoToParent' })
        },
        {
            yielded: {
                current_directory: directory_with_one_problem_and_two_directories,
                parent_stack: [
                    deeply_nested_directory
                ],
                selected_problem_description: undefined
            },
            continued_with: Input({ type: 'SelectEntry', value: and_commutativity_description.name })
        },
        {
            yielded: {
                current_directory: directory_with_one_problem_and_two_directories,
                parent_stack: [
                    deeply_nested_directory
                ],
                selected_problem_description: and_commutativity_description
            }
        }
    ]
})