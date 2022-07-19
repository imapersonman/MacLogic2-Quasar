import { CoastlineObject, obj } from 'coastline/src/machine/object'
import { ECCTermOVM, ECCTerm } from 'coastline/src/machine/examples'

export const ecc = {
  prop: obj<ECCTermOVM, 'ECCProp'>('ECCProp', undefined),
  type: (order: number) => obj<ECCTermOVM, 'ECCType'>('ECCType', order),
  var: (id: string) => obj<ECCTermOVM, 'ECCVariable'>('ECCVariable', id),
  sd: (index: number) => obj<ECCTermOVM, 'ECCSD'>('ECCSD', index),
  vars: (...ids: string[]) => ids.map((id) => obj<ECCTermOVM, 'ECCVariable'>('ECCVariable', id)),
  app: (head: CoastlineObject<ECCTermOVM, ECCTerm>, arg: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCApplication'>('ECCApplication', { head, arg }),
  arrow: (input: CoastlineObject<ECCTermOVM, ECCTerm>, output: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCArrow'>('ECCArrow', { input, output }),
  product: (left: CoastlineObject<ECCTermOVM, ECCTerm>, right: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCProduct'>('ECCProduct', { left, right }),
  pi: (bound: CoastlineObject<ECCTermOVM, 'ECCVariable'>, bound_type: CoastlineObject<ECCTermOVM, ECCTerm>, scope: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCPi'>('ECCPi', { bound, bound_type, scope }),
  la: (bound: CoastlineObject<ECCTermOVM, 'ECCVariable'>, bound_type: CoastlineObject<ECCTermOVM, ECCTerm>, scope: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCLambda'>('ECCLambda', { bound, bound_type, scope }),
  si: (bound: CoastlineObject<ECCTermOVM, 'ECCVariable'>, bound_type: CoastlineObject<ECCTermOVM, ECCTerm>, scope: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCSigma'>('ECCSigma', { bound, bound_type, scope }),
  pair: (pair_type: CoastlineObject<ECCTermOVM, ECCTerm>, left: CoastlineObject<ECCTermOVM, ECCTerm>, right: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCPair'>('ECCPair', { pair_type, left, right }),
  project: (project: 'left' | 'right', pair: CoastlineObject<ECCTermOVM, ECCTerm>) => obj<ECCTermOVM, 'ECCProject'>('ECCProject', { project, pair })
}

export const ecc_examples = [
  ecc.prop,
  ecc.type(0),
  ecc.type(13),
  ecc.var('x'),
  ecc.var('cool'),
  ecc.sd(0),
  ecc.sd(13),
  ecc.app(ecc.var('x'), ecc.var('y')),
  ecc.app(ecc.app(ecc.var('x'), ecc.var('y')), ecc.var('z')),
  ecc.app(ecc.app(ecc.var('x'), ecc.var('y')), ecc.app(ecc.var('w'), ecc.var('z'))),
  ecc.app(ecc.app(ecc.var('x'), ecc.var('y')), ecc.app(ecc.var('w'), ecc.var('x'))),
  ecc.arrow(ecc.var('A'), ecc.var('B')),
  ecc.product(ecc.var('A'), ecc.var('B')),
  ecc.pi(ecc.var('a'), ecc.var('b'), ecc.var('c')),
  ecc.pi(ecc.var('a'), ecc.var('a'), ecc.var('c')),
  ecc.pi(ecc.var('a'), ecc.var('b'), ecc.var('a')),
  ecc.la(ecc.var('a'), ecc.var('b'), ecc.var('c')),
  ecc.la(ecc.var('a'), ecc.var('a'), ecc.var('c')),
  ecc.la(ecc.var('a'), ecc.var('b'), ecc.var('a')),
  ecc.si(ecc.var('a'), ecc.var('b'), ecc.var('c')),
  ecc.si(ecc.var('a'), ecc.var('a'), ecc.var('c')),
  ecc.si(ecc.var('a'), ecc.var('b'), ecc.var('a')),
  ecc.pair(ecc.var('A'), ecc.var('M'), ecc.var('N')),
  ecc.project('left', ecc.var('M')),
  ecc.project('right', ecc.var('M')),
  ecc.pair(ecc.product(ecc.var('A'), ecc.var('B')), ecc.project('left', ecc.var('M')), ecc.project('right', ecc.var('N'))),
  ecc.la(ecc.var('x'), ecc.var('x'), ecc.var('x')),
  ecc.pi(ecc.var('x'), ecc.prop, ecc.app(ecc.la(ecc.var('y'), ecc.prop, ecc.app(ecc.var('y'), ecc.si(ecc.var('z'), ecc.prop, ecc.var('z')))), ecc.la(ecc.var('z'), ecc.prop, ecc.app(ecc.var('x'), ecc.var('z')))))
]

