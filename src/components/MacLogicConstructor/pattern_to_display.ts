import { match_clause, match_clauses } from 'coastline/src/unification/first_order_match_clauses'
import { Ast, Variable } from 'coastline/src/lambda_pi/ast'
import { unelaborate } from './elaborate'
import { unparse } from './parser'
import { app, con, mvlist, ovlist } from 'coastline/src/lambda_pi/shorthands'
import { exists, forall, ml } from './maclogic_shorthands'
import { is_meta_variable } from 'coastline/src/lambda_pi/utilities'
import { is_match_error, match } from 'coastline/src/unification/first_order_match'

const [X] = mvlist('X')
const [x] = ovlist('x')

export const pattern_to_display = (pattern: Ast): string => {
  const quantifier_clause = (q_name: string, q_func: (x: Variable, body: Ast) => Ast) =>
    match_clause(app(con(q_name), X), (u) => {
      if (is_meta_variable(u('X')))
        return q_func(x, u('X'))
      return unwrapped
    })
  const ml_u = match(ml(X), pattern)
  const unwrapped = is_match_error(ml_u) ? pattern : ml_u['X']
  return unparse(unelaborate(match_clauses(unwrapped, [
    quantifier_clause('exists', exists),
    quantifier_clause('forall', forall)
  ], () => unwrapped)))
}