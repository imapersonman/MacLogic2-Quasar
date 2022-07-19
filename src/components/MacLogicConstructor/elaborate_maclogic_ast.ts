import { defined, first, rest, string_in_array } from 'coastline/src/utilities'
import { display_failed_check, display_redeclared_variable, display_undeclared_constant, FailedCheck, is_failed_check, is_redeclared_variable, is_undeclared_constant, RedeclaredVariable, UndeclaredConstant } from 'coastline/src/logical_framework/sort_errors'
import { display_proven_sequent, ProvenSequent, proven_sequent } from './proven_sequent'
import { syntactic_equality } from 'coastline/src/lambda_pi/syntactic_equality'
import { ast_in, ast_to_string, is_application, is_constant, is_lambda, is_pi, is_variable } from 'coastline/src/lambda_pi/utilities'
import { Ast, Lambda, Variable } from 'coastline/src/lambda_pi/ast'
import { i, o } from './maclogic_shorthands'
import { app, con, flapp, imv, iv, mvlist, pi } from 'coastline/src/lambda_pi/shorthands'
import { map_lookup_key_not_found } from 'coastline/src/map/RecursiveMap'
import { sig } from './construction_interaction'
import { Ctx } from 'coastline/src/logical_framework/ctx'
import { match_clause, match_clauses } from 'coastline/src/unification/first_order_match_clauses'
import { bound_variables } from 'coastline/src/lambda_pi/bound_variables'
import { new_variable } from 'coastline/src/lambda_pi/new_variable'
import { to_beta_normal_form } from 'coastline/src/lambda_pi/to_beta_normal_form'
import { free_variables } from 'coastline/src/lambda_pi/free_variables'
import { all_possible_variable_names } from './possible_variable_names'
import { display_sort } from 'coastline/src/logical_framework/sort'

export class VacuousBind { constructor(readonly variable: Variable) {} }
export const vacuous_bind = (variable: Variable): VacuousBind => new VacuousBind(variable)
export const is_vacuous_bind = (d: unknown): d is VacuousBind => d instanceof VacuousBind
export const display_vacuous_bind = (d: VacuousBind) => ({ did: 'VacuousBind', variable: d.variable })

export class BoundIndividualConstant { constructor(readonly individual: Variable) {} }
export const bound_individual_constant = (individual: Variable): BoundIndividualConstant => new BoundIndividualConstant(individual)
export const is_bound_individual_constant = (b: unknown): b is BoundIndividualConstant => b instanceof BoundIndividualConstant
export const display_bound_individual_constant = (b: BoundIndividualConstant) => ({ did: 'BoundIndividualConstant', individual: b.individual })

export class FreeIndividualVariable { constructor(readonly individual: Variable) {} }
export const free_individual_variable = (individual: Variable): FreeIndividualVariable => new FreeIndividualVariable(individual)
export const is_free_individual_variable = (b: unknown): b is FreeIndividualVariable => b instanceof FreeIndividualVariable 
export const display_free_individual_variable = (b: FreeIndividualVariable) => ({ did: 'FreeIndividualVariable', individual: b.individual })

export type MacLogicElaborationError = RedeclaredVariable | UndeclaredConstant | FailedCheck | VacuousBind

export const is_maclogic_elaboration_error = (e: unknown): e is MacLogicElaborationError =>
    is_redeclared_variable(e)
    || is_undeclared_constant(e)
    || is_failed_check(e)
    || is_vacuous_bind(e)

export const display_maclogic_elaboration_error = (e: MacLogicElaborationError) => {
    if (is_redeclared_variable(e))
        return display_redeclared_variable(e)
    if (is_undeclared_constant(e))
        return display_undeclared_constant(e)
    if (is_failed_check(e))
        return display_failed_check(e)
    if (is_vacuous_bind(e))
        return display_vacuous_bind(e)
}
export const display_maclogic_elaboration_output = (m: ProvenSequent | MacLogicElaborationError | undefined) => {
    if (!defined(m))
        return 'undefined'
    if (is_maclogic_elaboration_error(m))
        return display_maclogic_elaboration_error(m)
    return display_proven_sequent(m)
}

// A M_type is one of the following:
// - i
// - o
// - P(x: M_type).M_type
const is_m_type = (ast: Ast): boolean =>
    syntactic_equality(ast, i)
    || syntactic_equality(ast, o)
    || (is_pi(ast) && is_m_type(ast.type) && is_m_type(ast.scope))

const [X] = mvlist('X')

// This function throws an exception if desired_type is neither equal to i nor o.
export const elaborate_maclogic_ast = (ps: ProvenSequent): ProvenSequent | MacLogicElaborationError | undefined => {
    const elaborate_normalized_maclogic_ast = (inner_ps: ProvenSequent): ProvenSequent | MacLogicElaborationError | undefined => {
        const { assumptions, proof, sort } = inner_ps
        if (is_constant(proof)) {
            const previous_sort = sig.lookup(proof)
            if (!defined(previous_sort))
                return new UndeclaredConstant(proof)
            if (!syntactic_equality(sort, previous_sort))
                return new FailedCheck(proof, sort, previous_sort)
            return inner_ps
        } else if (is_variable(proof)) {
            const previous_sort = assumptions.lookup(proof.id)
            if (map_lookup_key_not_found(previous_sort))
                return proven_sequent(assumptions.add(proof.id, sort), proof, sort)
            if (!syntactic_equality(sort, previous_sort))
                return new FailedCheck(proof, sort, previous_sort)
            return inner_ps
        } else if (is_application(proof)) {
            const elaborate_list_to_ctx = (initial_ctx: Ctx, ast_sort_pairs: [Ast, Ast][]): Ctx | MacLogicElaborationError | undefined => {
                let current_ctx = initial_ctx
                for (const [ast, sort] of ast_sort_pairs) {
                    const elaboration = elaborate_normalized_maclogic_ast(proven_sequent(current_ctx, ast, sort))
                    if (!defined(elaboration) || is_maclogic_elaboration_error(elaboration))
                        return elaboration
                    current_ctx = elaboration.assumptions
                }
                return current_ctx
            }
            const elaborate_list_to_proven_sequent = (initial_ctx: Ctx, ast_sort_pairs: [Ast, Ast][], final_ast: Ast, final_sort: Ast): ProvenSequent | MacLogicElaborationError | undefined => {
                const elaborated_ctx = elaborate_list_to_ctx(initial_ctx, ast_sort_pairs)
                if (!defined(elaborated_ctx) || is_maclogic_elaboration_error(elaborated_ctx))
                    return elaborated_ctx
                return proven_sequent(elaborated_ctx, final_ast, final_sort)
            }
            const connective_elaboration_clause = (c: Ast, n_args: number) => {
                const imvs = new Array(n_args).fill(imv(0)).map((_, index) => imv(index))
                return match_clause(flapp(c, first(imvs), ...rest(imvs)), (u) => {
                    const elaboration_list = imvs.map<[Ast, Ast]>((m) => [u(m.id), o])
                    return elaborate_list_to_proven_sequent(assumptions, elaboration_list, proof, sort)
                })
            }
            const quantifier_elaboration_clause = (q: Ast) => {
                return match_clause(app(q, X), (u) => {
                    const l = u('X') as Lambda
                    if (assumptions.contains(l.bound.id))
                        return new RedeclaredVariable(l.bound)
                    const elaborated_scope = elaborate_normalized_maclogic_ast(proven_sequent(
                        assumptions.add(l.bound.id, l.type),
                        l.scope,
                        o
                    ))
                    if (!defined(elaborated_scope) || is_maclogic_elaboration_error(elaborated_scope))
                        return elaborated_scope
                    const fvs_in_scope = free_variables([], l.scope)
                    if (!ast_in(l.bound, fvs_in_scope))
                        return vacuous_bind(l.bound)
                    return proven_sequent(
                        elaborated_scope.assumptions.remove(l.bound.id),
                        proof,
                        sort
                    )
                })
            }
            return match_clauses(proof, [
                connective_elaboration_clause(con('not'), 1),
                connective_elaboration_clause(con('and'), 2),
                connective_elaboration_clause(con('or'), 2),
                connective_elaboration_clause(con('imp'), 2),
                connective_elaboration_clause(con('iff'), 2),
                quantifier_elaboration_clause(con('forall')),
                quantifier_elaboration_clause(con('exists'))
            ], () => {
                // predicates and individual functions
                const vs_to_avoid = bound_variables(sort)
                const elaborated_head = elaborate_normalized_maclogic_ast(proven_sequent(
                    assumptions,
                    proof.head,
                    pi(new_variable(vs_to_avoid, iv(0)), i, sort)
                ))
                if (!defined(elaborated_head) || is_maclogic_elaboration_error(elaborated_head))
                    return elaborated_head
                const elaborated_arg_to_i = elaborate_normalized_maclogic_ast(proven_sequent(
                    elaborated_head.assumptions,
                    proof.arg,
                    i
                ))
                if (!defined(elaborated_arg_to_i) || is_maclogic_elaboration_error(elaborated_arg_to_i))
                    return elaborated_arg_to_i
                return proven_sequent(elaborated_arg_to_i.assumptions, proof, sort)
            })
        } else if (is_lambda(proof)) {
            if (!is_pi(sort))
                throw new Error(`Sort is not pi, it\s\n${display_sort(sort)}`)
            if (!syntactic_equality(proof.type, sort.type))
                throw new Error(`Bounds variable type ${ast_to_string(proof.type)} does not equal sort type ${ast_to_string(sort.type)}`)
            const elaborated_scope = elaborate_normalized_maclogic_ast(proven_sequent(
                assumptions.add(proof.bound.id, proof.type),
                proof.scope,
                sort.scope
            ))
            if (!defined(elaborated_scope) || is_maclogic_elaboration_error(elaborated_scope))
                return elaborated_scope
            return proven_sequent(elaborated_scope.assumptions.remove(proof.bound.id), proof, sort)
        }
        // e.g. it'll freak out for MetaVariables and binders (for now).
        throw new Error(`elaborate_maclogic_ast unimplemented for Ast:\n${JSON.stringify(display_proven_sequent(ps))}`)
    }
    if (!is_m_type(ps.sort))
        return undefined
    const nf = to_beta_normal_form(ps.proof)
    return elaborate_normalized_maclogic_ast(proven_sequent(ps.assumptions, nf, ps.sort))
}

export const find_bound_individual_constant_or_free_individual_variable_in_ast = (
    ast: Ast
): undefined | BoundIndividualConstant | FreeIndividualVariable => {
    const is_individual_name = (name: string) => /[a-z]'*/.test(name)
    const fvs = free_variables([], ast)
    const poorly_named_fv = fvs.find((v) => is_individual_name(v.id) && !string_in_array(all_possible_variable_names, v.id.charAt(0)))
    if (defined(poorly_named_fv))
        return free_individual_variable(poorly_named_fv)
    const bvs = bound_variables(ast)
    const poorly_named_bv = bvs.find((v) => is_individual_name(v.id) && string_in_array(all_possible_variable_names, v.id.charAt(0)))
    if (defined(poorly_named_bv))
        return bound_individual_constant(poorly_named_bv)
    return undefined
}