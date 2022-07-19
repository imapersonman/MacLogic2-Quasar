import { Ast, Lambda } from 'coastline/src/lambda_pi/ast'
import { app, con, flapp, iv, mv, mvlist, ov } from 'coastline/src/lambda_pi/shorthands'
import { Ctx } from 'coastline/src/logical_framework/ctx'
import { ctx_union, display_incompatible_ctxs, IncompatibleCtxs, is_incompatible_ctxs } from 'coastline/src/logical_framework/ctx_union'
import { display_redeclared_variable, is_redeclared_variable, RedeclaredVariable } from 'coastline/src/logical_framework/sort_errors'
import { map_lookup_key_not_found, mk_map } from 'coastline/src/map/RecursiveMap'
import { declare, is_array, is_string } from 'coastline/src/utilities'
import { sequent, Sequent } from 'coastline/src/construction/sequent'
import { absurd, and, exists, forall, i, iff, imp, ml, not, o, or, pred } from './maclogic_shorthands'
import { S } from './s'
import { ErrorInAssumptions, ErrorInConclusion, SequentError } from './sequent_error'
import { unify_clauses, match_clause, match_clauses } from 'coastline/src/unification/first_order_match_clauses'
import { ast_to_string, is_constant, is_meta_variable, is_variable } from 'coastline/src/lambda_pi/utilities'
import { SubProblem } from 'coastline/src/construction/check_proof_insert'
import { unwrap_ml } from './unwrap_ml'
import { ml_wrapped } from './ml_wrapped'
import { ProvenSequent, proven_sequent } from './proven_sequent'

export const is_individual = (s: S): s is string => is_string(s) && s === s.toLowerCase()
export const is_negation = (s: S): s is S[] => is_array(s) && s.length === 2 && is_string(s[0]) && s[0] === '~'
export const is_quantifier = (s: S): s is S[] => is_array(s) && s.length === 3 && is_string(s[0]) && ['∃', '∀'].some((q) => q === s[0])
export const is_bin_op = (s: S): s is S[] => is_array(s) && s.length === 3 && is_string(s[0]) && ['&', '∨', '→', '↔'].some((c) => c === s[0])
export const is_predicate = (s: S): s is S[] => is_array(s) && s.length > 0 && is_string(s[0]) && s[0] === s[0].toUpperCase()

export type ElaborationError = RedeclaredVariable | IncompatibleCtxs
export const is_elaboration_error = (e: unknown): e is ElaborationError =>
    is_redeclared_variable(e) || is_incompatible_ctxs(e)
export const display_elaboration_error = (e: ElaborationError) => {
    if (is_redeclared_variable(e))
        return display_redeclared_variable(e)
    return display_incompatible_ctxs(e)
}

// Is only capable of elaborating the output of parse.
export const elaborate_s = (s: S): ProvenSequent | ElaborationError => {
    const get_ctx_from_args = (ctx: Ctx, args: S[]): [Ctx, Ast[]] | ElaborationError =>
        args.reduce<[Ctx, Ast[]] | ElaborationError>((acc: [Ctx, Ast[]] | ElaborationError, arg): [Ctx, Ast[]] | ElaborationError => {
            // sort from arg elaboration should be i.
            if (is_elaboration_error(acc))
                return acc
            const elaborated = elaborate_s_with_ctx(acc[0], arg)
            if (is_elaboration_error(elaborated))
                return elaborated
            const { assumptions, proof } = elaborated
            const unioned = ctx_union(acc[0], assumptions)
            if (is_incompatible_ctxs(unioned))
                // Should never occur
                return unioned
                // throw new Error(`IncompatibleCtxs in elaborate_s_with_ctx: ${JSON.stringify(unioned)}`)
            return [unioned, [...acc[1], proof]]
        }, [ctx, []])

    // Important Cases:
    // - Individuals
    const elaborate_s_with_ctx = (ctx: Ctx, s: S): ProvenSequent | ElaborationError => {
        if (is_individual(s)) {
            const type = ctx.lookup(s)
            if (map_lookup_key_not_found(type))
                return proven_sequent(ctx.add(s, i), ov(s), i)
            // We trust the given ctx because we trust all the output ctxs.
            return proven_sequent(ctx, ov(s), i)
        }
        // - Negations
        if (is_negation(s)) {
            const arg = s[1]
            const ctx_from_arg = get_ctx_from_args(ctx, [arg])
            if (is_elaboration_error(ctx_from_arg))
                return ctx_from_arg
            return proven_sequent(
                ctx_from_arg[0],
                not(ctx_from_arg[1][0]),
                o
            )
        }
        // - Quantifiers
        // ['∃', 'x', ['F']]
        if (is_quantifier(s)) {
            const bound_id = s[1] as string
            const body_s = s[2]
            if (ctx.contains(bound_id))
                return new RedeclaredVariable(ov(bound_id))
            const mod_ctx = ctx.add(bound_id, i)
            const ctx_from_arg = get_ctx_from_args(mod_ctx, [body_s])
            const q = s[0] === '∃' ? exists : forall
            if (is_elaboration_error(ctx_from_arg))
                return ctx_from_arg
            return proven_sequent(
                // removing the entry with bound_id as key is a bit of a hack but it works and simplifies things.
                ctx_from_arg[0].remove(bound_id),
                q(ov(bound_id), ctx_from_arg[1][0]),
                o
            )
        }
        // - Binary Operators
        if (is_bin_op(s)) {
            const c = s[0] as string
            const args = (s as S[]).slice(1)
            const ctx_from_args = get_ctx_from_args(ctx, args)
            if (is_elaboration_error(ctx_from_args))
                return ctx_from_args
            const bin_op =
                c === '&' ? and
                : c === '∨' ? or
                : c === '→' ? imp
                : iff
            return proven_sequent(
                ctx_from_args[0],
                bin_op(ctx_from_args[1][0], ctx_from_args[1][1]),
                o
            )
        }
        // - Predicates
        if (is_predicate(s)) {
            const head = s[0] as string
            const args = (s as S[]).slice(1) as string[]
            if (head === '⋏')
                return proven_sequent(ctx, absurd, o)
            const ctx_from_args = get_ctx_from_args(ctx, args)
            if (is_elaboration_error(ctx_from_args))
                return ctx_from_args
            const as_ast = args.length === 0 ? ov(head) : flapp(ov(head), ov(args[0]), ...args.slice(1).map(ov))
            if (map_lookup_key_not_found(head))
                return proven_sequent(ctx_from_args[0], as_ast, o)
            const unioned = ctx_union(ctx.add(head, pred(args.length)), ctx_from_args[0])
            if (is_incompatible_ctxs(unioned))
                return unioned
            return proven_sequent(unioned, as_ast, o)
        }
        throw new Error('undefined')
    }
    return elaborate_s_with_ctx(mk_map(), s)
}

export const elaborate_sequent = (assumptions: S[], conclusion: S): Sequent | SequentError<ElaborationError> => {
    const elaborated_assumptions = assumptions.map(elaborate_s)
    let individual_and_formulae_ctx = mk_map<Ast>()
    let proof_ctx = mk_map<Ast>()
    for (const [index, ea] of elaborated_assumptions.entries()) {
        if (is_elaboration_error(ea))
            return new ErrorInAssumptions(ea, index)
        const ifctx_unioned = ctx_union(individual_and_formulae_ctx, ea.assumptions)
        if (is_incompatible_ctxs(ifctx_unioned))
            return new ErrorInAssumptions(ifctx_unioned, index)
        individual_and_formulae_ctx = ifctx_unioned
        proof_ctx = proof_ctx.add(iv(index).id, ml(ea.proof))
    }

    const elaborated_conclusion = elaborate_s(conclusion)
    if (is_elaboration_error(elaborated_conclusion))
        return new ErrorInConclusion(elaborated_conclusion)
    const ifctx_unioned = ctx_union(individual_and_formulae_ctx, elaborated_conclusion.assumptions)
    if (is_incompatible_ctxs(ifctx_unioned))
        return new ErrorInConclusion(ifctx_unioned)
    individual_and_formulae_ctx = ifctx_unioned
    const full_ctx = ctx_union(individual_and_formulae_ctx, proof_ctx)
    if (is_incompatible_ctxs(full_ctx))
        // should never happen
        throw new Error('Elaborated individual and formulae ctx is incompatible with the elaborated proof ctx')
    const proof_conclusion = ml(elaborated_conclusion.proof)

    return sequent(full_ctx, proof_conclusion)
}

export const unelaborate = (ast: Ast): S => {
    const unwrapped = ml_wrapped(ast) ? unwrap_ml(ast) : ast
    const [X, Y] = mvlist('X', 'Y')
    if (is_constant(unwrapped) && unwrapped.id === 'absurd')
        return ['⋏']
    if (is_variable(unwrapped))
        if (unwrapped.id === unwrapped.id.toLowerCase())
            return unwrapped.id
        else
            return [unwrapped.id]
    if (is_meta_variable(unwrapped))
        return [unwrapped.id]
    return match_clauses(unwrapped, [
        match_clause(not(X), (u) => ['~', unelaborate(u('X'))]),
        match_clause(and(X, Y), (u) => ['&', unelaborate(u('X')), unelaborate(u('Y'))]),
        match_clause(imp(X, Y), (u) => ['→', unelaborate(u('X')), unelaborate(u('Y'))]),
        match_clause(or(X, Y), (u) => ['∨', unelaborate(u('X')), unelaborate(u('Y'))]),
        match_clause(iff(X, Y), (u) => ['↔', unelaborate(u('X')), unelaborate(u('Y'))]),
        match_clause(app(con('exists'), X), (u) => declare(u('X') as Lambda, (l) => ['∃', l.bound.id, unelaborate(l.scope)])),
        match_clause(app(con('forall'), X), (u) => declare(u('X') as Lambda, (l) => ['∀', l.bound.id, unelaborate(l.scope)])),
        match_clause(app(X, Y), (u) => [...unelaborate(u('X')), unelaborate(u('Y'))])
    // ], () => { throw new Error(`Can't unelaborate given Ast: ${ast_to_string(ast)}`) })
    ], () => {
        throw new Error(`Can't unelaborate given Ast: ${ast_to_string(unwrapped)}`)
    })
}

export const unelaborate_sequent = (s: Sequent): [S[], S] => {
    const X = mv('X')
    const assumptions_s: S[] = []
    for (const [,type] of s.assumptions.entries()) {
        unify_clauses(type, [
            match_clause(ml(X), (u) => assumptions_s.push(unelaborate(u('X'))))
        // if no match, don't do anything
        ], () => undefined)
    }

    const conclusion_s = unwrap_ml(s.conclusion)
    return [assumptions_s, unelaborate(conclusion_s)]
}

export const unelaborate_sub_problem = (sub_problem: SubProblem): { id: number, sequent: [S[], S] } => ({
    id: sub_problem.meta_variable.get_index(),
    sequent: unelaborate_sequent(sub_problem.sequent)
})