import { ProblemDirectory } from 'src/components/MacLogicConstructor/problem_browser';

const all_propositional_tactics = ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df', 'mt', 'ds', 'pmi1', 'pmi2', 'dn+', 'dem1', 'dem2', 'dem3', 'dem4', 'dem5', 'dem6', 'dem7', 'dem8', 'imp1', 'imp2', 'neg_imp1', 'neg_imp2', 'com_and', 'com_or', 'com_bic', 'dist1', 'dist2', 'sdn_and1', 'sdn_and2', 'sdn_and3', 'sdn_and4', 'sdn_and5', 'sdn_and6', 'sdn_or1', 'sdn_or2', 'sdn_or3', 'sdn_or4', 'sdn_or5', 'sdn_or6', 'sdn_con1', 'sdn_con2', 'sdn_con3', 'sdn_con4', 'sdn_con5', 'sdn_con6', 'sdn_bic1', 'sdn_bic2', 'sdn_bic3', 'sdn_bic4', 'sdn_bic5', 'sdn_bic6', 'lem']

export const root_directory: ProblemDirectory = {
    type: 'ProblemDirectory',
    name: 'Modern Logic',
    entries: [
        {
            type: 'ProblemDirectory',
            name: 'Chapter 4',
            entries: [
                {
                    type: 'ProblemDirectory',
                    name: 'Section 2',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: 'A & B, C & D, (A & D) → H',
                                    conclusion: 'H',
                                    allowed_tactics: ['ande', 'andi', 'impe'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: 'A & (B & C)',
                                    conclusion: 'C & (B & A)',
                                    allowed_tactics: ['ande', 'andi', 'impe'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'andi' }
                                        ],
                                        [
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: 'A → (B → (C → D)), C & (A & B)',
                                    conclusion: 'D',
                                    allowed_tactics: ['ande', 'andi', 'impe'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ],
                                        [
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: 'R → (S → T), S',
                                    conclusion: 'R → T',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ],
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '((A & B) & C) → D',
                                    conclusion: 'C → (B → (A → D))',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'andi' }
                                        ],
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: 'A',
                                    conclusion: 'B → A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' }
                                        ],
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: 'A → (B → C)',
                                    conclusion: '(A → B) → (A → C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ],
                                    ]
                                },
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: 'A → B, B → C',
                                    conclusion: 'A → C',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: 'A → B, A → C',
                                    conclusion: 'A → (B & C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: 'A',
                                    conclusion: 'B → (A & B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: 'A → B',
                                    conclusion: '(A & C) → (B & C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '(A & B) → C',
                                    conclusion: 'A → (B → C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: 'A → (B → C)',
                                    conclusion: '(A & B) → C',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: '(A & B) → C, A',
                                    conclusion: 'B → C',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: 'A → B',
                                    conclusion: '(C → A) → (C → B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9',
                                    assumptions: 'A & (A → (A & B))',
                                    conclusion: 'B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10',
                                    assumptions: 'A → (A → B)',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '11',
                                    assumptions: '(A & B) → (C & D)',
                                    conclusion: '[(A & B) → C] & [(A & B) → D]',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '12',
                                    assumptions: 'C → A, C → (A → B)',
                                    conclusion: 'C → (A & B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '13',
                                    assumptions: 'A → (B → C), (A & D) → E, C → D',
                                    conclusion: '(A & B) → E',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '14',
                                    assumptions: 'A → (B → C)',
                                    conclusion: 'B → (A → C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '15',
                                    assumptions: 'A → (B → C), D → B',
                                    conclusion: 'A → (D → C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '16',
                                    assumptions: 'A → B',
                                    conclusion: 'A → (C → B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '17',
                                    assumptions: 'A & (B & C)',
                                    conclusion: 'A → (B → C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '18',
                                    assumptions: 'B & C',
                                    conclusion: '(A → B) & (A → C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                            ]
                        }
                    ]
                },
                {
                    type: 'ProblemDirectory',
                    name: 'Section 3',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '',
                                    conclusion: 'A → A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '',
                                    conclusion: '(A → B) → ((B → C) → (A → C))',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '',
                                    conclusion: '(A & B) → (B & A)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '',
                                    conclusion: '(A → B) → (A → B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '',
                                    conclusion: 'A → (B → A)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '',
                                    conclusion: '[A → (B & C)] → [(A → B) & (A → C)]',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '',
                                    conclusion: '[(A → A) → B] → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'ProblemDirectory',
                    name: 'Section 4',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: 'A → B, ~B',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '~B',
                                    conclusion: '~(A & B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '~(A & B)',
                                    conclusion: 'A → ~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '~(A & ~B)',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: 'B, ~B',
                                    conclusion: 'A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: 'A → ~B',
                                    conclusion: 'B → ~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '',
                                    conclusion: '~(A & ~A)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: 'A',
                                    conclusion: '~~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '~~A → B, ~B',
                                    conclusion: '~~~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: 'A → B',
                                    conclusion: '~(A & ~B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: '~(A & B), A',
                                    conclusion: '~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: 'A',
                                    conclusion: '~(B & ~(A & B))',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: '',
                                    conclusion: '(A & ~A) → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9',
                                    assumptions: 'B → (A & ~A)',
                                    conclusion: '~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10',
                                    assumptions: 'A → B, A → ~B',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '11',
                                    assumptions: '(A & B) → ~A',
                                    conclusion: 'A → ~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '12',
                                    assumptions: '(A & ~B) → B',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '13',
                                    assumptions: 'A → B, B → ~A',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '14',
                                    assumptions: 'A → (B → C)',
                                    conclusion: '~C → ~(A & B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '15',
                                    assumptions: 'A → ~(B & C), B → C',
                                    conclusion: 'A → ~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '16',
                                    assumptions: 'A, A → C, ~B → ~C',
                                    conclusion: '~(A → ~B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '17',
                                    assumptions: '',
                                    conclusion: '(~A → A) → A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '18',
                                    assumptions: '(A & ~B) → ~A',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '19',
                                    assumptions: '',
                                    conclusion: '~⋏',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '20a',
                                    assumptions: '~A',
                                    conclusion: 'A → ⋏',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '20b',
                                    assumptions: 'A → ⋏',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '21',
                                    assumptions: '~A',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '22a',
                                    assumptions: '~(A → B)',
                                    conclusion: 'A & ~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '22b',
                                    assumptions: 'A & ~B',
                                    conclusion: '~(A → B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '23',
                                    assumptions: '~(A & B), ~(A & ~B)',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '24',
                                    assumptions: '~(A → ~A), ~(B → ~B), ~(A & B)',
                                    conclusion: '⋏',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '25',
                                    assumptions: 'A → ~(B → C)',
                                    conclusion: '(A → B) & (A → ~C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '26',
                                    assumptions: '',
                                    conclusion: '~{[~(A & B) & ~(A & ~B)] & [~(~A & B) & ~(~A & ~B)]}',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' },
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'ProblemDirectory',
                    name: 'Section 5',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '(A ∨ (D & E)) → B',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'oril' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '(A & B) ∨ (A & C)',
                                    conclusion: 'A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: 'A ∨ B, ~B',
                                    conclusion: 'A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: 'A & (B ∨ C)',
                                    conclusion: '(A & B) ∨ (A & C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '~A & ~B',
                                    conclusion: '~(A ∨ B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: 'A ∨ (B ∨ C)',
                                    conclusion: '(A ∨ B) ∨ C',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: '',
                                    conclusion: 'A ∨ ~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' }
                                        ]
                                    ]
                                },
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '(A ∨ B) → C',
                                    conclusion: 'A → C',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'oril' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: 'A → B, (B ∨ C) → D, D → ~A',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: 'A ∨ B',
                                    conclusion: 'B ∨ A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'oril' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: 'A ∨ ~~B',
                                    conclusion: 'A ∨ B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'dn' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: 'A ∨ A',
                                    conclusion: 'A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: 'A → (B ∨ C), ~B & ~C',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: 'A ∨ ⋏',
                                    conclusion: 'A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: 'A ∨ B, A → B, B → A',
                                    conclusion: 'A & B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9',
                                    assumptions: '(A & B) ∨ (A & C)',
                                    conclusion: 'A & (B ∨ C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10',
                                    assumptions: 'A ∨ B',
                                    conclusion: '(A → B) → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '11',
                                    assumptions: '(A → ⋏) ∨ (B → ⋏), B',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '12',
                                    assumptions: '~(A → ~A), ~(A ∨ B)',
                                    conclusion: '⋏',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '13',
                                    assumptions: 'A ∨ B',
                                    conclusion: '~(~A & ~B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '14a',
                                    assumptions: 'A & B',
                                    conclusion: '~(~A ∨ ~B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '14b',
                                    assumptions: '~(~A ∨ ~B)',
                                    conclusion: 'A & B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '15',
                                    assumptions: '~(~A & ~B)',
                                    conclusion: 'A ∨ B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '16a',
                                    assumptions: '~A ∨ ~B',
                                    conclusion: '~(A & B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '16b',
                                    assumptions: '~(A & B)',
                                    conclusion: '~A ∨ ~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '17a',
                                    assumptions: 'A → B',
                                    conclusion: '~A ∨ B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '17b',
                                    assumptions: '~A ∨ B',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '18a',
                                    assumptions: '~(A → B)',
                                    conclusion: '~(~A ∨ B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '18b',
                                    assumptions: '~(~A ∨ B)',
                                    conclusion: '~(A → B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '19',
                                    assumptions: '(A ∨ B) ∨ C',
                                    conclusion: 'A ∨ (B ∨ C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '20a',
                                    assumptions: 'A ∨ (B & C)',
                                    conclusion: '(A ∨ B) & (A ∨ C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '20b',
                                    assumptions: '(A ∨ B) & (A ∨ C)',
                                    conclusion: 'A ∨ (B & C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'andi' }
                                        ],
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '21',
                                    assumptions: '~(A ∨ (B & C))',
                                    conclusion: '~(A ∨ B) ∨ ~(A ∨ C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '22',
                                    assumptions: 'A → (~B ∨ ~C), ~C → ~D, B',
                                    conclusion: '~A ∨ ~D',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                }


                            ]
                        }
                    ]
                },
                {
                    type: 'ProblemDirectory',
                    name: 'Section 6',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '',
                                    conclusion: 'A ↔ A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: 'A ↔ ~B',
                                    conclusion: '~(A ↔ B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value:'noti' },
                                            { type: 'Tactic', value:'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: 'A, A ↔ B',
                                    conclusion: 'B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: 'A ↔ B',
                                    conclusion: 'B ↔ A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '(A & B) ↔ A',
                                    conclusion: 'A → B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value:1 },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '(A ∨ B) ↔ A',
                                    conclusion: 'B → A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '~A, A ↔ B',
                                    conclusion: '~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6a',
                                    assumptions: '~A ↔ ~B',
                                    conclusion: 'A ↔ B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            // formatting this takes too long so it's copy-paste time
                                            {'type':'Tactic','value':'df'},
                                            {'type':'UnifyingAssumptionOrConclusion','value':0},
                                            {'type':'Tactic','value':'ande'},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic', 'value':'note'},
                                            {'type':'UnifyingAssumption','value':1}
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6b',
                                    assumptions: 'A ↔ B',
                                    conclusion: '~A ↔ ~B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            {'type':'Tactic','value':'df'},
                                            {'type':'UnifyingAssumptionOrConclusion','value':0},
                                            {'type':'Tactic','value':'ande'},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic','value':'note'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7a',
                                    assumptions: '~(A ↔ B)',
                                    conclusion: '~A ↔ B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'UnifyingAssumption','value':3},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'UnifyingAssumption','value':2},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'impi'}
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7b',
                                    assumptions: '~A ↔ B',
                                    conclusion: '~(A ↔ B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'df'},{'type':'UnifyingAssumptionOrConclusion','value':0},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':2},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'note'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: 'A & B',
                                    conclusion: 'A ↔ B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impi'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9a',
                                    assumptions: 'A ↔ ~A',
                                    conclusion: 'A & ~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'note'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9b',
                                    assumptions: 'A & ~A',
                                    conclusion: 'A ↔ ~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impi'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10',
                                    assumptions: '(A ∨ B) ∨ C, B ↔ C',
                                    conclusion: 'C ∨ A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'orir'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'oril'},{'type':'Tactic','value':'oril'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '11',
                                    assumptions: 'A → B, B → C, C → A',
                                    conclusion: '(A ↔ B) & ((B ↔ C) & (C ↔ A))',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':2},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '12',
                                    assumptions: 'A ↔ (B ∨ C), B → D, C → E',
                                    conclusion: 'D ∨ (E ∨ ~A)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'orir'},{'type':'Tactic','value':'orir'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':2},{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'oril'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'orir'},{'type':'Tactic','value':'oril'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '13a',
                                    assumptions: '(A & B) ↔ (A & C)',
                                    conclusion: 'A → (B ↔ C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'df'},{'type':'UnifyingAssumptionOrConclusion','value':0},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'ande'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '13b',
                                    assumptions: 'A → (B ↔ C)',
                                    conclusion: '(A & B) ↔ (A & C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'andi'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '14',
                                    assumptions: '~A ∨ C, ~B ∨ ~C',
                                    conclusion: 'A → ~(A ↔ B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'ore'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'note'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '15a',
                                    assumptions: 'A ↔ (B ↔ C)',
                                    conclusion: '(A ↔ B) ↔ C',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [
                                            {'type':'Tactic','value':'df'},
                                            {'type':'UnifyingAssumptionOrConclusion','value':0},
                                            {'type':'Tactic','value':'ande'},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'ande'},
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':3},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'ande'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':2},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'dn'},
                                            {'type':'Tactic','value':'noti'},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'ande'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'note'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':0},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'ande'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':2},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'impe'},
                                            {'type':'UnifyingAssumption','value':1},
                                            {'type':'Tactic','value':'df'},
                                            {'type':'Tactic','value':'andi'},
                                            {'type':'Tactic','value':'impi'},
                                            {'type':'Tactic','value':'impi'}
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '15b',
                                    assumptions: '(A ↔ B) ↔ C',
                                    conclusion: 'A ↔ (B ↔ C)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'df'},{'type':'UnifyingAssumptionOrConclusion','value':0},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':2},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':3},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':2},{'type':'Tactic','value':'note'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '16a',
                                    assumptions: 'A ↔ B',
                                    conclusion: '(A & B) ∨ (~A & ~B)',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'df'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'orir'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'oril'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'oril'},{'type':'Tactic','value':'andi'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '16b',
                                    assumptions: '(A & B) ∨ (~A & ~B)',
                                    conclusion: 'A ↔ B',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df'],
                                    test_scripts: [
                                        [{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'ande'},{'type':'Tactic','value':'df'},{'type':'Tactic','value':'andi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':1}]
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'ProblemDirectory',
                    name: 'Section 8',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: 'A → B, ~B',
                                    conclusion: '~A',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df', 'mt'],
                                    test_scripts: [
                                        [
                                            {'type':'Tactic','value':'mt'},
                                            {'type':'SequentOrTheoremSubstitution','value':[['A','A'],['B','B']]}
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: 'C → D, ~D',
                                    conclusion: '~C',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df', 'mt'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'C'],['B', 'D']] }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: 'R → (V → (S ∨ T)), ~(S ∨ T)',
                                    conclusion: 'R → ~V',
                                    allowed_tactics: ['ande', 'andi', 'impe', 'impi', 'note', 'noti', 'dn', 'oril', 'orir', 'ore', 'df', 'mt'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'S ∨ T'],['A', 'V']] }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: 'R → ((S → T) ∨ V), ~(S → T), R → ~V',
                                    conclusion: '~R',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ds' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'S → T'],['B', 'V']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '',
                                    conclusion: '(A → B) ∨ (B → A)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'lem' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'A']] },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'pmi1' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'A'],['B', 'B']] },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'pmi2' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'A'],['B', 'B']] }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: 'O → (S & (B ∨ R)), (~S ∨ X) & ((~B ∨ Y) & (~R ∨ Z)), ~X ∨ ~Y, O',
                                    conclusion: 'R',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ds' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~S'],['B', 'X']] },
                                            { type: 'Tactic', value: 'dn+' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'S']] },
                                            { type: 'Tactic', value: 'ds' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~X'],['B', '~Y']] },
                                            { type: 'Tactic', value: 'dn+' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'X']] },
                                            { type: 'Tactic', value: 'com_or' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~B'],['B', 'Y']] },
                                            { type: 'Tactic', value: 'ds' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'Y'],['B', '~B']] },
                                            { type: 'Tactic', value: 'ds' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'B'],['B', 'R']] }
                                        ],
                                        [
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'imp2' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'S'],['B', 'X']] },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'imp2' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'X'],['B', '~Y']] },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'com_or' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~B'],['B', 'Y']] },
                                            { type: 'Tactic', value: 'imp2' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~Y'],['B', '~B']] },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'UnifyingAssumption', value: 5 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'dn+' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'Y']] },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'imp2' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~B'],['B', 'R']] },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'dn+' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'B']] },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '~A',
                                    conclusion: '~B → ~(A ∨ B)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':1}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: 'A → (B ∨ ~C), ~A → (B ∨ ~C), ~B',
                                    conclusion: '~C',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'ore'},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':1}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '',
                                    conclusion: 'A ∨ (A → B)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'oril'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'orir'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':1}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '~B → A',
                                    conclusion: '(B → A) → A',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'note'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '',
                                    conclusion: '(A → B) → [(A → ~B) → ~A]',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'impe'},{'type':'Tactic','value':'note'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: '~[A → (B ∨ C)]',
                                    conclusion: '(B ∨ C) → A',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'}]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: 'A → B, (~B → ~A) → (C → D), ~D',
                                    conclusion: '~C',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'imp1' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'A'],['B', 'B']] },
                                            { type: 'Tactic', value: 'com_or' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~A'],['B', 'B']] },
                                            { type: 'Tactic', value: 'imp2' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~B'],['B', '~A']] },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'dn+' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'B']] },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'imp1' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'C'],['B', 'D']] },
                                            { type: 'Tactic', value: 'com_or' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', '~C'],['B', 'D']] },
                                            { type: 'Tactic', value: 'ds' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'D'],['B', '~C']] }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: '(A ∨ B) → (A ∨ C)',
                                    conclusion: 'A ∨ (B → C)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9',
                                    assumptions: '(A & B) ↔ C, ~(C ∨ ~A)',
                                    conclusion: '~B',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10a',
                                    assumptions: 'A → (B ∨ C)',
                                    conclusion: '(A → B) ∨ (A → C)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10b',
                                    assumptions: '(A → B) ∨ (A → C)',
                                    conclusion: 'A → (B ∨ C)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '11',
                                    assumptions: '~(A & ~B) ∨ ~(~D & ~E), ~(E ∨ B), C → (~E → (~D & A))',
                                    conclusion: '~C',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'oril' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '12',
                                    assumptions: '(A ∨ B) → (C & D), (~E ∨ C) → [(F ∨ G) → H], (~I→J)→[G&(H→~K)]',
                                    conclusion: 'K → (~A ∨ ~I)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '13',
                                    assumptions: '(A ↔ B) ↔ (C ↔ D)',
                                    conclusion: '(A ↔ C) ↔ (B ↔ D)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'A'],['A', 'C']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'A'],['A', 'B']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'D'],['A', 'C']] },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'C'],['A', 'A']] },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'A'],['A', 'B']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'B'],['A', 'D']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'C'],['A', 'D']] },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'D'],['A', 'B']] },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'B'],['A', 'A']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'D'],['A', 'B']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'A'],['A', 'B']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'UnifyingAssumptionOrConclusion', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'B'],['B', 'A']] },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'B'],['A', 'D']] },
                                            { type: 'Tactic', value: 'mt' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['B', 'D'],['A', 'C']] },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '14',
                                    assumptions: '(A ∨ B) & (C ∨ D)',
                                    conclusion: '(B ∨ C) ∨ (A & D)',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'oril' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '15',
                                    assumptions: '~(A ↔ B), ~(B ↔ C), ~(C ↔ A)',
                                    conclusion: '⋏',
                                    allowed_tactics: all_propositional_tactics,
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 3 }
                                        ]
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'ProblemDirectory',
            name: 'Chapter 6',
            entries: [
                {
                    type: 'ProblemDirectory',
                    name: 'Section 3',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: 'A → Gb',
                                    conclusion: 'A → (∃x)Gx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '(∀x)(Fx → Gx), Fa',
                                    conclusion: '(∃x)(~Gx → Hx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 }
                                        ],
                                        [
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'efq' },
                                            { type: 'SequentOrTheoremSubstitution', value: [['A', 'Ha']] },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '(∀x)(Fx → Gx), (∀x)Fx',
                                    conclusion: '(∀x)Gx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '~(∃x)(Fx & Gx)',
                                    conclusion: '(∀x)(Fx → ~Gx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: '~(∀x)Fx',
                                    conclusion: '(∃x)~Fx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ],
                                        [
                                            { type: 'Tactic', value: 'qs4' },
                                            { type: 'QuantifierShiftSubstitution', value: { variable: 'x', scope: 'Fx' } }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: '(∀x)(Fx → (∀y)Gy)',
                                    conclusion: '(∀x)(∀y)(Fx → Gy)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1a',
                                    assumptions: '(∀x)Fx & (∀x)Gx',
                                    conclusion: '(∀x)(Fx & Gx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '1b',
                                    assumptions: '(∀x)(Fx & Gx)',
                                    conclusion: '(∀x)Fx & (∀x)Gx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '(∀x)~Fx',
                                    conclusion: '(∃x)(Fx → Gx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '(∀x)(Fx → Gx)',
                                    conclusion: '(∀x)Fx → (∀x)Gx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '(∀x)Fx ∨ (∀x)Gx',
                                    conclusion: '(∀x)(Fx ∨ Gx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '~(∃x)Fx',
                                    conclusion: '(∀x)~Fx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: '(∃x)Fx → (∀x)Gx',
                                    conclusion: '(∀x)(Fx → Gx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: '(∃x)Fx → Ga',
                                    conclusion: '(∃x)(Fx → Gx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ] 
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: '(∀x)(~Fx → ~Kx)',
                                    conclusion: '(∃x)((Fx & Kx) ∨ ~Kx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'orir' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9a',
                                    assumptions: '(∀x)(A & Fx)',
                                    conclusion: 'A & (∀x)Fx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9b',
                                    assumptions: 'A & (∀x)Fx',
                                    conclusion: '(∀x)(A & Fx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10a',
                                    assumptions: '(∀x)(A → Fx)',
                                    conclusion: 'A → (∀x)Fx',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10b',
                                    assumptions: 'A → (∀x)Fx',
                                    conclusion: '(∀x)(A → Fx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '11',
                                    assumptions: '(∀x)(∀y)(Fx → Gy)',
                                    conclusion: '(∀x)(Fx → (∀y)Gy)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '12',
                                    assumptions: '(∀x)(∀y)(Gy → Fx)',
                                    conclusion: '(∀x)((∀y)Gy → Fx)',
                                    allowed_tactics: [...all_propositional_tactics, 'existsi', 'foralle', 'foralli'],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'ProblemDirectory',
                    name: 'Section 4',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '(∃x)(Fx & Gx)',
                                    conclusion: '(∃x)Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'ande' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '(∀x)(Fx → Gx), (∃x)~Gx',
                                    conclusion: '(∃x)~Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '(∃x)~Fx',
                                    conclusion: '~(∀x)Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: '(∃x)(Fx → A)',
                                    conclusion: '(∀x)Fx → A',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: '(∃x)(∃y)(Fx & Gy)',
                                    conclusion: '(∃y)(∃x)(Gy & Fx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: '(∀x)(∃y)(Fx & Gy)',
                                    conclusion: '(∃y)(∀x)(Fx & Gy)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDirectory',
                                    name: 'I',
                                    entries: [
                                        {
                                            type: 'ProblemDescription',
                                            name: '1',
                                            assumptions: '(∃x)Fx, (∀x)(Fx → Gx)',
                                            conclusion: '(∃x)Gx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '2a',
                                            assumptions: '(∃x)Fx ∨ (∃x)Gx',
                                            conclusion: '(∃x)(Fx ∨ Gx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'orir' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '2b',
                                            assumptions: '(∃x)(Fx ∨ Gx)',
                                            conclusion: '(∃x)Fx ∨ (∃x)Gx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'orir' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '3',
                                            assumptions: '(∃x)(Fx & ~Gx), (∀x)(Hx → Gx)',
                                            conclusion: '(∃x)(Fx & ~Hx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'andi' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'note' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '4',
                                            assumptions: '(∀x)~Fx',
                                            conclusion: '~(∃x)Fx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'note' }
                                                ]
                                            ],
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '5',
                                            assumptions: '(∀x)(Fx → (∀y)~Fy)',
                                            conclusion: '~(∃x)Fx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'note' }
                                                ]
                                            ],
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '6',
                                            assumptions: '(∃x)(Fx & ~Gx)',
                                            conclusion: '~(∀x)(Fx → Gx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'note' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '7',
                                            assumptions: '(∃x)(Fx & Gx), (∀x)[(∃y)Fy → Rx], (∀x)[(∃y)Gy → Sx]',
                                            conclusion: '(∀x)(Rx & Sx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'andi' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '8',
                                            assumptions: '(∃x)(Fx ∨ (Gx & Hx)), (∀x)(~Gx ∨ ~Hx)',
                                            conclusion: '(∃x)Fx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 1 }
                                                ]
                                            ],
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '9',
                                            assumptions: '(∃x)(Fx & (Gx ∨ Hx))',
                                            conclusion: '(∃x)(Fx & Gx) ∨ (∃x)(Fx & Hx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'andi' },
                                                    { type: 'Tactic', value: 'orir' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'andi' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '10',
                                            assumptions: '(∃x)(Fx ↔ Gx), (∀x)(Gx → (Hx → Jx))',
                                            conclusion: '(∃x)Jx ∨ ((∀x)Fx → (∃x)(Gx & ~Hx))',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'df' },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'orir' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'andi' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '11',
                                            assumptions: '(∀x)(Fx & (∃y)Gy)',
                                            conclusion: '(∃x)(Fx & Gx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'andi' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '12a',
                                            assumptions: '(∃x)(Fx & ~Fx)',
                                            conclusion: '(∀x)(Gx & ~Gx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 0 }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '12b',
                                            assumptions: '(∀x)(Gx & ~Gx)',
                                            conclusion: '(∃x)(Fx & ~Fx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 1 }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '13',
                                            assumptions: '(∃x)Gx',
                                            conclusion: '(∀x)(∃y)(Fx → Gy)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '14',
                                            assumptions: '(∀x)(Fx → (∃y)Gy), (∀x)(~Fx → (∃y)Gy)',
                                            conclusion: '(∃z)Gz',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '15',
                                            assumptions: '',
                                            conclusion: '(∀x)((Fx → Gx) ∨ (Gx → Fx))',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'lem' },
                                                    { type: 'SequentOrTheoremSubstitution', value: [['A', 'Fa']] },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'orir' },
                                                    { type: 'Tactic', value: 'pmi1' },
                                                    { type: 'SequentOrTheoremSubstitution', value: [['A', 'Fa'], ['B', 'Ga']] },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'pmi2' },
                                                    { type: 'SequentOrTheoremSubstitution', value: [['A', 'Fa'], ['B', 'Ga']] }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '16',
                                            assumptions: '(∃x)Fx → (∃x)Gx',
                                            conclusion: '(∃x)(Fx → Gx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '17',
                                            assumptions: '',
                                            conclusion: '(∃x)(∀y)(Fx → Fy)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 1 }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '18',
                                            assumptions: '(∀x)(∃y)(Fx → Gy), (∀x)(∃y)(~Fx → Gy)',
                                            conclusion: '(∃z)Gz',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'c' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '19a',
                                            assumptions: '(∀x)(∀y)(Gy → Fx)',
                                            conclusion: '(∀x)((∃y)Gy → Fx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'impe' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '19b',
                                            assumptions: '(∀x)((∃y)Gy → Fx)',
                                            conclusion: '(∀x)(∀y)(Gy → Fx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '20a',
                                            assumptions: '(∃x)(∀y)(Fx → Gy)',
                                            conclusion: '(∃x)(Fx → (∀y)Gy)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'impe' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '20b',
                                            assumptions: '(∃x)(Fx → (∀y)Gy)',
                                            conclusion: '(∃x)(∀y)(Fx → Gy)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'b' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '21',
                                            assumptions: '(∃x)(∀y)(Fy → Gx)',
                                            conclusion: '(∀x)(∃y)(Fx → Gy)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'impe' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '22a',
                                            assumptions: '(∃x)(∀y)(Fx → Gy)',
                                            conclusion: '(∀x)Fx → (∀x)Gx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'AnyFreeVariable', value: 'b' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '22b',
                                            assumptions: '(∀x)Fx → (∀x)Gx',
                                            conclusion: '(∃x)(∀y)(Fx → Gy)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'impe'},{'type':'Tactic','value':'foralli'},{'type':'UnusedFreeVariable','value':0},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':0},{'type':'Tactic','value':'existsi'},{'type':'AnyFreeVariable','value':'a'},{'type':'Tactic','value':'foralli'},{'type':'UnusedFreeVariable','value':0},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'note'},{'type':'UnifyingAssumption','value':1},{'type':'Tactic','value':'dn'},{'type':'Tactic','value':'noti'},{'type':'Tactic','value':'note'},{'type':'Tactic','value':'existsi'},{'type':'AnyFreeVariable','value':'a'},{'type':'Tactic','value':'foralli'},{'type':'UnusedFreeVariable','value':0},{'type':'Tactic','value':'impi'},{'type':'Tactic','value':'foralle'},{'type':'AnyFreeVariable','value':'b'}]
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'ProblemDirectory',
                                    name: 'II',
                                    entries: [
                                        {
                                            type: 'ProblemDescription',
                                            name: '1a',
                                            assumptions: '(∃x)(A & Fx)',
                                            conclusion: 'A & (∃x)Fx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'andi' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '1b',
                                            assumptions: 'A & (∃x)Fx',
                                            conclusion: '(∃x)(A & Fx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'ande' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'andi' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '2a',
                                            assumptions: '(∃x)(A ∨ Fx)',
                                            conclusion: 'A ∨ (∃x)Fx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'orir' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '2b',
                                            assumptions: 'A ∨ (∃x)Fx',
                                            conclusion: '(∃x)(A ∨ Fx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'orir' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '3a',
                                            assumptions: '(∀x)(A ∨ Fx)',
                                            conclusion: 'A ∨ (∀x)Fx',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'orir' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '3b',
                                            assumptions: 'A ∨ (∀x)Fx',
                                            conclusion: '(∀x)(A ∨ Fx)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'ore' },
                                                    { type: 'Tactic', value: 'oril' },
                                                    { type: 'Tactic', value: 'orir' },
                                                    { type: 'Tactic', value: 'foralle' },
                                                    { type: 'AnyFreeVariable', value: 'a' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '4',
                                            assumptions: '(∀x)Fx → A',
                                            conclusion: '(∃x)(Fx → A)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'impe' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 1 },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' }
                                                ]
                                            ]
                                        }

                                    ]
                                },
                                {
                                    type: 'ProblemDirectory',
                                    name: 'III',
                                    entries: [
                                        {
                                            type: 'ProblemDescription',
                                            name: '1',
                                            assumptions: '',
                                            conclusion: '(∃x)[(∃y)Fy → Fx]',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'existse' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' }
                                                ]
                                            ]
                                        },
                                        {
                                            type: 'ProblemDescription',
                                            name: '2',
                                            assumptions: '',
                                            conclusion: '(∃x)(Fx → (∀y)Fy)',
                                            allowed_tactics: [],
                                            test_scripts: [
                                                [
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'a' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'foralli' },
                                                    { type: 'UnusedFreeVariable', value: 0 },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 0 },
                                                    { type: 'Tactic', value: 'existsi' },
                                                    { type: 'AnyFreeVariable', value: 'b' },
                                                    { type: 'Tactic', value: 'impi' },
                                                    { type: 'Tactic', value: 'dn' },
                                                    { type: 'Tactic', value: 'noti' },
                                                    { type: 'Tactic', value: 'note' },
                                                    { type: 'UnifyingAssumption', value: 1 }
                                                ]
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'ProblemDirectory',
                    name: 'Section 5',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '~(∃x)(Fx & Gx) ∨ (∃x)~Gx, (∀y)Gy',
                                    conclusion: '(∀z)(Fz → ~Gz)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '(∀x)Fx → A ',
                                    conclusion: '(∃x)(Fx → A)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '(∀x)Fx, (∀y)Fy → (∀y)Gy',
                                    conclusion: '(∀z)Gz',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '~(∀x)(Fx → Gx)',
                                    conclusion: '(∃x)(Fx & ~Gx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '(∀x)(Fx → ~Gx)',
                                    conclusion: '~(∃x)(Fx & Gx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '(∃x)(Fx → (∃y)~Fy)',
                                    conclusion: '~(∀x)Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '(∃x)Fx → ~(∀y)Gy, (∀x)(Kx → (∃y)Jy), (∃y)~Gy → (∃x)Kx',
                                    conclusion: '~(∃x)Fx ∨ (∃y)Jy',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'orir' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '(∃x)Fx → (∀y)Gy',
                                    conclusion: '(∃x)(Fx → (∀y)Gy)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'b' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6a',
                                    assumptions: '(∀x)Fx',
                                    conclusion: '~(∃x)~Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6b',
                                    assumptions: '~(∃x)~Fx',
                                    conclusion: '(∀x)Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7a',
                                    assumptions: '(∃x)Fx',
                                    conclusion: '~(∀x)~Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7b',
                                    assumptions: '~(∀x)~Fx',
                                    conclusion: '(∃x)Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: '',
                                    conclusion: '(∃x)(∀y)(Fx → Fy)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9',
                                    assumptions: '',
                                    conclusion: '(∃x)(∀y)(∀z)((Fy → Gz) → (Fx → Gx))',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10',
                                    assumptions: '(∀x)(∃y)(Fx → Gy)',
                                    conclusion: '(∃x)(∀y)(Fy → Gx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' }
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'ProblemDirectory',
            name: 'Chapter 8',
            entries: [
                {
                    type: 'ProblemDirectory',
                    name: 'Section 3',
                    entries: [
                        {
                            type: 'ProblemDirectory',
                            name: 'Examples',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '(∃x)(∀y)Lxy',
                                    conclusion: '(∀y)(∃x)Lxy',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '(∀x)(∃y)Rxy, (∀x)(∀y)(Rxy → Ryx)',
                                    conclusion: '(∀x)(∃y)(Rxy & Ryx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '(∀x)(Fx → Gx), (∀x)(∀y)(Rxy → Syx), (∀x)(∀y)(Sxy → Syx)',
                                    conclusion: '(∀x)[(∃y)(Fx & Rxy) → (∃y)(Gx & Sxy)]',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 4 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '(∀x)[(∃y)Tyx → (∀z)~Txz], (∀x)(∀y)(Tyx → Txx)',
                                    conclusion: '(∀x)(∀y)~Txy',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'ProblemDirectory',
                            name: 'Exercises',
                            entries: [
                                {
                                    type: 'ProblemDescription',
                                    name: '1',
                                    assumptions: '(∀x)(Fx → (∀y)Rxy), ~Rab',
                                    conclusion: '~Fa',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '2',
                                    assumptions: '(∀x)(Fx → (∀y)(Gy → Rxy)), (∀x)(Hx → Gx)',
                                    conclusion: '(∀x)(∀y)((Fx & Hy) → Rxy)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '3',
                                    assumptions: '(∃x)Fx → (∀x)(Fx → Gxa), (∃x)Hx → (∀x)(Hx → Jxa)',
                                    conclusion: '(∃x)(Fx & Hx) → (∃x)(∃y)(Gxy & Jxy)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '4',
                                    assumptions: '(∀y)(∃x)((Fyy & Fyx) ∨ Fxy)',
                                    conclusion: '(∀y)(∃x)Fxy',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '5',
                                    assumptions: '(∀x)(∀y)(Rxy ↔ (Fy → Gx)), (∀z)Raz',
                                    conclusion: '(∃x)Fx → (∃x)Gx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '6',
                                    assumptions: '(∀x)[(∃y)Rxy → (∀z)Rzx]',
                                    conclusion: '(∀x)(∀y)(Rxy → Ryx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '7',
                                    assumptions: '(∀x)(∀y)(Exy → Eyx), (∀x)(∀y)(Exy → Exx)',
                                    conclusion: '(∀x)[(∃y)Eyx → Exx]',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '8',
                                    assumptions: '(∀x)(Fx → Gx)',
                                    conclusion: '(∀x)[(∀y)(Gy → Rxy) → (∀z)(Fz → Rxz)]',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '9',
                                    assumptions: '(∃y)(∀x)Rxy, (∀x)(Fx → (∃y)Syx), (∀x)(∀y)(Rxy → ~Sxy)',
                                    conclusion: '(∃x)~Fx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '10',
                                    assumptions: '(∃x)(∀y)((∃z)Ryz → Ryx), (∀x)(∃y)Rxy',
                                    conclusion: '(∃x)(∀y)Ryx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'c' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '11',
                                    assumptions: '(∃x)(Fx & (∀y)(Gy → Rxy)), (∀x)(Fx → (∀y)(Ky → ~Rxy))',
                                    conclusion: '(∀x)(Gx → ~Kx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '12',
                                    assumptions: '(∃x)(∀y)((Fx ∨ Gy) → (∀z)(Hxy → Hyz)), (∃z)(∀x)~Hxz',
                                    conclusion: '(∃y)(∀x)(Fy → ~Hyx)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'oril' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '13',
                                    assumptions: '(∀x)[(∃y)Tyx → (∀z)~Txz], (∀x)[(∃y)Tyx → Txx]',
                                    conclusion: '(∀x)(∀y)~Txy',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '14',
                                    assumptions: '(∃x)[Sx & (∀y)((Py & (∃z)(Sz & Dyz)) → Dyx)], (∀x)(Px → (∃y)(Sy & Dxy))',
                                    conclusion: '(∃x)(Sx & (∀y)(Py → Dyx))',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'andi' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '15',
                                    assumptions: '(∀x)(∀y)[(∃z)Hyz → Hxy]',
                                    conclusion: '(∃x)(∃y)Hxy → (∀x)(∀y)Hxy',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'd' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '16',
                                    assumptions: '(∃x)(Fx & (∀y)((Gy & Hy) → ~Sxy)), (∀x)(∀y)(((Fx & Gy) & Jy) → ~Sxy), (∀x)(∀y)(((Fx & Gy) & Rxy) → Sxy), (∃x)(Gx & (Jx ∨ Hx))',
                                    conclusion: '(∃x)(∃y)((Fx & Gy) & ~Rxy)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 3 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 4 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'ore' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'andi' },
                                            { type: 'Tactic', value: 'note' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '17',
                                    assumptions: '(∀x)(∀y)(∀z)(Rxy → ~Ryz)',
                                    conclusion: '(∃y)(∀x)~Rxy',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'c' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'UnifyingAssumption', value: 2 },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '18',
                                    assumptions: '(∀x)Fx ↔ ~(∃x)(∃y)Rxy',
                                    conclusion: '(∃x)(∀y)(∀z)(Fx → ~Ryz)',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'df' },
                                            { type: 'Tactic', value: 'ande' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'c' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '19',
                                    assumptions: '(∃x)(∀y)[(∃z)(Fzy → (∃w)Fyw) → Fxy]',
                                    conclusion: '(∃x)Fxx',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'foralle' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impe' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' }
                                        ]
                                    ]
                                },
                                {
                                    type: 'ProblemDescription',
                                    name: '20',
                                    assumptions: '',
                                    conclusion: '(∀x)(∃y)(∀z)[(∃u)Txyu → (∃v)Txzv]',
                                    allowed_tactics: [],
                                    test_scripts: [
                                        [
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'a' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'b' },
                                            { type: 'Tactic', value: 'foralli' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'impi' },
                                            { type: 'Tactic', value: 'dn' },
                                            { type: 'Tactic', value: 'noti' },
                                            { type: 'Tactic', value: 'note' },
                                            { type: 'UnifyingAssumption', value: 1 },
                                            { type: 'Tactic', value: 'existse' },
                                            { type: 'UnusedFreeVariable', value: 0 },
                                            { type: 'Tactic', value: 'existsi' },
                                            { type: 'AnyFreeVariable', value: 'e' }
                                        ]
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}