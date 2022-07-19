import { Sequent, sequent_to_string } from 'coastline/src/construction/sequent';
import { Ast } from 'coastline/src/lambda_pi/ast';
import { ast_to_string } from 'coastline/src/lambda_pi/utilities';
import { LogicDisplay } from './interfaces/logic_display';

export class LambdaPiDisplay implements LogicDisplay<
    string,
    string,
    { assumptions: string[], conclusion: string },
    string
> {
    sequent_to_display(seq: Sequent): string {
        return sequent_to_string(seq)
    }

    current_problem_to_display(seq: Sequent): { assumptions: string[]; conclusion: string; } {
        return {
            assumptions: seq.assumptions.entries().map(([id, type]) => `${id}: ${ast_to_string(type)}`),
            conclusion: ast_to_string(seq.conclusion)
        }
    }

    tactic_to_display(t: string): string {
        return t
    }

    ast_to_display(ast: Ast): string {
        return ast_to_string(ast)
    }
}