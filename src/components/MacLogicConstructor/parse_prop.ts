import Parsimmon from 'coastline/node_modules/@types/parsimmon'
import { mk_map } from 'coastline/src/map/RecursiveMap'
import { Ast } from 'coastline/src/lambda_pi/ast'
import { defined } from 'coastline/src/utilities'
import { InputParser } from './interfaces/input_parser'
import { MLElaborationErrorV1 } from './interfaces/maclogic_ii_input_parser'

export const parse_prop = (p: InputParser<Parsimmon.Failure, MLElaborationErrorV1>) => (text: string): Ast | undefined => {
  if (!defined(text))
    return undefined
  if (text.length === 1 && /[a-z]/.test(text))
    return undefined
  const parsed = p.parse_ast(text)
  if (p.is_parse_error(parsed))
    return undefined
  const elaborated = p.elaborate_ast(mk_map(), parsed)
  if (p.is_elaboration_error(elaborated))
    return undefined
  return elaborated.proof
}