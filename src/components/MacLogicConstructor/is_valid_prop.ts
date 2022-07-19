import Parsimmon from 'parsimmon'
import { defined } from 'coastline/src/utilities'
import { InputParser } from './interfaces/input_parser'
import { parse_prop } from './parse_prop'
import { MLElaborationErrorV1 } from './interfaces/maclogic_ii_input_parser'

export const is_valid_prop_string = (p: InputParser<Parsimmon.Failure, MLElaborationErrorV1>) => (ast: string): boolean => {
  return defined(parse_prop(p)(ast))
}

export const is_valid_prop_list_string = (p: InputParser<Parsimmon.Failure, MLElaborationErrorV1>) => (list: string): boolean => {
  return list.length === 0 || list.split(',').every((prop) => defined(parse_prop(p)(prop.trim())))
}