/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/ban-types */
import { display_sequent, sequent, Sequent } from 'coastline/src/construction/sequent'
import { CheckedProofInsert, display_invalid_proof_insert, display_sub_problem, is_valid_proof_insert, SubProblem, sub_problem } from 'coastline/src/construction/check_proof_insert'
import { AssumptionHidingProofInsert, check_assumption_hiding_proof_insert, HideAssumption, hide_assumptions_in_problems, InsertProof, is_assumption_hiding_proof_insert } from './assumption_hiding_proof_insert'
import { display_unifying_assumption, find_unifying_assumptions, UnifyingAssumption } from 'coastline/src/construction/unifying_assumptions'
import { Ast, Constant, Lambda, Variable } from 'coastline/src/lambda_pi/ast'
import { defined, first, is_empty, object_from_entries, rest } from 'coastline/src/utilities'
import { ast_to_string, is_generated_variable, is_lambda, is_pi, vs_in } from 'coastline/src/lambda_pi/utilities'
import { ThrowingUnifier, throwing_unifier } from 'coastline/src/unification/throwing_unifier'
import { Continue, ContinueThen, ControlStatus, Retry, RunSerially, SaveThen, StartInteraction, Update, UserInput, WaitFor, While } from 'coastline/src/interaction/interaction'
import { try_match, unify } from 'coastline/src/unification/shorthands'
import { is_unification_error, Substitution } from 'coastline/src/unification/first_order'
import { ThrowingUnifyingAssumption, throwing_unifying_assumption } from 'coastline/src/construction/throwing_unifying_assumption'
import { Ctx, display_ctx } from 'coastline/src/logical_framework/ctx'
import { app, con, flapp, gv, imv, iv, la, mvlist, ov, pi, type_k } from 'coastline/src/lambda_pi/shorthands'
import { next_indexed_variable_in_sequent } from 'coastline/src/construction/next_indexed_variable_in_sequent'
import { absurd, and, andel, ander, andi, dfl, dfr, dn, exists, existse, existsi, forall, foralle, foralli, i, iff, imp, impe, impi, individuali, ml, not, note, noti, o, or, ore, oril, orir } from './maclogic_shorthands'
import { possibly_beta_reduce } from 'coastline/src/lambda_pi/to_beta_normal_form'
import { fill_in_problem_with_parent } from './fill_in_problem_with_parent'
import { close_at_id, current_problem, is_closed_problem, is_current_problem, is_open_problem, is_split_problem, make_current_at_id, open_problem, ProblemTree, split_at_id } from './problem_tree'
import { all_possible_variable_names, filled_in_possible_variable_names } from './possible_variable_names'
import { mk_map } from 'coastline/src/map/RecursiveMap'
import { try_parse } from 'coastline/src/lambda_pi/parsers/parser'
import { match_clause, match_clauses } from 'coastline/src/unification/first_order_match_clauses'
import { bound_variables } from 'coastline/src/lambda_pi/bound_variables'
import { bound_variables_in_sequent } from 'coastline/src/construction/bound_variables_in_sequent'
import { RelativelyNamedAst } from 'coastline/src/construction/relatively_named_ast'
import { substitute } from 'coastline/src/lambda_pi/substitute'
import { syntactic_equality } from 'coastline/src/lambda_pi/syntactic_equality'
import { ctx_union, display_incompatible_ctxs, IncompatibleCtxs, is_incompatible_ctxs } from 'coastline/src/logical_framework/ctx_union'
import { introduce_ctx } from 'coastline/src/logical_framework/introduce_ctx'
import { meta_substitute } from 'coastline/src/lambda_pi/meta_substitute'
import { ast_to_proof, display_proof, ProofLine } from './linear_proof2'
import { unelaborate_then_unparse_sequent } from './parse_then_elaborate'
import { ml_wrapped } from './ml_wrapped'
import { mk_sig } from 'coastline/src/logical_framework/sig2'
import { assert_linear_proof_is_valid } from './assert_linear_proof_is_valid'
import { unwrap_ml } from './unwrap_ml'
import { ProvenSequent } from './proven_sequent'
import { Sig } from 'coastline/src/logical_framework/sig'
import { new_variable } from 'coastline/src/lambda_pi/new_variable'

const [f, p, x, phi] = [gv('f', 1), gv('p', 1), gv('x', 1), gv('phi', 1)]
const qs_phi_type = pi(f, pi(p, pi(x, i, o), pi(x, i, o)), pi(x, i, o))
const f_id = la(p, pi(x, i, o), p)
const f_inner_not = la(p, pi(x, i, o), la(x, i, not(app(p, x))))
const forall_phi = (phi: Ast) => app(con('forall'), phi)
const exists_phi = (phi: Ast) => app(con('exists'), phi)
export const make_qs_phi = (v: Variable, pred: Lambda): Lambda => {
    const new_v = new_variable([v, x, ...vs_in(pred)], v)
    const new_pred = la(new_v, pred.type, substitute(pred.bound, new_v, pred.scope))
    return la(f, pi(p, pi(x, i, o), pi(x, i, o)), la(v, i, flapp(f, new_pred, v)))
}

export const sig = mk_sig(
    // o, i,
    [con('o'), type_k],
    [con('i'), type_k],
    // ml
    [con('ml'), try_parse('P(p: o).Type')],
    // absurd
    [con('absurd'), o],
    // not, noti, note, dn
    [con('not'), try_parse('P(q: o).o')],
    [con('noti'), try_parse('P(A: o).P(p: P(x: ml A).ml absurd).ml (not A)')],
    [con('note'), try_parse('P(A: o).P(maj: ml (not A)).P(min: ml A).ml absurd')],
    [con('dn'), try_parse('P(A: o).P(p: ml (not (not A))).ml A')],
    // and, andi, andel, ander
    [con('and'), try_parse('P(x: o).P(y: o).o')],
    [con('andi'), try_parse('P(A: o).P(B: o).P(l: ml A).P(r: ml B).ml (and A B)')],
    [con('andel'), try_parse('P(A: o).P(B: o).P(p: ml (and A B)).ml A')],
    [con('ander'), try_parse('P(A: o).P(B: o).P(p: ml (and A B)).ml B')],
    // or, oril, orir, ore
    [con('or'), try_parse('P(x: o).P(y: o).o')],
    [con('oril'), try_parse('P(A: o).P(B: o).P(lp: ml A).ml (or A B)')],
    [con('orir'), try_parse('P(A: o).P(B: o).P(lp: ml B).ml (or A B)')],
    [con('ore'), try_parse('P(A: o).P(B: o).P(C: o).P(orp: ml (or A B)).P(pl: P(a: ml A).ml C).P(pr: P(b: ml B).ml C).ml C')],
    // individuali, propositioni
    [con('individuali'), try_parse('P(A: o).P(if: P(a: i).ml A).ml A')],
    [con('propositioni'), try_parse('P(to_prove: o).P(pf: P(A: o).ml to_prove).ml to_prove')], // yo this shouldn't be used ever
    // imp, impi, impe
    [con('imp'), try_parse('P(x: o).P(y: o).o')],
    [con('impi'), try_parse('P(A: o).P(B: o).P(p: P(x: ml A).ml B).ml (imp A B)')],
    [con('impe'), try_parse('P(A: o).P(B: o).P(maj: ml (imp A B)).P(min: ml A).ml B')],
    // forall, foralli, foralle
    [con('forall'), try_parse('P(b: P(x: i).o).o')],
    [con('foralli'), try_parse('P(phi: P(x: i).o).P(p: P(t: i).ml (phi t)).ml (forall phi)')],
    [con('foralle'), try_parse('P(phi: P(x: i).o).P(t: i).P(p: ml (forall phi)).ml (phi t)')],
    // exists, existsi, existse
    [con('exists'), try_parse('P(b: P(x: i).o).o')],
    [con('existsi'), try_parse('P(phi: P(x: i).o).P(t: i).P(p: ml (phi t)).ml (exists phi)')],
    [con('existse'), try_parse('P(phi: P(a: i).o).P(A: o).P(e: ml (exists phi)).P(p: P(x: i).P(y: ml (phi x)).ml A).ml A')],
    // iff, dfl, dfr
    [con('iff'), try_parse('P(x: o).P(y: o).o')],
    [con('dfl'), try_parse('P(A: o).P(B: o).P(iff: ml (iff A B)).ml (and (imp A B) (imp B A))')],
    [con('dfr'), try_parse('P(A: o).P(B: o).P(andp: ml (and (imp A B) (imp B A))).ml (iff A B)')],
    // sequents/theorems
    [con('ds'), try_parse('P(A: o).P(B: o).P(orp: ml (or A B)).P(np: ml (not A)).ml B')],
    [con('mt'), try_parse('P(A: o).P(B: o).P(ip: ml (imp A B)).P(np: ml (not B)).ml (not A)')],
    [con('pmi1'), try_parse('P(A: o).P(B: o).P(p: ml A).ml (imp B A)')],
    [con('pmi2'), try_parse('P(A: o).P(B: o).P(p: ml (not A)).ml (imp A B)')],
    [con('dn+'), try_parse('P(A: o).P(p: ml A).ml (not (not A))')],
    [con('dem1'), try_parse('P(A: o).P(B: o).P(p: ml (not (and A B))).ml (or (not A) (not B))')],
    [con('dem2'), try_parse('P(A: o).P(B: o).P(p: ml (or (not A) (not B))).ml (not (and A B))')],
    [con('dem3'), try_parse('P(A: o).P(B: o).P(p: ml (not (or A B))).ml (and (not A) (not B))')],
    [con('dem4'), try_parse('P(A: o).P(B: o).P(p: ml (and (not A) (not B))).ml (not (or A B))')],
    [con('dem5'), try_parse('P(A: o).P(B: o).P(p: ml (not (or (not A) (not B)))).ml (and A B)')],
    [con('dem6'), try_parse('P(A: o).P(B: o).P(p: ml (and A B)).ml (not (or (not A) (not B)))')],
    [con('dem7'), try_parse('P(A: o).P(B: o).P(p: ml (not (and (not A) (not B)))).ml (or A B)')],
    [con('dem8'), try_parse('P(A: o).P(B: o).P(p: ml (or A B)).ml (not (and (not A) (not B)))')],
    [con('imp1'), try_parse('P(A: o).P(B: o).P(p: ml (imp A B)).ml (or (not A) B)')],
    [con('imp2'), try_parse('P(A: o).P(B: o).P(p: ml (or (not A) B)).ml (imp A B)')],
    [con('neg_imp1'), try_parse('P(A: o).P(B: o).P(p: ml (not (imp A B))).ml (and A (not B))')],
    [con('neg_imp2'), try_parse('P(A: o).P(B: o).P(p: ml (and A (not B))).ml (not (imp A B))')],
    [con('com_and'), try_parse('P(A: o).P(B: o).P(p: ml (and A B)).ml (and B A)')],
    [con('com_or'), try_parse('P(A: o).P(B: o).P(p: ml (or A B)).ml (or B A)')],
    [con('com_bic'), try_parse('P(A: o).P(B: o).P(p: ml (iff A B)).ml (iff B A)')],
    [con('dist1'), try_parse('P(A: o).P(B: o).P(C: o).P(p: ml (and A (or B C))).ml (or (and A B) (and A C))')],
    [con('dist2'), try_parse('P(A: o).P(B: o).P(C: o).P(p: ml (or (and A B) (and A C))).ml (and A (or B C))')],
    [con('dist3'), try_parse('P(A: o).P(B: o).P(C: o).P(p: ml (or A (and B C))).ml (and (or A B) (or A C))')],
    [con('dist4'), try_parse('P(A: o).P(B: o).P(C: o).P(p: ml (and (or A B) (or A C))).ml (or A (and B C))')],
    [con('lem'), try_parse('P(A: o).ml (or A (not A))')],
    [con('efq'), try_parse('P(A: o).P(p: ml absurd).ml A')],
    [con('lemma'), try_parse('P(A: o).P(p: ml A).ml A')],

    // (forall (L(x: i).not (phi x)))
    // (not (exists (L(x: i).phi x)))
    [con('qs1'), pi(phi, qs_phi_type, pi(p, ml(forall_phi(app(phi, f_inner_not))), ml(not(exists_phi(app(phi, f_id))))))],
    [con('qs2'), pi(phi, qs_phi_type, pi(p, ml(not(exists_phi(app(phi, f_id)))), ml(forall_phi(app(phi, f_inner_not)))))],
    // (exists (L(x: i).not (phi x)))
    // (not (forall (L(x: i).phi x)))
    [con('qs3'), pi(phi, qs_phi_type, pi(p, ml(exists_phi(app(phi, f_inner_not))), ml(not(forall_phi(app(phi, f_id))))))],
    [con('qs4'), pi(phi, qs_phi_type, pi(p, ml(not(forall_phi(app(phi, f_id)))), ml(exists_phi(app(phi, f_inner_not)))))],

    // P(phi: P(f: P(p: P(x: i).o).P(x: i).o).P(x: i).o).P(_0: ml (exists (phi f_id))).ml exists (phi f_id)
    [con('avu'), pi(phi, qs_phi_type, pi(iv(0), ml(forall_phi(app(phi, f_id))), ml(forall_phi(app(phi, f_id)))))],
    [con('ave'), pi(phi, qs_phi_type, pi(iv(0), ml(exists_phi(app(phi, f_id))), ml(exists_phi(app(phi, f_id)))))],

    [con('sdn_and1'), try_parse('P(A: o).P(B: o).P(p: ml (and (not (not A)) B)).ml (and A B)')],
    [con('sdn_and2'), try_parse('P(A: o).P(B: o).P(p: ml (and A B)).ml (and (not (not A)) B)')],
    [con('sdn_and3'), try_parse('P(A: o).P(B: o).P(p: ml (and (not (not A)) (not (not B)))).ml (and A B)')],
    [con('sdn_and4'), try_parse('P(A: o).P(B: o).P(p: ml (and A B)).ml (and (not (not A)) (not (not B)))')],
    [con('sdn_and5'), try_parse('P(A: o).P(B: o).P(p: ml (and A (not (not B)))).ml (and A B)')],
    [con('sdn_and6'), try_parse('P(A: o).P(B: o).P(p: ml (and A B)).ml (and A (not (not B)))')],

    [con('sdn_or1'), try_parse('P(A: o).P(B: o).P(p: ml (or (not (not A)) B)).ml (or A B)')],
    [con('sdn_or2'), try_parse('P(A: o).P(B: o).P(p: ml (or A B)).ml (or (not (not A)) B)')],
    [con('sdn_or3'), try_parse('P(A: o).P(B: o).P(p: ml (or (not (not A)) (not (not B)))).ml (or A B)')],
    [con('sdn_or4'), try_parse('P(A: o).P(B: o).P(p: ml (or A B)).ml (or (not (not A)) (not (not B)))')],
    [con('sdn_or5'), try_parse('P(A: o).P(B: o).P(p: ml (or A (not (not B)))).ml (or A B)')],
    [con('sdn_or6'), try_parse('P(A: o).P(B: o).P(p: ml (or A B)).ml (or A (not (not B)))')],

    [con('sdn_con1'), try_parse('P(A: o).P(B: o).P(p: ml (imp (not (not A)) B)).ml (imp A B)')],
    [con('sdn_con2'), try_parse('P(A: o).P(B: o).P(p: ml (imp A B)).ml (imp (not (not A)) B)')],
    [con('sdn_con3'), try_parse('P(A: o).P(B: o).P(p: ml (imp (not (not A)) (not (not B)))).ml (imp A B)')],
    [con('sdn_con4'), try_parse('P(A: o).P(B: o).P(p: ml (imp A B)).ml (imp (not (not A)) (not (not B)))')],
    [con('sdn_con5'), try_parse('P(A: o).P(B: o).P(p: ml (imp A (not (not B)))).ml (imp A B)')],
    [con('sdn_con6'), try_parse('P(A: o).P(B: o).P(p: ml (imp A B)).ml (imp A (not (not B)))')],

    [con('sdn_bic1'), try_parse('P(A: o).P(B: o).P(p: ml (iff (not (not A)) B)).ml (iff A B)')],
    [con('sdn_bic2'), try_parse('P(A: o).P(B: o).P(p: ml (iff A B)).ml (iff (not (not A)) B)')],
    [con('sdn_bic3'), try_parse('P(A: o).P(B: o).P(p: ml (iff (not (not A)) (not (not B)))).ml (iff A B)')],
    [con('sdn_bic4'), try_parse('P(A: o).P(B: o).P(p: ml (iff A B)).ml (iff (not (not A)) (not (not B)))')],
    [con('sdn_bic5'), try_parse('P(A: o).P(B: o).P(p: ml (iff A (not (not B)))).ml (iff A B)')],
    [con('sdn_bic6'), try_parse('P(A: o).P(B: o).P(p: ml (iff A B)).ml (iff A (not (not B)))')],
)

export type SequentOrTheoremId = 
    | 'ds' | 'mt' | 'pmi1' | 'pmi2' | 'dn+' | 'dem1' | 'dem2' | 'dem3' | 'dem4'
    | 'dem5' | 'dem6' | 'dem7' | 'dem8' | 'imp1' | 'imp2' | 'neg_imp1' | 'neg_imp2' | 'com_and' | 'com_or' | 'com_bic'
    | 'dist1' | 'dist2' | 'dist3' | 'dist4' | 'lem' | 'sdn_and1' | 'sdn_and2' | 'sdn_and3' | 'sdn_and4' | 'sdn_and5'
    | 'sdn_and6' | 'sdn_or1' | 'sdn_or2' | 'sdn_or3' | 'sdn_or4' | 'sdn_or5' | 'sdn_or6' | 'sdn_con1' | 'sdn_con2'
    | 'sdn_con3' | 'sdn_con4' | 'sdn_con5' | 'sdn_con6' | 'sdn_bic1' | 'sdn_bic2' | 'sdn_bic3' | 'sdn_bic4'
    | 'sdn_bic5' | 'sdn_bic6' | 'efq' | 'lemma'

export type TacticId = ''
    | 'ande' | 'andi' | 'impe' | 'impi' | 'foralli' | 'foralle' | 'existse' | 'existsi' | 'note' | 'noti' | 'dn'
    | 'oril' | 'orir' | 'ore' | 'df' | 'qs1' | 'qs2' | 'qs3' | 'qs4' | 'avu' | 'ave'
    | SequentOrTheoremId

export type BaseTacticState = {
    problem_stack: SubProblem[]
    next_problem_id: number
    next_unused_variable_id: number
    error: MacLogicError | undefined
    proof_insert: AssumptionHidingProofInsert | undefined
    new_problems: Sequent[] | undefined
    request: MacLogicRequest | undefined
    tactic: TacticId | undefined,
    ast: Ast | undefined,
    proof: ProofLine[] | undefined
}

export type MacLogicRequest =
    | { type: 'UnusedFreeVariable', possible_names: string[] }
    | { type: 'AnyFreeVariable', bound_variables: Variable[] }
    | { type: 'UnifyingAssumption', pattern: Ast, uas: UnifyingAssumption[] }
    | { type: 'UnifyingAssumptionOrConclusion', pattern: Ast, uas: UnifyingAssumption[], uc: Substitution | undefined }
    | { type: 'SequentOrTheoremSubstitution', variable_ids: string[], sequent_or_theorem: Ast }
    | { type: 'QuantifierShiftSubstitution' }
    | { type: 'AlphabeticVarianceSubstitution' }

export interface MacLogicState extends BaseTacticState {
    mode: 'EnterProblem' | 'EnterTactic' | 'Finished'
    problem_ctx: Ctx
    main_problem: Sequent | undefined
    problem_tree: ProblemTree | undefined
    can_undo: boolean
    can_redo: boolean
    inputs: MacLogicInput[]
}

export type ProvenSequentSubstitution = { [id: string]: ProvenSequent }

export type MacLogicInput =
    | { type: 'Problem', value: Sequent }
    | { type: 'Tactic', value: TacticId }
    | MacLogicResponse

export type QuantifierShiftSubstitution = { statement: ProvenSequent }

export type MacLogicResponse =
    | { type: 'UnifyingAssumption', value: number }
    | { type: 'UnifyingAssumptionOrConclusion', value: number }
    | { type: 'UnusedFreeVariable', value: number }
    | { type: 'AnyFreeVariable', value: string }
    | { type: 'SequentOrTheoremSubstitution', value: ProvenSequentSubstitution }
    | { type: 'QuantifierShiftSubstitution', value: ProvenSequent }
    | { type: 'AlphabeticVarianceSubstitution', value: { old_variable: string, proven_sequent: ProvenSequent } }
    | { type: 'ConfirmCompleted' }

export type MacLogicError =
    | { type: 'NoUnifyingAssumptionsFound', pattern: Ast }
    | { type: 'NoUnifyingAssumptionsOrConclusionFound', pattern: Ast }
    | { type: 'NoUnifyingConclusion', pattern: Ast }
    | { type: 'VariableAlreadyUsed', name: string }
    | { type: 'VariableIsNotFree', name: string }
    | { type: 'VariableIsNotInStatement', name: string, statement: Ast }

const display_proven_sequent = (proven_sequent: ProvenSequent) => ({
    assumptions: display_ctx(proven_sequent.assumptions),
    proof: ast_to_string(proven_sequent.proof),
    sort: ast_to_string(proven_sequent.sort)
})

const display_maclogic_input = (input: MacLogicInput) => {
    const display_maclogic_input_sequent_or_theorem_substitution = (value: ProvenSequentSubstitution) => {
        const cool = Object.entries(value).map<[string, unknown]>(([key, value]) => [key, display_proven_sequent(value)])
        return object_from_entries(...cool)
    }
    if (input.type === 'SequentOrTheoremSubstitution')
        return display_maclogic_input_sequent_or_theorem_substitution(input.value)
    return input
}

export const display_maclogic_state = (state: MacLogicState): object => ({
    ...state,
    problem_ctx: display_ctx(state.problem_ctx),
    new_problems: defined(state.new_problems) ? state.new_problems.map(display_sequent) : '<unset>',
    problem_stack: state.problem_stack.map(display_sub_problem),
    main_problem: defined(state.main_problem) ? display_sequent(state.main_problem) : '<unset>',
    error: defined(state.error) ? display_maclogic_error(state.error) : '<unset>',
    request: defined(state.request) ? display_maclogic_request(state.request) : '<unset>',
    problem_tree: defined(state.problem_tree) ? display_maclogic_problem_tree(state.problem_tree) : '<unset>',
    ast: defined(state.ast) ? ast_to_string(state.ast) : '<unset>',
    proof: defined(state.proof) ? display_proof(state.proof) : '<unset>',
    inputs: state.inputs.map(display_maclogic_input)
})

export const display_maclogic_problem_tree = (tree: ProblemTree): object => {
    const type = is_split_problem(tree) ? 'SplitProblem' : is_closed_problem(tree) ? 'ClosedProblem' : is_current_problem(tree) ? 'CurrentProblem' : is_open_problem(tree) ? 'OpenProblem' : '????'
    const basic_display = { ...tree, type, seq: unelaborate_then_unparse_sequent(tree.seq) }
    if (is_split_problem(tree))
        return {
            ...basic_display,
            children: tree.children.map(display_maclogic_problem_tree)
        }
    return basic_display
}

export const display_maclogic_error = (error: MacLogicError): object => {
    if (error.type === 'NoUnifyingAssumptionsFound')
        return { ...error, pattern: ast_to_string(error.pattern) }
    if (error.type === 'NoUnifyingConclusion')
        return { ...error, pattern: ast_to_string(error.pattern) }
    if (error.type === 'VariableAlreadyUsed')
        return error
    if (error.type === 'VariableIsNotFree')
        return error
    throw new Error('unimplemented error display')
}

export const display_maclogic_request = (request: MacLogicRequest): object => {
    if (request.type === 'UnifyingAssumption')
        return { ...request, pattern: ast_to_string(request.pattern), uas: request.uas.map(display_unifying_assumption) }
    if (request.type === 'UnifyingAssumptionOrConclusion')
        return {
            ...request,
            pattern: ast_to_string(request.pattern),
            uas: request.uas.map(display_unifying_assumption),
            uc: !defined(request.uc) ? '<unset>' : Object.entries(request.uc).reduce((acc, [id, ast]) => ({ ...acc, [id]: ast_to_string(ast) }), {})
        }
    if (request.type === 'AnyFreeVariable')
        return {
            ...request,
            bound_variables: request.bound_variables.map((v) => v.id)
        }
    if (request.type === 'SequentOrTheoremSubstitution')
        return {
            ...request,
            sequent_or_theorem: ast_to_string(request.sequent_or_theorem)
        }
    return request
}

const apply_sequent_or_theorem = (s_or_t: Constant, s_or_t_type: Ast, propositions: Substitution): [Ast[], RelativelyNamedAst, Ast] => {
    const apply_sequent_or_theorem_with_type = (assumptions_acc: Ast[], inner_s_or_t: RelativelyNamedAst, inner_s_or_t_type: Ast): [Ast[], RelativelyNamedAst, Ast] => {
        // race to the inner-most scope, then work out
        if (!is_pi(inner_s_or_t_type))
            return [assumptions_acc, inner_s_or_t, inner_s_or_t_type]
        if (syntactic_equality(inner_s_or_t_type.type, o)) {
            // We want the base ID because bound may have been renamed to avoid capture.
            const prop_sub = propositions[inner_s_or_t_type.bound.get_base_id()]
            if (!defined(prop_sub))
                throw new Error(`Missing proposition to sub in for variable '${inner_s_or_t_type.bound.id}'`)
            const subbed_scope = substitute(inner_s_or_t_type.bound, prop_sub, inner_s_or_t_type.scope)
            return apply_sequent_or_theorem_with_type(assumptions_acc, (m, v) => app(inner_s_or_t(m, v), prop_sub), subbed_scope)
        }
        return apply_sequent_or_theorem_with_type([...assumptions_acc, inner_s_or_t_type.type], (m, v) => app(inner_s_or_t(m, v), m(assumptions_acc.length)), inner_s_or_t_type.scope)
    }
    return apply_sequent_or_theorem_with_type([], () => s_or_t, s_or_t_type)
}

type InsertOrContinuation = AssumptionHidingProofInsert | ((state: MacLogicState) => ControlStatus<MacLogicState, MacLogicInput>)

const run_insert_or_continuation = (state: MacLogicState, iorc: InsertOrContinuation): ControlStatus<MacLogicState, MacLogicInput> => {
    if (is_assumption_hiding_proof_insert(iorc))
        return Continue({ ...state, proof_insert: iorc })
    return iorc(state)
}

const ask_for_unifying_conclusion = (pattern: Ast, insert_f: (u: ThrowingUnifier) => InsertOrContinuation) => (state: MacLogicState): ControlStatus<MacLogicState, MacLogicInput> => {
    const u = unify(first(state.problem_stack).sequent.conclusion, pattern)
    if (is_unification_error(u))
        return Retry({ ...state, error: { type: 'NoUnifyingConclusion', pattern } })
    return run_insert_or_continuation(state, insert_f(throwing_unifier(u)))
}

const push_input = (state: MacLogicState, input: MacLogicInput): MacLogicState => ({ ...state, inputs: [...state.inputs, input] })

const ask_for_unifying_assumption = (pattern: Ast, insert_f: (ua: ThrowingUnifyingAssumption) => AssumptionHidingProofInsert | ((state: MacLogicState) => ControlStatus<MacLogicState, MacLogicInput>)) => (state: MacLogicState): ControlStatus<MacLogicState, MacLogicInput> => {
    const uas = find_unifying_assumptions(first(state.problem_stack).sequent.assumptions, pattern)
    if (uas.length === 0)
        return Retry({ ...state, error: { type: 'NoUnifyingAssumptionsFound', pattern } })
    if (uas.length === 1)
        return run_insert_or_continuation(state, insert_f(throwing_unifying_assumption(uas[0])))
    return ContinueThen(RunSerially([
        Update(() => {
            return { ...state, request: { type: 'UnifyingAssumption', pattern, uas }, new_problems: undefined }
        }),
        WaitFor(UserInput((_state, input) => {
            if (input.type !== 'UnifyingAssumption')
                throw new Error(`Expected 'UnifyingAssumption', got ${input.type}`)
            if (input.value < 0 || input.value >= uas.length)
                throw new Error(`UnifyingAssumption index out of bounds: ${input.value} is not within [0, ${uas.length})`)
            return run_insert_or_continuation(push_input(state, input), insert_f(throwing_unifying_assumption(uas[input.value])))
        }))
    ]))
}

// Matcher is a function with the following signature:
// <Match>(ast: Ast) => Match | undefined

const ask_for_unifying_assumption_or_conclusion = (
    pattern: Ast,
    ua_insert_f: (ua: ThrowingUnifyingAssumption) => InsertOrContinuation,
    uc_insert_f: (u: ThrowingUnifier) => InsertOrContinuation
) => (state: MacLogicState): ControlStatus<MacLogicState, MacLogicInput> => {
    const { assumptions, conclusion } = first(state.problem_stack).sequent
    const uas = find_unifying_assumptions(assumptions, pattern)
    const uc = unify(pattern, conclusion)
    if (uas.length === 0 && is_unification_error(uc))
        return Retry({ ...state, error: { type: 'NoUnifyingAssumptionsOrConclusionFound', pattern } })
    if (uas.length === 0 && !is_unification_error(uc))
        return run_insert_or_continuation(state, uc_insert_f(throwing_unifier(uc)))
    if (uas.length === 1 && is_unification_error(uc))
        return run_insert_or_continuation(state, ua_insert_f(throwing_unifying_assumption(uas[0])))
    return ContinueThen(RunSerially([
        Update(() => ({ ...state, request: { type: 'UnifyingAssumptionOrConclusion', pattern, uas, uc: is_unification_error(uc) ? undefined : uc }, new_problems: undefined })),
        WaitFor(UserInput((_state, input) => {
            if (input.type !== 'UnifyingAssumptionOrConclusion')
                throw new Error(`Expected 'UnifyingAssumptionOrConclusion', got ${input.type}`)
            if (input.value < 0 || input.value >= uas.length + 1)
                throw new Error(`UnifyingAssumptionOrConclusion index out of bounds: ${input.value} is not within [0, ${uas.length})`)
            if (input.value === uas.length && !is_unification_error(uc))
                return run_insert_or_continuation(push_input(state, input), uc_insert_f(throwing_unifier(uc)))
            return run_insert_or_continuation(push_input(state, input), ua_insert_f(throwing_unifying_assumption(uas[input.value])))
        }))
    ]))
}

const ask_for_unused_variable = (assumptions: Ctx, conclusion: Ast, insert_f: (new_v: Variable) => InsertOrContinuation) => (state: MacLogicState): ControlStatus<MacLogicState, MacLogicInput> => {
    const used_variable_names = [
        ...assumptions.entries().map(([id]) => id),
        ...bound_variables(conclusion).map((bv) => bv.id)
    ]
    const possible_names = filled_in_possible_variable_names(all_possible_variable_names, used_variable_names)
        // .filter((name) => !bvs.some((bv) => name === bv.id))
    return ContinueThen(RunSerially([
        Update(() => ({ ...state, request: { type: 'UnusedFreeVariable', possible_names }, new_problems: undefined })),
        WaitFor(UserInput((_state, input) => {
            if (input.type !== 'UnusedFreeVariable')
                throw new Error(`Expected 'UnusedVariable', got '${input.type}'`)
            if (input.value < 0 || input.value >= possible_names.length)
                throw new Error(`UnifyingAssumptionOrConclusion index out of bounds: ${input.value} is not within [0, ${possible_names.length})`)
            return run_insert_or_continuation(push_input(state, input), insert_f(ov(possible_names[input.value])))
        }))
    ]))
}

const ask_for_any_variable = (assumptions: Ctx, conclusion: Ast, insert_f: (new_v: Variable) => InsertOrContinuation) => (state: MacLogicState): ControlStatus<MacLogicState, MacLogicInput> => {
    const bvs = bound_variables_in_sequent(sequent(assumptions, conclusion)).filter((v) => !is_generated_variable(v))
    return ContinueThen(RunSerially([
        Update(() => ({ ...state, request: { type: 'AnyFreeVariable', bound_variables: bvs }, new_problems: undefined })),
        WaitFor(UserInput((_state, input) => {
            if (input.type !== 'AnyFreeVariable')
                throw new Error(`Expected 'AnyVariable', got '${input.type}'`)
            const bound = new Set([...bvs.map((v) => v.id)])
            if (bound.has(input.value))
                return Retry({ ...state, error: { type: 'VariableIsNotFree', name: input.value } })
            return run_insert_or_continuation(push_input(state, input), insert_f(ov(input.value)))
        }))
    ]))
}

const sequents_and_theorems = new Set([
    'ds', 'mt', 'pmi1', 'pmi2', 'dn+', 'dem1', 'dem2', 'dem3', 'dem4', 'dem5', 'dem6', 'dem7', 'dem8', 'imp1', 'imp2',
    'neg_imp1', 'neg_imp2', 'com_and', 'com_or', 'com_bic', 'dist1', 'dist2', 'dist3', 'dist4', 'lem', 'sdn_and1', 'sdn_and2',
    'sdn_and3', 'sdn_and4', 'sdn_and5', 'sdn_and6', 'sdn_or1', 'sdn_or2', 'sdn_or3', 'sdn_or4', 'sdn_or5', 'sdn_or6',
    'sdn_con1', 'sdn_con2', 'sdn_con3', 'sdn_con4', 'sdn_con5', 'sdn_con6', 'sdn_bic1', 'sdn_bic2', 'sdn_bic3', 'sdn_bic4',
    'sdn_bic5', 'sdn_bic6', 'efq', 'lemma'
])
export const is_sequent_or_theorem_id = (id: string): id is SequentOrTheoremId => sequents_and_theorems.has(id)

// Assumption: rule_type is of the form P(x1: o)...P(xn: o).o for 0 <= n.
export const separate_propositions_assumptions_and_conclusion = (rule_type: Ast): { propositions: Variable[], assumptions: Ast[], conclusion: Ast } => {
    if (is_pi(rule_type)) {
        const { propositions, assumptions, conclusion } = separate_propositions_assumptions_and_conclusion(rule_type.scope)
        return match_clauses(rule_type.type, [
            match_clause(o, () => ({ propositions: [rule_type.bound, ...propositions], assumptions, conclusion })),
            match_clause(ml(X), (u) => ({ propositions, assumptions: [u('X'), ...assumptions], conclusion }))
        ])
    }
    return { propositions: [], assumptions: [], conclusion: try_match(ml(X), rule_type)['X'] }
}

export const proven_sequent_substitution_to_ctx_and_substitution = (ctx: Ctx, pss: ProvenSequentSubstitution): [Ctx, Substitution] | IncompatibleCtxs => {
    return Object.entries(pss).reduce<[Ctx, Substitution] | IncompatibleCtxs>((acc, [id, proven_sequent]) => {
        if (is_incompatible_ctxs(acc))
            return acc
        const new_ctx = ctx_union(acc[0], proven_sequent.assumptions)
        if (is_incompatible_ctxs(new_ctx))
            return new_ctx
        return [new_ctx, { ...acc[1], [id]: proven_sequent.proof }]
    }, [ctx, {}])
}

const individuali_ast_f = (assumptions: Ctx, conclusion: Ast, ics: Variable[], p: Ast): Ast =>
    is_empty(ics) ? p
    : assumptions.contains(first(ics).id) ? individuali_ast_f(assumptions, conclusion, rest(ics), p)
    : individuali(unwrap_ml(conclusion), la(first(ics), i, individuali_ast_f(assumptions, conclusion, rest(ics), p)))

const fragment_from_rule_type = (new_individual_names: Variable[], ctx: Ctx, conclusion: Ast, sequent_or_theorem: Constant, sequent_or_theorem_type: Ast, propositions: Substitution): [Ast[], RelativelyNamedAst] => {
    const [assumptions, applied_sequent_or_theorem, applied_type] = apply_sequent_or_theorem(sequent_or_theorem, sequent_or_theorem_type, propositions)
    return [
        assumptions,
        (m, v) => individuali_ast_f(ctx, conclusion, new_individual_names, app(la(v(0), applied_type, m(assumptions.length)), applied_sequent_or_theorem(m, v)))
    ]
}

export const sequent_or_theorem_to_proof_insert = (new_individual_names: Variable[], ctx: Ctx, conclusion: Ast, id: SequentOrTheoremId, propositions: Substitution): AssumptionHidingProofInsert => {
    const id_type = sig.lookup(con(id))
    if (!defined(id_type))
        throw new Error(`SequentOrTheoremId '${id}' does not exist in the MacLogic signature`)
    const deconstructed_insert = fragment_from_rule_type(new_individual_names, ctx, conclusion, con(id), id_type, propositions)
    return InsertProof(
        [...deconstructed_insert[0], conclusion],
        deconstructed_insert[1]
    )
}

export const problem_ctx_with_new_individuals_separated = (old_problem_ctx: Ctx, new_problem_ctx: Ctx): [Ctx, Variable[]] => {
    const new_individual_names = new_problem_ctx.entries()
        // Keep if it is an individual AND is not in the old problem_ctx.
        .filter(([id]) => !old_problem_ctx.contains(id))
        .filter(([, type]) => syntactic_equality(i, type)/* && !state.problem_ctx.contains(id)*/)
        .map(([id]) => ov(id))
    // The hacky stuff has come back to bite me.
    // We shouldn't be filtering out all individual declarations, because there are old individuals we might want to keep around.
    const new_problem_ctx_wo_new_individuals = mk_map(...new_problem_ctx.entries()
        // Keep if it is a non-individual OR is in the old problem_ctx.
        .filter(([id, type]) => !syntactic_equality(i, type) || old_problem_ctx.contains(id)))
    return [new_problem_ctx_wo_new_individuals, new_individual_names]
}

export const sequent_or_theorem_to_tactic = (state: MacLogicState, tactic: SequentOrTheoremId, assumptions: Ctx, conclusion: Ast): ControlStatus<MacLogicState, MacLogicInput> => {
    const rule_type = sig.lookup(con(tactic)) as Ast
    const { propositions } = separate_propositions_assumptions_and_conclusion(rule_type)
    const variable_ids: string[] = propositions.map(({ id }) => id)
    return ContinueThen(RunSerially([
        Update(() => ({ ...state, request: { type: 'SequentOrTheoremSubstitution', variable_ids, sequent_or_theorem: rule_type }, new_problems: undefined })),
        WaitFor(UserInput((_state, input) => {
            if (input.type !== 'SequentOrTheoremSubstitution')
                throw new Error(`Expected 'SequentOrTheoremSubstitution', got '${input.type}'`)
            // I wasn't originally including the list of assumptions in the following call, which means that redeclaration errors were occurring whenever an individual was declared
            // in input.value's Ctx and the Ast (like a foralli or existse).
            // I can't fix this problem by simply unioning the assumptions ctx to the problem_ctx, since this function returns the new problem_ctx, and I don't want all the assumptions
            // included in the new problem_ctx.
            // So what does the do?
            // POSSIBLE SOLUTION 1: pass in the assumptions Ctx, and have proven_sequent_substitution_to_ctx_and_substitution check if any of the values in a given proven_sequent occur in assumptions.
            // I hate this solution so nah.
            // POSSIBLE SOLUTION 2: compute the new problem_ctx AND the new sub problem ctx.
            // I also hate this solution, but less than I hate solution 1.
            // POSSIBLE SOLUTION 3: after checking the result of this call, compute a new Ctx with all the individuals declared and wrap the new proof in a bunch of indiduali's (somehow).
            const hopefully_ctx_and_substitution = proven_sequent_substitution_to_ctx_and_substitution(state.problem_ctx, input.value)
            if (is_incompatible_ctxs(hopefully_ctx_and_substitution))
                throw new Error('Old Problem Ctx and given ProvenSequentSubstitutions are incompatible')
            const [new_problem_ctx, prop_sub] = hopefully_ctx_and_substitution
            // // HACK
            // // These are the individual names that should be declared using individuali in the resulting proof fragment.
            // const new_individual_names = new_problem_ctx.entries()
            //     // Keep if it is an individual AND is not in the old problem_ctx.
            //     .filter(([id]) => !state.problem_ctx.contains(id))
            //     .filter(([, type]) => syntactic_equality(i, type)/* && !state.problem_ctx.contains(id)*/)
            //     .map(([id]) => id)
            // // The hacky stuff has come back to bite me.
            // // We shouldn't be filtering out all individual declarations, because there are old individuals we might want to keep around.
            // const new_problem_ctx_wo_new_individuals = mk_map(...new_problem_ctx.entries()
            //     // Keep if it is a non-individual OR is in the old problem_ctx.
            //     .filter(([id, type]) => !syntactic_equality(i, type) || state.problem_ctx.contains(id)))
            const [new_problem_ctx_wo_new_individuals, new_individual_names] = problem_ctx_with_new_individuals_separated(state.problem_ctx, new_problem_ctx)
            return Continue(push_input({
                ...state,
                problem_ctx: new_problem_ctx_wo_new_individuals,
                proof_insert: sequent_or_theorem_to_proof_insert(new_individual_names, assumptions.union(new_problem_ctx_wo_new_individuals), conclusion, tactic, prop_sub),
            }, input))
        }))
    ]))
}

export const ask_for_quantifier_shift_substitution = (insert_f: (phi: Lambda) => AssumptionHidingProofInsert) => (state: MacLogicState): ControlStatus<MacLogicState, MacLogicInput> => {
    const { assumptions, conclusion } = first(state.problem_stack).sequent
    return ContinueThen(RunSerially([
        Update(() => ({ ...state, request: { type: 'QuantifierShiftSubstitution' }, new_problems: undefined })),
        WaitFor(UserInput((_state, input) => {
            if (input.type !== 'QuantifierShiftSubstitution')
                throw new Error(`Expected 'QuantifierShiftSubstitution', got '${input.type}'`)
            if (!is_lambda(input.value.proof))
                throw new Error(`Expected proof to be a Lambda, got\n${ast_to_string(input.value.proof)}`)
            const old_ctx = ctx_union(state.problem_ctx, mk_map(...assumptions.entries().filter(([,type]) => syntactic_equality(type, i))))
            if (is_incompatible_ctxs(old_ctx))
                throw new Error('This really should never happen -- problem_ctx and assumptions are incompatible!!!')
            const new_full_ctx = ctx_union(old_ctx, input.value.assumptions)
            if (is_incompatible_ctxs(new_full_ctx))
                throw new Error(`This might happen -- old ctx is incompatible with ctx given by frontend:\nold: ${JSON.stringify(display_ctx(old_ctx))}\nnew: ${JSON.stringify(display_ctx(input.value.assumptions))}\nerror: ${JSON.stringify(display_incompatible_ctxs(new_full_ctx))}`)
            const [new_problem_ctx, new_individuals] = problem_ctx_with_new_individuals_separated(old_ctx, new_full_ctx)
            const user_proof_insert = insert_f(input.value.proof)
            // return run_insert_or_continuation(push_input(state, input), insert_f(input.value.proof))
            return Continue(push_input({
                ...state,
                problem_ctx: new_problem_ctx,
                proof_insert: InsertProof(
                    user_proof_insert.new_conclusions,
                    (m, v) => individuali_ast_f(assumptions, conclusion, new_individuals, user_proof_insert.fragment(m, v))
                )
            }, input))
        }))
    ]))
}

export const ask_for_alphabetic_variance_substitution = (insert_f: (old_v: Variable, phi: Lambda) => AssumptionHidingProofInsert) => (state: MacLogicState): ControlStatus<MacLogicState, MacLogicInput> => {
    const { assumptions, conclusion } = first(state.problem_stack).sequent
    return ContinueThen(RunSerially([
        Update(() => ({ ...state, request: { type: 'AlphabeticVarianceSubstitution' }, new_problems: undefined })),
        WaitFor(UserInput((_state, input) => {
            if (input.type !== 'AlphabeticVarianceSubstitution')
                throw new Error(`Expected 'AlphabeticVarianceSubstitution', got '${input.type}'`)
            if (!is_lambda(input.value.proven_sequent.proof))
                throw new Error(`Expected proof to be a Lambda, got\n${ast_to_string(input.value.proven_sequent.proof)}`)
            const old_ctx = ctx_union(state.problem_ctx, mk_map(...assumptions.entries().filter(([,type]) => syntactic_equality(type, i))))
            if (is_incompatible_ctxs(old_ctx))
                throw new Error('This really should never happen -- problem_ctx and assumptions are incompatible!!!')
            const new_full_ctx = ctx_union(old_ctx, input.value.proven_sequent.assumptions)
            if (is_incompatible_ctxs(new_full_ctx))
                throw new Error(`This might happen -- old ctx is incompatible with ctx given by frontend:\nold: ${JSON.stringify(display_ctx(old_ctx))}\nnew: ${JSON.stringify(display_ctx(input.value.proven_sequent.assumptions))}\nerror: ${JSON.stringify(display_incompatible_ctxs(new_full_ctx))}`)
            const [new_problem_ctx, new_individuals] = problem_ctx_with_new_individuals_separated(old_ctx, new_full_ctx)
            const user_proof_insert = insert_f(ov(input.value.old_variable), input.value.proven_sequent.proof)
            return Continue(push_input({
                ...state,
                problem_ctx: new_problem_ctx,
                proof_insert: InsertProof(
                    user_proof_insert.new_conclusions,
                    (m, v) => individuali_ast_f(assumptions, conclusion, new_individuals, user_proof_insert.fragment(m, v))
                )
            }, input))
        }))
    ]))
}

export const run_tactic = (state: MacLogicState, tactic: TacticId, assumptions: Ctx, conclusion: Ast): ControlStatus<MacLogicState, MacLogicInput> => {
    if (is_sequent_or_theorem_id(tactic))
        return sequent_or_theorem_to_tactic(state, tactic, assumptions, conclusion)
    if (tactic === 'ande')
        return ask_for_unifying_assumption(
            ml(and(X, Y)),
            ({ variable: a, unifier: u }) => InsertProof(
                [HideAssumption(conclusion, [a])],
                (m, v) => flapp(la(v(0), ml(u('X')), la(v(1), ml(u('Y')), m(0))), andel(u('X'), u('Y'), a), ander(u('X'), u('Y'), a)))
        )(state)
    if (tactic === 'andi')
        return ask_for_unifying_conclusion(
            ml(and(X, Y)),
            (u) => InsertProof(
                [ml(u('X')), ml(u('Y'))],
                (m) => andi(u('X'), u('Y'), m(0), m(1)))
        )(state)
    if (tactic === 'impe')
        return ask_for_unifying_assumption(
            ml(imp(X, Y)),
            ({ variable: a, unifier: u }) => InsertProof(
                [ml(u('X')), HideAssumption(conclusion, [a])],
                (m, v) => flapp(la(v(0), ml(u('Y')), m(1)), impe(u('X'), u('Y'), a, m(0))))
        )(state)
    if (tactic === 'impi')
        return ask_for_unifying_conclusion(
            ml(imp(X, Y)),
            (u) => InsertProof(
                [ml(u('Y'))],
                (m, v) => impi(u('X'), u('Y'), la(v(0), ml(u('X')), m(0))))
        )(state)
    if (tactic === 'foralli') {
        return ask_for_unifying_conclusion(
            ml(app(con('forall'), X)),
            (u) => ask_for_unused_variable(assumptions, conclusion, (new_v) => {
                const instance = possibly_beta_reduce(u('X'), new_v)
                return InsertProof([ml(instance)], (m) => foralli(u('X'), la(new_v, i, m(0))))
            })
        )(state)
    }
    if (tactic === 'foralle') {
        return ask_for_unifying_assumption(
            ml(app(con('forall'), X)),
            ({ unifier: u, variable: a }) => ask_for_any_variable(assumptions, conclusion, (new_v) => {
                const goal = throwing_unifier(unify(ml(X), conclusion) as Substitution)('X')
                const instance = possibly_beta_reduce(u('X'), new_v)
                return InsertProof(
                    [ml(goal)],
                    assumptions.contains(new_v.id)
                        ? (m, v) => app(la(v(0), ml(instance), m(0)), foralle(u('X'), new_v, a))
                        : (m, v) => individuali(goal, la(new_v, i, app(la(v(0), ml(instance), m(0)), foralle(u('X'), new_v, a)))))
            })
        )(state)
    }
    if (tactic === 'existse') {
        return ask_for_unifying_assumption(
            ml(app(con('exists'), X)),
            ({ unifier: u, variable: a }) => ask_for_unused_variable(assumptions, conclusion, (new_v) => {
                const goal = throwing_unifier(unify(ml(X), conclusion) as Substitution)('X')
                const instance = possibly_beta_reduce(u('X'), new_v)
                return InsertProof([HideAssumption(ml(goal), [a])], (m, v) => existse(u('X'), goal, a, la(new_v, i, la(v(0), ml(instance), m(0)))))
            })
        )(state)
    }
    if (tactic === 'existsi') {
        return ask_for_unifying_conclusion(ml(app(con('exists'), X)), (u) => ask_for_any_variable(assumptions, conclusion, (new_v) => {
            const goal = throwing_unifier(unify(ml(X), conclusion) as Substitution)('X')
            const instance = possibly_beta_reduce(u('X'), new_v)
            return InsertProof(
                [ml(instance)],
                assumptions.contains(new_v.id)
                    ? (m) => existsi(u('X'), new_v, m(0))
                    : (m) => individuali(goal, la(new_v, i, existsi(u('X'), new_v, m(0)))),
            )
        }))(state)
    }
    if (tactic === 'noti') {
        return ask_for_unifying_conclusion(
            ml(not(X)),
            (u) => InsertProof([ml(absurd)], (m, v) => noti(u('X'), la(v(0), ml(u('X')), m(0))))
        )(state)
    }
    if (tactic === 'note') {
        return ask_for_unifying_assumption(ml(not(X)), ({ unifier: u, variable: a }) =>
            InsertProof(
                [ml(u('X')), HideAssumption(conclusion, [a])],
                (m, v) => app(la(v(0), ml(absurd), m(1)), note(u('X'), a, m(0))))
        )(state)
    }
    if (tactic === 'dn') {
        return ask_for_unifying_conclusion(ml(X), (u) =>
            InsertProof(
                [ml(not(not(u('X'))))],
                (m) => dn(u('X'), m(0)))
        )(state)
    }
    if (tactic === 'oril') {
        return ask_for_unifying_conclusion(
            ml(or(X, Y)),
            (u) => InsertProof([ml(u('X'))], (m) => oril(u('X'), u('Y'), m(0)))
        )(state)
    }
    if (tactic === 'orir') {
        return ask_for_unifying_conclusion(
            ml(or(X, Y)),
            (u) => InsertProof([ml(u('Y'))], (m) => orir(u('X'), u('Y'), m(0)))
        )(state)
    }
    if (tactic === 'ore') {
        return ask_for_unifying_conclusion(
            ml(X),
            (gu) => ask_for_unifying_assumption(
                ml(or(X, Y)),
                ({ unifier: u, variable: a }) => InsertProof(
                    [HideAssumption(ml(gu('X')), [a]), HideAssumption(ml(gu('X')), [a])],
                    (m, v) => ore(u('X'), u('Y'), gu('X'), a, la(v(0), ml(u('X')), m(0)), la(v(0), ml(u('Y')), m(1)))
                )
            )
        )(state)
    }
    if (tactic === 'df') {
        return ask_for_unifying_assumption_or_conclusion(
            ml(iff(X, Y)),
            ({ unifier: u, variable: a }) => InsertProof(
                [HideAssumption(conclusion, [a])],
                (m, v) => app(la(v(0), ml(and(imp(u('X'), u('Y')), imp(u('Y'), u('X')))), m(0)), dfl(u('X'), u('Y'), a))
            ),
            (u) => InsertProof(
                [ml(and(imp(u('X'), u('Y')), imp(u('Y'), u('X'))))],
                (m) => dfr(u('X'), u('Y'), m(0))
            )
        )(state)
    }
    const make_qs_tactic = (roi: Constant, required: (phi: Lambda) => Ast, given: (phi: Lambda) => Ast) =>
        ask_for_quantifier_shift_substitution(
            (phi) => InsertProof(
                [ml(required(phi)), conclusion],
                (m, v) => flapp(
                    la(v(0), ml(given(phi)), m(1)),
                    flapp(roi, make_qs_phi(phi.bound, phi), m(0))
                )
            )
        )(state)
    const forall_not_f = (phi: Lambda) => forall(phi.bound, not(possibly_beta_reduce(phi, phi.bound)))
    const not_exists_f = (phi: Lambda) => not(app(con('exists'), phi))
    const exists_not_f = (phi: Lambda) => exists(phi.bound, not(possibly_beta_reduce(phi, phi.bound)))
    const not_forall_f = (phi: Lambda) => not(app(con('forall'), phi))
    if (tactic === 'qs1')
        return make_qs_tactic(con('qs1'), forall_not_f, not_exists_f)
    if (tactic === 'qs2')
        return make_qs_tactic(con('qs2'), not_exists_f, forall_not_f)
    if (tactic === 'qs3')
        return make_qs_tactic(con('qs3'), exists_not_f, not_forall_f)
    if (tactic === 'qs4')
        return make_qs_tactic(con('qs4'), not_forall_f, exists_not_f)
    const make_av_tactic = (roi: Constant, q: (phi: Lambda) => Ast) =>
        ask_for_alphabetic_variance_substitution(
            (old_v, phi) => InsertProof(
                [ml(q(la(old_v, i, possibly_beta_reduce(phi, old_v)))), conclusion],
                (m, v) => flapp(
                    la(v(0), ml(q(phi)), m(1)),
                    flapp(roi, make_qs_phi(phi.bound, phi), m(0))
                )
            )
        )(state)
    if (tactic === 'avu')
        return make_av_tactic(con('avu'), forall_phi)
    if (tactic === 'ave')
        return make_av_tactic(con('ave'), exists_phi)
   
    throw new Error(`Tactic Input '${tactic}' Unimplemented`)
}

const close_already_solved = (state: MacLogicState): MacLogicState => {
    let leftovers = state.problem_stack
    let closed_tree = state.problem_tree!
    let next_ast = state.ast
    // let new_problems = state.new_problems
    while (!is_empty(leftovers)) {
        const top = first(leftovers)
        // const uas = find_unifying_assumptions(top.sequent.assumptions, top.sequent.conclusion)
        const syntactially_equivalent_assumption = top.sequent.assumptions.entries().find(([, type]) => syntactic_equality(type, top.sequent.conclusion))
        if (!defined(syntactially_equivalent_assumption))
            return {
                ...state,
                problem_stack: leftovers,
                problem_tree: make_current_at_id(
                    closed_tree,
                    top.meta_variable.get_index()
                ),
                ast: next_ast
            }
        leftovers = leftovers.slice(1)
        closed_tree = close_at_id(closed_tree, top.meta_variable.get_index())
        next_ast = defined(next_ast) ? meta_substitute(top.meta_variable, ov(syntactially_equivalent_assumption[0]), next_ast) : undefined
    }
    return { ...state, mode: 'Finished', problem_tree: closed_tree, problem_stack: leftovers, ast: next_ast }
}

export const is_individual_or_predicate_type = (ast: Ast): boolean => {
    const is_predicate_type = (inner_ast: Ast): boolean => syntactic_equality(inner_ast, o) || (is_pi(inner_ast) && syntactic_equality(inner_ast.type, i) && is_predicate_type(inner_ast.scope))
    return syntactic_equality(ast, i) || is_predicate_type(ast)
}

export const separate_sequent_from_individuals_and_predicates = (seq: Sequent): [Ctx, Sequent] => {
    const new_ctx = mk_map(...seq.assumptions.entries().filter(([,type]) => is_individual_or_predicate_type(type)))
    const new_sequent = sequent(
        mk_map(...seq.assumptions.entries().filter(([,type]) => !is_individual_or_predicate_type(type))),
        seq.conclusion
    )
    return [new_ctx, new_sequent]
}

const keep_only_theorems_in_sequent_ctx = (seq: Sequent): Sequent =>
    sequent(mk_map(...seq.assumptions.entries().filter(([,type]) => ml_wrapped(type))), seq.conclusion)

const [X, Y] = mvlist('X', 'Y')

export const state_to_checked_proof_insert = (sig: Sig, state: MacLogicState): [SubProblem, CheckedProofInsert] => {
    const current_sub_problem = first(state.problem_stack)
    const { sequent: solved_sequent } = current_sub_problem
    return [current_sub_problem, check_assumption_hiding_proof_insert(
        sig,
        state.problem_ctx,
        solved_sequent,
        state.proof_insert!,
        (i) => imv(state.next_problem_id + i),
        (i) => iv(state.next_unused_variable_id + i)
    )]
}

export const initial_state: MacLogicState = {
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
}

export const initial_problem_to_state = (sequent: Sequent): MacLogicState => {
    const state = initial_state
    const elaborated = sequent
    const [problem_ctx, main_problem_sequent] = separate_sequent_from_individuals_and_predicates(elaborated)
    const initial_ast = introduce_ctx(main_problem_sequent.assumptions, imv(state.next_problem_id))
    return {
        ...state,
        mode: 'EnterTactic',
        problem_ctx,
        main_problem: main_problem_sequent,
        // main_problem_string: unparse_sequent(parsed[0], parsed[1]),
        problem_stack: [sub_problem(imv(state.next_problem_id), main_problem_sequent)],
        new_problems: [
            main_problem_sequent
        ],
        next_problem_id: state.next_problem_id + 1,
        next_unused_variable_id: next_indexed_variable_in_sequent(main_problem_sequent).get_index(),
        problem_tree: current_problem(state.next_problem_id, keep_only_theorems_in_sequent_ctx(elaborated)),
        ast: initial_ast
    }
}

export const interaction =
    StartInteraction<MacLogicState, MacLogicInput>(
        initial_state,
        RunSerially([
            WaitFor(UserInput((_, input) => {
                if (input.type !== 'Problem')
                    throw new Error(`Expected 'Problem', got '${input.type}'`)
                return Continue(initial_problem_to_state(input.value))
            })),
            Update(close_already_solved),
            While(({ mode }) => mode === 'EnterTactic', RunSerially([
                WaitFor(UserInput((state, input) => {
                    if (input.type !== 'Tactic')
                        throw new Error(`Expected 'Tactic', got '${input.type}'`)
                    const { assumptions, conclusion } = first(state.problem_stack).sequent
                    const full_ctx = assumptions.union(state.problem_ctx)
                    const mod_state: MacLogicState = { ...state, error: undefined, tactic: input.value, inputs: [...state.inputs, input] }
                    return SaveThen(run_tactic(mod_state, input.value, full_ctx, conclusion))
                })),
                Update((state) => {
                    const [old_sub_problem, checked] = state_to_checked_proof_insert(sig, state)
                    const { meta_variable: mv, sequent: solved_sequent } = old_sub_problem
                    if (!is_valid_proof_insert(checked))
                        throw new Error(`Something is wrong with the given Proof Insert!\n${JSON.stringify(display_invalid_proof_insert(checked))}`)
                    const new_problems = hide_assumptions_in_problems(
                        state.proof_insert?.new_conclusions!,
                        checked.sub_problems.map((p) => fill_in_problem_with_parent(solved_sequent, p)))
                    const next_unused_variable_id = Math.max(state.next_unused_variable_id + 1, ...new_problems.map((np) => {
                        const next = next_indexed_variable_in_sequent(np.sequent).get_index()
                        return next
                    }))
                    const next_ast = meta_substitute(mv, checked.ast, state.ast!)
                    return {
                        ...state,
                        problem_stack: [...new_problems, ...state.problem_stack.slice(1)],
                        next_problem_id: state.next_problem_id + new_problems.length,
                        next_unused_variable_id,
                        proof_insert: undefined,
                        new_problems: new_problems.map((sp) => sp.sequent),
                        tactic: undefined,
                        problem_tree: split_at_id(
                            state.problem_tree!,
                            mv.get_index(),
                            state.tactic!,
                            new_problems.map((sp) => open_problem(sp.meta_variable.get_index(), keep_only_theorems_in_sequent_ctx(sp.sequent)))
                        ),
                        ast: next_ast
                    }
                }),
                Update(close_already_solved)
            ])),
            Update((state) => {
                const final_proof = introduce_ctx(state.problem_ctx, state.ast!)
                const new_proof = ast_to_proof(final_proof, state.main_problem!)
                assert_linear_proof_is_valid(new_proof, state.main_problem!)
                return {
                    ...state,
                    proof: new_proof
                }
            }),
            WaitFor(UserInput((state, input) => {
                if (input.type !== 'ConfirmCompleted')
                    throw new Error(`Expected 'ConfirmComplete', got '${input.type}'`)
                return Continue(state)
            }))
        ]),
        {
            waiting_for_input: (state, undo_stack, redo_stack) => {
                return { ...state, can_undo: !is_empty(undo_stack), can_redo: !is_empty(redo_stack) }
            },
        }
    )
