import { ECCTermOVM } from 'coastline/src/machine/examples'
import { last } from 'coastline/src/utilities'
import { CoastlineObject, ECCTerm } from 'coastline/src/machine/object'
import P from 'parsimmon'
import { ecc } from './ecc_terms'

const bin_op = (c: (l: CoastlineObject<ECCTermOVM, ECCTerm>, r: CoastlineObject<ECCTermOVM, ECCTerm>) => CoastlineObject<ECCTermOVM, ECCTerm>, factor: P.Parser<CoastlineObject<ECCTermOVM, ECCTerm>>, connector: P.Parser<unknown>) =>
    P.seq(factor, connector.wrap(P.optWhitespace, P.optWhitespace), factor).map(([l,, r]) => c(l, r))

export const ecc_terms = P.createLanguage({
    Expression: (r) => P.alt(r.Pi, r.Lambda, r.Sigma, r.Type, r.Arrow, r.Product, r.Application, r.Factor).trim(P.optWhitespace),
    Type: () => P.string('Type').then(P.whitespace).then(P.regexp(/[0-9]+/)).map((order) => ecc.type(parseInt(order))),
    Prop: () => P.string('Prop').map(() => ecc.prop),
    Identifier: () => P.regexp(/([A-Za-z_\-])[A-Za-z0-9_$\-]*/).map(ecc.var),
    SD: () => P.string('\\').then(P.regexp(/[0-9]+/)).map((index) => ecc.sd(parseInt(index))),
    Factor: (r) => P.alt(
        // r.Type,
        r.Prop,
        r.Pair,
        r.Projection,
        r.SD,
        r.Identifier,
        r.Expression.wrap(P.string('('), P.string(')')),
    ),
    Projection: (r) => P.alt(r.LeftProjection, r.RightProjection),
    // test('pair<a>(b, c)', () => expect(parse('pair<a>(b, c)')).toEqual(ecc.pair(a, b, c)))
    LeftProjection: (r) => P.alt(P.string('π₁'), P.string('pi_1')).then(P.optWhitespace).then(r.Expression.wrap(P.string('(').then(P.optWhitespace), P.optWhitespace.then(P.string(')')))).map((x) => ecc.project('left', x)),
    RightProjection: (r) => P.alt(P.string('π₂'), P.string('pi_2')).then(P.optWhitespace).then(r.Expression.wrap(P.string('(').then(P.optWhitespace), P.optWhitespace.then(P.string(')')))).map((x) => ecc.project('right', x)),
    Pair: (r) => P.seq(
        P.string('pair').then(r.Expression.wrap(P.string('<').trim(P.optWhitespace), P.string('>').trim(P.optWhitespace))),
        P.seq(r.Expression, P.string(',').trim(P.optWhitespace), r.Expression).wrap(P.string('(').then(P.optWhitespace), P.optWhitespace.then(P.string(')'))
    )).map(([t, [l,, r]]: [CoastlineObject<ECCTermOVM, ECCTerm>, [CoastlineObject<ECCTermOVM, ECCTerm>, string, CoastlineObject<ECCTermOVM, ECCTerm>]]) => ecc.pair(t, l, r)),
    Arrow: (r) => bin_op(ecc.arrow, r.Factor, P.alt(P.string('→'), P.string('->'))),
    Product: (r) => bin_op(ecc.product, r.Factor, P.alt(P.string('×'), P.string('\\times'))),
    Application: (r) => r.Factor.sepBy(P.whitespace).assert((a) => a.length >= 2, 'The number of arguments in an Application must be greater than or equal to 1')
        .map((a) => {
            const associate = (a: CoastlineObject<ECCTermOVM, ECCTerm>[]): CoastlineObject<ECCTermOVM, ECCTerm> => a.length === 2 ? ecc.app(a[0], a[1]) : ecc.app(associate(a.slice(0, -1)), last(a))
            return associate(a)
        }),
    Pi:     (r) => P.seq(P.alt(P.string('P'), P.string('∏'), P.string('Π')).skip(P.optWhitespace), r.Abstraction).map(([, [id, type, scope]]: [unknown, [CoastlineObject<ECCTermOVM, 'ECCVariable'>, CoastlineObject<ECCTermOVM, ECCTerm>, CoastlineObject<ECCTermOVM, ECCTerm>]]) =>
        ecc.pi(id, type, scope)),
    Lambda: (r) => P.seq(P.alt(P.string('L'), P.string('λ')).skip(P.optWhitespace), r.Abstraction).map(([, [id, type, scope]]: [unknown, [CoastlineObject<ECCTermOVM, 'ECCVariable'>, CoastlineObject<ECCTermOVM, ECCTerm>, CoastlineObject<ECCTermOVM, ECCTerm>]]) =>
        ecc.la(id, type, scope)),
    Sigma: (r) => P.seq(P.alt(P.string('S'), P.string('Σ')).skip(P.optWhitespace), r.Abstraction).map(([, [id, type, scope]]: [unknown, [CoastlineObject<ECCTermOVM, 'ECCVariable'>, CoastlineObject<ECCTermOVM, ECCTerm>, CoastlineObject<ECCTermOVM, ECCTerm>]]) =>
        ecc.si(id, type, scope)),
    Abstraction: (r) => P.seq(
        P.seq(
            r.Identifier.skip(P.optWhitespace).skip(P.string(':')).skip(P.optWhitespace),
            r.Expression
        ).wrap(
            P.string('(').then(P.optWhitespace),
            P.optWhitespace.then(P.string(')'))
        ).skip(P.optWhitespace).skip(P.string('.')),
        r.Expression
    ).map(([[id, type], scope]: [[CoastlineObject<ECCTermOVM, 'ECCVariable'>, CoastlineObject<ECCTermOVM, ECCTerm>], CoastlineObject<ECCTermOVM, ECCTerm>]) => [id, type, scope])
})

export const parse = (text: string): CoastlineObject<ECCTermOVM, ECCTerm> | undefined => {
    const result: P.Result<CoastlineObject<ECCTermOVM, ECCTerm>> = ecc_terms.Expression.parse(text)
    if (result.status)
        return result.value
    return undefined
}