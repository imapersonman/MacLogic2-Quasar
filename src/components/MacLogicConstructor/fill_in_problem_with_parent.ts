import { SubProblem, sub_problem } from 'coastline/src/construction/check_proof_insert';
import { sequent, Sequent } from 'coastline/src/construction/sequent';

export const fill_in_problem_with_parent = (parent: Sequent, partial: SubProblem): SubProblem =>
    sub_problem(partial.meta_variable, sequent(partial.sequent.assumptions.union(parent.assumptions), partial.sequent.conclusion))
