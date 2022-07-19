import { app, con, mv, ov, ovlist } from 'coastline/src/lambda_pi/shorthands'
import { Ast } from 'coastline/src/lambda_pi/ast'
import { pattern_to_display } from '../../src/components/MacLogicConstructor/pattern_to_display'
import { and, exists, forall, ml } from '../../src/components/MacLogicConstructor/maclogic_shorthands'

const [F, G] = [(x: Ast): Ast => app(ov('F'), x), (x: Ast): Ast => app(ov('G'), x)]
const [x, y] = ovlist('x', 'y')

describe('pattern_to_display', () => {
    test('and', () => expect(pattern_to_display(ml(and(F(x), G(y))))).toEqual('Fx & Gy'))
    test('exists', () => expect(pattern_to_display(ml(exists(y, and(F(x), G(y)))))).toEqual('(∃y)(Fx & Gy)'))
    test('exists with mv', () => expect(pattern_to_display(ml(app(con('exists'), mv('X'))))).toEqual('(∃x)X'))
    test('forall', () => expect(pattern_to_display(ml(forall(y, and(F(x), G(y)))))).toEqual('(∀y)(Fx & Gy)'))
    test('forall with mv', () => expect(pattern_to_display(ml(app(con('forall'), mv('X'))))).toEqual('(∀x)X'))
    // should also work for Asts not wrapped in ml
    test('and not wrapped in ml', () => expect(pattern_to_display(and(F(x), G(y)))).toEqual('Fx & Gy'))
    test('exists not wrapped in ml', () => expect(pattern_to_display(exists(y, and(F(x), G(y))))).toEqual('(∃y)(Fx & Gy)'))
    test('exists with mv not wrapped in ml', () => expect(pattern_to_display(app(con('exists'), mv('X')))).toEqual('(∃x)X'))
    test('forall not wrapped in ml', () => expect(pattern_to_display(forall(y, and(F(x), G(y))))).toEqual('(∀y)(Fx & Gy)'))
    test('forall with mv not wrapped in ml', () => expect(pattern_to_display(app(con('forall'), mv('X')))).toEqual('(∀x)X'))
})