import { Ast } from 'coastline/src/lambda_pi/ast';
import { Sequent } from 'coastline/src/construction/sequent';
import { elaborate_s, elaborate_sequent, is_elaboration_error, unelaborate, unelaborate_sequent } from './elaborate';
import { is_parse_failure, parse, parse_sequent, unparse, unparse_sequent } from './parser';
import { is_sequent_error } from './sequent_error';
import { ProvenSequent } from './proven_sequent';

export const try_parse_then_elaborate_sequent = (assumptions_t: string, conclusion_t: string): Sequent => {
    const parsed = parse_sequent(assumptions_t, conclusion_t)
    if (is_sequent_error(parsed))
        throw new Error(`parser error: ${JSON.stringify(parsed)}`)
    const elaborated = elaborate_sequent(parsed[0], parsed[1])
    if (is_sequent_error(elaborated))
        throw new Error(`sequent error: ${JSON.stringify(elaborated)}`)
    return elaborated
}

export const unelaborate_then_unparse_sequent = (seq: Sequent): string => {
    const unelaborated = unelaborate_sequent(seq)
    return unparse_sequent(unelaborated[0], unelaborated[1])
}

export const try_parse_then_elaborate = (text: string): ProvenSequent => {
    const parsed = parse(text)
    if (is_parse_failure(parsed))
        throw new Error(`parser error: ${JSON.stringify(parsed)}`)
    const elaborated = elaborate_s(parsed)
    if (is_elaboration_error(elaborated))
        throw new Error(`redeclared variable: ${JSON.stringify(elaborated)}`)
    return elaborated
}

export const unelaborate_then_unparse = (ast: Ast): string =>
    unparse(unelaborate(ast))