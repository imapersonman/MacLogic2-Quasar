import Pa from 'parsimmon'

import { Ast } from 'coastline/src/lambda_pi/ast'
import { absurd, and, exists, forall, iff, imp, not, or } from './maclogic_shorthands'
import { flapp, ov } from 'coastline/src/lambda_pi/shorthands'
import { first, is_empty, is_object, rest } from 'coastline/src/utilities'

const bin_op = (c_f: (x: Ast, y: Ast) => Ast, factor: Pa.Parser<unknown>, connector: Pa.Parser<unknown>) =>
    Pa.seq(factor, connector.wrap(Pa.optWhitespace, Pa.optWhitespace), factor).map(([l,, r]) => c_f(l as Ast, r as Ast))

const wrap = (p: Pa.Parser<unknown>): Pa.Parser<unknown> =>
    Pa.alt(p.wrap(Pa.string('('), Pa.string(')')), p.wrap(Pa.string('['), Pa.string(']')), p.wrap(Pa.string('{'), Pa.string('}')))

const LFOL: Pa.Language = Pa.createLanguage({
    Expression: (r) => Pa.alt(r.And, r.Or, r.Implies, r.Iff, r.Factor).wrap(Pa.optWhitespace, Pa.optWhitespace),
    Factor: (r) => Pa.alt(r.Exists, r.Forall, r.Not, r.Predicate, wrap(r.Expression)),
    Absurd: () =>
        Pa.alt(
            Pa.string('⊥'),
            Pa.string('\\F'),
            Pa.string('⋏'),
            Pa.regexp(/absurd/i)
        ).map(() => absurd),
    Individual: () => Pa.regexp(/[a-z]'*/).map((i) => ov(i)),
    Predicate: (r) =>
        Pa.alt(
            r.Absurd,
            Pa.seq(
                Pa.regexp(/[A-Z]'*/),
                r.Individual.sepBy(Pa.string(''))).map(([p, xs]) => is_empty(xs) ? ov(p) : flapp(ov(p), first(xs), ...rest(xs)))
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

export const parse = (t: string): Ast | Pa.Failure => {
    const result = LFOL.Expression.parse(t)
    if (result.status)
        return result.value as Ast
    return result
}

// export const parse_sequent = (assumptions_t: string, conclusion_t: string): Sequent | SequentError<Pa.Failure> => {
//     const assumption_strings = assumptions_t.split(',').map((s) => s.trim())
//     const parsed_assumptions: Ast[] = []
//     for (const [index, assumption_s] of assumption_strings.entries()) {
//         if (assumption_s === '')
//             continue
//         const parsed = parse(assumption_s)
//         if (is_parse_failure(parsed))
//             return new ErrorInAssumptions(parsed, index)
//         parsed_assumptions.push(parsed)
//     }

//     const parsed_conclusion = parse(conclusion_t)
//     if (is_parse_failure(parsed_conclusion))
//         return new ErrorInConclusion(parsed_conclusion)

//     return sequent(mk_map(...parsed_assumptions.map<[string, Ast]>((a, index) => [iv(index).id, a])), parsed_conclusion)
// }

// export const is_parse_failure = (f: Ast | Pa.Failure): f is Pa.Failure => is_object(f) && 'status' in f && !f.status

export const is_parse_failure = (f: unknown): f is Pa.Failure => is_object(f) && 'status' in f && !(f as { status: unknown }).status

