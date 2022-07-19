import { defined } from 'coastline/src/utilities'
import { ov } from 'coastline/src/lambda_pi/shorthands'
import { mk_map } from 'coastline/src/map/RecursiveMap'
import { elaborate_s, is_elaboration_error } from './elaborate'
import { o } from './maclogic_shorthands'
import { is_parse_failure, parse } from './parser'
import { ProvenSequentSubstitution } from './construction_interaction'
import { proven_sequent } from './proven_sequent'

export const parse_sequent_substitution = (required_keys: string[], substitutions: { [variable_id: string]: string }): ProvenSequentSubstitution => {
    const id_to_proven_sequent = (id: string) => proven_sequent(mk_map([id, o]), ov(id), o)
    const sub = Object.entries(substitutions).reduce<ProvenSequentSubstitution>((acc, [id, ast_string]) => {
        // const parsed = parse_prop(ast_string)
        const parsed = parse(ast_string)
        if (is_parse_failure(parsed))
            return { ...acc, [id]: id_to_proven_sequent(id) }
        const elaborated = elaborate_s(parsed)
        if (is_elaboration_error(elaborated))
            return { ...acc, [id]: id_to_proven_sequent(id) }
        return { ...acc, [id]: elaborated }
    }, {})
    return required_keys.reduce((acc, key) => (!defined(acc[key]) ? { ...acc, [key]: id_to_proven_sequent(key) } : acc), sub)
}