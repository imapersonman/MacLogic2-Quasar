import { app, flapp, ov, ovlist } from 'coastline/src/lambda_pi/shorthands'
import { Ast, Variable } from 'coastline/src/lambda_pi/ast'
import { absurd, and, exists, forall, iff, imp, not, or } from '../../src/components/MacLogicConstructor/maclogic_shorthands'
import { is_parse_failure, parse } from '../../src/components/MacLogicConstructor/maclogic_parser'

const [A, B, C, D, E, F, G, J, P, R, X, Y, Z, a, b, c, d, g, h, k, o, s, x, y, z] = ovlist('A', 'B', 'C', 'D', 'E', 'F', 'G', 'J', 'P', 'R', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'g', 'h', 'k', 'o', 's', 'x', 'y', 'z')

describe('parse', () => {
    // Absurdity
    test('\\F', () => expect(parse('\\F')).toEqual(absurd))
    test('⊥', () => expect(parse('⊥')).toEqual(absurd))
    test('absurd', () => expect(parse('absurd')).toEqual(absurd))
    test('⋏', () => expect(parse('⋏')).toEqual(absurd))
    test('AbsUrd', () => expect(parse('AbsUrd')).toEqual(absurd))
    // 0-place predicates
    test('A', () => expect(parse('A')).toEqual(A))
    test('B', () => expect(parse('B')).toEqual(B))
    test('Z', () => expect(parse('Z')).toEqual(Z))
    test('D\'\'\'', () => expect(parse('D\'\'\'')).toEqual(ov('D\'\'\'')))
    // 1-place predicates
    test('Aa', () => expect(parse('Aa')).toEqual(app(A, a)))
    test('Px', () => expect(parse('Px')).toEqual(app(P, x)))
    test('Gb', () => expect(parse('Gb')).toEqual(app(G, b)))
    test('D\'\'\'x', () => expect(parse('D\'\'\'x')).toEqual(app(ov('D\'\'\''), x)))
    test('D\'\'\'x\'\'', () => expect(parse('D\'\'\'x\'\'')).toEqual(app(ov('D\'\'\''), ov('x\'\''))))
    // 2-place predicates
    test('Fgc', () => expect(parse('Fgc')).toEqual(flapp(F, g, c)))
    test('Jxx', () => expect(parse('Jxx')).toEqual(flapp(J, x, x)))
    test('F\'g\'\'\'c\'\'', () => expect(parse('F\'g\'\'\'c\'\'')).toEqual(flapp(ov('F\''), ov('g\'\'\''), ov('c\'\''))))
    // n-place predicates
    test('Jxxyyaoskhai\'\'sd', () => expect(parse('Jxxyyaoskhai\'\'sd')).toEqual(flapp(J, x, x, y, y, a, o, s, k, h, a, ov('i\'\''), s, d)))
    // Not
    test('~J', () => expect(parse('~J')).toEqual(not(J)))
    test('~J\'\'', () => expect(parse('~J\'\'')).toEqual(not(ov('J\'\''))))
    test('~~~~~J', () => expect(parse('~~~~~J')).toEqual(not(not(not(not(not(J)))))))
    test('¬J', () => expect(parse('¬J')).toEqual(not(J)))
    test('¬¬¬¬¬J', () => expect(parse('¬¬¬¬¬J')).toEqual(not(not(not(not(not(J)))))))
    test('-J', () => expect(parse('-J')).toEqual(not(J)))
    test('-----J', () => expect(parse('-----J')).toEqual(not(not(not(not(not(J)))))))

    const test_bin_op = (c_f: (x: Ast, y: Ast) => Ast, c: string) => {
        test(`A ${c} B`, () => expect(parse(`A ${c} B`)).toEqual(c_f(A, B)))
        test(`  A ${c} B `, () => expect(parse(`  A ${c} B `)).toEqual(c_f(A, B)))
        test(`A${c}B`, () => expect(parse(`A${c}B`)).toEqual(c_f(A, B)))
        test(`A\'${c}B\'`, () => expect(parse(`A\'${c}B\'`)).toEqual(c_f(ov('A\''), ov('B\''))))
        test(`C ${c}D`, () => expect(parse(`C ${c}D`)).toEqual(c_f(C, D)))
        test(`C${c} D`, () => expect(parse(`C${c} D`)).toEqual(c_f(C, D)))
        test(`(X ${c} Y) ${c} P`, () => expect(parse(`(X ${c} Y) ${c} P`)).toEqual(c_f(c_f(X, Y), P)))
        test(`( X ${c} Y ) ${c} P`, () => expect(parse(`( X ${c} Y ) ${c} P`)).toEqual(c_f(c_f(X, Y), P)))
        test(`[ X ${c} Y ] ${c} P`, () => expect(parse(`[ X ${c} Y ] ${c} P`)).toEqual(c_f(c_f(X, Y), P)))
        test(`[ X ${c} Y ) ${c} P`, () => expect(is_parse_failure(parse(`[ X ${c} Y ) ${c} P`))).toBeTruthy())
        test(`{ X ${c} Y } ${c} P`, () => expect(parse(`{ X ${c} Y } ${c} P`)).toEqual(c_f(c_f(X, Y), P)))
        test(`( X ${c} Y ] ${c} P`, () => expect(is_parse_failure(parse(`( X ${c} Y ] ${c} P`))).toBeTruthy())
        test(`P ${c} (X ${c} Y)`, () => expect(parse(`P ${c} (X ${c} Y)`)).toEqual(c_f(P, c_f(X, Y))))
        test(`(P ${c} (X ${c} Y))`, () => expect(parse(`(P ${c} (X ${c} Y))`)).toEqual(c_f(P, c_f(X, Y))))
        test(`[P ${c} (X ${c} Y)]`, () => expect(parse(`[P ${c} (X ${c} Y)]`)).toEqual(c_f(P, c_f(X, Y))))
        test(`((A ${c} B) ${c} C) ${c} (D ${c} (E ${c} F))`, () =>
            expect(parse(`((A ${c} B) ${c} C) ${c} (D ${c} (E ${c} F))`))
            .toEqual(c_f(c_f(c_f(A, B), C), c_f(D, c_f(E, F)))))
        test(`Pxy${c}Ryxz`, () => expect(parse(`Pxy${c}Ryxz`)).toEqual(c_f(flapp(P, x, y), flapp(R, y, x, z))))
        test(`Pxy  ${c}    Ryxz`, () => expect(parse(`Pxy${c}Ryxz`)).toEqual(c_f(flapp(P, x, y), flapp(R, y, x, z))))
        test(`~~A ${c} ~~B`, () => expect(parse(`~~A ${c} ~~B`)).toEqual(c_f(not(not(A)), not(not(B)))))
        test(`~~A\' ${c} ~~B\'`, () => expect(parse(`~~A\' ${c} ~~B\'`)).toEqual(c_f(not(not(ov('A\''))), not(not(ov('B\''))))))
    }

    test_bin_op(and, '&')
    test_bin_op(and, '/\\')
    test_bin_op(and, '^')
    test_bin_op(and, '∧')

    test_bin_op(or, '∨')
    test_bin_op(or, '\\/')

    test_bin_op(imp, '→')
    test_bin_op(imp, '->')

    test_bin_op(iff, '↔')
    test_bin_op(iff, '<->')

    const test_quantifier = (q_f: (x: Variable, body: Ast) => Ast, q: string) => {
        test(`${q}xFx`, () => expect(parse(`${q}xFx`)).toEqual(q_f(x, app(F, x))))
        test(`${q}x\'\'\'F\'\'x\'\'\'`, () => expect(parse(`${q}x\'\'\'F\'\'x\'\'\'`)).toEqual(q_f(ov('x\'\'\''), app(ov('F\'\''), ov('x\'\'\'')))))
        test(`(${q}x)Fx`, () => expect(parse(`(${q}x)Fx`)).toEqual(q_f(x, app(F, x))))
        test(`${q}x${q}y${q}zFxyz`, () => expect(parse(`${q}x${q}y${q}zFxyz`)).toEqual(q_f(x, q_f(y, q_f(z, flapp(F, x, y, z))))))
        // Apparently quantifiers can be surrounded by parens and that's cool in maclogic
        test(`(${q}x)(${q}y)(${q}z)Fxyz`, () => expect(parse(`(${q}x)(${q}y)(${q}z)Fxyz`)).toEqual(q_f(x, q_f(y, q_f(z, flapp(F, x, y, z))))))
        test(`${q}xFxyz&B`, () => expect(parse(`${q}xFxyz&B`)).toEqual(and(q_f(x, flapp(F, x, y, z)), B)))
        test(`${q}x\'F\'x\'y\'z\'&B\'`, () => expect(parse(`${q}x\'F\'x\'y\'z\'&B\'`)).toEqual(and(q_f(ov('x\''), flapp(ov('F\''), ov('x\''), ov('y\''), ov('z\''))), ov('B\''))))
    }

    test_quantifier(exists, '∃')
    test_quantifier(exists, '\\E')

    test_quantifier(forall, '∀')
    test_quantifier(forall, '\\A')
    test_quantifier(forall, '\\U')
})