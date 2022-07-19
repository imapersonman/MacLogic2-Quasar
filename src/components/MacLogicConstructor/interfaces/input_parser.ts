import { Sort } from 'coastline/src/logical_framework/sort';
import { Sequent } from 'coastline/src/construction/sequent';
import { Ast } from 'coastline/src/lambda_pi/ast';
import { Ctx } from 'coastline/src/logical_framework/ctx';
import { ProvenSequent } from '../proven_sequent';
import { ErrorInAssumptions, SequentError } from '../sequent_error';

export interface InputParser<AstPError, ElaborationError> {
    elaborate_ast(ctx: Ctx, ast: Ast): ProvenSequent | ElaborationError
    elaborate_ast_with_sort(ctx: Ctx, ast: Ast, sort: Sort): ProvenSequent | ElaborationError
    parse_ast(text: string): Ast | AstPError
    parse_and_elaborate_with_ctx(ctx: Ctx, text: string): ProvenSequent | AstPError | ElaborationError
    parse_and_elaborate(text: string): ProvenSequent | AstPError | ElaborationError
    parse_and_elaborate_assumption_with_ctx(ctx: Ctx, text: string): Ctx | AstPError | ElaborationError
    parse_and_elaborate_assumptions_with_ctx(ctx: Ctx, text: string): Ctx | ErrorInAssumptions<AstPError | ElaborationError>
    parse_and_elaborate_conclusion_with_ctx(ctx: Ctx, text: string): Sequent | AstPError | ElaborationError
    parse_and_elaborate_sequent(assumptions_text: string, conclusion_text: string): Sequent | SequentError<AstPError | ElaborationError>
    is_parse_error(output: unknown): output is AstPError
    is_elaboration_error(output: unknown): output is ElaborationError
}

// different ways I want to parse:
// - parse_and_elaborate<AstPError>(text: string): ProvenSequent | AstPError
// - parse_and_elaborate_assumption_from_ctx<AstPError>(previous_ctx: Ctx, text: string): Ctx | AstPError
// - parse_and_elaborate_conclusion_from_ctx<AstPError>(previous_ctx: Ctx, text: string): Ast | AstPError
// - parse_and_elaborate_sequent<AstPError>(text: string): Sequent | SequentError<AstPError>