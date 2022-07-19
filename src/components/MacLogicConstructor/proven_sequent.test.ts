import { sequent } from 'coastline/src/construction/sequent'
import { type_k } from 'coastline/src/lambda_pi/shorthands'
import { kind_s } from 'coastline/src/logical_framework/sort'
import { mk_map } from 'coastline/src/map/RecursiveMap'
import { is_proven_sequent, proven_sequent } from './proven_sequent'

describe('is_proven_sequent', () => {
    test('arbitrary true', () => expect(is_proven_sequent(proven_sequent(mk_map(), type_k, kind_s))).toBeTruthy())
    test('arbitrary false', () => expect(is_proven_sequent(sequent(mk_map(), type_k))).toBeFalsy())
    test('undefined', () => expect(is_proven_sequent(undefined)).toBeFalsy())
})