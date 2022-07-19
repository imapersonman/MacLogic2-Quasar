import { Ast } from 'coastline/src/lambda_pi/ast';
import { display_sort, is_sort, Sort } from 'coastline/src/logical_framework/sort';
import { Ctx, display_ctx } from 'coastline/src/logical_framework/ctx';
import { ast_to_string, is_ast } from 'coastline/src/lambda_pi/utilities';
import { RecursiveMap } from 'coastline/src/map/RecursiveMap';
import { defined } from 'coastline/src/utilities';

export interface ProvenSequent { assumptions: Ctx, proof: Ast, sort: Sort }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const is_proven_sequent = (p: any): p is ProvenSequent => defined(p) && ('assumptions' in p) && ('proof' in p) && ('sort' in p) && (p.assumptions instanceof RecursiveMap) && is_ast(p.proof) && is_sort(p.sort)
export const proven_sequent = (assumptions: Ctx, proof: Ast, sort: Sort): ProvenSequent => ({ assumptions, proof, sort })
export const display_proven_sequent = ({ assumptions, proof, sort }: ProvenSequent) => ({
    assumptions: display_ctx(assumptions),
    proof: ast_to_string(proof),
    sort: display_sort(sort)
})