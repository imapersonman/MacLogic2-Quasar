import { Ast, Variable } from 'coastline/src/lambda_pi/ast'
import { FailedCheck, RedeclaredVariable, UndeclaredConstant } from 'coastline/src/logical_framework/sort_errors'
import { app, con, flapp, la, ovlist, pi } from 'coastline/src/lambda_pi/shorthands'
import { mk_map } from 'coastline/src/map/RecursiveMap'
import { absurd, and, exists, forall, i, iff, ifun, imp, ml, not, o, or, pred } from '../../src/components/MacLogicConstructor/maclogic_shorthands'
import { display_maclogic_elaboration_output, elaborate_maclogic_ast, vacuous_bind } from '../../src/components/MacLogicConstructor/elaborate_maclogic_ast'
import { display_proven_sequent, proven_sequent } from '../../src/components/MacLogicConstructor/proven_sequent'

const [A, Z, P, x, y, z, R, B, C, D, F, w, a, b, c] = ovlist('A', 'Z', 'P', 'x', 'y', 'z', 'R', 'B', 'C', 'D', 'F', 'w', 'a', 'b', 'c')

describe('elaborate_maclogic_ast', () => {
    it('returns undefined when given a non-M_type', () => expect(elaborate_maclogic_ast(proven_sequent(mk_map(), x, ml(A)))).toEqual(undefined))

    describe('constants', () => {
        test('unknown constant T', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    con('T'),
                    o
                )
            )
        ).toEqual(
            new UndeclaredConstant(con('T'))
        ))

        test('desired type conflicts with actual type in maclogic sig', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    absurd,
                    i
                )
            )
        ).toEqual(
            new FailedCheck(absurd, i, o)
        ))

        test('⊥', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    absurd,
                    o
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(),
                absurd,
                o
            )
        ))
    })

    describe('variables', () => {
        test('desired type conflicts with actual type in ctx', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['x', o]),
                    x,
                    i
                )
            )
        ).toEqual(
            new FailedCheck(x, i, o)
        ))

        test('x does not exist yet', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    b,
                    i
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['b', i]),
                b,
                i
            )
        ))

        test('x exists with same type', () => expect(
            proven_sequent(
                mk_map(['x', o]),
                x,
                o
            )
        ).toEqual(
            proven_sequent(
                mk_map(['x', o]),
                x, o
            )
        ))

        test('A', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    A,
                    o
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['A', o]),
                A,
                o
            )
        ))

        test('Z', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    Z,
                    o
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['Z', o]),
                Z,
                o
            )
        ))
    })

    describe('predicates and individual functions', () => {
        test('Px with P and x correctly in the ctx', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['P', pred(1)], ['x', i]),
                    app(P, x),
                    o
                )
            )
        ).toEqual(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['P', pred(1)], ['x', i]),
                    app(P, x),
                    o
                )
            )
        ))

        test('Px with only x in the ctx', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['x', i]),
                    app(P, x),
                    o
                )
            )
        ).toEqual(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['x', i], ['P', pred(1)]),
                    app(P, x),
                    o
                )
            )
        ))

        test('Px with only P in the ctx', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['P', pred(1)]),
                    app(P, x),
                    o
                )
            )
        ).toEqual(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['P', pred(1)], ['x', i]),
                    app(P, x),
                    o
                )
            )
        ))

        test('Px', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    app(P, c),
                    o
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['P', pred(1)], ['c', i]),
                app(P, c),
                o
            )
        ))

        test('Rxyz', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    flapp(R, a, b, c),
                    i
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['R', ifun(3)], ['a', i], ['b', i], ['c', i]),
                flapp(R, a, b, c),
                i
            )
        ))

        test('Rxyz', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    flapp(R, a, a, a),
                    o
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['R', pred(3)], ['a', i]),
                flapp(R, a, a, a),
                o
            )
        ))

        test('Rxyz but R was previously described as a 2-ary predicate', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(['R', pred(2)]),
                    flapp(R, x, y, z),
                    o
                )
            )
        ).toEqual(
            new FailedCheck(R, pred(3), pred(2))
        ))
    })

    describe('propositional connectives', () => {
        const test_binary_operator = (c: string, op_f: (l: Ast, r: Ast) => Ast) => {
            test(`A ${c} B`, () => expect(
                display_maclogic_elaboration_output(elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        op_f(A, B),
                        o
                    )
                ))
            ).toEqual(
                display_proven_sequent(proven_sequent(
                    mk_map(['A', o], ['B', o]),
                    op_f(A, B),
                    o
                ))
            ))

            test(`A ${c} A`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        op_f(A, A),
                        o
                    )
                )
            ).toEqual(
                proven_sequent(
                    mk_map(['A', o]),
                    op_f(A, A),
                    o
                )
            ))

            test(`(A ${c} B) ${c} (C ${c} D)`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        op_f(op_f(A, B), op_f(C, D)),
                        o
                    )
                )
            ).toEqual(
                proven_sequent(
                    mk_map(['A', o], ['B', o], ['C', o], ['D', o]),
                    op_f(op_f(A, B), op_f(C, D)),
                    o
                )
            ))

            test(`(A ${c} B) ${c} (C ${c} A)`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        op_f(op_f(A, B), op_f(C, A)),
                        o
                    )
                )
            ).toEqual(
                proven_sequent(
                    mk_map(['A', o], ['B', o], ['C', o]),
                    op_f(op_f(A, B), op_f(C, A)),
                    o
                )
            ))
        }

        test_binary_operator('&', and)
        test_binary_operator('∨', or)
        test_binary_operator('→', imp)
        test_binary_operator('↔', iff)

        test('~P', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    not(P),
                    o
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['P', o]),
                not(P),
                o
            )
        ))

        test('~~~P', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    not(not(not(P))),
                    o
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['P', o]),
                not(not(not(P))),
                o
            )
        ))
    })

    describe('quantifiers', () => {
        const test_quantifier = (q: string, q_f: (x: Variable, scope: Ast) => Ast) => {
            // test(`${q}xF`, () => expect(
            //     elaborate_maclogic_ast(
            //         proven_sequent(
            //             mk_map(),
            //             q_f(x, F),
            //             o
            //         )
            //     )
            // ).toEqual(
            //     proven_sequent(
            //         mk_map(['F', o]),
            //         q_f(x, F),
            //         o
            //     )
            // ))

            test(`${q}xFx`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        q_f(x, app(F, x)),
                        o
                    )
                )
            ).toEqual(
                proven_sequent(
                    mk_map(['F', pred(1)]),
                    q_f(x, app(F, x)),
                    o
                )
            ))

            // test(`${q}xFy`, () => expect(
            //     elaborate_maclogic_ast(
            //         proven_sequent(
            //             mk_map(),
            //             q_f(x, app(F, y)),
            //             o
            //         )
            //     )
            // ).toEqual(
            //     proven_sequent(
            //         mk_map(['F', pred(1)], ['y', i]),
            //         q_f(x, app(F, y)),
            //         o
            //     )
            // ))

            test(`${q}x${q}y${q}zRxyzw`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        q_f(x, q_f(y, q_f(z, flapp(R, x, y, z, a)))),
                        o
                    )
                )
            ).toEqual(
                proven_sequent(
                    mk_map(['R', pred(4)], ['a', i]),
                    q_f(x, q_f(y, q_f(z, flapp(R, x, y, z, a)))),
                    o
                )
            ))

            test(`${q}x${q}y${q}yRxwyz redeclared y`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        q_f(x, q_f(y, q_f(y, flapp(R, x, w, y, z)))),
                        o
                    )
                )
            ).toEqual(
                new RedeclaredVariable(y)
            ))

            // vacuous binds
            test(`${q}xF simple vacuous bind`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        q_f(x, F),
                        o
                    )
                )
            ).toEqual(
                vacuous_bind(x)
            ))

            test(`(${q}xFx & ${q}yR) vacuous bind in conjunction`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        and(q_f(x, app(F, x)), q_f(y, R)),
                        o
                    )
                )
            ).toEqual(
                vacuous_bind(y)
            ))

            test(`${q}x${q}z${q}yFxy vacuous bind in nested quantifier`, () => expect(
                elaborate_maclogic_ast(
                    proven_sequent(
                        mk_map(),
                        q_f(x, q_f(z, q_f(y, flapp(F, x, y)))),
                        o
                    )
                )
            ).toEqual(
                vacuous_bind(z)
            ))
        }

        test_quantifier('∃', exists)
        test_quantifier('∀', forall)
    })

    describe('lambdas', () => {
        test('just one checks out nothing added to ctx', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    la(x, i, x),
                    pi(x, i, i)
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(),
                la(x, i, x),
                pi(x, i, i)
            )
        ))
        test('free individual variable under lambda', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    la(x, i, app(F, y)),
                    pi(x, i, o)
                )
            )
        ).toEqual(
            proven_sequent(
                mk_map(['F', pred(1)], ['y', i]),
                la(x, i, app(F, y)),
                pi(x, i, o)
            )
        ))
        test('nicely returns predicate', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    la(y, i, flapp(P, a, y)),
                    pi(y, i, o)
                ),
            )
        ).toEqual(
            proven_sequent(
                mk_map(['P', pred(2)], ['a', i]),
                la(y, i, flapp(P, a, y)),
                pi(y, i, o)
            )
        ))
        test('nicely returns two place predicate', () => expect(
            elaborate_maclogic_ast(
                proven_sequent(
                    mk_map(),
                    la(x, i, la(y, i, and(app(F, x), app(R, y)))),
                    pi(x, i, pi(y, i, o))
                ),
            )
        ).toEqual(
            proven_sequent(
                mk_map(['F', pred(1)], ['R', pred(1)]),
                la(x, i, la(y, i, and(app(F, x), app(R, y)))),
                pi(x, i, pi(y, i, o))
            ),
        ))
    })
})