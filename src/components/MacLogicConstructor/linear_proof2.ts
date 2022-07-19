import { defined, last } from 'coastline/src/utilities'
import { Sequent, sequent } from 'coastline/src/construction/sequent'
import { Ast, Lambda } from 'coastline/src/lambda_pi/ast'
import { to_beta_normal_form } from 'coastline/src/lambda_pi/to_beta_normal_form'
import { ast_to_string, is_application, is_constant, is_lambda, is_variable } from 'coastline/src/lambda_pi/utilities'
import { Ctx, display_ctx } from 'coastline/src/logical_framework/ctx'
import { Env } from 'coastline/src/logical_framework/env'
import { SequentMap } from 'coastline/src/logical_framework/sequent_map'
import { is_kind_sort, Sort } from 'coastline/src/logical_framework/sort'
import { display_sort_error, is_sort_error } from 'coastline/src/logical_framework/sort_errors'
import { strengthen_ctx } from 'coastline/src/logical_framework/strengthen_ctx'
import { synthesize } from 'coastline/src/logical_framework/synthesize_type'
import { mk_map } from 'coastline/src/map/RecursiveMap'
import { sig } from './construction_interaction'
import { use_newest_variables } from 'coastline/src/construction/use_newest_variables'
import { ml_wrapped } from './ml_wrapped'
import { syntactic_equality } from 'coastline/src/lambda_pi/syntactic_equality'
import { substitute } from 'coastline/src/lambda_pi/substitute'
import { ov } from 'coastline/src/lambda_pi/shorthands'
import { separate_normalized_application } from 'coastline/src/lambda_pi/separate_normalized_constant_application'

type ProofInfo = { reason: string, child_sequents: Sequent[] }
type Investigation2 = { sequents: Sequent[], map: SequentMap<ProofInfo>, canon_as_map: SequentMap<string>, as_map: { [id: string]: string }}
export type ProofLine = { assumption_lines: number[], line_number: number, reason: string, dependencies: number[], statement: Ast }

/* parameter */ const is_relevant_type = (type: Sort): boolean => !is_kind_sort(type) && ml_wrapped(type) 
const compute_relevant_ctx = (ctx: Ctx): Ctx => mk_map(...ctx.entries().filter(([,type]) => is_relevant_type(type)))
const compute_minimal_ctx = (as_map: { [id: string]: string }, ctx: Ctx, ast: Ast): Ctx => mk_map(
    ...strengthen_ctx(ctx, ast).entries()
        .filter(([,type]) => is_relevant_type(type))
        .map<[string, Ast]>(([id, type]) => [as_map[id] ?? id, type])
)
const lambda_sequent = (l: Lambda): Sequent => sequent(mk_map([l.bound.id, l.type]), l.type)
const investigate_with_ctx = (canon_as_map: SequentMap<string>, as_map: { [id: string]: string }, ctx: Ctx, ast: Ast): Investigation2 => {
    const minimal_ctx = compute_minimal_ctx(as_map, ctx, ast)
    const type = synthesize(new Env(sig, ctx, mk_map()), ast)
    if (is_sort_error(type))
        throw new Error(`Sort Error:\n${JSON.stringify(display_sort_error(type))}\nCtx:${JSON.stringify(display_ctx(ctx))}`)
    const ast_sequent = sequent(minimal_ctx, type)
    const empty_investigation = { sequents: [ast_sequent], map: new SequentMap<ProofInfo>(), canon_as_map, as_map }
    if (is_variable(ast) || is_constant(ast)) {
        return empty_investigation
    } else if (is_application(ast)) {
        if (!is_relevant_type(type))
            return empty_investigation
        const { head, args } = separate_normalized_application(ast)
        const merged_arg_map = args.reduce<[Sequent[], Investigation2]>((acc, arg) => {
            const arg_investigation = investigate_with_ctx(acc[1].canon_as_map, acc[1].as_map, ctx, arg)
            return [
                [...acc[0], ...arg_investigation.sequents],
                {
                    sequents: arg_investigation.sequents,
                    map: acc[1].map.merge(arg_investigation.map),
                    canon_as_map: arg_investigation.canon_as_map,
                    as_map: arg_investigation.as_map
                }
            ]
        }, [[], empty_investigation])
        const app_sequent_map = new SequentMap<ProofInfo>([ast_sequent, { reason: head.id, child_sequents: merged_arg_map[0].filter(({ conclusion }) => is_relevant_type(conclusion)) }])
        const new_map = merged_arg_map[1].map.merge(app_sequent_map)
        return { sequents: [ast_sequent], map: new_map, canon_as_map: merged_arg_map[1].canon_as_map, as_map: merged_arg_map[1].as_map }
    }
    else if (is_lambda(ast)) {
        const assumption_sequent = lambda_sequent(ast)
        const lambda_sequent_map = new SequentMap<ProofInfo>([assumption_sequent, { reason: 'Assumption', child_sequents: [] }])
        const contains_assumption = canon_as_map.contains(assumption_sequent)
        const assumption_ref = ast_to_string(assumption_sequent.conclusion)
        const new_canon_as_map = contains_assumption ? canon_as_map : canon_as_map.set(assumption_sequent, assumption_ref)
        const new_as_map = contains_assumption ? {
            ...as_map,
            [assumption_ref]: canon_as_map.get(assumption_sequent) ?? 'undefined'
        } : {
            ...as_map,
            [assumption_ref]: assumption_ref
        }
        const scope_inv = investigate_with_ctx(new_canon_as_map, new_as_map, ctx.add(ast.bound.id, ast.type), ast.scope)
        if (!is_relevant_type(ast.type))
            return scope_inv
        return {
            sequents: [assumption_sequent, ...scope_inv.sequents],
            map: lambda_sequent_map.merge(scope_inv.map),
            canon_as_map: scope_inv.canon_as_map,
            as_map: scope_inv.as_map
        }
    }
    throw new Error(`Can't investigate this Ast:\n${ast_to_string(ast)}`)
}

export const ast_to_proof = (ast: Ast, target_sequent: Sequent): ProofLine[] => {
    const nf = to_beta_normal_form(ast)
    // we want the most recently declared variables used so that the minimal ctxs from lambdas don't include variables with
    // types equivalent to the types most recently declared.
    /* parameterized (the call to ml_wrapped is at least) */ const mr = use_newest_variables(mk_map(), nf, ml_wrapped)
    const investigate_premises = (ctx: Ctx, inner_ast: Ast): SequentMap<ProofInfo> => {
        if (is_lambda(inner_ast)) {
            const new_ctx = ctx.add(inner_ast.bound.id, inner_ast.type)
            if (is_relevant_type(inner_ast.type)) {
                const duplicated_premise = ctx.entries().find(([, type]) => syntactic_equality(type, inner_ast.type))
                if (defined(duplicated_premise))
                    return investigate_premises(new_ctx, substitute(ov(duplicated_premise[0]), inner_ast.bound, inner_ast.scope))
                return new SequentMap([lambda_sequent(inner_ast), { reason: 'Premise', child_sequents: [] as Sequent[] }]).merge(investigate_premises(new_ctx, inner_ast.scope))
            }
            return investigate_premises(new_ctx, inner_ast.scope)
        }
        const full_proof = investigate_with_ctx(new SequentMap<string>(), {}, ctx, inner_ast)
        return full_proof.map
    }
    const minimal_sequent = sequent(compute_relevant_ctx(target_sequent.assumptions), target_sequent.conclusion)
    const initial_investigation = investigate_premises(mk_map(), mr)
    return system_proof_from_proof_info_map(initial_investigation, minimal_sequent)
}

type ProofMap = { [line_number: number]: ProofLine }

const prune_proof = (proof: ProofLine[]): ProofLine[] => {
    const proof_to_proof_map = (p: ProofLine[]): ProofMap => {
        const map: { [line_number: number]: ProofLine } = {}
        for (const pl of p)
            map[pl.line_number] = pl
        return map
    }
    const try_get_line_from_map = (map: ProofMap, ln: number): ProofLine => {
        const line = map[ln]
        if (!defined(line))
            throw new Error(`Line number ${ln} does not occur in the given proof`)
        return line
    }
    const reachable_line_numbers_from = (from_line_number: number, proof_map: ProofMap): Set<number> => {
        const current_line = try_get_line_from_map(proof_map, from_line_number)
        const dependencies = current_line.dependencies
        const separately_reachable_from_dependencies = dependencies.map((d) => reachable_line_numbers_from(d, proof_map))
        const combined_reachable_from_dependencies = separately_reachable_from_dependencies.reduce((acc: Set<number>, rfd: Set<number>) =>
            new Set([...acc, ...rfd]), new Set<number>())
        return combined_reachable_from_dependencies.add(from_line_number)
    }
    const prune_unreachable_lines = (reachable: Set<number>, proof: ProofLine[]): ProofLine[] => {
        let new_proof: ProofLine[] = []
        let shift_down_by = 0
        const line_number_map: { [line_number: number]: number } = {}
        for (const pl of proof) {
            if (reachable.has(pl.line_number)) {
                line_number_map[pl.line_number] = pl.line_number - shift_down_by
                new_proof = [
                    ...new_proof,
                    {
                        ...pl,
                        assumption_lines: pl.assumption_lines.map((aln) => line_number_map[aln]),
                        line_number: line_number_map[pl.line_number],
                        dependencies: pl.dependencies.map((dln) => line_number_map[dln])
                    }
                ]
            } else {
                shift_down_by++
            }
        }
        return new_proof
    }
    // Assumes the final line is the proof's conclusion.
    // Assumes the proof is non-empty
    const premise_line_numbers = proof.filter(({ reason }) => reason === 'Premise').map(({ line_number }) => line_number)
    const conclusion_line_number = last(proof).line_number
    const reachable_line_numbers = reachable_line_numbers_from(conclusion_line_number, proof_to_proof_map(proof))
    const pruned_proof = prune_unreachable_lines(new Set([...reachable_line_numbers, ...premise_line_numbers]), proof)
    return pruned_proof
}

const system_proof_from_proof_info_map = (i2: SequentMap<ProofInfo>, target_sequent: Sequent): ProofLine[] => {
    const assumptions_map: { [id: string]: number } = {}
    let proof_so_far: ProofLine[] = []
    let line_number_map: SequentMap<number> = new SequentMap()
    for (const [index, { key: sequent, value: proof_info }] of i2.entries.entries()) {
        const new_line_number = index + 1
        if (proof_info.reason === 'Premise' || proof_info.reason === 'Assumption')
            assumptions_map[ast_to_string(sequent.assumptions.entries()[0][1])] = new_line_number
        line_number_map = line_number_map.set(sequent, new_line_number)
        const assumption_lines: number[] = sequent.assumptions.entries().map(([, type]) => assumptions_map[ast_to_string(type)] ?? -1).sort((a, b) => a - b)
        const dependencies: number[] = proof_info.child_sequents.map((cs) => line_number_map.get(cs) ?? -1)
        const new_line = { assumption_lines, reason: proof_info.reason, line_number: new_line_number, dependencies, statement: sequent.conclusion }
        proof_so_far = [...proof_so_far, new_line]
        if (SequentMap.sequent_equals_sequent(sequent, target_sequent))
            break
    }
    const pruned_proof = prune_proof(proof_so_far)
    return pruned_proof
}

export type ProofLineDisplay = { as: string, ln: number, statement: string, reason: string }
const display_proof_line = (line: ProofLine, statement_to_string?: (s: Ast) => string, reason_map?: (reason: string) => string): ProofLineDisplay => ({
    as: line.assumption_lines.map((a) => a === undefined ? 'undefined' : a).join(','),
    ln: line.line_number,
    statement: (defined(statement_to_string) ? statement_to_string : ast_to_string)(line.statement),
    reason: `${line.dependencies.join(',')}${line.dependencies.length === 0 ? '' : ' '}${defined(reason_map) ? reason_map(line.reason) : line.reason}`
})

export const display_proof = (proof: ProofLine[], statement_to_string?: (s: Ast) => string, reason_map?: (reason: string) => string): ProofLineDisplay[] =>
    proof.map((line) => display_proof_line(line, statement_to_string, reason_map))