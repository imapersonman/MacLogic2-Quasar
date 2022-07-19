/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { app, con, flapp, imv, iovlist, iv, la, mvlist, ov, ovlist, pi, type_k } from 'coastline/src/lambda_pi/shorthands';
import { sub_problem } from 'coastline/src/construction/check_proof_insert';
import { sequent } from 'coastline/src/construction/sequent';
import { try_parse_then_elaborate_sequent } from '../../src/components/MacLogicConstructor/parse_then_elaborate';
import { unifying_assumption } from 'coastline/src/construction/unifying_assumptions';
import { test_partial_generator_expectation, test_generator_expectation } from 'coastline/tests/generators/check_generator'
import { absurd, and, andel, ander, andi, exists, existse, existsi, forall, foralle, foralli, i, iff, imp, impe, impi, ml, not, o, or, ore, pred } from '../../src/components/MacLogicConstructor/maclogic_shorthands';
import { Ast, Variable } from 'coastline/src/lambda_pi/ast';
import { AssumptionHidingProofInsert, HideAssumption, hide_assumptions_in_problems, InsertProof } from '../../src/components/MacLogicConstructor/assumption_hiding_proof_insert';
import { mk_map } from 'coastline/src/map/RecursiveMap';
import { run_interaction, Input } from 'coastline/src/interaction/interaction'
import { display_maclogic_state, interaction, is_individual_or_predicate_type, proven_sequent_substitution_to_ctx_and_substitution, separate_propositions_assumptions_and_conclusion, separate_sequent_from_individuals_and_predicates, SequentOrTheoremId, sequent_or_theorem_to_proof_insert, sig } from '../../src/components/MacLogicConstructor/construction_interaction';
import { fill_in_problem_with_parent } from '../../src/components/MacLogicConstructor/fill_in_problem_with_parent';
import { and_association_1, and_association_2, and_association_3, and_association_4, and_association_5, exists_and_exists_conjunct_1, exists_and_exists_conjunct_2, exists_and_exists_conjunct_3, exists_and_exists_conjunct_4, forall_pullout_1, forall_pullout_2, forall_pullout_3, forall_pullout_4, forall_pullout_5, forall_pullout_6, forall_pullout_7, implication_collapse_1, implication_collapse_2, implication_collapse_3, implication_collapse_4, pt_seq } from './problem_tree.test';
import { closed_problem, current_problem, open_problem, split_problem } from '../../src/components/MacLogicConstructor/problem_tree';
import { possible_names_minus } from '../../src/components/MacLogicConstructor/possible_variable_names';
import { check_sig } from 'coastline/src/logical_framework/synthesize_type';
import { Ctx } from 'coastline/src/logical_framework/ctx';
import { Substitution } from 'coastline/src/unification/first_order';
import { individuali } from 'coastline/src/maclogic/maclogic_shorthands';
import { proven_sequent } from '../../src/components/MacLogicConstructor/proven_sequent';

const tptes = (assumptions: string, conclusion: string) => try_parse_then_elaborate_sequent(assumptions, conclusion)
const separated_tptes = (assumptions: string, conclusion: string) => separate_sequent_from_individuals_and_predicates(try_parse_then_elaborate_sequent(assumptions, conclusion))[1]

const [X, Y, Z] = mvlist('X', 'Y', 'Z')
const [A, B, C, D, R, S, T] = ovlist('A', 'B', 'C', 'D', 'R', 'S', 'T')
const [u1, u2, u3, u4, u5, u6] = iovlist(0, 1, 2, 3, 4, 5)

test('sig typechecks correctly', () => expect(check_sig(sig)).toBeTruthy())

describe('hide_assumptions_in_problems', () => {
    it('throws when the new problems do not match up with the new conclusions', () => expect(
        () => hide_assumptions_in_problems(
            [X, HideAssumption(Y, [ov('a')]), Z],
            [sub_problem(imv(0), sequent(mk_map(), type_k)), sub_problem(imv(1), sequent(mk_map(), type_k))])
    ).toThrow())
    it('returns an empty list of problems when there are no problems given', () => expect(
        hide_assumptions_in_problems([], [])
    ).toEqual(
        []
    ))
    it('only hides assumptions that we want to hide, ignoring the conclusions even though they should probably be the same', () => expect(
        hide_assumptions_in_problems(
            [HideAssumption(type_k, [ov('a')]), X, HideAssumption(Y, [ov('b')]), HideAssumption(absurd, [ov('c')])],
            [
                sub_problem(imv(0), sequent(mk_map(['a', type_k], ['b', type_k], ['c', type_k]), type_k)),
                sub_problem(imv(4), sequent(mk_map(['a', type_k], ['c', type_k]), X)),
                sub_problem(imv(1), sequent(mk_map(['b', type_k], ['d', type_k], ['g', type_k]), Y)),
                sub_problem(imv(3), sequent(mk_map(['c', type_k]), absurd))
            ])
    ).toEqual(
        [
            sub_problem(imv(0), sequent(mk_map(['b', type_k], ['c', type_k]), type_k)),
            sub_problem(imv(4), sequent(mk_map(['a', type_k], ['c', type_k]), X)),
            sub_problem(imv(1), sequent(mk_map(['d', type_k], ['g', type_k]), Y)),
            sub_problem(imv(3), sequent(mk_map(), absurd))
        ]
    ))
    it('throws if an assumption to hide does not exist', () => expect(
        () => hide_assumptions_in_problems(
            [HideAssumption(type_k, [ov('a')]), X, HideAssumption(Y, [ov('b')]), HideAssumption(absurd, [ov('c')])],
            [
                sub_problem(imv(0), sequent(mk_map(), type_k)),
                sub_problem(imv(1), sequent(mk_map(), X)),
                sub_problem(imv(4), sequent(mk_map(), Y)),
                sub_problem(imv(3), sequent(mk_map(), absurd))
            ])
    ).toThrow())
})


describe('fill_in_sequent_with_parent', () => {
    it('does not fill assumptions if neither parent nor sequent have any, taking sequent conclusion', () => expect(
        fill_in_problem_with_parent(sequent(mk_map(), X), sub_problem(imv(-1), sequent(mk_map(), Y)))
    ).toEqual(
        sub_problem(imv(-1), sequent(mk_map(), Y))
    ))
    it('fills in assumptions with parent only if sequent does not have any', () => expect(
        fill_in_problem_with_parent(sequent(mk_map(['x', Z], ['y', absurd]), X), sub_problem(imv(10), sequent(mk_map(), Z)))
    ).toEqual(
        sub_problem(imv(10), sequent(mk_map(['x', Z], ['y', absurd]), Z))
    ))
    it('fills in assumptions with sequent only if parent does not have any', () => expect(
        fill_in_problem_with_parent(sequent(mk_map(), X), sub_problem(imv(0), sequent(mk_map(['x', Z], ['y', absurd]), type_k)))
    ).toEqual(
        sub_problem(imv(0), sequent(mk_map(['x', Z], ['y', absurd]), type_k))
    ))
    it('fills in assumptions with parent first if both parent and sequent have some', () => expect(
        fill_in_problem_with_parent(sequent(mk_map(['z', Y], ['w', Z]), X), sub_problem(imv(2), sequent(mk_map(['x', Z], ['y', absurd]), Y)))
    ).toEqual(
        sub_problem(imv(2), sequent(mk_map(['z', Y], ['w', Z], ['x', Z], ['y', absurd]), Y))
    ))
})

test_partial_generator_expectation('successful maclogic and association', run_interaction(interaction), {
    yields: [
        {
            yielded: {
                mode: 'EnterProblem',
                problem_ctx: mk_map<Ast>(),
                main_problem: undefined,
                // main_problem_string: '',
                problem_stack: [],
                next_problem_id: 0,
                next_unused_variable_id: 0,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: undefined,
                problem_tree: undefined,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast: undefined,
                proof: undefined,
                inputs: []
            },
            continued_with: Input({ type: 'Problem', value: tptes('A & (B & C)', '(A & B) & C') })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['A', o], ['B', o], ['C', o]),
                main_problem: separated_tptes('A & (B & C)', '(A & B) & C'),
                // main_problem_string: 'A & (B & C) ⊢ (A & B) & C',
                problem_stack: [
                    sub_problem(imv(0), sequent(mk_map<Ast>(['$_0', ml(and(A, and(B, C)))]), ml(and(and(A, B), C))))
                ],
                next_problem_id: 1,
                next_unused_variable_id: 1,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(and(A, and(B, C)))]), ml(and(and(A, B), C)))
                ],
                request: undefined,
                problem_tree: and_association_1,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast:
                    la(u1, ml(and(A, and(B, C))),
                        imv(0)),
                proof: undefined,
                inputs: []

            },
            continued_with: Input({ type: 'Tactic', value: 'ande' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['A', o], ['B', o], ['C', o]),
                main_problem: separated_tptes('A & (B & C)', '(A & B) & C'),
                // main_problem_string: 'A & (B & C) ⊢ (A & B) & C',
                problem_stack: [
                    sub_problem(imv(1), sequent(mk_map<Ast>(['$_1', ml(A)], ['$_2', ml(and(B, C))]), ml(and(and(A, B), C))))
                ],
                next_problem_id: 2,
                next_unused_variable_id: 3,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_1', ml(A)], ['$_2', ml(and(B, C))]), ml(and(and(A, B), C)))
                ],
                request: undefined,
                problem_tree: and_association_2,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(and(A, and(B, C))),
                        flapp(
                            la(u2, ml(A), la(u3, ml(and(B, C)),
                                imv(1))),
                            andel(A, and(B, C), u1),
                            ander(A, and(B, C), u1))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'ande' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'ande' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['A', o], ['B', o], ['C', o]),
                main_problem: separated_tptes('A & (B & C)', '(A & B) & C'),
                // main_problem_string: 'A & (B & C) ⊢ (A & B) & C',
                problem_stack: [
                    sub_problem(imv(2), sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(and(and(A, B), C))))
                ],
                next_problem_id: 3,
                next_unused_variable_id: 5,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(and(and(A, B), C)))
                ],
                request: undefined,
                problem_tree: and_association_3,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast: 
                    la(u1, ml(and(A, and(B, C))),
                        flapp(
                            la(u2, ml(A), la(u3, ml(and(B, C)),
                                flapp(
                                    la(u4, ml(B), la(u5, ml(C), imv(2))),
                                    andel(B, C, u3),
                                    ander(B, C, u3)))),
                            andel(A, and(B, C), u1),
                            ander(A, and(B, C), u1))),

                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'ande' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'andi' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['A', o], ['B', o], ['C', o]),
                main_problem: separated_tptes('A & (B & C)', '(A & B) & C'),
                // main_problem_string: 'A & (B & C) ⊢ (A & B) & C',
                problem_stack: [
                    sub_problem(imv(3), sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(and(A, B)))),
                    sub_problem(imv(4), sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(C)))
                ],
                next_problem_id: 5,
                next_unused_variable_id: 6,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(and(A, B))),
                    sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(C))
                ],
                request: undefined,
                problem_tree: and_association_4,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(and(A, and(B, C))),
                        flapp(
                            la(u2, ml(A), la(u3, ml(and(B, C)),
                                flapp(
                                    la(u4, ml(B), la(u5, ml(C), andi(and(A, B), C, imv(3), imv(4)))),
                                    andel(B, C, u3),
                                    ander(B, C, u3)))),
                            andel(A, and(B, C), u1),
                            ander(A, and(B, C), u1))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'andi' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'andi' })
        },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map(['A', o], ['B', o], ['C', o]),
        main_problem: separated_tptes('A & (B & C)', '(A & B) & C'),
        // main_problem_string: 'A & (B & C) ⊢ (A & B) & C',
        problem_stack: [],
        next_problem_id: 7,
        next_unused_variable_id: 7,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(A)),
            sequent(mk_map<Ast>(['$_1', ml(A)], ['$_3', ml(B)], ['$_4', ml(C)]), ml(B)),
        ],
        request: undefined,
        problem_tree: and_association_5,
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast:
            la(u1, ml(and(A, and(B, C))),
                flapp(
                    la(u2, ml(A), la(u3, ml(and(B, C)),
                        flapp(
                            la(u4, ml(B), la(u5, ml(C), andi(and(A, B), C, andi(A, B, u2, u4), u5))),
                            andel(B, C, u3),
                            ander(B, C, u3)))),
                    andel(A, and(B, C), u1),
                    ander(A, and(B, C), u1))),
        proof: [
            { assumption_lines: [ 1 ], line_number: 1, statement: ml(and(A, and(B, C))), reason: 'Premise', dependencies: [] },
            { assumption_lines: [ 1 ], line_number: 2, statement: ml(A), reason: 'andel', dependencies: [1] },
            { assumption_lines: [ 1 ], line_number: 3, statement: ml(and(B, C)), reason: 'ander', dependencies: [1] },
            { assumption_lines: [ 1 ], line_number: 4, statement: ml(B), reason: 'andel', dependencies: [3] },
            { assumption_lines: [ 1 ], line_number: 5, statement: ml(and(A, B)), reason: 'andi', dependencies: [2, 4] },
            { assumption_lines: [ 1 ], line_number: 6, statement: ml(C), reason: 'ander', dependencies: [3] },
            { assumption_lines: [ 1 ], line_number: 7, statement: ml(and(and(A, B), C)), reason: 'andi', dependencies: [5, 6] }
        ],
        inputs: [{ type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'andi' }, { type: 'Tactic', value: 'andi' }]
    }
}, display_maclogic_state, display_maclogic_state)

test_generator_expectation('successful maclogic implication collapse', run_interaction(interaction), {
    yields: [
        {
            yielded: {
                mode: 'EnterProblem',
                problem_ctx: mk_map<Ast>(),
                main_problem: undefined,
                // main_problem_string: '',
                problem_stack: [],
                next_problem_id: 0,
                next_unused_variable_id: 0,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: undefined,
                problem_tree: undefined,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast: undefined,
                proof: undefined,
                inputs: []
            },
            continued_with: Input({ type: 'Problem', value: tptes('R -> (S -> T), S', 'R -> T') })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['R', o], ['S', o], ['T', o]),
                main_problem: separated_tptes('R -> (S -> T), S', 'R -> T'),
                // main_problem_string: 'R → (S → T), S ⊢ R → T',
                problem_stack: [
                    sub_problem(imv(0), separated_tptes('R → (S → T), S', 'R → T'))
                ],
                next_problem_id: 1,
                next_unused_variable_id: 2,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    separated_tptes('R → (S → T), S', 'R → T')
                ],
                request: undefined,
                problem_tree: implication_collapse_1,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast:
                    la(u1, ml(imp(R, imp(S, T))), la(u2, ml(S),
                        imv(0))),
                proof: undefined,
                inputs: []
            },
            continued_with: Input({ type: 'Tactic', value: 'impi' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['R', o], ['S', o], ['T', o]),
                main_problem: separated_tptes('R -> (S -> T), S', 'R -> T'),
                // main_problem_string: 'R → (S → T), S ⊢ R → T',
                problem_stack: [
                    sub_problem(imv(1), sequent(mk_map<Ast>(['$_0', ml(imp(R, imp(S, T)))], ['$_1', ml(S)], ['$_2', ml(R)]), ml(T)))
                ],
                next_problem_id: 2,
                next_unused_variable_id: 3,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(imp(R, imp(S, T)))], ['$_1', ml(S)], ['$_2', ml(R)]), ml(T))
                ],
                request: undefined,
                problem_tree: implication_collapse_2,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(imp(R, imp(S, T))), la(u2, ml(S),
                        impi(R, T, la(u3, ml(R),
                            imv(1))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'impi' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'impe' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['R', o], ['S', o], ['T', o]),
                main_problem: separated_tptes('R -> (S -> T), S', 'R -> T'),
                // main_problem_string: 'R → (S → T), S ⊢ R → T',
                problem_stack: [
                    sub_problem(imv(3), sequent(mk_map<Ast>(['$_1', ml(S)], ['$_2', ml(R)], ['$_3', ml(imp(S, T))]), ml(T)))
                ],
                next_problem_id: 4,
                next_unused_variable_id: 4,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(imp(R, imp(S, T)))], ['$_1', ml(S)], ['$_2', ml(R)]), ml(R)),
                    sequent(mk_map<Ast>(['$_1', ml(S)], ['$_2', ml(R)], ['$_3', ml(imp(S, T))]), ml(T))
                ],
                request: undefined,
                problem_tree: implication_collapse_3,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(imp(R, imp(S, T))), la(u2, ml(S),
                        impi(R, T, la(u3, ml(R),
                            flapp(
                                la(u4, ml(imp(S, T)),
                                    imv(3)),
                                impe(R, imp(S, T), u1, u3)))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'impi' }, { type: 'Tactic', value: 'impe' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'impe' })
        },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map(['R', o], ['S', o], ['T', o]),
        main_problem: separated_tptes('R -> (S -> T), S', 'R -> T'),
        // main_problem_string: 'R → (S → T), S ⊢ R → T',
        problem_stack: [],
        next_problem_id: 6,
        next_unused_variable_id: 5,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map<Ast>(['$_1', ml(S)], ['$_2', ml(R)], ['$_3', ml(imp(S, T))]), ml(S)),
            sequent(mk_map<Ast>(['$_1', ml(S)], ['$_2', ml(R)], ['$_4', ml(T)]), ml(T)),
        ],
        request: undefined,
        problem_tree: implication_collapse_4,
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast:
            la(u1, ml(imp(R, imp(S, T))), la(u2, ml(S),
                impi(R, T, la(u3, ml(R),
                    flapp(
                        la(u4, ml(imp(S, T)),
                            flapp(
                                la(u5, ml(T), u5),
                                impe(S, T, u4, u2))),
                        impe(R, imp(S, T), u1, u3)))))),
        proof: [
            { assumption_lines: [ 1 ], line_number: 1, statement: ml(imp(R, imp(S, T))), reason: 'Premise', dependencies: [] },
            { assumption_lines: [ 2 ], line_number: 2, statement: ml(S), reason: 'Premise', dependencies: [] },
            { assumption_lines: [ 3 ], line_number: 3, statement: ml(R), reason: 'Assumption', dependencies: [] },
            { assumption_lines: [ 1, 3 ], line_number: 4, statement: ml(imp(S, T)), reason: 'impe', dependencies: [1, 3] },
            { assumption_lines: [ 1, 2, 3 ], line_number: 5, statement: ml(T), reason: 'impe', dependencies: [4, 2] },
            { assumption_lines: [ 1, 2 ], line_number: 6, statement: ml(imp(R, T)), reason: 'impi', dependencies: [3, 5] }
        ],
        inputs: [{ type: 'Tactic', value: 'impi' }, { type: 'Tactic', value: 'impe' }, { type: 'Tactic', value: 'impe' }]
    }
}, display_maclogic_state, display_maclogic_state)

// ∀x(Fx -> ∀yGy) => ∀x∀y(Fx -> Gy)
const [a, b] = ovlist('a', 'b')
const [Fv, Gv] = ovlist('F', 'G')
const [F, G, x, y] = [(ind: Ast) => flapp(Fv, ind), (ind: Ast) => flapp(Gv, ind), ov('x'), ov('y')]
test_generator_expectation('successful maclogic universal pullout', run_interaction(interaction), {
    yields: [
        {
            yielded: {
                mode: 'EnterProblem',
                problem_ctx: mk_map<Ast>(),
                main_problem: undefined,
                // main_problem_string: '',
                problem_stack: [],
                next_problem_id: 0,
                next_unused_variable_id: 0,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: undefined,
                problem_tree: undefined,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast: undefined,
                proof: undefined,
                inputs: []
            },
            continued_with: Input({ type: 'Problem', value: tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)') })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(0), separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'))
                ],
                next_problem_id: 1,
                next_unused_variable_id: 1,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)')
                ],
                request: undefined,
                problem_tree: forall_pullout_1,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        imv(0)),
                proof: undefined,
                inputs: []
            },
            continued_with: Input({ type: 'Tactic', value: 'foralli' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(0), separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'))
                ],
                next_problem_id: 1,
                next_unused_variable_id: 1,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: { type: 'UnusedFreeVariable', possible_names: [...possible_names_minus(['x', 'y'])] },
                problem_tree: forall_pullout_1,
                tactic: 'foralli',
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        imv(0)),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }]
            },
            continued_with: Input({ type: 'UnusedFreeVariable', value: 0 })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(1), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i]), ml(forall(y, imp(F(a), G(y))))))
                ],
                next_problem_id: 2,
                next_unused_variable_id: 2,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i]), ml(forall(y, imp(F(a), G(y)))))
                ],
                request: undefined,
                problem_tree: forall_pullout_2,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                imv(1)))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }]
            },
            continued_with: Input({ type: 'Tactic', value: 'foralli' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(1), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i]), ml(forall(y, imp(F(a), G(y))))))
                ],
                next_problem_id: 2,
                next_unused_variable_id: 2,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: { type: 'UnusedFreeVariable', possible_names: [...possible_names_minus(['a', 'y']), 'a\''] },
                problem_tree: forall_pullout_2,
                tactic: 'foralli',
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                imv(1)))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }]
            },
            continued_with: Input({ type: 'UnusedFreeVariable', value: 0 })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(2), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i]), ml(imp(F(a), G(b)))))
                ],
                next_problem_id: 3,
                next_unused_variable_id: 3,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i]), ml(imp(F(a), G(b))))
                ],
                request: undefined,
                problem_tree: forall_pullout_3,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                foralli(
                                    la(y, i, imp(F(a), G(y))),
                                    la(b, i, imv(2)))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }]
            },
            continued_with: Input({ type: 'Tactic', value: 'impi' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(3), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))]), ml(G(b))))
                ],
                next_problem_id: 4,
                next_unused_variable_id: 4,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))]), ml(G(b)))
                ],
                request: undefined,
                problem_tree: forall_pullout_4,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                foralli(
                                    la(y, i, imp(F(a), G(y))),
                                    la(b, i, impi(F(a), G(b),
                                        la(u4, ml(F(a)), imv(3)))))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'impi' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'foralle' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(3), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))]), ml(G(b))))
                ],
                next_problem_id: 4,
                next_unused_variable_id: 4,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: { type: 'AnyFreeVariable', bound_variables: [x, y] },
                problem_tree: forall_pullout_4,
                tactic: 'foralle',
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                foralli(
                                    la(y, i, imp(F(a), G(y))),
                                    la(b, i, impi(F(a), G(b),
                                        la(u4, ml(F(a)), imv(3)))))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'impi' }, { type: 'Tactic', value: 'foralle' }]
            },
            continued_with: Input({ type: 'AnyFreeVariable', value: 'a' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(4), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_4', ml(imp(F(a), forall(y, G(y))))]), ml(G(b))))
                ],
                next_problem_id: 5,
                next_unused_variable_id: 5,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_4', ml(imp(F(a), forall(y, G(y))))]), ml(G(b)))
                ],
                request: undefined,
                problem_tree: forall_pullout_5,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                foralli(
                                    la(y, i, imp(F(a), G(y))),
                                    la(b, i, impi(F(a), G(b),
                                        la(u4, ml(F(a)),
                                            app(
                                                la(u5, ml(imp(F(a), forall(y, G(y)))),
                                                    imv(4)),
                                                foralle(la(x, i, imp(F(x), forall(y, G(y)))), a, u1))))))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'impi' }, { type: 'Tactic', value: 'foralle' }, { type: 'AnyFreeVariable', value: 'a' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'impe' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(6), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_5', ml(forall(y, G(y)))]), ml(G(b))))
                ],
                next_problem_id: 7,
                next_unused_variable_id: 6,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_4', ml(imp(F(a), forall(y, G(y))))]), ml(F(a))),
                    sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_5', ml(forall(y, G(y)))]), ml(G(b)))
                ],
                request: undefined,
                problem_tree: forall_pullout_6,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                foralli(
                                    la(y, i, imp(F(a), G(y))),
                                    la(b, i, impi(F(a), G(b),
                                        la(u4, ml(F(a)),
                                            app(
                                                la(u5, ml(imp(F(a), forall(y, G(y)))),
                                                    app(
                                                        la(u6, ml(forall(y, G(y))),
                                                            imv(6)),
                                                        impe(F(a), forall(y, G(y)), u5, u4))),
                                                foralle(la(x, i, imp(F(x), forall(y, G(y)))), a, u1))))))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'impi' }, { type: 'Tactic', value: 'foralle' }, { type: 'AnyFreeVariable', value: 'a' }, { type: 'Tactic', value: 'impe' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'foralle' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(6), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_5', ml(forall(y, G(y)))]), ml(G(b))))
                ],
                next_problem_id: 7,
                next_unused_variable_id: 6,
                error: undefined,
                proof_insert: undefined,
                // If request is defined, new_problems should be set to undefined.
                new_problems: undefined,
                request: { type: 'UnifyingAssumption', pattern: ml(app(con('forall'), X)), uas: [unifying_assumption({ 'X': la(x, i, imp(F(x), forall(y, G(y)))) }, iv(0)), unifying_assumption({ 'X': la(y, i, G(y)) }, iv(5))] },
                problem_tree: forall_pullout_6,
                tactic: 'foralle',
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                foralli(
                                    la(y, i, imp(F(a), G(y))),
                                    la(b, i, impi(F(a), G(b),
                                        la(u4, ml(F(a)),
                                            app(
                                                la(u5, ml(imp(F(a), forall(y, G(y)))),
                                                    app(
                                                        la(u6, ml(forall(y, G(y))),
                                                            imv(6)),
                                                        impe(F(a), forall(y, G(y)), u5, u4))),
                                                foralle(la(x, i, imp(F(x), forall(y, G(y)))), a, u1))))))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'impi' }, { type: 'Tactic', value: 'foralle' }, { type: 'AnyFreeVariable', value: 'a' }, { type: 'Tactic', value: 'impe' }, { type: 'Tactic', value: 'foralle' }]
            },
            continued_with: Input({ type: 'UnifyingAssumption', value: 1 })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
                // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
                problem_stack: [
                    sub_problem(imv(6), sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_5', ml(forall(y, G(y)))]), ml(G(b))))
                ],
                next_problem_id: 7,
                next_unused_variable_id: 6,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: { type: 'AnyFreeVariable', bound_variables: [x, y] },
                problem_tree: forall_pullout_6,
                tactic: 'foralle',
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                        foralli(
                            la(x, i, forall(y, imp(F(x), G(y)))),
                            la(a, i,
                                foralli(
                                    la(y, i, imp(F(a), G(y))),
                                    la(b, i, impi(F(a), G(b),
                                        la(u4, ml(F(a)),
                                            app(
                                                la(u5, ml(imp(F(a), forall(y, G(y)))),
                                                    app(
                                                        la(u6, ml(forall(y, G(y))),
                                                            imv(6)),
                                                        impe(F(a), forall(y, G(y)), u5, u4))),
                                                foralle(la(x, i, imp(F(x), forall(y, G(y)))), a, u1))))))))),
                proof: undefined,
                inputs: [
                    { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'impi' },
                    { type: 'Tactic', value: 'foralle' }, { type: 'AnyFreeVariable', value: 'a' }, { type: 'Tactic', value: 'impe' }, { type: 'Tactic', value: 'foralle' }, { type: 'UnifyingAssumption', value: 1 }
                ]
            },
            continued_with: Input({ type: 'AnyFreeVariable', value: 'b' })
        },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map(['F', pred(1)], ['G', pred(1)]),
        main_problem: separated_tptes('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)'),
        // main_problem_string: '(∀x)(Fx → (∀y)Gy) ⊢ (∀x)(∀y)(Fx → Gy)',
        problem_stack: [],
        next_problem_id: 8,
        next_unused_variable_id: 7,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map<Ast>(['$_0', ml(forall(x, imp(F(x), forall(y, G(y)))))], ['a', i], ['b', i], ['$_3', ml(F(a))], ['$_5', ml(forall(y, G(y)))], ['$_6', ml(G(b))]), ml(G(b)))
        ],
        request: undefined,
        problem_tree: forall_pullout_7,
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast:
            la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
                foralli(
                    la(x, i, forall(y, imp(F(x), G(y)))),
                    la(a, i,
                        foralli(
                            la(y, i, imp(F(a), G(y))),
                            la(b, i, impi(F(a), G(b),
                                la(u4, ml(F(a)),
                                    app(
                                        la(u5, ml(imp(F(a), forall(y, G(y)))),
                                            app(
                                                la(u6, ml(forall(y, G(y))),
                                                    app(
                                                        la(iv(6), ml(G(b)), iv(6)),
                                                        foralle(la(y, i, G(y)), b, u6)
                                                    )
                                                ),
                                                impe(F(a), forall(y, G(y)), u5, u4))),
                                        foralle(la(x, i, imp(F(x), forall(y, G(y)))), a, u1))))))))),
        proof: [
            { assumption_lines: [ 1 ], line_number: 1, statement: ml(forall(x, imp(F(x), forall(y, G(y))))), reason: 'Premise', dependencies: [] },
            { assumption_lines: [ 2 ], line_number: 2, statement: ml(F(a)), reason: 'Assumption', dependencies: [] },
            { assumption_lines: [ 1 ], line_number: 3, statement: ml(imp(F(a), forall(y, G(y)))), reason: 'foralle', dependencies: [1] },
            { assumption_lines: [ 1, 2 ], line_number: 4, statement: ml(forall(y, G(y))), reason: 'impe', dependencies: [3, 2] },
            { assumption_lines: [ 1, 2 ], line_number: 5, statement: ml(G(b)), reason: 'foralle', dependencies: [4] },
            { assumption_lines: [ 1 ], line_number: 6, statement: ml(imp(F(a), G(b))), reason: 'impi', dependencies: [2, 5] },
            { assumption_lines: [ 1 ], line_number: 7, statement: ml(forall(y, imp(F(a), G(y)))), reason: 'foralli', dependencies: [6] },
            { assumption_lines: [ 1 ], line_number: 8, statement: ml(forall(x, forall(y, imp(F(x), G(y))))), reason: 'foralli', dependencies: [7] }
        ],
        inputs: [
            { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'foralli' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'impi' },
            { type: 'Tactic', value: 'foralle' }, { type: 'AnyFreeVariable', value: 'a' }, { type: 'Tactic', value: 'impe' }, { type: 'Tactic', value: 'foralle' }, { type: 'UnifyingAssumption', value: 1 },
            { type: 'AnyFreeVariable', value: 'b' }
        ]
    }
}, display_maclogic_state, display_maclogic_state)

test_generator_expectation('exists_and_exists_conjunct', run_interaction(interaction), {
    yields: [
        {
            yielded: {
                mode: 'EnterProblem',
                problem_ctx: mk_map<Ast>(),
                main_problem: undefined,
                // main_problem_string: '',
                problem_stack: [],
                next_problem_id: 0,
                next_unused_variable_id: 0,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: undefined,
                problem_tree: undefined,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast: undefined,
                proof: undefined,
                inputs: []
            },
            continued_with: Input({ type: 'Problem', value: tptes('∃x(Fx & Gx)', '∃xFx') })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map<Ast>(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∃x(Fx & Gx)', '∃xFx'),
                // main_problem_string: '(∃x)(Fx & Gx) ⊢ (∃x)Fx',
                problem_stack: [
                    sub_problem(imv(0), separated_tptes('∃x(Fx & Gx)', '∃xFx'))
                ],
                next_problem_id: 1,
                next_unused_variable_id: 1,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    separated_tptes('∃x(Fx & Gx)', '∃xFx')
                ],
                request: undefined,
                problem_tree: exists_and_exists_conjunct_1,
                tactic: undefined,
                can_undo: false,
                can_redo: false,
                ast:
                    la(u1, ml(exists(x, and(F(x), G(x)))),
                        imv(0)),
                proof: undefined,
                inputs: []
            },
            continued_with: Input({ type: 'Tactic', value: 'existse' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map<Ast>(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∃x(Fx & Gx)', '∃xFx'),
                // main_problem_string: '(∃x)(Fx & Gx) ⊢ (∃x)Fx',
                problem_stack: [
                    sub_problem(imv(0), separated_tptes('∃x(Fx & Gx)', '∃xFx'))
                ],
                next_problem_id: 1,
                next_unused_variable_id: 1,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: { type: 'UnusedFreeVariable', possible_names: [...possible_names_minus(['x'])] },
                problem_tree: exists_and_exists_conjunct_1,
                tactic: 'existse',
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(exists(x, and(F(x), G(x)))),
                        imv(0)),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'existse' }]
            },
            continued_with: Input({ type: 'UnusedFreeVariable', value: 0 })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map<Ast>(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∃x(Fx & Gx)', '∃xFx'),
                // main_problem_string: '(∃x)(Fx & Gx) ⊢ (∃x)Fx',
                problem_stack: [
                    sub_problem(imv(1), sequent(mk_map<Ast>(['a', i], ['$_1', ml(and(F(a), G(a)))]), ml(exists(x, F(x)))))
                ],
                next_problem_id: 2,
                next_unused_variable_id: 2,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['a', i], ['$_1', ml(and(F(a), G(a)))]), ml(exists(x, F(x))))
                ],
                request: undefined,
                problem_tree: exists_and_exists_conjunct_2,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(exists(x, and(F(x), G(x)))),
                        existse(
                            la(x, i, and(F(x), G(x))),
                            exists(x, F(x)),
                            u1,
                            la(a, i, la(u2, ml(and(F(a), G(a))),
                                imv(1))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'existse' }, { type: 'UnusedFreeVariable', value: 0 }]
            },
            continued_with: Input({ type: 'Tactic', value: 'ande' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map<Ast>(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∃x(Fx & Gx)', '∃xFx'),
                // main_problem_string: '(∃x)(Fx & Gx) ⊢ (∃x)Fx',
                problem_stack: [
                    sub_problem(imv(2), sequent(mk_map<Ast>(['a', i], ['$_2', ml(F(a))], ['$_3', ml(G(a))]), ml(exists(x, F(x)))))
                ],
                next_problem_id: 3,
                next_unused_variable_id: 4,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map<Ast>(['a', i], ['$_2', ml(F(a))], ['$_3', ml(G(a))]), ml(exists(x, F(x))))
                ],
                request: undefined,
                problem_tree: exists_and_exists_conjunct_3,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(exists(x, and(F(x), G(x)))),
                        existse(
                            la(x, i, and(F(x), G(x))),
                            exists(x, F(x)),
                            u1,
                            la(a, i, la(u2, ml(and(F(a), G(a))),
                                flapp(
                                    la(u3, ml(F(a)), la(u4, ml(G(a)),
                                        imv(2))),
                                    andel(F(a), G(a), u2),
                                    ander(F(a), G(a), u2)))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'existse' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'ande' }]
            },
            continued_with: Input({ type: 'Tactic', value: 'existsi' })
        },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map<Ast>(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('∃x(Fx & Gx)', '∃xFx'),
                // main_problem_string: '(∃x)(Fx & Gx) ⊢ (∃x)Fx',
                problem_stack: [
                    sub_problem(imv(2), sequent(mk_map<Ast>(['a', i], ['$_2', ml(F(a))], ['$_3', ml(G(a))]), ml(exists(x, F(x)))))
                ],
                next_problem_id: 3,
                next_unused_variable_id: 4,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: { type: 'AnyFreeVariable', bound_variables: [x] },
                problem_tree: exists_and_exists_conjunct_3,
                tactic: 'existsi',
                can_undo: true,
                can_redo: false,
                ast:
                    la(u1, ml(exists(x, and(F(x), G(x)))),
                        existse(
                            la(x, i, and(F(x), G(x))),
                            exists(x, F(x)),
                            u1,
                            la(a, i, la(u2, ml(and(F(a), G(a))),
                                flapp(
                                    la(u3, ml(F(a)), la(u4, ml(G(a)),
                                        imv(2))),
                                    andel(F(a), G(a), u2),
                                    ander(F(a), G(a), u2)))))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'existse' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'existsi' }]
            },
            continued_with: Input({ type: 'AnyFreeVariable', value: 'a' })
        },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map<Ast>(['F', pred(1)], ['G', pred(1)]),
        main_problem: separated_tptes('∃x(Fx & Gx)', '∃xFx'),
        // main_problem_string: '(∃x)(Fx & Gx) ⊢ (∃x)Fx',
        problem_stack: [],
        next_problem_id: 4,
        next_unused_variable_id: 5,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map<Ast>(['a', i], ['$_2', ml(F(a))], ['$_3', ml(G(a))]), ml(F(a)))
        ],
        request: undefined,
        problem_tree: exists_and_exists_conjunct_4,
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast:
            la(u1, ml(exists(x, and(F(x), G(x)))),
                existse(
                    la(x, i, and(F(x), G(x))),
                    exists(x, F(x)),
                    u1,
                    la(a, i, la(u2, ml(and(F(a), G(a))),
                        flapp(
                            la(u3, ml(F(a)), la(u4, ml(G(a)),
                                existsi( la(x, i, F(x)), a, u3)
                            )),
                            andel(F(a), G(a), u2),
                            ander(F(a), G(a), u2)))))),
        proof: [
            { assumption_lines: [ 1 ], line_number: 1, statement: ml(exists(x, and(F(x), G(x)))), reason: 'Premise', dependencies: [] },
            { assumption_lines: [ 2 ], line_number: 2, statement: ml(and(F(a), G(a))), reason: 'Assumption', dependencies: [] },
            { assumption_lines: [ 2 ], line_number: 3, statement: ml(F(a)), reason: 'andel', dependencies: [2] },
            { assumption_lines: [ 2 ], line_number: 4, statement: ml(exists(x, F(x))), reason: 'existsi', dependencies: [3] },
            { assumption_lines: [ 1 ], line_number: 5, statement: ml(exists(x, F(x))), reason: 'existse', dependencies: [1, 2, 4] }
        ],
        inputs: [{ type: 'Tactic', value: 'existse' }, { type: 'UnusedFreeVariable', value: 0 }, { type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'existsi' }, { type: 'AnyFreeVariable', value: 'a' }]
    }
}, display_maclogic_state, display_maclogic_state)

test_generator_expectation('~B ⊢ ~(A & B)', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('~B', '~(A & B)') }) },
        { continued_with: Input({ type: 'Tactic', value: 'noti' }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        { continued_with: Input({ type: 'Tactic', value: 'ande' }) },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map<Ast>(['B', o], ['A', o]),
        main_problem: separated_tptes('~B', '~(A & B)'),
        // main_problem_string: '~B ⊢ ~(A & B)',
        problem_stack: [],
        next_problem_id: 5,
        next_unused_variable_id: 5,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map(['$_0', ml(not(B))], ['$_3', ml(A)], ['$_4', ml(B)]), ml(B))
        ],
        request: undefined,
        problem_tree:
            split_problem(0, pt_seq([ml(not(B))], ml(not(and(A, B)))), 'noti', [
                split_problem(1, pt_seq([ml(not(B)), ml(and(A, B))], ml(absurd)), 'note', [
                    split_problem(2, pt_seq([ml(not(B)), ml(and(A, B))], ml(B)), 'ande', [
                        closed_problem(4, pt_seq([ml(not(B)), ml(A), ml(B)], ml(B))),
                    ]),
                    closed_problem(3, pt_seq([ml(and(A, B)), ml(absurd)], ml(absurd)))
                ])
            ]),
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast: la(iv(0), app(con('ml'), app(con('not'), B)), app(app(con('noti'), app(app(con('and'), A), B)), la(iv(1), app(con('ml'), app(app(con('and'), A), B)), app(la(iv(2), app(con('ml'), con('absurd')), iv(2)), app(app(app(con('note'), B), iv(0)), app(app(la(iv(3), app(con('ml'), A), la(iv(4), app(con('ml'), B), iv(4))), app(app(app(con('andel'), A), B), iv(1))), app(app(app(con('ander'), A), B), iv(1)))))))),
        proof: [
            { assumption_lines: [1], line_number: 1, statement: ml(not(B)), reason: 'Premise', dependencies: [] },
            { assumption_lines: [2], line_number: 2, statement: ml(and(A, B)), reason: 'Assumption', dependencies: [] },
            { assumption_lines: [2], line_number: 3, statement: ml(B), reason: 'ander', dependencies: [2] },
            { assumption_lines: [1, 2], line_number: 4, statement: ml(absurd), reason: 'note', dependencies: [1, 3] },
            { assumption_lines: [1], line_number: 5, statement: ml(not(and(A, B))), reason: 'noti', dependencies: [2, 4] }
        ],
        inputs: [{ type: 'Tactic', value: 'noti' }, { type: 'Tactic', value: 'note' }, { type: 'Tactic', value: 'ande' }]
    }
}, display_maclogic_state, display_maclogic_state)

test_partial_generator_expectation('⊢ A ∨ ~A', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('', 'A ∨ ~A') }) },
        { continued_with: Input({ type: 'Tactic', value: 'dn' }) },
        { continued_with: Input({ type: 'Tactic', value: 'noti' }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        { continued_with: Input({ type: 'Tactic', value: 'orir' }) },
        { continued_with: Input({ type: 'Tactic', value: 'noti' }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        { continued_with: Input({ type: 'Tactic', value: 'oril' }) },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map<Ast>(['A', o]),
        main_problem: separated_tptes('', 'A ∨ ~A'),
        // main_problem_string: '⊢ A ∨ ~A',
        problem_stack: [],
        next_problem_id: 10,
        next_unused_variable_id: 7,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map(['$_1', ml(not(or(A, not(A))))], ['$_4', ml(A)]), ml(A))
        ],
        request: undefined,
        problem_tree:
            split_problem(0, pt_seq([], ml(or(A, not(A)))), 'dn', [
                split_problem(1, pt_seq([], ml(not(not(or(A, not(A)))))), 'noti', [
                    split_problem(2, pt_seq([ml(not(or(A, not(A))))], ml(absurd)), 'note', [
                        split_problem(3, pt_seq([ml(not(or(A, not(A))))], ml(or(A, not(A)))), 'orir', [
                            split_problem(5, pt_seq([ml(not(or(A, not(A))))], ml(not(A))), 'noti', [
                                split_problem(6, pt_seq([ml(not(or(A, not(A)))), ml(A)], ml(absurd)), 'note', [
                                    split_problem(7, pt_seq([ml(not(or(A, not(A)))), ml(A)], ml(or(A, not(A)))), 'oril', [
                                        closed_problem(9, pt_seq([ml(not(or(A, not(A)))), ml(A)], ml(A)))
                                    ]),
                                    closed_problem(8, pt_seq([ml(A), ml(absurd)], ml(absurd)))
                                ])
                            ])
                        ]),
                        closed_problem(4, pt_seq([ml(absurd)], ml(absurd)))
                    ])
                ])
            ]),
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast: app(app(con('dn'), app(app(con('or'), con('A')), app(con('not'), con('A')))), app(app(con('noti'), app(con('not'), app(app(con('or'), con('A')), app(con('not'), con('A'))))), la(iv(1), app(con('ml'), app(con('not'), app(app(con('or'), con('A')), app(con('not'), con('A'))))), app(la(iv(2), app(con('ml'), con('absurd')), iv(2)), app(app(app(con('note'), app(app(con('or'), con('A')), app(con('not'), con('A')))), iv(1)), app(app(app(con('orir'), con('A')), app(con('not'), con('A'))), app(app(con('noti'), con('A')), la(iv(4), app(con('ml'), con('A')), app(la(iv(5), app(con('ml'), con('absurd')), iv(5)), app(app(app(con('note'), app(app(con('or'), con('A')), app(con('not'), con('A')))), iv(1)), app(app(app(con('oril'), con('A')), app(con('not'), con('A'))), iv(4)))))))))))),
        proof: [
            { assumption_lines: [1], line_number: 1, statement: ml(not(or(A, not(A)))), reason: 'Assumption', dependencies: [] },
            { assumption_lines: [2], line_number: 2, statement: ml(A), reason: 'Assumption', dependencies: [] },
            { assumption_lines: [2], line_number: 3, statement: ml(or(A, not(A))), reason: 'oril', dependencies: [2] },
            { assumption_lines: [1, 2], line_number: 4, statement: ml(absurd), reason: 'note', dependencies: [1, 3] },
            { assumption_lines: [1], line_number: 5, statement: ml(not(A)), reason: 'noti', dependencies: [2, 4] },
            { assumption_lines: [1], line_number: 6, statement: ml(or(A, not(A))), reason: 'orir', dependencies: [5] },
            { assumption_lines: [1], line_number: 7, statement: ml(absurd), reason: 'note', dependencies: [1, 6] },
            { assumption_lines: [], line_number: 8, statement: ml(not(not(or(A, not(A))))), reason: 'noti', dependencies: [1, 7] },
            { assumption_lines: [], line_number: 9, statement: ml(or(A, not(A))), reason: 'dn', dependencies: [8] }
        ],
        inputs: [{ type: 'Tactic', value: 'dn' }, { type: 'Tactic', value: 'noti' }, { type: 'Tactic', value: 'note' }, { type: 'Tactic', value: 'orir' }, { type: 'Tactic', value: 'noti' }, { type: 'Tactic', value: 'note' }, { type: 'Tactic', value: 'oril' }]
    }
}, display_maclogic_state, display_maclogic_state)

test_generator_expectation('A ∨ A ⊢ A', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('A ∨ A', 'A') }) },
        { continued_with: Input({ type: 'Tactic', value: 'ore' }) },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map<Ast>(['A', o]),
        main_problem: separated_tptes('A ∨ A', 'A'),
        // main_problem_string: 'A ∨ A ⊢ A',
        problem_stack: [],
        next_problem_id: 3,
        next_unused_variable_id: 2,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map(['$_1', ml(A)]), ml(A)),
            sequent(mk_map(['$_1', ml(A)]), ml(A))
        ],
        request: undefined,
        problem_tree:
            split_problem(0, pt_seq([ml(or(A, A))], ml(A)), 'ore', [
                closed_problem(1, pt_seq([ml(A)], ml(A))),
                closed_problem(2, pt_seq([ml(A)], ml(A)))
            ]),
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast: la(u1, ml(or(A, A)), ore(A, A, A, u1, la(u2, ml(A), u2), la(u2, ml(A), u2))),
        proof: [
            { assumption_lines: [1], line_number: 1, statement: ml(or(A, A)), reason: 'Premise', dependencies: [] },
            { assumption_lines: [2], line_number: 2, statement: ml(A), reason: 'Assumption', dependencies: [] },
            { assumption_lines: [1], line_number: 3, statement: ml(A), reason: 'ore', dependencies: [1, 2, 2, 2, 2] }
        ],
        inputs: [{ type: 'Tactic', value: 'ore' }]
    }
}, display_maclogic_state, display_maclogic_state)

test_generator_expectation('A ↔ B ⊢ B ↔ A', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('A ↔ B', 'B ↔ A') }) },
        { continued_with: Input({ type: 'Tactic', value: 'df' }) },
        { continued_with: Input({ type: 'UnifyingAssumptionOrConclusion', value: 0 }) },
        { continued_with: Input({ type: 'Tactic', value: 'ande' }) },
        { continued_with: Input({ type: 'Tactic', value: 'df' }) },
        { continued_with: Input({ type: 'Tactic', value: 'andi' }) },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
    returns: {
        mode: 'Finished',
        problem_ctx: mk_map<Ast>(['A', o], ['B', o]),
        main_problem: separated_tptes('A ↔ B', 'B ↔ A'),
        // main_problem_string: 'A ↔ B ⊢ B ↔ A',
        problem_stack: [],
        next_problem_id: 6,
        next_unused_variable_id: 6,
        error: undefined,
        proof_insert: undefined,
        new_problems: [
            sequent(mk_map(['$_2', ml(imp(A, B))], ['$_3', ml(imp(B, A))]), ml(imp(B, A))),
            sequent(mk_map(['$_2', ml(imp(A, B))], ['$_3', ml(imp(B, A))]), ml(imp(A, B)))
        ],
        request: undefined,
        problem_tree:
            split_problem(0, pt_seq([ml(iff(A, B))], ml(iff(B, A))), 'df', [
                split_problem(1, pt_seq([ml(and(imp(A, B), imp(B, A)))], ml(iff(B, A))), 'ande', [
                    split_problem(2, pt_seq([ml(imp(A, B)), ml(imp(B, A))], ml(iff(B, A))), 'df', [
                        split_problem(3, pt_seq([ml(imp(A, B)), ml(imp(B, A))], ml(and(imp(B, A), imp(A, B)))), 'andi', [
                            closed_problem(4, pt_seq([ml(imp(A, B)), ml(imp(B, A))], ml(imp(B, A)))),
                            closed_problem(5, pt_seq([ml(imp(A, B)), ml(imp(B, A))], ml(imp(A, B))))
                        ])
                    ])
                ])
            ])
        ,
        tactic: undefined,
        can_undo: true,
        can_redo: false,
        ast: la(iv(0), app(con('ml'), app(app(con('iff'), con('A')), con('B'))), app(la(iv(1), app(con('ml'), app(app(con('and'), app(app(con('imp'), con('A')), con('B'))), app(app(con('imp'), con('B')), con('A')))), app(app(la(iv(2), app(con('ml'), app(app(con('imp'), con('A')), con('B'))), la(iv(3), app(con('ml'), app(app(con('imp'), con('B')), con('A'))), app(app(app(con('dfr'), con('B')), con('A')), app(app(app(app(con('andi'), app(app(con('imp'), con('B')), con('A'))), app(app(con('imp'), con('A')), con('B'))), iv(3)), iv(2))))), app(app(app(con('andel'), app(app(con('imp'), con('A')), con('B'))), app(app(con('imp'), con('B')), con('A'))), iv(1))), app(app(app(con('ander'), app(app(con('imp'), con('A')), con('B'))), app(app(con('imp'), con('B')), con('A'))), iv(1)))), app(app(app(con('dfl'), con('A')), con('B')), iv(0)))),
        proof: [
            { assumption_lines: [1], line_number: 1, statement: ml(iff(A, B)), reason: 'Premise', dependencies: [] },
            { assumption_lines: [1], line_number: 2, statement: ml(and(imp(A, B), imp(B, A))), reason: 'dfl', dependencies: [1] },
            { assumption_lines: [1], line_number: 3, statement: ml(imp(B, A)), reason: 'ander', dependencies: [2] },
            { assumption_lines: [1], line_number: 4, statement: ml(imp(A, B)), reason: 'andel', dependencies: [2] },
            { assumption_lines: [1], line_number: 5, statement: ml(and(imp(B, A), imp(A, B))), reason: 'andi', dependencies: [3, 4] },
            { assumption_lines: [1], line_number: 6, statement: ml(iff(B, A)), reason: 'dfr', dependencies: [5] }
        ],
        inputs: [{ type: 'Tactic', value: 'df' }, { type: 'UnifyingAssumptionOrConclusion', value: 0 }, { type: 'Tactic', value: 'ande' }, { type: 'Tactic', value: 'df' }, { type: 'Tactic', value: 'andi' }]
    }
}, display_maclogic_state, display_maclogic_state)

// No tests here, just make sure nothing freaks out
test_partial_generator_expectation('(∀x)[(∃y)Tyx → (∀z)~Txz], (∀x)(∀y)(Tyx → Txx) ⊢ (∀x)(∀y)~Txy', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('(∀x)[(∃y)Tyx → (∀z)~Txz], (∀x)(∀y)(Tyx → Txx)', '(∀x)(∀y)~Txy') }) },
        { continued_with: Input({ type: 'Tactic', value: 'foralli' }) },
        { continued_with: Input({ type: 'UnusedFreeVariable', value: 0 }) },
        { continued_with: Input({ type: 'Tactic', value: 'foralli' }) },
        { continued_with: Input({ type: 'UnusedFreeVariable', value: 0 }) },
        { continued_with: Input({ type: 'Tactic', value: 'noti' }) },
        { continued_with: Input({ type: 'Tactic', value: 'foralle' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 0 }) },
        { continued_with: Input({ type: 'AnyFreeVariable', value: 'b' }) },
        { continued_with: Input({ type: 'Tactic', value: 'impe' }) },
        { continued_with: Input({ type: 'Tactic', value: 'existsi' }) },
        { continued_with: Input({ type: 'AnyFreeVariable', value: 'a' }) },
        { continued_with: Input({ type: 'Tactic', value: 'foralle' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 2 }) },
        { continued_with: Input({ type: 'AnyFreeVariable', value: 'b' }) },
        { continued_with: Input({ type: 'Tactic', value: 'foralle' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 1 }) },
        { continued_with: Input({ type: 'AnyFreeVariable', value: 'b' }) },
        { continued_with: Input({ type: 'Tactic', value: 'foralle' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 3 }) },
        { continued_with: Input({ type: 'AnyFreeVariable', value: 'a' }) },
        { continued_with: Input({ type: 'Tactic', value: 'impe' }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        // { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ],
}, display_maclogic_state, display_maclogic_state)

describe('sequent_or_theorem_to_tactic', () => {
    describe('ds', () => {
        // A \/ B, ~A |- B
        // I want a function that takes the separated stuff, the proven sequent stuffs, and produces the correct proof insert but that's a bit lame innit.
        test_partial_generator_expectation('sequent theorem introduction for ds', run_interaction(interaction), {
            yields: [
                {
                    yielded: {
                        mode: 'EnterProblem',
                        problem_ctx: mk_map<Ast>(),
                        main_problem: undefined,
                        // main_problem_string: '',
                        problem_stack: [],
                        next_problem_id: 0,
                        next_unused_variable_id: 0,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: undefined,
                        request: undefined,
                        problem_tree: undefined,
                        tactic: undefined,
                        can_undo: false,
                        can_redo: false,
                        ast: undefined,
                        proof: undefined,
                        inputs: []
                    },
                    continued_with: Input({ type: 'Problem', value: tptes('T', 'R') })
                },
                {
                    yielded: {
                        mode: 'EnterTactic',
                        problem_ctx: mk_map<Ast>(['T', o], ['R', o]),
                        main_problem: separated_tptes('T', 'R'),
                        // main_problem_string: 'T ⊢ R',
                        problem_stack: [
                            sub_problem(imv(0), sequent(mk_map<Ast>(['$_0', ml(T)]), ml(R)))
                        ],
                        next_problem_id: 1,
                        next_unused_variable_id: 1,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: [
                            sequent(mk_map<Ast>(['$_0', ml(T)]), ml(R))
                        ],
                        request: undefined,
                        problem_tree:
                            current_problem(0, pt_seq([ml(T)], ml(R)))
                        ,
                        tactic: undefined,
                        can_undo: false,
                        can_redo: false,
                        ast: la(u1, ml(T), imv(0)),
                        proof: undefined,
                        inputs: []
                    },
                    continued_with: Input({ type: 'Tactic', value: 'ds' })
                },
                {
                    yielded: {
                        mode: 'EnterTactic',
                        problem_ctx: mk_map<Ast>(['T', o], ['R', o]),
                        main_problem: separated_tptes('T', 'R'),
                        // main_problem_string: 'T ⊢ R',
                        problem_stack: [
                            sub_problem(imv(0), sequent(mk_map<Ast>(['$_0', ml(T)]), ml(R)))
                        ],
                        next_problem_id: 1,
                        next_unused_variable_id: 1,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: undefined,
                        request: {
                            type: 'SequentOrTheoremSubstitution',
                            variable_ids: ['A', 'B'],
                            sequent_or_theorem: sig.lookup(con('ds')) as Ast
                        },
                        problem_tree:
                            current_problem(0, pt_seq([ml(T)], ml(R)))
                        ,
                        tactic: 'ds',
                        can_undo: true,
                        can_redo: false,
                        ast: la(u1, ml(T), imv(0)),
                        proof: undefined,
                        inputs: [{ type: 'Tactic', value: 'ds' }]
                    },
                    continued_with: Input({ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['A', o], ['R', o]), and(A, R), o), 'B': proven_sequent(mk_map(['T', o]), T, o) } })
                },
                {
                    yielded: {
                        mode: 'EnterTactic',
                        problem_ctx: mk_map<Ast>(['T', o], ['R', o], ['A', o]),
                        main_problem: separated_tptes('T', 'R'),
                        // main_problem_string: 'T ⊢ R',
                        problem_stack: [
                            sub_problem(imv(1), sequent(mk_map<Ast>(['$_0', ml(T)]), ml(or(and(A, R), T)))),
                            sub_problem(imv(2), sequent(mk_map<Ast>(['$_0', ml(T)]), ml(not(and(A, R))))),
                            sub_problem(imv(3), sequent(mk_map<Ast>(['$_0', ml(T)], ['$_1', ml(T)]), ml(R)))
                        ],
                        next_problem_id: 4,
                        next_unused_variable_id: 2,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: [
                            sequent(mk_map<Ast>(['$_0', ml(T)]), ml(or(and(A, R), T))),
                            sequent(mk_map<Ast>(['$_0', ml(T)]), ml(not(and(A, R)))),
                            sequent(mk_map<Ast>(['$_0', ml(T)], ['$_1', ml(T)]), ml(R))
                        ],
                        request: undefined,
                        problem_tree:
                            split_problem(0, pt_seq([ml(T)], ml(R)), 'ds', [
                                current_problem(1, pt_seq([ml(T)], ml(or(and(A, R), T)))),
                                open_problem(2, pt_seq([ml(T)], ml(not(and(A, R))))),
                                open_problem(3, pt_seq([ml(T), ml(T)], ml(R)))
                            ])
                        ,
                        tactic: undefined,
                        can_undo: true,
                        can_redo: false,
                        ast: la(u1, ml(T), flapp(la(u2, ml(T), imv(3)), flapp(con('ds'), and(A, R), T, imv(1), imv(2)))),
                        proof: undefined,
                        inputs: [{ type: 'Tactic', value: 'ds' }, { type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['A', o], ['R', o]), and(A, R), o), 'B': proven_sequent(mk_map(['T', o]), T, o) } }]
                    }
                }
            ],
        }, display_maclogic_state, display_maclogic_state)
    })

describe('dn+', () => {
        test_partial_generator_expectation('sequent theorem introduction for dn+', run_interaction(interaction), {
            yields: [
                {
                    yielded: {
                        mode: 'EnterProblem',
                        problem_ctx: mk_map<Ast>(),
                        main_problem: undefined,
                        // main_problem_string: '',
                        problem_stack: [],
                        next_problem_id: 0,
                        next_unused_variable_id: 0,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: undefined,
                        request: undefined,
                        problem_tree: undefined,
                        tactic: undefined,
                        can_undo: false,
                        can_redo: false,
                        ast: undefined,
                        proof: undefined,
                        inputs: []
                    },
                    continued_with: Input({ type: 'Problem', value: tptes('T', 'R') })
                },
                {
                    yielded: {
                        mode: 'EnterTactic',
                        problem_ctx: mk_map<Ast>(['T', o], ['R', o]),
                        main_problem: separated_tptes('T', 'R'),
                        // main_problem_string: 'T ⊢ R',
                        problem_stack: [
                            sub_problem(imv(0), sequent(mk_map<Ast>(['$_0', ml(T)]), ml(R)))
                        ],
                        next_problem_id: 1,
                        next_unused_variable_id: 1,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: [
                            sequent(mk_map<Ast>(['$_0', ml(T)]), ml(R))
                        ],
                        request: undefined,
                        problem_tree:
                            current_problem(0, pt_seq([ml(T)], ml(R)))
                        ,
                        tactic: undefined,
                        can_undo: false,
                        can_redo: false,
                        ast: la(u1, ml(T), imv(0)),
                        proof: undefined,
                        inputs: []
                    },
                    continued_with: Input({ type: 'Tactic', value: 'dn+' })
                },
                {
                    yielded: {
                        mode: 'EnterTactic',
                        problem_ctx: mk_map<Ast>(['T', o], ['R', o]),
                        main_problem: separated_tptes('T', 'R'),
                        // main_problem_string: 'T ⊢ R',
                        problem_stack: [
                            sub_problem(imv(0), sequent(mk_map<Ast>(['$_0', ml(T)]), ml(R)))
                        ],
                        next_problem_id: 1,
                        next_unused_variable_id: 1,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: undefined,
                        request: {
                            type: 'SequentOrTheoremSubstitution',
                            sequent_or_theorem: sig.lookup(con('dn+')) as Ast,
                            variable_ids: ['A']
                        },
                        problem_tree:
                            current_problem(0, pt_seq([ml(T)], ml(R)))
                        ,
                        tactic: 'dn+',
                        can_undo: true,
                        can_redo: false,
                        ast: la(u1, ml(T), imv(0)),
                        proof: undefined,
                        inputs: [{ type: 'Tactic', value: 'dn+' }]
                    },
                    continued_with: Input({ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['A', o], ['R', o]), and(A, R), o) } })
                },
                {
                    yielded: {
                        mode: 'EnterTactic',
                        problem_ctx: mk_map<Ast>(['T', o], ['R', o], ['A', o]),
                        main_problem: separated_tptes('T', 'R'),
                        // main_problem_string: 'T ⊢ R',
                        problem_stack: [
                            sub_problem(imv(1), sequent(mk_map<Ast>(['$_0', ml(T)]), ml(and(A, R)))),
                            sub_problem(imv(2), sequent(mk_map<Ast>(['$_0', ml(T)], ['$_1', ml(not(not(and(A, R))))]), ml(R))),
                        ],
                        next_problem_id: 3,
                        next_unused_variable_id: 2,
                        error: undefined,
                        proof_insert: undefined,
                        new_problems: [
                            sequent(mk_map<Ast>(['$_0', ml(T)]), ml(and(A, R))),
                            sequent(mk_map<Ast>(['$_0', ml(T)], ['$_1', ml(not(not(and(A, R))))]), ml(R))
                        ],
                        request: undefined,
                        problem_tree:
                            split_problem(0, pt_seq([ml(T)], ml(R)), 'dn+', [
                                current_problem(1, pt_seq([ml(T)], ml(and(A, R)))),
                                open_problem(2, pt_seq([ml(T), ml(not(not(and(A, R))))], ml(R))),
                            ])
                        ,
                        tactic: undefined,
                        can_undo: true,
                        can_redo: false,
                        ast: la(u1, ml(T), flapp(la(u2, ml(not(not(and(A, R)))), imv(2)), flapp(con('dn+'), and(A, R), imv(1)))),
                        proof: undefined,
                        inputs: [{ type: 'Tactic', value: 'dn+' }, { type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['A', o], ['R', o]), and(A, R), o) } }]
                    }
                }
            ],
        }, display_maclogic_state, display_maclogic_state)
    })
})

describe('separate_variable_ids_from_assumptions_and_conclusion', () => {
    test('converts ml to conclusion only', () => expect(
        separate_propositions_assumptions_and_conclusion(ml(A))
    ).toEqual(
        { propositions: [], assumptions: [], conclusion: A }
    ))
    test('converts pi with 1 proposition and ml to conclusion only', () => expect(
        separate_propositions_assumptions_and_conclusion(pi(A, o, ml(B)))
    ).toEqual(
        { propositions: [A], assumptions: [], conclusion: B }
    ))
    test('converts pi with 3 propositions and ml to conclusion only', () => expect(
        separate_propositions_assumptions_and_conclusion(pi(A, o, pi(B, o, pi(C, o, ml(R)))))
    ).toEqual(
        { propositions: [A, B, C], assumptions: [], conclusion: R }
    ))
    test('converts pi with 1 assumption and ml to conclusion only', () => expect(
        separate_propositions_assumptions_and_conclusion(pi(iv(0), ml(and(A, B)), ml(C)))
    ).toEqual(
        { propositions: [], assumptions: [and(A, B)], conclusion: C }
    ))
    test('converts pi with 3 assumptions and ml to conclusion only', () => expect(
        separate_propositions_assumptions_and_conclusion(pi(iv(0), ml(and(A, B)), pi(iv(1), ml(R), pi(iv(2), ml(T), ml(or(A, T))))))
    ).toEqual(
        { propositions: [], assumptions: [and(A, B), R, T], conclusion: or(A, T) }
    ))
    test('converts pi with 3 proposition and 3 assumptions and ml to conclusion only', () => expect(
        separate_propositions_assumptions_and_conclusion(pi(A, o, pi(B, o, pi(C, o, pi(iv(0), ml(and(A, B)), pi(iv(1), ml(R), pi(iv(2), ml(T), ml(or(A, T)))))))))
    ).toEqual(
        { propositions: [A, B, C], assumptions: [and(A, B), R, T], conclusion: or(A, T) }
    ))
})

describe('sequent_or_theorem_to_proof_insert', () => {
    const test_sequent_or_theorem_to_proof_insert = (name: string, individual_names: Variable[], ctx: Ctx, conclusion: Ast, id: SequentOrTheoremId, propositions: Substitution, output: AssumptionHidingProofInsert) => {
        const result = sequent_or_theorem_to_proof_insert(individual_names, ctx, conclusion, id, propositions)
        const result_conclusions = result.new_conclusions
        const applied_result_fragment = result.fragment(imv, iv)
        const expected_conclusions = output.new_conclusions
        const applied_expected_fragment = output.fragment(imv, iv)
        describe(name, () => {
            test('conclusion', () => expect(result_conclusions).toEqual(expected_conclusions))
            test('fragment', () => expect(applied_result_fragment).toEqual(applied_expected_fragment))
        })
    }
    test_sequent_or_theorem_to_proof_insert('ds with all the occurring propositions declared',
        [],
        mk_map(['C', o], ['T', o], ['R', o], ['S', o], ['A', o]),
        ml(C),
        'ds',
        { 'A': and(A, R), 'B': or(T, S) },
        InsertProof(
            [ml(or(and(A, R), or(T, S))), ml(not(and(A, R))), ml(C)],
            (m, v) => flapp(la(v(0), ml(or(T, S)), m(2)), flapp(con('ds'), and(A, R), or(T, S), m(0), m(1)))
        )
    )
    test_sequent_or_theorem_to_proof_insert('ds with none the occurring propositions declared (except the conclusion)',
        [],
        mk_map(['C', o]),
        ml(C),
        'ds',
        { 'A': and(A, R), 'B': or(T, S) },
        InsertProof(
            [ml(or(and(A, R), or(T, S))), ml(not(and(A, R))), ml(C)],
            (m, v) => flapp(la(v(0), ml(or(T, S)), m(2)), flapp(con('ds'), and(A, R), or(T, S), m(0), m(1)))
        )
    )
    test_sequent_or_theorem_to_proof_insert('mt with some of the occurring propositions declared',
        [],
        mk_map(['C', o], ['B', o]),
        ml(C),
        'mt',
        // In order to avoid capture, B is renamed to $B_1 in mt's type, but this should still work.
        { 'A': not(B), 'B': A },
        InsertProof(
            [ml(imp(not(B), A)), ml(not(A)), ml(C)],
            (m, v) => flapp(la(v(0), ml(not(not(B))), m(2)), flapp(con('mt'), not(B), A, m(0), m(1)))
        )
    )
    test_sequent_or_theorem_to_proof_insert('dn+ with all of the occurring propositions declared',
        [],
        mk_map(['C', o], ['A', o], ['B', o]),
        ml(C),
        'dn+',
        {'A': imp(A, imp(B, C)) },
        InsertProof(
            [ml(imp(A, imp(B, C))), ml(C)],
            (m) => flapp(la(iv(0), ml(not(not(imp(A, imp(B, C))))), m(1)), flapp(con('dn+'), imp(A, imp(B, C)), m(0)))
        )
    )
    test_sequent_or_theorem_to_proof_insert('lem',
        [],
        mk_map(['C', o], ['T', o]),
        ml(C),
        'lem',
        { 'A': iff(T, T) }, 
        InsertProof(
            [ml(C)],
            (m, v) => flapp(la(v(0), ml(or(iff(T, T), not(iff(T, T)))), m(0)), flapp(con('lem'), iff(T, T)))
        )
    )
    test_sequent_or_theorem_to_proof_insert('lem with two new individuals declared',
        [a, b],
        mk_map(['C', o], ['T', o]),
        ml(C),
        'lem',
        { 'A': and(F(a), G(b)) }, 
        InsertProof(
            [ml(C)],
            // This will cause issues if sequents/theorems require new variables to be declared (which they likely will in the future!!)
            (m, v) => individuali(C, la(a, i, individuali(C, la(b, i, flapp(la(v(0), ml(or(and(F(a), G(b)), not(and(F(a), G(b))))), m(0)), flapp(con('lem'), and(F(a), G(b))))))))
        )
    )
    test_sequent_or_theorem_to_proof_insert('lem with two new individuals declared',
        [a, b],
        mk_map(['C', o], ['T', o], ['a', i]),
        ml(C),
        'lem',
        { 'A': and(F(a), G(b)) }, 
        InsertProof(
            [ml(C)],
            // This will cause issues if sequents/theorems require new variables to be declared (which they likely will in the future!!)
            (m, v) => individuali(C, la(b, i, flapp(la(v(0), ml(or(and(F(a), G(b)), not(and(F(a), G(b))))), m(0)), flapp(con('lem'), and(F(a), G(b))))))
        )
    )
})

// export const proven_sequent_substitution_to_ctx_and_substitution = (pss: ProvenSequentSubstitution): [Ctx, Substitution] => {
describe('proven_sequent_substitution_to_ctx_and_substitution', () => {
    it('works with an empty substitution', () => expect(proven_sequent_substitution_to_ctx_and_substitution(mk_map(), {})).toEqual([mk_map(), {}]))
    it('works with a substitution containing a single entry A: ⊥', () => expect(
        proven_sequent_substitution_to_ctx_and_substitution(mk_map(), { 'A': proven_sequent(mk_map(), absurd, o) })
    ).toEqual(
        [mk_map(), { 'A': absurd }]
    ))
    it('works with a substitution containing a single entry A: A', () => expect(
        proven_sequent_substitution_to_ctx_and_substitution(mk_map(), { 'A': proven_sequent(mk_map(['A', o]), A, o) })
    ).toEqual(
        [mk_map(['A', o]), { 'A': A }]
    ))
    it('works with a substitution containing a single entry A: R -> S', () => expect(
        proven_sequent_substitution_to_ctx_and_substitution(mk_map(), { 'A': proven_sequent(mk_map(['R', o], ['S', o]), imp(R, S), o) })
    ).toEqual(
        [mk_map(['R', o], ['S', o]), { 'A': imp(R, S) }]
    ))
    it('works with a substitution containing multiple entries A: R -> S, B: T', () => expect(
        proven_sequent_substitution_to_ctx_and_substitution(mk_map(), { 'A': proven_sequent(mk_map(['R', o], ['S', o]), imp(R, S), o), 'B': proven_sequent(mk_map(['T', o]), T, o) })
    ).toEqual(
        [mk_map(['R', o], ['S', o], ['T', o]), { 'A': imp(R, S), 'B': T }]
    ))
    it('works with a substitution containing multiple entries with overlapping ctxs A: R -> S, B: S -> T', () => expect(
        proven_sequent_substitution_to_ctx_and_substitution(mk_map(), { 'A': proven_sequent(mk_map(['R', o], ['S', o]), imp(R, S), o), 'B': proven_sequent(mk_map(['S', o], ['T', o]), imp(S, T), o) })
    ).toEqual(
        [mk_map(['R', o], ['S', o], ['T', o]), { 'A': imp(R, S), 'B': imp(S, T) }]
    ))
    it('works with a non-empty initial ctx and a substitution containing multiple entries A: R -> S, B: T', () => expect(
        proven_sequent_substitution_to_ctx_and_substitution(mk_map(['T', o], ['S', o], ['Q', o]), { 'A': proven_sequent(mk_map(['R', o], ['S', o]), imp(R, S), o), 'B': proven_sequent(mk_map(['T', o]), T, o) })
    ).toEqual(
        [mk_map(['T', o], ['S', o], ['Q', o], ['R', o]), { 'A': imp(R, S), 'B': T }]
    ))
})

describe('separate_sequent_from_individuals_and_predicates', () => {
    const [F, G, y, a] = ovlist('F', 'G', 'y', 'a')
    test('', () => expect(
        separate_sequent_from_individuals_and_predicates(
            sequent(mk_map<Ast>(['A', o], ['F', pred(1)], ['G', pred(1)], ['B', o], ['a', i], ['$_0', ml(A)], ['$_1', ml(forall(y, app(F, y)))], ['$_2', ml(forall(y, app(G, y)))], ['b', i], ['$_3', ml(B)]), ml(and(A, app(F, a))))
        )
    ).toEqual(
        [
            mk_map(['A', o], ['F', pred(1)], ['G', pred(1)], ['B', o], ['a', i], ['b', i]),
            sequent(mk_map<Ast>(['$_0', ml(A)], ['$_1', ml(forall(y, app(F, y)))], ['$_2', ml(forall(y, app(G, y)))], ['$_3', ml(B)]), ml(and(A, app(F, a))))
        ]
    ))
})

describe('is_individual_or_predicate_type', () => {
    const [x, y, z] = ovlist('x', 'y', 'z')
    it('correctly identifies individuals', () => expect(is_individual_or_predicate_type(i)).toBeTruthy())
    it('correctly identifies propositions', () => expect(is_individual_or_predicate_type(o)).toBeTruthy())
    it('correctly identifies single place predicates', () => expect(is_individual_or_predicate_type(pred(1))).toBeTruthy())
    it('correctly identifies multi-place predicates', () => expect(is_individual_or_predicate_type(pred(4))).toBeTruthy())
    it('correctly identifies a non-individual or predicate type', () => expect(is_individual_or_predicate_type(pi(x, ml(A), pred(1)))).toBeFalsy())
    it('correctly identifies a pi with mixed propositions and individuals as arguments', () => expect(is_individual_or_predicate_type(pi(x, i, pi(y, o, pi(z, i, o))))).toBeFalsy())
})

test_partial_generator_expectation('correctly excludes individual declared on problem start in unused variable stuff', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('\\ExFx', 'Fa') }) },
        { continued_with: Input({ type: 'Tactic', value: 'existse' }) },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map<Ast>(['F', pred(1)], ['a', i]),
                main_problem: separated_tptes('\\ExFx', 'Fa'),
                // main_problem_string: '(∃x)Fx ⊢ Fa',
                problem_stack: [
                    sub_problem(imv(0), sequent(mk_map<Ast>(['$_0', ml(exists(x, F(x)))]), ml(F(a))))
                ],
                next_problem_id: 1,
                next_unused_variable_id: 1,
                error: undefined,
                proof_insert: undefined,
                new_problems: undefined,
                request: { type: 'UnusedFreeVariable', possible_names: [...possible_names_minus(['a']), 'a\''] },
                problem_tree:
                    current_problem(0, pt_seq([ml(exists(x, F(x)))], ml(F(a))))
                ,
                tactic: 'existse',
                can_undo: true,
                can_redo: false,
                ast: la(u1, ml(exists(x, F(x))), imv(0)),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'existse' }]
            }
        }
    ]
})

test_partial_generator_expectation('correctly declares new variable in an any_variable_name response', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('', '\\Ex\\Ey(Fx & Gy)') }) },
        { continued_with: Input({ type: 'Tactic', value: 'existsi' }) },
        { continued_with: Input({ type: 'AnyFreeVariable', value: 'a' }) },
        {
            yielded: {
                mode: 'EnterTactic',
                problem_ctx: mk_map<Ast>(['F', pred(1)], ['G', pred(1)]),
                main_problem: separated_tptes('', '\\Ex\\Ey(Fx & Gy)'),
                // main_problem_string: '⊢ (∃x)(∃y)(Fx & Gy)',
                problem_stack: [
                    sub_problem(imv(1), sequent(mk_map(['a', i]), ml(exists(y, and(F(ov('a')), G(y))))))
                ],
                next_problem_id: 2,
                next_unused_variable_id: 1,
                error: undefined,
                proof_insert: undefined,
                new_problems: [
                    sequent(mk_map(['a', i]), ml(exists(y, and(F(ov('a')), G(y)))))
                ],
                request: undefined,
                problem_tree:
                    split_problem(0, pt_seq([], ml(exists(x, exists(y, and(F(x), G(y)))))), 'existsi', [
                        current_problem(1, pt_seq([], ml(exists(y, and(F(a), G(y))))))
                    ])
                ,
                tactic: undefined,
                can_undo: true,
                can_redo: false,
                ast: individuali(exists(x, exists(y, and(F(x), G(y)))), la(a, i, existsi(la(x, i, exists(y, and(F(x), G(y)))), a, imv(1)))),
                proof: undefined,
                inputs: [{ type: 'Tactic', value: 'existsi' }, { type: 'AnyFreeVariable', value: 'a' }]
            }
        }
    ]
})

test_partial_generator_expectation('does not close alpha-equivalent problems', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('\\ExFx', '\\EyFy') }) },
        { continued_with: Input({ type: 'Tactic', value: 'existse' }) },
        { continued_with: Input({ type: 'UnusedFreeVariable', value: 0 }) },
        { continued_with: Input({ type: 'Tactic', value: 'existsi' }) },
        { continued_with: Input({ type: 'AnyFreeVariable', value: 'a' }) },
        { continued_with: Input({ type: 'ConfirmCompleted' }) }
    ]
})

// Just to avoid the error
test_partial_generator_expectation('correctly constructs C -> D, ~C |- ~D using mt', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('C -> D, ~C', '~D') }) },
        { continued_with: Input({ type: 'Tactic', value: 'mt' }) },
        { continued_with: Input({ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['C', o]), C, o), 'B': proven_sequent(mk_map(['D', o]), D, o) } }) }
    ]
})

// Just to avoid the error
test_partial_generator_expectation('correctly constructs ⊢ (∀x)((Fx → Gx) ∨ (Gx → Fx))', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('', '(∀x)((Fx → Gx) ∨ (Gx → Fx))') }) },
        { continued_with: Input({ type: 'Tactic', value: 'dn' }) },
        { continued_with: Input({ type: 'Tactic', value: 'noti' }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        { continued_with: Input({ type: 'Tactic', value: 'foralli' }) },
        { continued_with: Input({ type: 'UnusedFreeVariable', value: 0 }) },
        { continued_with: Input({ type: 'Tactic', value: 'lem' }) },
        { continued_with: Input({ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['F', pred(1)], ['a', i]), F(a), o) } }) },
        { continued_with: Input({ type: 'Tactic', value: 'ore' }) },
        { continued_with: Input({ type: 'Tactic', value: 'orir' }) },
        { continued_with: Input({ type: 'Tactic', value: 'pmi1' }) },
        { continued_with: Input({ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['F', pred(1)], ['a', i]), F(a), o), 'B': proven_sequent(mk_map(['G', pred(1)], ['a', i]), G(a), o) } }) },
        { continued_with: Input({ type: 'Tactic', value: 'oril' }) },
        { continued_with: Input({ type: 'Tactic', value: 'pmi2' }) },
        { continued_with: Input({ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['F', pred(1)], ['a', i]), F(a), o), 'B': proven_sequent(mk_map(['G', pred(1)], ['a', i]), G(a), o) } }) }
    ]
})

// Just to avoid the error
test_partial_generator_expectation('correctly constructs (∀x)Fx → (∀x)Gx ⊢ (∃x)(∀y)(Fx → Gy)', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('(∀x)Fx → (∀x)Gx', '(∃x)(∀y)(Fx → Gy)') }) },
        { continued_with: Input({'type':'Tactic','value':'dn'}) },
        { continued_with: Input({'type':'Tactic','value':'noti'}) },
        { continued_with: Input({'type':'Tactic','value':'impe'}) },
        { continued_with: Input({'type':'Tactic','value':'foralli'}) },
        { continued_with: Input({'type':'UnusedFreeVariable','value':0}) },
        { continued_with: Input({'type':'Tactic','value':'dn'}) },
        { continued_with: Input({'type':'Tactic','value':'noti'}) },
        { continued_with: Input({'type':'Tactic','value':'note'}) },
        { continued_with: Input({'type':'UnifyingAssumption','value':0}) },
        { continued_with: Input({'type':'Tactic','value':'existsi'}) },
        { continued_with: Input({'type':'AnyFreeVariable','value':'a'}) },
        { continued_with: Input({'type':'Tactic','value':'foralli'}) },
        { continued_with: Input({'type':'UnusedFreeVariable','value':0}) },
        { continued_with: Input({'type':'Tactic','value':'impi'}) },
        { continued_with: Input({'type':'Tactic','value':'note'}) },
        { continued_with: Input({'type':'UnifyingAssumption','value':1}) },
        { continued_with: Input({'type':'Tactic','value':'dn'}) },
        { continued_with: Input({'type':'Tactic','value':'noti'}) },
        { continued_with: Input({'type':'Tactic','value':'note'}) },
        { continued_with: Input({'type':'Tactic','value':'existsi'}) },
        { continued_with: Input({'type':'AnyFreeVariable','value':'a'}) },
        { continued_with: Input({'type':'Tactic','value':'foralli'}) },
        { continued_with: Input({'type':'UnusedFreeVariable','value':0}) },
        { continued_with: Input({'type':'Tactic','value':'impi'}) },
        { continued_with: Input({'type':'Tactic','value':'foralle'}) },
        { continued_with: Input({'type':'AnyFreeVariable','value':'b'}) }
    ]
})

// Just to avoid the error
test_partial_generator_expectation('correctly constructs A ∨ ~A, A ⊢ B → A while needelssy using ∨E', run_interaction(interaction), {
    yields: [
    ]
})

// Just to avoid the error
test_partial_generator_expectation('correctly constructs A ⊢ B → A while needlessly using LEM and ∨E', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('A', 'B → A') }) },
        { continued_with: Input({ type: 'Tactic', value: 'lem' }) },
        { continued_with: Input({ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['A', o]), A, o) } }) },
        { continued_with: Input({ type: 'Tactic', value: 'ore' }) },
        { continued_with: Input({ type: 'Tactic', value: 'impi' }) },
        { continued_with: Input({ type: 'Tactic', value: 'impi' }) }
    ]
})

// From that one student (4/4/22)
// Fails if ore must only rely on assumptions and not premises during proof generation.
test_partial_generator_expectation('(A & B) → C (B & ~A) → D (~B & ~A) → (C & D) F ~C ~D E → (~A ∨ ~B) (~A ∨ ~B) → E ~A |- \\F', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('(A & B) → C, (B & ~A) → D, (~B & ~A) → (C & D), F, ~C, ~D, E → (~A ∨ ~B), (~A ∨ ~B) → E, ~A', '\\F') }) },
        { continued_with: Input({ type: 'Tactic', value: 'impe' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 4 }) },
        { continued_with: Input({ type: 'Tactic', value: 'oril' }) },
        { continued_with: Input({ type: 'Tactic', value: 'impe' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 3 }) },
        { continued_with: Input({ type: 'Tactic', value: 'ore' }) },
        { continued_with: Input({ type: 'Tactic', value: 'impe' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 1 }) },
        { continued_with: Input({ type: 'Tactic', value: 'andi' }) },
        { continued_with: Input({ type: 'Tactic', value: 'dn' }) },
        { continued_with: Input({ type: 'Tactic', value: 'noti' }) },
        { continued_with: Input({ type: 'Tactic', value: 'impe' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 2 }) },
        { continued_with: Input({ type: 'Tactic', value: 'andi' }) },
        { continued_with: Input({ type: 'Tactic', value: 'ande' }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 1 }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 1 }) },
        { continued_with: Input({ type: 'Tactic', value: 'impe' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 2 }) },
        { continued_with: Input({ type: 'Tactic', value: 'andi' }) },
        { continued_with: Input({ type: 'Tactic', value: 'ande' }) },
        { continued_with: Input({ type: 'Tactic', value: 'note' }) },
        { continued_with: Input({ type: 'UnifyingAssumption', value: 0 }) },
    ]
})

test_partial_generator_expectation('does not freak out when renaming variables using qs1', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('\\Aw-Aw', '-\\EwAw') }) },
        { continued_with: Input({ type: 'Tactic', value: 'qs1' }) },
        { continued_with: Input({ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(), la(ov('w'), i, app(A, ov('w'))), pi(x, i, o)) }) }
    ]
})

test_partial_generator_expectation('does not freak out when renaming variables using qs2', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('-\\EwAw', '\\Aw-Aw') }) },
        { continued_with: Input({ type: 'Tactic', value: 'qs2' }) },
        { continued_with: Input({ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(), la(ov('w'), i, app(A, ov('w'))), pi(x, i, o)) }) }
    ]
})

test_partial_generator_expectation('does not freak out when renaming variables using qs3', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('\\Ew-Aw', '-\\AwAw') }) },
        { continued_with: Input({ type: 'Tactic', value: 'qs3' }) },
        { continued_with: Input({ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(), la(ov('w'), i, app(A, ov('w'))), pi(x, i, o)) }) }
    ]
})

test_partial_generator_expectation('does not freak out when renaming variables using qs4', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('-\\AwAw', '\\Ew-Aw') }) },
        { continued_with: Input({ type: 'Tactic', value: 'qs4' }) },
        { continued_with: Input({ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(), la(ov('w'), i, app(A, ov('w'))), pi(x, i, o)) }) }
    ]
})

test_partial_generator_expectation('does not freak out using avu', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('\\AxFx', '\\AyFy') }) },
        { continued_with: Input({ type: 'Tactic', value: 'avu' }) },
        { continued_with: Input({ type: 'AlphabeticVarianceSubstitution', value: { old_variable: 'x', proven_sequent: proven_sequent(mk_map(), la(y, i, F(y)), pi(x, i, o)) } }) }
    ]
})

test_partial_generator_expectation('does not freak out using ave', run_interaction(interaction), {
    yields: [
        { continued_with: Input({ type: 'Problem', value: tptes('\\ExFx', '\\EyFy') }) },
        { continued_with: Input({ type: 'Tactic', value: 'ave' }) },
        { continued_with: Input({ type: 'AlphabeticVarianceSubstitution', value: { old_variable: 'x', proven_sequent: proven_sequent(mk_map(), la(y, i, F(y)), pi(x, i, o)) } }) }
    ]
})