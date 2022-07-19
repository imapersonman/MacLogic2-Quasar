/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CoastlineObject } from 'coastline/src/machine/object'
import { ECCBinder, ECCTerm, ECCTermOVM } from 'coastline/src/machine/examples'
import { ecc } from './ecc_terms'
import { parse } from './ecc_term_parser'

const [a, b, c, d, x, y] = ecc.vars('a', 'b', 'c', 'd', 'x', 'y')

describe('ECC parse', () => {
    test('Prop', () => expect(parse('Prop')).toEqual(ecc.prop))
    test('untrimmed Prop', () => expect(parse(' \n\tProp')).toEqual(ecc.prop))
    test('Type 0', () => expect(parse('Type 0')).toEqual(ecc.type(0)))
    test('untrimmed Type 13', () => expect(parse('Type \n\t                 13')).toEqual(ecc.type(13)))
    test('\\0', () => expect(parse('\\0')).toEqual(ecc.sd(0)))
    test('\\13', () => expect(parse('\\13')).toEqual(ecc.sd(13)))
    test('c', () => expect(parse('c')).toEqual(c))
    test('(((((c)))))', () => expect(parse('(((((c)))))')).toEqual(c))
    test('b', () => expect(parse('b')).toEqual(b))
    test('b c', () => expect(parse('b c')).toEqual(ecc.app(b, c)))
    test('untrimmed b c ', () => expect(parse(' \nb   \t\t\t   \n c  ')).toEqual(ecc.app(b, c)))
    test('a c', () => expect(parse('a c')).toEqual(ecc.app(a, c)))
    test('a b c d', () => expect(parse('a b c d')).toEqual(ecc.app(ecc.app(ecc.app(a, b), c), d)))
    test('(c b) (b c)', () => expect(parse('(c b) (b c)')).toEqual(ecc.app(ecc.app(c, b), ecc.app(b, c))))
    test('a (b (c d))', () => expect(parse('a (b (c d))')).toEqual(ecc.app(a, ecc.app(b, ecc.app(c, d)))))
    test('(Type 0) (Type 13)', () => expect(parse('(Type 0) (Type 13)')).toEqual(ecc.app(ecc.type(0), ecc.type(13))))

    const test_binder = (b_id: string, c: (b: CoastlineObject<ECCTermOVM, 'ECCVariable'>, t: CoastlineObject<ECCTermOVM, ECCTerm>, s: CoastlineObject<ECCTermOVM, ECCTerm>) => CoastlineObject<ECCTermOVM, ECCBinder>) => {
        test(`${b_id}(x : Type 0).y`, () => expect(parse(`${b_id}(x : Type 0).y`)).toEqual(c(x, ecc.type(0), y)))
        test(`      ${b_id}    (     x       :       Type   0 )  .   y   `, () => expect(parse(`      ${b_id}    (     x       :       Type   0 )  .   y   `)).toEqual(c(x, ecc.type(0), y)))
        test(`${b_id}(x:Type 0).y`, () => expect(parse(`${b_id}(x:Type 0).y`)).toEqual(c(x, ecc.type(0), y)))
    }

    test_binder('L', ecc.la)
    test_binder('λ', ecc.la)
    test_binder('P', ecc.pi)
    test_binder('Π', ecc.pi)
    test_binder('S', ecc.si)
    test_binder('Σ', ecc.si)

    const test_binary_type = (t_id: string, c: (l: CoastlineObject<ECCTermOVM, ECCTerm>, r: CoastlineObject<ECCTermOVM, ECCTerm>) => CoastlineObject<ECCTermOVM, ECCTerm>) => {
        test(`a ${t_id} b`, () => expect(parse(`a ${t_id} b`)).toEqual(c(a, b)))
        test(` \na    \t\t\t\t\t\n ${t_id} \n b `, () => expect(parse(` \na    \t\t\t\t\t\n ${t_id} \n b `)).toEqual(c(a, b)))
        test(`(a ${t_id} b) ${t_id} ((a ${t_id} b)${t_id} (c))`, () => expect(parse(`(a ${t_id} b) ${t_id} ((a ${t_id} b)${t_id} (x))`)).toEqual(c(c(a, b), c(c(a, b), x))))
    }

    test_binary_type('→', ecc.arrow)
    test_binary_type('->', ecc.arrow)
    test_binary_type('×', ecc.product)
    test_binary_type('\\times', ecc.product)

    const test_projection = (p_id: string, c: (t: CoastlineObject<ECCTermOVM, ECCTerm>) => CoastlineObject<ECCTermOVM, ECCTerm>) => {
        test(`${p_id}(x)`, () => expect(parse(`${p_id}(x)`)).toEqual(c(x)))
        test(` ${p_id} ( x ) `, () => expect(parse(` ${p_id} ( x ) `)).toEqual(c(x)))
        test(`${p_id}(${p_id}(y))`, () => expect(parse(`${p_id}(${p_id}(y))`)).toEqual(c(c(y))))
    }

    test_projection('π₁', (t) => ecc.project('left', t))
    test_projection('pi_1', (t) => ecc.project('left', t))
    test_projection('π₂', (t) => ecc.project('right', t))
    test_projection('pi_2', (t) => ecc.project('right', t))

    test('pair<a>(b, c)', () => expect(parse('pair<a>(b, c)')).toEqual(ecc.pair(a, b, c)))
    test('pair<a>(pi_1(x), pi_(x))', () => expect(parse('pair<a>(pi_1(x), pi_2(x))')).toEqual(ecc.pair(a, ecc.project('left', x), ecc.project('right', x))))
    test('pair  <  a  >   (  pi_1(x)\t,\t  pi_2(x) )  ', () => expect(parse('pair  <  a  >   (  pi_1(x)\t,\t  pi_2(x) )  ')).toEqual(ecc.pair(a, ecc.project('left', x), ecc.project('right', x))))
})