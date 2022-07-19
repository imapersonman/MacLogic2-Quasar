import { CheckedProofInsert, check_proof_insert, SubProblem, sub_problem } from 'coastline/src/construction/check_proof_insert'
import { Sig } from 'coastline/src/logical_framework/sig'
import { RelativelyNamedAst } from 'coastline/src/construction/relatively_named_ast'
import { Ast, GeneratedVariable, IndexedMetaVariable, Variable } from 'coastline/src/lambda_pi/ast'
import { sequent, Sequent } from 'coastline/src/construction/sequent'
import { IndexedValue } from 'coastline/src/construction/indexed_value'
import { Ctx } from 'coastline/src/logical_framework/ctx'

export class AssumptionHidingConclusion { constructor(readonly conclusion: Ast, readonly hidden_assumptions: Variable[]) {} }
export const HideAssumption = (conclusion: Ast, hidden_assumptions: Variable[]) => new AssumptionHidingConclusion(conclusion, hidden_assumptions)
export const is_assumption_hiding_conclusion = (a: unknown): a is AssumptionHidingConclusion => a instanceof AssumptionHidingConclusion

export class AssumptionHidingProofInsert { constructor(readonly new_conclusions: (Ast | AssumptionHidingConclusion)[], readonly fragment: RelativelyNamedAst) {} }
export const InsertProof = (new_conclusions: (Ast | AssumptionHidingConclusion)[], fragment: RelativelyNamedAst) => new AssumptionHidingProofInsert(new_conclusions, fragment)
export const is_assumption_hiding_proof_insert = (a: unknown): a is AssumptionHidingProofInsert => a instanceof AssumptionHidingProofInsert

// Works exactly like check_proof_insert, just has to preprocess the input to unwrap the hidden assumptions.
export const check_assumption_hiding_proof_insert = (sig: Sig, ctx: Ctx, goal: Sequent, ahpi: AssumptionHidingProofInsert, m: IndexedValue<IndexedMetaVariable>, v: IndexedValue<GeneratedVariable>): CheckedProofInsert => {
    const new_conclusions = ahpi.new_conclusions.map((conc_or_hiding_conc) =>
        is_assumption_hiding_conclusion(conc_or_hiding_conc) ? conc_or_hiding_conc.conclusion
        : conc_or_hiding_conc)
    return check_proof_insert(sig, ctx, goal, new_conclusions, ahpi.fragment, m, v)
}

export const hide_assumptions_in_problems = (new_conclusions: (Ast | AssumptionHidingConclusion)[], new_problems: SubProblem[]): SubProblem[] => {
    if (new_conclusions.length !== new_problems.length)
        throw new Error(`new_conclusions and new_problems have differen lengths!\nnew_conclusions: ${new_conclusions.length}\nnew_problems: ${new_problems.length}`)
    let output = [] as SubProblem[]
    for (const [index, nc] of new_conclusions.entries()) {
        const np = new_problems[index]
        if (!is_assumption_hiding_conclusion(nc)) { output = [...output, np]; continue }
        for (const ha of nc.hidden_assumptions)
            if (!np.sequent.assumptions.contains(ha.id))
                throw new Error(`Assumptions should contain variable ${ha.id} to hide but it doesn't exist!`)
            else
                output = [...output, sub_problem(np.meta_variable, sequent(np.sequent.assumptions.remove(ha.id), np.sequent.conclusion))]
    }
    return output
}

