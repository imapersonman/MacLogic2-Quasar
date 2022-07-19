import { Sequent } from 'coastline/src/construction/sequent';
import { Ast } from 'coastline/src/lambda_pi/ast'

export interface LogicDisplay<AstD, SequentD, CurrentProblemD, TacticD> {
    ast_to_display(ast: Ast): AstD
    sequent_to_display(seq: Sequent): SequentD
    current_problem_to_display(seq: Sequent): CurrentProblemD
    tactic_to_display(t: string): TacticD
}