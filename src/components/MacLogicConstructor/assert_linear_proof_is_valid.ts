import { Ast, Lambda, Variable } from 'coastline/src/lambda_pi/ast'
import { contains } from 'coastline/src/lambda_pi/contains'
import { defined, last } from 'coastline/src/utilities'
import { display_proof, ProofLine } from './linear_proof2'
import { union, isEqual } from 'lodash'
import { first_position_at_ast, get_ast_at } from 'coastline/src/lambda_pi/position'
import { ast_in, ast_to_string, is_lambda, is_variable } from 'coastline/src/lambda_pi/utilities'
import { beta_eta_equality } from 'coastline/src/lambda_pi/beta_eta_equality'
import { possibly_beta_reduce } from 'coastline/src/lambda_pi/to_beta_normal_form'
import { syntactic_equality } from 'coastline/src/lambda_pi/syntactic_equality'
import { unify } from 'coastline/src/unification/shorthands'
import { apply_substitution_ast, is_unification_error } from 'coastline/src/unification/first_order'
import { unwrap_ml } from './unwrap_ml'
import { is_match_error, match } from 'coastline/src/unification/first_order_match'
import { app, con, mvlist } from 'coastline/src/lambda_pi/shorthands'
import { absurd, and, iff, imp, not, or } from './maclogic_shorthands'
import { Sequent } from 'coastline/src/construction/sequent'
import { ml_wrapped } from './ml_wrapped'

const [X, Y] = mvlist('X', 'Y')

type LineMap = { [ln: number]: ProofLine }
export const assert_linear_proof_is_valid = (p: ProofLine[], for_sequent: Sequent): void => {
    const line_was_premise_or_assumption = (line: ProofLine): boolean => line.reason === 'Premise' || line.reason === 'Assumption'
    const check_proof_line = (line_map: LineMap, line: ProofLine): void => {
        if (line_was_premise_or_assumption(line)) {
            if (line.assumption_lines.length !== 1)
                throw new Error('Premise/Assumption has a number of assumptions other than 1')
            if (line.assumption_lines[0] !== line.line_number)
                throw new Error(`Premise/Assumption line does not assume itself in\n${JSON.stringify(display_proof(p))}`)
            if (line.dependencies.length !== 0)
                throw new Error('Premise/Assumption line depends on other lines')
            return undefined
        }
        const expected_dependencies_length_for_reason: { [reaon: string]: number } = {
            'Premise': 0,
            'Assumption': 0,
            'andel': 1,
            'ander': 1,
            'impe': 2,
            'impi': 2,
            'foralle': 1,
            'foralli': 1,
            'existsi': 1,
            'existse': 3,
            'note': 2
        }
        const assumption_lines_avoid_variable = (line_map: LineMap, assumptions: number[], variable: Variable): void => {
            for (const as of assumptions) {
                const line = line_map[as]
                if (!defined(line))
                    throw new Error(`Can't find given assumption line ${as}`)
                const statement = line.statement
                if (contains(statement, variable))
                    throw new Error(`Assumption reference ${as}, which looks like ${ast_to_string(statement)}, does not avoid the variable ${variable.id}`)
            }
        }
        const assert_ast_is_instance_of_lambda = (intended_instance: Ast, original_lambda: Lambda, reason: string): Variable  => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const var_position = first_position_at_ast(original_lambda.scope, original_lambda.bound)!
            const actual_var = get_ast_at(intended_instance, var_position)
            if (!defined(actual_var) || !is_variable(actual_var) || !beta_eta_equality(possibly_beta_reduce(original_lambda, actual_var), intended_instance))
                throw new Error(`${reason}: ${ast_to_string(intended_instance)} is not an instance of ${ast_to_string(original_lambda)}`)
            return actual_var
        }
        const assert_ast_looks_like = (for_reason: string, ast: Ast, ast_name: string, looks_like: Ast) => {
            if (!syntactic_equality(ast, looks_like))
                throw new Error(`${for_reason} ${ast_name} should look like\n${ast_to_string(looks_like)}\nbut instead looks like\n${ast_to_string(ast)}`)
        }
        const assert_ast_unifies_with = (for_reason: string, ast: Ast, ast_name: string, pattern: Ast) => {
            // assuming mvs(ast) and mvs(pattern) are disjoint
            const u = unify(pattern, ast)
            if (is_unification_error(u))
                throw new Error(`${for_reason} ${ast_name} should look like\n${ast_to_string(pattern)}\nbut instead looks like\n${ast_to_string(ast)}`)
            return u
        }
        const assert_dependency_was_assumed = (for_reason: string, line_map: LineMap, current_line: ProofLine, dependency_index: number) => {
            const dependency_reason = line_map[current_line.dependencies[dependency_index]].reason
            // I don't think it's a problem if what is supposed to be an assumption is actually a premise.
            // Adding the `dependency_reason !== 'Premise'` clause will fix a kind of error that I've only
            // seen occur when an assumption referenced by ore can only find a premise.
            if (dependency_reason !== 'Assumption' && dependency_reason !== 'Premise')
                throw new Error(`${for_reason} dependecy ${dependency_index} should be 'Assumption' but is instead ${dependency_reason}`)
        }
        const without_line = (line_list: number[], without: number): number[] => line_list.filter((ln) => ln !== without)

        const exp_dep_count = expected_dependencies_length_for_reason[line.reason]
        if (defined(exp_dep_count) && line.dependencies.length !== exp_dep_count)
            throw new Error(`for reason ${line.reason}, the expected number of dependencies ${exp_dep_count} does not equal the actual number of dependencies ${line.dependencies.length}`)
        for (const dep of line.dependencies)
            if (!line_map[dep])
                throw new Error(`Dependency ${dep} either does not occur in the proof or occurs after the current line`)
        // calculate before the clauses in case we're looking at Sequent/Theorem lines that aren't explicitly dealt with here.
        let expected_assumptions: number[] = line.dependencies.reduce((acc, dep) => union(acc, line_map[dep].assumption_lines), [] as number[])
        const statement = unwrap_ml(line.statement)
        if (line.reason === 'foralle') {
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const d_u = match(app(con('forall'), X), dep1)
            if (is_match_error(d_u) || !is_lambda(d_u['X']))
                throw new Error(`first foralle dependency should be a universal quantifier but instead looks like ${ast_to_string(dep1)}`)
            assert_ast_is_instance_of_lambda(statement, d_u['X'], 'foralle')
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'foralli') {
            const s_u = match(app(con('forall'), X), statement)
            if (is_match_error(s_u) || !is_lambda(s_u['X']))
                throw new Error(`foralli statement should be a universal quantifier but instead looks like ${ast_to_string(statement)}`)
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const new_var = assert_ast_is_instance_of_lambda(dep1, s_u['X'], 'foralli')
            assumption_lines_avoid_variable(line_map, line.assumption_lines, new_var)
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'existsi') {
            const s_u = match(app(con('exists'), X), statement)
            if (is_match_error(s_u) || !is_lambda(s_u['X']))
                throw new Error(`existsi statement should be an existential quantifier but instead looks like ${ast_to_string(statement)}`)
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            assert_ast_is_instance_of_lambda(dep1, s_u['X'], 'foralli')
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'existse') {
            const existential_dep = unwrap_ml(line_map[line.dependencies[0]].statement)
            const d_u = match(app(con('exists'), X), existential_dep)
            if (is_match_error(d_u) || !is_lambda(d_u['X']))
                throw new Error(`first existse dependency should be an existential quantifier but instead looks like ${ast_to_string(existential_dep)}`)
            const assumption_dep = unwrap_ml(line_map[line.dependencies[1]].statement)
            if (!line_was_premise_or_assumption(line_map[line.dependencies[1]]))
                throw new Error(`second existse dependency should be an assumption but instead its given reason is ${line_map[line.dependencies[1]].reason}`)
            // checking conclusion dep first so we can just return if the bound var was not found in the existential dependency
            const conclusion_dep = unwrap_ml(line_map[line.dependencies[2]].statement)
            if (!beta_eta_equality(conclusion_dep, statement))
                throw new Error(`third existse dependency ${ast_to_string(conclusion_dep)} should be equal to the current line's statement ${ast_to_string(statement)}`)
            const new_var = assert_ast_is_instance_of_lambda(assumption_dep, d_u['X'], 'existse')
            assumption_lines_avoid_variable(line_map, [line_map[line.dependencies[0]].line_number, line_map[line.dependencies[2]].line_number, ...line.assumption_lines], new_var)
            expected_assumptions = union(
                line_map[line.dependencies[0]].assumption_lines,
                without_line(line_map[line.dependencies[2]].assumption_lines, line.dependencies[1])
            )
        } else if (line.reason === 'andel') {
            const dep = unwrap_ml(line_map[line.dependencies[0]].statement)
            const conjunct_u = assert_ast_unifies_with('andel', dep, 'dependency', and(X, Y))
            assert_ast_looks_like('ande', statement, 'statement', conjunct_u['X'])
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'ander') {
            const dep = unwrap_ml(line_map[line.dependencies[0]].statement)
            const conjunct_u = assert_ast_unifies_with('ander', dep, 'dependency', and(X, Y))
            assert_ast_looks_like('ande', statement, 'statement', conjunct_u['Y'])
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'andi') {
            const u = assert_ast_unifies_with('andi', statement, 'statement', and(X, Y))
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const dep2 = unwrap_ml(line_map[line.dependencies[1]].statement)
            assert_ast_looks_like('andi', dep1, 'dependency 0', u['X'])
            assert_ast_looks_like('andi', dep2, 'dependency 1', u['Y'])
            expected_assumptions = union(
                line_map[line.dependencies[0]].assumption_lines,
                line_map[line.dependencies[1]].assumption_lines
            )
        } else if (line.reason === 'impe') {
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const maj_u = assert_ast_unifies_with('impe', dep1, 'dependency 0', imp(X, Y))
            const dep2 = unwrap_ml(line_map[line.dependencies[1]].statement)
            assert_ast_looks_like('impe', dep2, 'dependency 1', maj_u['X'])
            assert_ast_looks_like('impe', statement, 'statement', maj_u['Y'])
            expected_assumptions = union(
                line_map[line.dependencies[0]].assumption_lines,
                line_map[line.dependencies[1]].assumption_lines
            )
        } else if (line.reason === 'impi') {
            const s_u = assert_ast_unifies_with('impi', statement, 'statement', imp(X, Y))
            assert_dependency_was_assumed('impi', line_map, line, 0)
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            assert_ast_looks_like('impi', dep1, 'dependency 0', s_u['X'])
            const dep2 = unwrap_ml(line_map[line.dependencies[1]].statement)
            assert_ast_looks_like('impi', dep2, 'dependency 1', s_u['Y'])
            expected_assumptions = without_line(line_map[line.dependencies[1]].assumption_lines, line.dependencies[0])
        } else if (line.reason === 'note') {
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const maj_u = assert_ast_unifies_with('note', dep1, 'dependency 0', not(X))
            const dep2 = unwrap_ml(line_map[line.dependencies[1]].statement)
            assert_ast_looks_like('note', dep2, 'dependency 1', maj_u['X'])
            assert_ast_looks_like('note', statement, 'statement', absurd)
            expected_assumptions = union(
                line_map[line.dependencies[0]].assumption_lines,
                line_map[line.dependencies[1]].assumption_lines
            )
        } else if (line.reason === 'noti') {
            const s_u = assert_ast_unifies_with('noti', statement, 'statement', not(X))
            assert_dependency_was_assumed('noti', line_map, line, 0)
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            assert_ast_looks_like('noti', dep1, 'dependency 0', s_u['X'])
            const dep2 = unwrap_ml(line_map[line.dependencies[1]].statement)
            assert_ast_looks_like('noti', dep2, 'dependency 1', absurd)
            expected_assumptions = without_line(line_map[line.dependencies[1]].assumption_lines, line.dependencies[0])
        } else if (line.reason === 'dn') {
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const d_u = assert_ast_unifies_with('dn', dep1, 'dependency 0', not(not(X)))
            assert_ast_looks_like('dn', statement, 'statement', d_u['X'])
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'oril') {
            const s_u = assert_ast_unifies_with('oril', statement, 'statement', or(X, Y))
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            assert_ast_looks_like('oril', dep1, 'dependency 0', s_u['X'])
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'orir') {
            const s_u = assert_ast_unifies_with('orir', statement, 'statement', or(X, Y))
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            assert_ast_looks_like('orir', dep1, 'dependency 0', s_u['Y'])
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'ore') {
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const d1_u = assert_ast_unifies_with('ore', dep1, 'dependency 0', or(X, Y))
            const dep2 = unwrap_ml(line_map[line.dependencies[1]].statement)
            assert_ast_looks_like('ore', dep2, 'dependency 1', d1_u['X'])
            assert_dependency_was_assumed('ore', line_map, line, 1)
            const dep3 = unwrap_ml(line_map[line.dependencies[2]].statement)
            assert_ast_looks_like('ore', dep3, 'dependency 2', statement)
            const dep4 = unwrap_ml(line_map[line.dependencies[3]].statement)
            assert_ast_looks_like('ore', dep4, 'dependency 3', d1_u['Y'])
            assert_dependency_was_assumed('ore', line_map, line, 3)
            const dep5 = unwrap_ml(line_map[line.dependencies[4]].statement)
            assert_ast_looks_like('ore', dep5, 'dependency 4', statement)
            expected_assumptions = union(
                line_map[line.dependencies[0]].assumption_lines,
                without_line(line_map[line.dependencies[2]].assumption_lines, line.dependencies[1]),
                without_line(line_map[line.dependencies[4]].assumption_lines, line.dependencies[3]),
            )
        } else if (line.reason === 'dfl') {
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const d1_u = assert_ast_unifies_with('dfl', dep1, 'dependency 0', iff(X, Y))
            assert_ast_looks_like('dfl', statement, 'statement', apply_substitution_ast(d1_u, and(imp(X, Y), imp(Y, X))))
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        } else if (line.reason === 'dfr') {
            const dep1 = unwrap_ml(line_map[line.dependencies[0]].statement)
            const d1_u = assert_ast_unifies_with('dfr', dep1, 'dependency 0', and(imp(X, Y), imp(Y, X)))
            assert_ast_looks_like('dfr', statement, 'statement', apply_substitution_ast(d1_u, iff(X, Y)))
            expected_assumptions = line_map[line.dependencies[0]].assumption_lines
        }
        expected_assumptions.sort((a, b) => a - b)
        if (!isEqual(line.assumption_lines, expected_assumptions))
            throw new Error(`Line ${line.line_number}: Expected assumptions ${JSON.stringify(expected_assumptions)} different from actual assumptions ${JSON.stringify(line.assumption_lines)}\nProof:\n${JSON.stringify(display_proof(p))}`)
        // else 
        //     throw new Error(`Haven't implemented reason '${line.reason}'`)
    }
    const line_map: LineMap = {}
    for (const line of p) {
        check_proof_line(line_map, line)
        line_map[line.line_number] = line
    }
    const p_premises = p.filter(({ reason }) => reason === 'Premise')
    const p_premises_string = p_premises.map(({ statement }) => ast_to_string(statement)).join(', ')
    const expected_premises = for_sequent.assumptions.entries().reduce<Ast[]>((acc, [, type]) => ast_in(type, acc) ? acc : [...acc, type], [])
    const expected_premises_string = expected_premises.filter(ml_wrapped).map((type) => ast_to_string(type)).join(', ')
    if (p_premises_string !== expected_premises_string)
        throw new Error(`Actual proof premises\n${p_premises_string}\nare different than the expected premises \n${expected_premises_string} in proof\n${JSON.stringify(display_proof(p))}`)
    // The conclusion is valid iff it occurs as one of the premises XOR it appears in the last line.
    if (defined(p_premises.find(({ statement }) => syntactic_equality(for_sequent.conclusion, statement))))
        // then the conclusion appears in the premises so we should not be complaining.
        return
    const expected_conclusion_string = ast_to_string(for_sequent.conclusion)
    const p_conclusion_string = ast_to_string(last(p).statement)
    if (p_conclusion_string !== expected_conclusion_string)
        throw new Error(`Actual proof conclusion\n${p_conclusion_string}\nis different than the expected conclusion\n${expected_conclusion_string}\nFull Proof:\n${JSON.stringify(display_proof(p))}`)
}