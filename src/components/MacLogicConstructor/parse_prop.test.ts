import { app, ovlist } from 'coastline/src/lambda_pi/shorthands'
import { and, forall, } from './maclogic_shorthands'
import { MacLogicIIInputerParser } from './interfaces/maclogic_ii_input_parser'
import { parse_prop } from './parse_prop'

const [A, B, F, x, y, b] = ovlist('A', 'B', 'F', 'x', 'y', 'b')

const pp = parse_prop(new MacLogicIIInputerParser())

describe('parse_prop', () => {
    it('should parse a simple sentence letter', () => expect(pp('A')).toEqual(A))
    it('should parse a simple conjunction', () => expect(pp('A & B')).toEqual(and(A, B)))
    it('should parse a universal', () => expect(pp('\\AxFx')).toEqual(forall(x, app(F, x))))
    it('should parse this annoying example: \\AyFy & Fb', () => expect(pp('\\AyFy & Fb')).toEqual(and(forall(y, app(F, y)), app(F, b))))
})