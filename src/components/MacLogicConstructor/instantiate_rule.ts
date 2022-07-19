import { is_pi } from 'coastline/src/lambda_pi/utilities'
import { Ast } from 'coastline/src/lambda_pi/ast'
import { try_match } from 'coastline/src/unification/shorthands'
import { ml, o } from './maclogic_shorthands'
import { con, mvlist } from 'coastline/src/lambda_pi/shorthands'
import { syntactic_equality } from 'coastline/src/lambda_pi/syntactic_equality'
import { Substitution } from 'coastline/src/unification/first_order'
import { defined } from 'coastline/src/utilities'
import { substitute } from 'coastline/src/lambda_pi/substitute'
import { SequentOrTheoremId, sig } from './construction_interaction'

const [X] = mvlist('X')

export const instantiate_rule = (s_or_t_id: SequentOrTheoremId, sub: Substitution): [Ast[], Ast] => {
    const rule = sig.lookup(con(s_or_t_id)) as Ast
    return instantiate_rule_directly(rule, sub)
}

export const instantiate_rule_directly = (rule: Ast, sub: Substitution): [Ast[], Ast] => {
    const instantiate_rule_acc = (assumptions_acc: Ast[], inner_rule: Ast): [Ast[], Ast] => {
        if (!is_pi(inner_rule))
            return [assumptions_acc, try_match(ml(X), inner_rule)['X']]
        if (syntactic_equality(inner_rule.type, o)) {
            const replacement = sub[inner_rule.bound.get_base_id()]
            if (!defined(replacement))
                throw new Error(`${inner_rule.bound.get_base_id()} does not have a substitution:\n${JSON.stringify(sub)}`)
            const continued_rule = substitute(inner_rule.bound, replacement, inner_rule.scope)
            return instantiate_rule_acc(assumptions_acc, continued_rule)
        }
        const assumption = try_match(ml(X), inner_rule.type)['X']
        return instantiate_rule_acc([...assumptions_acc, assumption], inner_rule.scope)
    }
    return instantiate_rule_acc([], rule)
}