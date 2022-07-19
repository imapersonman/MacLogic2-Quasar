/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ctx } from 'coastline/src/logical_framework/ctx';
import { Ast, Lambda, Variable } from 'coastline/src/lambda_pi/ast';
import { app, con, func_type, mvlist, type_k } from 'coastline/src/lambda_pi/shorthands';
import { mk_map } from 'coastline/src/map/RecursiveMap';
import { absurd, and, exists, forall, iff, imp, not, o, or, pred, prop, taut } from './maclogic_shorthands';
import { check, check_ctx } from 'coastline/src/logical_framework/synthesize_type';
import { Env } from 'coastline/src/logical_framework/env';
import { unify_clauses, MatchClause, match_clause } from 'coastline/src/unification/first_order_match_clauses';
import { declare } from 'coastline/src/utilities';
import { ast_in } from 'coastline/src/lambda_pi/utilities';
import { free_variables } from 'coastline/src/lambda_pi/free_variables';
import { mk_sig } from 'coastline/src/logical_framework/sig2';

export const sig = mk_sig(
    [con('o'), type_k],
    [con('i'), type_k],
    [con('absurd'), o],
    [con('taut'), o],
    [con('not'), prop(1)],
    [con('and'), prop(2)],
    [con('or'), prop(2)],
    [con('imp'), prop(2)],
    [con('iff'), prop(2)],
    [con('forall'), func_type([pred(1)], o)],
    [con('exists'), func_type([pred(1)], o)]
)

export const check_fol_ctx = (ctx: Ctx): boolean => check_ctx(sig, ctx)
export const check_fol_formula = (ctx: Ctx, formula: Ast): boolean => check(new Env(sig, ctx, mk_map()), formula, o)

const [X, Y] = mvlist('X', 'Y')

export const match_absurd = <R>(f: () => R): MatchClause<R> => match_clause(absurd, () => f())
export const match_taut = <R>(f: () => R): MatchClause<R> => match_clause(taut, () => f())
export const match_not = <R>(f: (x: Ast) => R): MatchClause<R> => match_clause(not(X), (u) => f(u('X')))
export const match_binary = (op: (l: Ast, r: Ast) => Ast) => <R>(f: (l: Ast, r: Ast) => R): MatchClause<R> => match_clause(op(X, Y), (u) => f(u('X'), u('Y')))
export const match_and = match_binary(and)
export const match_or = match_binary(or)
export const match_imp = match_binary(imp)
export const match_iff = match_binary(iff)
export const match_quant = (q: string) => <R>(f: (v: Variable, b: Ast) => R): MatchClause<R> => match_clause(app(con(q), X), (u) => declare(u('X') as Lambda, (X) => f(X.bound, X.scope)))
export const match_forall = match_quant('forall')
export const match_exists = match_quant('exists')

const nnf = (formula: Ast): Ast => unify_clauses(formula, [
        match_and((l, r) => and(nnf(l), nnf(r))),
        match_or((l, r) => or(nnf(l), nnf(r))),
        match_imp((l, r) => or(nnf(not(l)), nnf(r))),
        match_iff((l, r) => or(and(nnf(l), nnf(r)), and(nnf(not(l)), nnf(not(r))))),
        match_not((x) => unify_clauses(x, [
            match_not((p) => nnf(p)),
            match_and((l, r) => or(nnf(not(l)), nnf(not(r)))),
            match_imp((l, r) => and(nnf(l), nnf(not(r)))),
            match_iff((l, r) => or(and(nnf(l), nnf(not(r))), and(nnf(not(l)), nnf(r)))),
            match_forall((x, p) => exists(x, nnf(not(p)))),
            match_exists((x, p) => forall(x, nnf(not(p))))
        ])),
        match_forall((x, p) => forall(x, nnf(p))),
        match_forall((x, p) => exists(x, nnf(p)))
    ],
    () => formula
)

const psimplify1 = (formula: Ast) => unify_clauses(formula, [
    match_not((x) => unify_clauses<Ast>(x, [
        match_absurd(() => taut),
        match_taut(() => absurd),
        match_not((p) => p),
        match_and((l, r) => unify_clauses(l, [
            match_absurd(() => absurd),
            match_taut(() => r)
        ], () => unify_clauses(r, [
            match_absurd(() => absurd),
            match_taut(() => l)
        ]))),
        match_or((l, r) => unify_clauses(l, [
            match_absurd(() => r),
            match_taut(() => taut)
        ], () => unify_clauses(r, [
            match_absurd(() => l),
            match_taut(() => taut)
        ]))),
        match_imp((l, r) => unify_clauses(l, [
            match_absurd(() => taut),
            match_taut(() => r)
        ], () => unify_clauses<Ast>(r, [
            match_absurd(() => not(l)),
            match_taut(() => taut)
        ]))),
        match_iff((l, r) => unify_clauses(l, [
            match_absurd(() => not(r)),
            match_taut(() => r)
        ], () => unify_clauses(r, [
            match_absurd(() => not(l)),
            match_taut(() => l)
        ])))
    ]))
], () => formula)

const psimplify = (formula: Ast): Ast => unify_clauses(formula, [
    match_not((p) => psimplify1(not(psimplify(p)))),
    match_and((p, q) => psimplify1(and(psimplify(p), psimplify(q)))),
    match_or((p, q) => psimplify1(or(psimplify(p), psimplify(q)))),
    match_imp((p, q) => psimplify1(imp(psimplify(p), psimplify(q)))),
    match_iff((p, q) => psimplify1(iff(psimplify(p), psimplify(q)))),
], () => formula)

const simplify1 = (formula: Ast): Ast => unify_clauses(formula, [
    match_forall((x, p) => ast_in(x, free_variables([], p)) ? formula : p),
    match_exists((x, p) => ast_in(x, free_variables([], p)) ? formula : p)
], () => psimplify1(formula))

const simplify = (formula: Ast): Ast => unify_clauses(formula, [
    match_not((p) => simplify1(not(simplify(p)))),
    match_and((p, q) => simplify1(and(simplify(p), simplify(q)))),
    match_or((p, q) => simplify1(or(simplify(p), simplify(q)))),
    match_imp((p, q) => simplify1(imp(simplify(p), simplify(q)))),
    match_iff((p, q) => simplify1(iff(simplify(p), simplify(q)))),
    match_forall((x, p) => simplify1(forall(x, simplify(p)))),
    match_exists((x, p) => simplify1(exists(x, simplify(p))))
], () => formula)