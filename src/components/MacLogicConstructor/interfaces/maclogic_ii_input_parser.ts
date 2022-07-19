/* eslint-disable @typescript-eslint/no-unused-vars */
import { next_indexed_variable_in_ctx } from 'coastline/src/logical_framework/next_indexed_variable_in_ctx';
import { sequent, Sequent } from 'coastline/src/construction/sequent';
import { AbstractSyntaxTree, Ast } from 'coastline/src/lambda_pi/ast';
import { Ctx, display_ctx } from 'coastline/src/logical_framework/ctx';
import { mk_map } from 'coastline/src/map/RecursiveMap';
import Parsimmon from 'parsimmon'
import { ErrorInAssumptions, ErrorInConclusion, is_error_in_assumptions, SequentError } from '../sequent_error';
import { BoundIndividualConstant, elaborate_maclogic_ast, find_bound_individual_constant_or_free_individual_variable_in_ast, FreeIndividualVariable, is_bound_individual_constant, is_free_individual_variable, is_maclogic_elaboration_error, MacLogicElaborationError } from '../elaborate_maclogic_ast';
import { is_parse_failure, parse } from '../maclogic_parser';
import { display_proven_sequent, ProvenSequent, proven_sequent } from '../proven_sequent';
import { InputParser } from './input_parser';
import { defined } from 'coastline/src/utilities';
import { ml, o } from '../maclogic_shorthands';
import { Sort } from 'coastline/src/logical_framework/sort';

type AstParserError = Parsimmon.Failure

export type MLElaborationErrorV1 = MacLogicElaborationError | undefined | BoundIndividualConstant | FreeIndividualVariable

export class MacLogicIIInputerParser implements InputParser<
    AstParserError,
    MLElaborationErrorV1
> {
    elaborate_ast_with_sort(ctx: Ctx, ast: AbstractSyntaxTree, sort: Sort): ProvenSequent | MLElaborationErrorV1 {
        const poorly_named_individual_error = find_bound_individual_constant_or_free_individual_variable_in_ast(ast)
        if (defined(poorly_named_individual_error))
            return poorly_named_individual_error
        return elaborate_maclogic_ast(proven_sequent(ctx, ast, sort))
    }
    elaborate_ast(ctx: Ctx, ast: AbstractSyntaxTree): ProvenSequent | MLElaborationErrorV1 {
        return this.elaborate_ast_with_sort(ctx, ast, o)
    }
    parse_ast(text: string): Parsimmon.Failure | AbstractSyntaxTree {
        return parse(text)
    }
    parse_and_elaborate_with_ctx(ctx: Ctx, text: string): ProvenSequent | Parsimmon.Failure | MLElaborationErrorV1 {
        const parsed = this.parse_ast(text)
        if (this.is_parse_error(parsed))
            return parsed
        return this.elaborate_ast(ctx, parsed)
    }
    parse_and_elaborate(text: string): Parsimmon.Failure | MLElaborationErrorV1 | ProvenSequent {
        return this.parse_and_elaborate_with_ctx(mk_map(), text)
    }
    parse_and_elaborate_assumption_with_ctx(ctx: Ctx, text: string): Parsimmon.Failure | MLElaborationErrorV1 | Ctx {
        const parsed = this.parse_ast(text)
        if (this.is_parse_error(parsed))
            return parsed
        const elaborated = this.elaborate_ast(ctx, parsed)
        if (this.is_elaboration_error(elaborated))
            return elaborated
        const new_variable = next_indexed_variable_in_ctx(elaborated.assumptions)
        return elaborated.assumptions.add(new_variable.id, ml(elaborated.proof))
    }
    parse_and_elaborate_conclusion_with_ctx(ctx: Ctx, text: string): Parsimmon.Failure | MLElaborationErrorV1 | Sequent {
        const parsed = this.parse_ast(text)
        if (this.is_parse_error(parsed))
            return parsed
        const elaborated = this.elaborate_ast(ctx, parsed)
        if (this.is_elaboration_error(elaborated))
            return elaborated
        return sequent(elaborated.assumptions, ml(elaborated.proof))
    }
    parse_and_elaborate_assumptions_with_ctx(ctx: Ctx, text: string): Ctx | ErrorInAssumptions<Parsimmon.Failure | MLElaborationErrorV1> {
        let current_assumptions = ctx
        const assumption_strings = text.split(',').map((a) => a.trim()).filter((a) => a.length !== 0)
        for (const [index, as] of assumption_strings.entries()) {
            const next_assumptions = this.parse_and_elaborate_assumption_with_ctx(current_assumptions, as)
            if (this.is_parse_error(next_assumptions) || this.is_elaboration_error(next_assumptions))
                return new ErrorInAssumptions(next_assumptions, index)
            current_assumptions = next_assumptions
        }
        return current_assumptions
    }
    parse_and_elaborate_sequent(assumptions_text: string, conclusion_text: string): Sequent | SequentError<Parsimmon.Failure | MLElaborationErrorV1> {
        const elaborated_assumptions = this.parse_and_elaborate_assumptions_with_ctx(mk_map(), assumptions_text)
        if (is_error_in_assumptions(elaborated_assumptions))
            return elaborated_assumptions
        const elaborated_conclusion = this.parse_and_elaborate_conclusion_with_ctx(elaborated_assumptions, conclusion_text)
        if (this.is_parse_error(elaborated_conclusion) || this.is_elaboration_error(elaborated_conclusion))
            return new ErrorInConclusion(elaborated_conclusion)
        return elaborated_conclusion
    }
    is_parse_error(output: unknown): output is Parsimmon.Failure {
        return is_parse_failure(output)
    }
    is_elaboration_error(output: unknown): output is MLElaborationErrorV1 {
        return is_maclogic_elaboration_error(output) || is_bound_individual_constant(output) || is_free_individual_variable(output)
    }
}