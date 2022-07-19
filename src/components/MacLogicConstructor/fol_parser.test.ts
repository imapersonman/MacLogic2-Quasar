import Pa from 'parsimmon'
import { app, flapp, ov, ovlist } from 'coastline/src/lambda_pi/shorthands'
import { Ast, Variable } from 'coastline/src/lambda_pi/ast'
import { absurd, and, exists, forall, iff, imp, not, or } from './maclogic_shorthands'
import { is_parse_failure } from './maclogic_parser'
import { first, is_empty, rest } from 'coastline/src/utilities'

// This file is unfinished, so this parser should not be used.

const [A, B, C, D, E, F, G, J, P, R, X, Y, Z, a, b, c, d, g, h, k, o, s, x, y, z] = ovlist('A', 'B', 'C', 'D', 'E', 'F', 'G', 'J', 'P', 'R', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'g', 'h', 'k', 'o', 's', 'x', 'y', 'z')

const bin_op = (c_f: (x: Ast, y: Ast) => Ast, factor: Pa.Parser<unknown>, connector: Pa.Parser<unknown>) =>
    Pa.seq(factor, connector.wrap(Pa.optWhitespace, Pa.optWhitespace), factor).map(([l,, r]) => c_f(l as Ast, r as Ast))

const wrap = (p: Pa.Parser<unknown>): Pa.Parser<unknown> =>
    Pa.alt(p.wrap(Pa.string('('), Pa.string(')')), p.wrap(Pa.string('['), Pa.string(']')), p.wrap(Pa.string('{'), Pa.string('}')))

const LFOL: Pa.Language = Pa.createLanguage({
  Expression: (r) => Pa.alt(r.And, r.Or, r.Implies, r.Iff, r.Factor).wrap(Pa.optWhitespace, Pa.optWhitespace),
  Factor: (r) => Pa.alt(r.Exists, r.Forall, r.Not, r.PredicateApplication, wrap(r.Expression)),
  Absurd: () =>
    Pa.alt(
      Pa.string('⊥'),
      Pa.string('\\F'),
      Pa.string('⋏'),
      Pa.regexp(/absurd/i)
    ).map(() => absurd),
  // An Individual can now be identified as any string starting with a lower-case alphabetic character, followed by any combination of letters, numbers, and underscores.
  Individual: () => Pa.regexp(/[a-z][a-zA-Z0-9_]*/).map((i) => ov(i)),
  // A Predicate can now be identified as any string starting with an upper-case alphabetic character, followed by any combination of letters, numbers, and underscores.
  Predicate: () => Pa.regexp(/[A-Z][a-zA-Z0-9_]*/).map((i) => ov(i)),
  PredicateApplication: (r) =>
    Pa.alt(
      r.Absurd,
      Pa.seq(
        r.Predicate.skip(Pa.optWhitespace),
        r.Individual.trim(Pa.optWhitespace).sepBy(Pa.string(',')).wrap(
          Pa.string('('),
          Pa.string(')')
        ),
      ).map(([p, xs]) => is_empty(xs) ? p as Ast : flapp(p, first(xs), ...rest(xs))),
      r.Predicate
    ),
  Not: (r) => Pa.alt(Pa.string('~'), Pa.string('¬'), Pa.string('-')).skip(Pa.optWhitespace).then(r.Factor).map((f) => not(f)),
  And: (r) => bin_op(and, r.Factor, Pa.alt(Pa.string('&'), Pa.string('^'), Pa.string('/\\'), Pa.string('∧'))),
  Or: (r) => bin_op(or, r.Factor, Pa.alt(Pa.string('\\/'), Pa.string('∨'))),
  Implies: (r) => bin_op(imp, r.Factor, Pa.alt(Pa.string('->'), Pa.string('→'))),
  Iff: (r) => bin_op(iff, r.Factor, Pa.alt(Pa.string('<->'), Pa.string('↔'))),
  Forall: (r) => Pa.alt(
    Pa.seq(Pa.alt(Pa.string('\\A'), Pa.string('\\U'), Pa.string('∀')), r.Individual, r.Factor).map(([, x, f]) => forall(x, f)),
    Pa.seq(Pa.seq(Pa.alt(Pa.string('\\A'), Pa.string('\\U'), Pa.string('∀')), r.Individual).wrap(Pa.string('('), Pa.string(')')), r.Factor).map(([[, x], f]) => forall(x, f))
  ),
  Exists: (r) => Pa.alt(
    Pa.seq(Pa.alt(Pa.string('\\E'), Pa.string('∃')), r.Individual, r.Factor).map(([, x, f]) => exists(x, f)),
    Pa.seq(Pa.seq(Pa.alt(Pa.string('\\E'), Pa.string('∃')), r.Individual).wrap(Pa.string('('), Pa.string(')')), r.Factor).map(([[, x], f]) => exists(x, f))
  )
})

const parse = (text: string): Ast | Pa.Failure => {
  const parsed = LFOL.Expression.parse(text)
  if (parsed.status)
    return parsed.value as Ast
  return parsed
}

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
  test('D', () => expect(parse('D')).toEqual(ov('D')))
  test('Divides', () => expect(parse('Divides')).toEqual(ov('Divides')))
  test('PERMUTES', () => expect(parse('PERMUTES')).toEqual(ov('PERMUTES')))
  test('IsDoap', () => expect(parse('IsDoap')).toEqual(ov('IsDoap')))
  test('Nah_', () => expect(parse('Nah_')).toEqual(ov('Nah_')))
  test('C42', () => expect(parse('C42')).toEqual(ov('C42')))
  // 1-place predicates
  test('A(a)', () => expect(parse('A(a)')).toEqual(app(A, a)))
  test('A (    a  ) ', () => expect(parse('A (    a  ) ')).toEqual(app(A, a)))
  test('P(x)', () => expect(parse('P(x)')).toEqual(app(P, x)))
  test('G(b)', () => expect(parse('G(b)')).toEqual(app(G, b)))
  test('Divides_(x)', () => expect(parse('Divides_(x)')).toEqual(app(ov('Divides_'), x)))
  test('PERMUTES(cool)', () => expect(parse('PERMUTES(cool)')).toEqual(app(ov('PERMUTES'), ov('cool'))))
  test('PERMUTES(cool_beans)', () => expect(parse('PERMUTES(cool_beans)')).toEqual(app(ov('PERMUTES'), ov('cool_beans'))))
  test('PERMUTES(cOOL_bEans12)', () => expect(parse('PERMUTES(cOOL_bEans12)')).toEqual(app(ov('PERMUTES'), ov('cOOL_bEans12'))))
  // 2-place predicates
  test('F(g,c)', () => expect(parse('F(g,c)')).toEqual(flapp(F, g, c)))
  test('F  (   g     ,            c     ) ', () => expect(parse('F  (   g     ,            c     ) ')).toEqual(flapp(F, g, c)))
  test('J(x, x)', () => expect(parse('J(x, x)')).toEqual(flapp(J, x, x)))
  // n-place predicates
  test('J(x, x, y, y, a, o, s, k, h, a, i, s, d)', () => expect(parse('J(x, x, y, y, a, o, s, k, h, a, i, s, d)')).toEqual(flapp(J, x, x, y, y, a, o, s, k, h, a, ov('i'), s, d)))
  // Not
  test('~J', () => expect(parse('~J')).toEqual(not(J)))
  test('~~~~~J', () => expect(parse('~~~~~J')).toEqual(not(not(not(not(not(J)))))))
  test('¬J', () => expect(parse('¬J')).toEqual(not(J)))
  test('¬¬¬¬¬J', () => expect(parse('¬¬¬¬¬J')).toEqual(not(not(not(not(not(J)))))))
  test('-J', () => expect(parse('-J')).toEqual(not(J)))
  test('-----J', () => expect(parse('-----J')).toEqual(not(not(not(not(not(J)))))))

  const test_bin_op = (c_f: (x: Ast, y: Ast) => Ast, c: string) => {
    test(`A ${c} B`, () => expect(parse(`A ${c} B`)).toEqual(c_f(A, B)))
    test(`  A ${c} B `, () => expect(parse(`  A ${c} B `)).toEqual(c_f(A, B)))
    test(`A${c}B`, () => expect(parse(`A${c}B`)).toEqual(c_f(A, B)))
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
    test(`P(x, y)${c}R(y, x, z)`, () => expect(parse(`P(x, y)${c}R(y, x, z)`)).toEqual(c_f(flapp(P, x, y), flapp(R, y, x, z))))
    test(`P(x, y)  ${c}    R(y, x, z)`, () => expect(parse(`P(x, y)  ${c}    R(y, x, z)`)).toEqual(c_f(flapp(P, x, y), flapp(R, y, x, z))))
    test(`~~A ${c} ~~B`, () => expect(parse(`~~A ${c} ~~B`)).toEqual(c_f(not(not(A)), not(not(B)))))
    test(`~~Action ${c} ~~Bad`, () => expect(parse(`~~Action ${c} ~~Bad`)).toEqual(c_f(not(not(ov('Action'))), not(not(ov('Bad'))))))
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const test_quantifier = (q_f: (x: Variable, body: Ast) => Ast, q: string) => {
    test(`${q}x.F(x)`, () => expect(parse(`${q}xF(x)`)).toEqual(q_f(x, app(F, x))))
    test(`${q}xiJinping.Feels(xiJinjping)`, () => expect(parse(`${q}xiJinping.Feels(xiJinjping)`)).toEqual(q_f(ov('xiJinping'), app(ov('Feels'), ov('xiJinping')))))
    test(`(${q}x).Fx`, () => expect(parse(`(${q}x).Fx`)).toEqual(q_f(x, app(F, x))))
    test(`${q}x${q}y${q}zFxyz`, () => expect(parse(`${q}x${q}y${q}zFxyz`)).toEqual(q_f(x, q_f(y, q_f(z, flapp(F, x, y, z))))))
    // Apparently quantifiers can be surrounded by parens and that's cool in maclogic
    test(`(${q}x).(${q}y).(${q}z)Fxyz`, () => expect(parse(`(${q}x)(${q}y)(${q}z)Fxyz`)).toEqual(q_f(x, q_f(y, q_f(z, flapp(F, x, y, z))))))
    test(`${q}xFxyz&B`, () => expect(parse(`${q}xFxyz&B`)).toEqual(and(q_f(x, flapp(F, x, y, z)), B)))
    test(`${q}x\'F\'x\'y\'z\'&B\'`, () => expect(parse(`${q}x\'F\'x\'y\'z\'&B\'`)).toEqual(and(q_f(ov('x\''), flapp(ov('F\''), ov('x\''), ov('y\''), ov('z\''))), ov('B\''))))
  }

  // test_quantifier(exists, '∃')
  // test_quantifier(exists, '\\E')

  // test_quantifier(forall, '∀')
  // test_quantifier(forall, '\\A')
  // test_quantifier(forall, '\\U')
})