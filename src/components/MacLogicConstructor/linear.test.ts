import { try_parse } from 'coastline/src/lambda_pi/parsers/parser'
import { Ast } from 'coastline/src/lambda_pi/ast'
import { ovlist, iovlist, la, flapp, app, ov, iv, con } from 'coastline/src/lambda_pi/shorthands'
import { and, andel, ander, andi, exists, existse, existsi, forall, foralle, foralli, i, imp, impe, impi, ml, not, o, pred } from 'coastline/src/maclogic/maclogic_shorthands'
import { S } from './s'
import { try_parse_then_elaborate_sequent, unelaborate_then_unparse } from './parse_then_elaborate'
import { ast_to_proof, display_proof } from './linear_proof2'
import { assert_linear_proof_is_valid } from './assert_linear_proof_is_valid'
import { make_qs_phi } from './construction_interaction'

const [A, B, C, R, S, T, Fv, Gv, x, y, a, b] = ovlist('A', 'B', 'C', 'R', 'S', 'T', 'F', 'G', 'x', 'y', 'a', 'b')
const [u1, u2, u3, u4, u5] = iovlist(1, 2, 3, 4, 5)
const [F, G] = [(x: Ast) => app(Fv, x), (x: Ast) => app(Gv, x)]

const and_assoc_proof = la(A, o, la(B, o, la(C, o, la(u1, ml(and(A, and(B, C))),
    flapp(
        la(u2, ml(A), la(u3, ml(and(B, C)),
            flapp(
                la(u4, ml(B), la(u5, ml(C), andi(and(A, B), C, andi(A, B, u2, u4), u5))),
                andel(B, C, u3),
                ander(B, C, u3)))),
        andel(A, and(B, C), u1),
        ander(A, and(B, C), u1))))))

const imp_collapse_proof =
    la(R, o, la(S, o, la(T, o, la(u1, ml(imp(R, imp(S, T))), la(u2, ml(S),
        impi(R, T, la(u3, ml(R),
            flapp(
                la(u4, ml(imp(S, T)),
                    flapp(
                        la(u5, ml(T), u5),
                        impe(S, T, u4, u2))),
                impe(R, imp(S, T), u1, u3)))))))))

const forall_pullout_consequent_proof =
    la(Fv, pred(1), la(Gv, pred(1), la(u1, ml(forall(x, imp(F(x), forall(y, G(y))))),
        foralli(
            la(x, i, forall(y, imp(F(x), G(y)))),
            la(a, i,
                foralli(
                    la(y, i, imp(F(a), G(y))),
                    la(b, i, impi(F(a), G(b),
                        la(u2, ml(F(a)),
                            flapp(
                                la(u3, ml(imp(F(a), forall(y, G(y)))),
                                    flapp(
                                        la(u4, ml(forall(y, G(y))),
                                            flapp(
                                                la(u5, ml(G(b)),
                                                    u5),
                                                foralle(
                                                    la(y, i, G(y)),
                                                    b,
                                                    u4))),
                                        impe(F(a), forall(y, G(y)), u3, u2))),
                                foralle(
                                    la(x, i, imp(F(x), forall(y, G(y)))),
                                    a,
                                    u1)))))))))))

const exists_and_exists_conjunct_proof =
    la(Fv, pred(1), la(Gv, pred(1), la(u1, ml(exists(x, and(F(x), G(x)))),
        existse(
            la(x, i, and(F(x), G(x))),
            exists(x, F(x)),
            u1,
            la(a, i, la(u2, ml(and(F(a), G(a))), 
                existsi(
                    la(x, i, F(x)),
                    a,
                    flapp(
                        la(u3, ml(F(a)), la(u4, ml(G(a)),
                            u3)),
                        andel(F(a), G(a), u2),
                        ander(F(a), G(a), u2)))))))))

const ml_example_42_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(D: o).λ(H: o).λ(_0: ml (and A B)).λ(_1: ml (and C D)).λ(_2: ml (imp (and A D) H)).(λ(_3: ml A).λ(_4: ml B).(λ(_5: ml C).λ(_6: ml D).(λ(_7: ml H)._7) (impe (and A D) H _2 (andi A D _3 _6))) (andel C D _1) (ander C D _1)) (andel A B _0) (ander A B _0)')

describe('linearize_ast', () => {
    const constant_name_ml_reason = (name: string): string => ({
        'andel': '&E',
        'ander': '&E',
        'andi': '&I',
        'impe': '→E',
        'impi': '→I',
        'note': '~E',
        'noti': '~I',
        'dn': 'DN',
        'oril': '∨I_left',
        'orir': '∨I_right',
        'ore': '∨E',
        'dfl': 'defn',
        'dfr': 'defn',
        'existse': '∃E',
        'existsi': '∃I',
        'foralle': '∀E',
        'foralli': '∀I',
    }[name] ?? name)
    const linearize = (ast: Ast, assumptions: string, conclusion: string) => {
        const seq = try_parse_then_elaborate_sequent(assumptions, conclusion)
        const p = ast_to_proof(ast, seq)
        // Eventual goal: Have the check_linear_proof function work through the signature and the is_relevant type stuff.
        assert_linear_proof_is_valid(p, seq)
        return display_proof(p, unelaborate_then_unparse, constant_name_ml_reason)
    }
    test('and_assoc', () => expect(
        linearize(and_assoc_proof, 'A & (B & C)', '(A & B) & C')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: 'A & (B & C)', reason: 'Premise' },
            { as: '1', ln: 2, statement: 'A',           reason: '1 &E' },
            { as: '1', ln: 3, statement: 'B & C',       reason: '1 &E' },
            { as: '1', ln: 4, statement: 'B',           reason: '3 &E' },
            { as: '1', ln: 5, statement: 'A & B',       reason: '2,4 &I' },
            { as: '1', ln: 6, statement: 'C',           reason: '3 &E' },
            { as: '1', ln: 7, statement: '(A & B) & C', reason: '5,6 &I' }
          ]
    ))
    test('imp_collapse', () => expect(
        linearize(imp_collapse_proof, 'R → (S → T), S', 'R → T')
    ).toEqual(
        [
            { as: '1',       ln: 1, statement: 'R → (S → T)', reason: 'Premise' },
            { as: '2',       ln: 2, statement: 'S',           reason: 'Premise' },
            { as: '3',       ln: 3, statement: 'R',           reason: 'Assumption' },
            { as: '1,3',     ln: 4, statement: 'S → T',       reason: '1,3 →E' },
            { as: '1,2,3',   ln: 5, statement: 'T',           reason: '4,2 →E' },
            { as: '1,2',     ln: 6, statement: 'R → T',       reason: '3,5 →I' }
        ]
    ))
    test('forall_pullout_consequent', () => expect(
        linearize(forall_pullout_consequent_proof, '(∀x)(Fx → (∀y)Gy)', '(∀x)(∀y)(Fx → Gy)')
    ).toEqual(
        [
            { as: '1',    ln: 1, statement: '(∀x)(Fx → (∀y)Gy)', reason: 'Premise' },
            { as: '2',    ln: 2, statement: 'Fa',                reason: 'Assumption' },
            { as: '1',    ln: 3, statement: 'Fa → (∀y)Gy',       reason: '1 ∀E' },
            { as: '1,2',  ln: 4, statement: '(∀y)Gy',            reason: '3,2 →E' },
            { as: '1,2',  ln: 5, statement: 'Gb',                reason: '4 ∀E' },
            { as: '1',    ln: 6, statement: 'Fa → Gb',           reason: '2,5 →I' },
            { as: '1',    ln: 7, statement: '(∀y)(Fa → Gy)',     reason: '6 ∀I' },
            { as: '1',    ln: 8, statement: '(∀x)(∀y)(Fx → Gy)', reason: '7 ∀I' }
        ]
    ))
    test('exists_and_exists_conjunct', () => expect(
        linearize(exists_and_exists_conjunct_proof, '(∃x)(Fx & Gx)', '(∃x)Fx')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: '(∃x)(Fx & Gx)', reason: 'Premise' },
            { as: '2', ln: 2, statement: 'Fa & Ga',       reason: 'Assumption' },
            { as: '2', ln: 3, statement: 'Fa',            reason: '2 &E' },
            { as: '2', ln: 4, statement: '(∃x)Fx',        reason: '3 ∃I' },
            { as: '1', ln: 5, statement: '(∃x)Fx',        reason: '1,2,4 ∃E' }
        ]
    ))
    test('ml_example_42_1_proof', () => expect(
        linearize(ml_example_42_proof, 'A & B, C & D, (A & D) → H', 'H')
    ).toEqual(
        [
            { as: '1',       ln: 1, statement: 'A & B',       reason: 'Premise' },
            { as: '2',       ln: 2, statement: 'C & D',       reason: 'Premise' },
            { as: '3',       ln: 3, statement: '(A & D) → H', reason: 'Premise' },
            { as: '1',       ln: 4, statement: 'A',           reason: '1 &E' },
            { as: '2',       ln: 5, statement: 'D',           reason: '2 &E' },
            { as: '1,2',     ln: 6, statement: 'A & D',       reason: '4,5 &I' },
            { as: '1,2,3',   ln: 7, statement: 'H',           reason: '3,6 →E' }
        ]
    ))
    const ml_example_42_2_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(_0: ml (and A (and B C))).(λ(_1: ml A).λ(_2: ml (and B C)).(λ(_3: ml B).λ(_4: ml C).andi C (and B A) _4 (andi B A _3 _1)) (andel B C _2) (ander B C _2)) (andel A (and B C) _0) (ander A (and B C) _0)')
    test('ml_example_42_2_proof', () => expect(
        linearize(ml_example_42_2_proof, 'A & (B & C)', 'C & (B & A)')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: 'A & (B & C)', reason: 'Premise' },
            { as: '1', ln: 2, statement: 'B & C',       reason: '1 &E' },
            { as: '1', ln: 3, statement: 'C',           reason: '2 &E' },
            { as: '1', ln: 4, statement: 'B',           reason: '2 &E' },
            { as: '1', ln: 5, statement: 'A',           reason: '1 &E' },
            { as: '1', ln: 6, statement: 'B & A',       reason: '4,5 &I' },
            { as: '1', ln: 7, statement: 'C & (B & A)', reason: '3,6 &I' }
        ]
    ))
    const ml_example_42_3_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(D: o).λ(_0: ml (imp A (imp B (imp C D)))).λ(_1: ml (and C (and A B))).(λ(_2: ml C).λ(_3: ml (and A B)).(λ(_4: ml A).λ(_5: ml B).(λ(_6: ml (imp B (imp C D))).(λ(_7: ml (imp C D)).(λ(_8: ml D)._8) (impe C D _7 _2)) (impe B (imp C D) _6 _5)) (impe A (imp B (imp C D)) _0 _4)) (andel A B _3) (ander A B _3)) (andel C (and A B) _1) (ander C (and A B) _1)')
    test('ml_example_42_3_proof', () => expect(
        linearize(ml_example_42_3_proof, 'A → (B → (C → D)), C & (A & B)', 'D')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: 'A → (B → (C → D))', reason: 'Premise' },
            { as: '2',   ln: 2, statement: 'C & (A & B)',       reason: 'Premise' },
            { as: '2',   ln: 3, statement: 'A & B',             reason: '2 &E' },
            { as: '2',   ln: 4, statement: 'A',                 reason: '3 &E' },
            { as: '1,2', ln: 5, statement: 'B → (C → D)',       reason: '1,4 →E' },
            { as: '2',   ln: 6, statement: 'B',                 reason: '3 &E' },
            { as: '1,2', ln: 7, statement: 'C → D',             reason: '5,6 →E' },
            { as: '2',   ln: 8, statement: 'C',                 reason: '2 &E' },
            { as: '1,2', ln: 9, statement: 'D',                 reason: '7,8 →E' }
        ]
    ))
    const ml_example_42_5_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(D: o).λ(_0: ml (imp (and (and A B) C) D)).impi C (imp B (imp A D)) (λ(_1: ml C).impi B (imp A D) (λ(_2: ml B).impi A D (λ(_3: ml A).(λ(_4: ml D)._4) (impe (and (and A B) C) D _0 (andi (and A B) C (andi A B _3 _2) _1)))))')
    test('ml_example_42_5_proof', () => expect(
        linearize(ml_example_42_5_proof, '((A & B) & C) → D', 'C → (B → (A → D))')
    ).toEqual(
        [
            { as: '1',          ln: 1, statement: '((A & B) & C) → D', reason: 'Premise' },
            { as: '2',          ln: 2, statement: 'C',                 reason: 'Assumption' },
            { as: '3',          ln: 3, statement: 'B',                 reason: 'Assumption' },
            { as: '4',          ln: 4, statement: 'A',                 reason: 'Assumption' },
            { as: '3,4',        ln: 5, statement: 'A & B',             reason: '4,3 &I' },
            { as: '2,3,4',      ln: 6, statement: '(A & B) & C',       reason: '5,2 &I' },
            { as: '1,2,3,4',    ln: 7, statement: 'D',                 reason: '1,6 →E' },
            { as: '1,2,3',      ln: 8, statement: 'A → D',             reason: '4,7 →I' },
            { as: '1,2',        ln: 9, statement: 'B → (A → D)',       reason: '3,8 →I' },
            { as: '1',         ln: 10, statement: 'C → (B → (A → D))', reason: '2,9 →I' }
        ]
    ))
    const ml_example_42_6_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml A).impi B A (λ(_1: ml B)._0)')
    test('ml_example_42_6_proof', () => expect(
        linearize(ml_example_42_6_proof, 'A', 'B → A')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: 'A',     reason: 'Premise' },
            { as: '2', ln: 2, statement: 'B',     reason: 'Assumption' },
            { as: '1', ln: 3, statement: 'B → A', reason: '2,1 →I' }
        ]
    ))
    const ml_example_42_7_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(_0: ml (imp A (imp B C))).impi (imp A B) (imp A C) (λ(_1: ml (imp A B)).impi A C (λ(_2: ml A).(λ(_3: ml B).(λ(_4: ml (imp B C)).(λ(_5: ml C)._5) (impe B C _4 _3)) (impe A (imp B C) _0 _2)) (impe A B _1 _2)))')
    test('ml_example_42_7_proof', () => expect(
        linearize(ml_example_42_7_proof, 'A → (B → C)', '(A → B) → (A → C)')
    ).toEqual(
        [
            { as: '1',     ln: 1, statement: 'A → (B → C)',       reason: 'Premise' },
            { as: '2',     ln: 2, statement: 'A → B',             reason: 'Assumption' },
            { as: '3',     ln: 3, statement: 'A',                 reason: 'Assumption' },
            { as: '1,3',   ln: 4, statement: 'B → C',             reason: '1,3 →E' },
            { as: '2,3',   ln: 5, statement: 'B',                 reason: '2,3 →E' },
            { as: '1,2,3', ln: 6, statement: 'C',                 reason: '4,5 →E' },
            { as: '1,2',   ln: 7, statement: 'A → C',             reason: '3,6 →I' },
            { as: '1',     ln: 8, statement: '(A → B) → (A → C)', reason: '2,7 →I' }
        ]
    ))
    const ml_example_44_1_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml (imp A B)).λ(_1: ml (not B)).noti A (λ(_2: ml A).(λ(_3: ml B).(λ(_4: ml absurd)._4) (note B _1 _3)) (impe A B _0 _2))')
    test('ml_example_44_1_proof', () => expect(
        linearize(ml_example_44_1_proof, 'A → B, ~B', '~A')
    ).toEqual(
        [
            { as: '1',     ln: 1, statement: 'A → B', reason: 'Premise' },
            { as: '2',     ln: 2, statement: '~B',    reason: 'Premise' },
            { as: '3',     ln: 3, statement: 'A',     reason: 'Assumption' },
            { as: '1,3',   ln: 4, statement: 'B',     reason: '1,3 →E' },
            { as: '1,2,3', ln: 5, statement: '⋏',     reason: '2,4 ~E' },
            { as: '1,2',   ln: 6, statement: '~A',    reason: '3,5 ~I' }
        ]
    ))
    const ml_example_44_2_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml (not B)).noti (and A B) (λ(_1: ml (and A B)).(λ(_2: ml A).λ(_3: ml B).(λ(_4: ml absurd)._4) (note B _0 _3)) (andel A B _1) (ander A B _1))')
    test('ml_example_44_2_proof', () => expect(
        linearize(ml_example_44_2_proof, '~B', '~(A & B)')
    ).toEqual(
        [
            { as: '1',    ln: 1, statement: '~B',       reason: 'Premise' },
            { as: '2',    ln: 2, statement: 'A & B',    reason: 'Assumption' },
            { as: '2',    ln: 3, statement: 'B',        reason: '2 &E' },
            { as: '1,2',  ln: 4, statement: '⋏',        reason: '1,3 ~E' },
            { as: '1',    ln: 5, statement: '~(A & B)', reason: '2,4 ~I' }
        ]
    ))
    const ml_example_44_3_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml (not (and A B))).impi A (not B) (λ(_1: ml A).noti B (λ(_2: ml B).(λ(_3: ml absurd)._3) (note (and A B) _0 (andi A B _1 _2))))')
    test('ml_example_44_3_proof', () => expect(
        linearize(ml_example_44_3_proof, '~(A & B)', 'A → ~B')
    ).toEqual(
        [
            { as: '1',     ln: 1, statement: '~(A & B)', reason: 'Premise' },
            { as: '2',     ln: 2, statement: 'A',        reason: 'Assumption' },
            { as: '3',     ln: 3, statement: 'B',        reason: 'Assumption' },
            { as: '2,3',   ln: 4, statement: 'A & B',    reason: '2,3 &I' },
            { as: '1,2,3', ln: 5, statement: '⋏',        reason: '1,4 ~E' },
            { as: '1,2',   ln: 6, statement: '~B',       reason: '3,5 ~I' },
            { as: '1',     ln: 7, statement: 'A → ~B',   reason: '2,6 →I' }
        ]
    ))
    const ml_example_44_4_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml (not (and A (not B)))).impi A B (λ(_1: ml A).dn B (noti (not B) (λ(_2: ml (not B)).(λ(_3: ml absurd)._3) (note (and A (not B)) _0 (andi A (not B) _1 _2)))))')
    test('ml_example_44_4_proof', () => expect(
        linearize(ml_example_44_4_proof, '~(A & ~B)', 'A → B')
    ).toEqual(
        [
            { as: '1',     ln: 1, statement: '~(A & ~B)', reason: 'Premise' },
            { as: '2',     ln: 2, statement: 'A',         reason: 'Assumption' },
            { as: '3',     ln: 3, statement: '~B',        reason: 'Assumption' },
            { as: '2,3',   ln: 4, statement: 'A & ~B',    reason: '2,3 &I' },
            { as: '1,2,3', ln: 5, statement: '⋏',         reason: '1,4 ~E' },
            { as: '1,2',   ln: 6, statement: '~~B',       reason: '3,5 ~I' },
            { as: '1,2',   ln: 7, statement: 'B',         reason: '6 DN' },
            { as: '1',     ln: 8, statement: 'A → B',     reason: '2,7 →I' }
        ]
    ))
    const ml_example_44_5_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml B).λ(_1: ml (not B)).dn A (noti (not A) (λ(_2: ml (not A)).(λ(_3: ml absurd)._3) (note B _1 _0)))')
    test('ml_example_44_5_proof', () => expect(
        linearize(ml_example_44_5_proof, 'B, ~B', 'A')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: 'B',   reason: 'Premise' },
            { as: '2',   ln: 2, statement: '~B',  reason: 'Premise' },
            { as: '3',   ln: 3, statement: '~A',  reason: 'Assumption' },
            { as: '1,2', ln: 4, statement: '⋏',   reason: '2,1 ~E' },
            { as: '1,2', ln: 5, statement: '~~A', reason: '3,4 ~I' },
            { as: '1,2', ln: 6, statement: 'A',   reason: '5 DN' }
        ]
    ))
    const ml_example_45_1_proof = try_parse('λ(A: o).λ(B: o).λ(D: o).λ(E: o).λ(_0: ml (imp (or A (and D E)) B)).impi A B (λ(_1: ml A).(λ(_2: ml B)._2) (impe (or A (and D E)) B _0 (oril A (and D E) _1)))')
    test('ml_example_45_1_proof', () => expect(
        linearize(ml_example_45_1_proof, '(A ∨ (D & E)) → B', 'A → B')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: '(A ∨ (D & E)) → B', reason: 'Premise' },
            { as: '2',   ln: 2, statement: 'A',                 reason: 'Assumption' },
            { as: '2',   ln: 3, statement: 'A ∨ (D & E)',       reason: '2 ∨I_left' },
            { as: '1,2', ln: 4, statement: 'B',                 reason: '1,3 →E' },
            { as: '1',   ln: 5, statement: 'A → B',             reason: '2,4 →I' }
        ]
    ))
    const ml_example_45_2_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(_0: ml (or (and A B) (and A C))).ore (and A B) (and A C) A _0 (λ(_1: ml (and A B)).(λ(_2: ml A).λ(_3: ml B)._2) (andel A B _1) (ander A B _1)) (λ(_1: ml (and A C)).(λ(_4: ml A).λ(_5: ml C)._4) (andel A C _1) (ander A C _1))')
    test('ml_example_45_2_proof', () => expect(
        linearize(ml_example_45_2_proof, '(A & B) ∨ (A & C)', 'A')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: '(A & B) ∨ (A & C)', reason: 'Premise' },
            { as: '2', ln: 2, statement: 'A & B',             reason: 'Assumption' },
            { as: '2', ln: 3, statement: 'A',                 reason: '2 &E' },
            { as: '4', ln: 4, statement: 'A & C',             reason: 'Assumption' },
            { as: '4', ln: 5, statement: 'A',                 reason: '4 &E' },
            { as: '1', ln: 6, statement: 'A',                 reason: '1,2,3,4,5 ∨E' }
        ]
    ))
    const ml_example_45_3_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml (or A B)).λ(_1: ml (not B)).ore A B A _0 (λ(_2: ml A)._2) (λ(_2: ml B).dn A (noti (not A) (λ(_3: ml (not A)).(λ(_4: ml absurd)._4) (note B _1 _2))))')
    test('ml_example_45_3_proof', () => expect(
        linearize(ml_example_45_3_proof, 'A ∨ B, ~B', 'A')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: 'A ∨ B', reason: 'Premise' },
            { as: '2',   ln: 2, statement: '~B',    reason: 'Premise' },
            { as: '3',   ln: 3, statement: 'A',     reason: 'Assumption' },
            { as: '4',   ln: 4, statement: 'B',     reason: 'Assumption' },
            { as: '5',   ln: 5, statement: '~A',    reason: 'Assumption' },
            { as: '2,4', ln: 6, statement: '⋏',     reason: '2,4 ~E' },
            { as: '2,4', ln: 7, statement: '~~A',   reason: '5,6 ~I' },
            { as: '2,4', ln: 8, statement: 'A',     reason: '7 DN' },
            { as: '1,2', ln: 9, statement: 'A',     reason: '1,3,3,4,8 ∨E' }
        ]
    ))
    const ml_example_45_4_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(_0: ml (and A (or B C))).(λ(_1: ml A).λ(_2: ml (or B C)).ore B C (or (and A B) (and A C)) _2 (λ(_3: ml B).oril (and A B) (and A C) (andi A B _1 _3)) (λ(_3: ml C).orir (and A B) (and A C) (andi A C _1 _3))) (andel A (or B C) _0) (ander A (or B C) _0)')
    test('ml_example_45_4_proof', () => expect(
        linearize(ml_example_45_4_proof, 'A & (B ∨ C)', '(A & B) ∨ (A & C)')
    ).toEqual(
        [
            { as: '1',    ln: 1, statement: 'A & (B ∨ C)',       reason: 'Premise' },
            { as: '1',    ln: 2, statement: 'B ∨ C',             reason: '1 &E' },
            { as: '3',    ln: 3, statement: 'B',                 reason: 'Assumption' },
            { as: '1',    ln: 4, statement: 'A',                 reason: '1 &E' },
            { as: '1,3',  ln: 5, statement: 'A & B',             reason: '4,3 &I' },
            { as: '1,3',  ln: 6, statement: '(A & B) ∨ (A & C)', reason: '5 ∨I_left' },
            { as: '7',    ln: 7, statement: 'C',                 reason: 'Assumption' },
            { as: '1,7',  ln: 8, statement: 'A & C',             reason: '4,7 &I' },
            { as: '1,7',  ln: 9, statement: '(A & B) ∨ (A & C)', reason: '8 ∨I_right' },
            { as: '1',   ln: 10, statement: '(A & B) ∨ (A & C)', reason: '2,3,6,7,9 ∨E' }
        ]
    ))
    const ml_example_45_5_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml (and (not A) (not B))).noti (or A B) (λ(_1: ml (or A B)).ore A B absurd _1 (λ(_2: ml A).(λ(_3: ml (not A)).λ(_4: ml (not B)).(λ(_5: ml absurd)._5) (note A _3 _2)) (andel (not A) (not B) _0) (ander (not A) (not B) _0)) (λ(_2: ml B).(λ(_6: ml (not A)).λ(_7: ml (not B)).(λ(_8: ml absurd)._8) (note B _7 _2)) (andel (not A) (not B) _0) (ander (not A) (not B) _0)))')
    test('ml_example_45_5_proof', () => expect(
        linearize(ml_example_45_5_proof, '~A & ~B', '~(A ∨ B)')
    ).toEqual(
        [
            { as: '1',      ln: 1, statement: '~A & ~B',  reason: 'Premise' },
            { as: '2',      ln: 2, statement: 'A ∨ B',    reason: 'Assumption' },
            { as: '3',      ln: 3, statement: 'A',        reason: 'Assumption' },
            { as: '1',      ln: 4, statement: '~A',       reason: '1 &E' },
            { as: '1,3',  ln: 5, statement: '⋏',        reason: '4,3 ~E' },
            { as: '6',    ln: 6, statement: 'B',        reason: 'Assumption' },
            { as: '1',    ln: 7, statement: '~B',       reason: '1 &E' },
            { as: '1,6',  ln: 8, statement: '⋏',        reason: '7,6 ~E' },
            { as: '1,2',  ln: 9, statement: '⋏',        reason: '2,3,5,6,8 ∨E' },
            { as: '1',   ln: 10, statement: '~(A ∨ B)', reason: '2,9 ~I' }
        ]
    ))
    const ml_example_45_6_proof = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(_0: ml (or A (or B C))).ore A (or B C) (or (or A B) C) _0 (λ(_1: ml A).oril (or A B) C (oril A B _1)) (λ(_1: ml (or B C)).ore B C (or (or A B) C) _1 (λ(_2: ml B).oril (or A B) C (orir A B _2)) (λ(_2: ml C).orir (or A B) C _2))')
    test('ml_example_45_6_proof', () => expect(
        linearize(ml_example_45_6_proof, 'A ∨ (B ∨ C)', '(A ∨ B) ∨ C')
    ).toEqual(
        [
            { as: '1',  ln: 1, statement: 'A ∨ (B ∨ C)', reason: 'Premise' },
            { as: '2',  ln: 2, statement: 'A',           reason: 'Assumption' },
            { as: '2',  ln: 3, statement: 'A ∨ B',       reason: '2 ∨I_left' },
            { as: '2',  ln: 4, statement: '(A ∨ B) ∨ C', reason: '3 ∨I_left' },
            { as: '5',  ln: 5, statement: 'B ∨ C',       reason: 'Assumption' },
            { as: '6',  ln: 6, statement: 'B',           reason: 'Assumption' },
            { as: '6',  ln: 7, statement: 'A ∨ B',       reason: '6 ∨I_right' },
            { as: '6',  ln: 8, statement: '(A ∨ B) ∨ C', reason: '7 ∨I_left' },
            { as: '9',  ln: 9, statement: 'C',           reason: 'Assumption' },
            { as: '9', ln: 10, statement: '(A ∨ B) ∨ C', reason: '9 ∨I_right' },
            { as: '5', ln: 11, statement: '(A ∨ B) ∨ C', reason: '5,6,8,9,10 ∨E' },
            { as: '1', ln: 12, statement: '(A ∨ B) ∨ C', reason: '1,2,4,5,11 ∨E' }
        ]
    ))
    const ml_example_45_7_proof = try_parse('λ(A: o).dn (or A (not A)) (noti (not (or A (not A))) (λ(_0: ml (not (or A (not A)))).(λ(_1: ml absurd)._1) (note (or A (not A)) _0 (orir A (not A) (noti A (λ(_2: ml A).(λ(_3: ml absurd)._3) (note (or A (not A)) _0 (oril A (not A) _2))))))))')
    test('ml_example_45_7_proof', () => expect(
        linearize(ml_example_45_7_proof, '', 'A ∨ ~A')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: '~(A ∨ ~A)',  reason: 'Assumption' },
            { as: '2',   ln: 2, statement: 'A',          reason: 'Assumption' },
            { as: '2',   ln: 3, statement: 'A ∨ ~A',     reason: '2 ∨I_left' },
            { as: '1,2', ln: 4, statement: '⋏',          reason: '1,3 ~E' },
            { as: '1',   ln: 5, statement: '~A',         reason: '2,4 ~I' },
            { as: '1',   ln: 6, statement: 'A ∨ ~A',     reason: '5 ∨I_right' },
            { as: '1',   ln: 7, statement: '⋏',          reason: '1,6 ~E' },
            { as: '',    ln: 8, statement: '~~(A ∨ ~A)', reason: '1,7 ~I' },
            { as: '',    ln: 9, statement: 'A ∨ ~A',     reason: '8 DN' }
        ]
    ))
    const ml_example_46_1_proof = try_parse('λ(A: o).dfr A A (andi (imp A A) (imp A A) (impi A A (λ(_0: ml A)._0)) (impi A A (λ(_1: ml A)._1)))')
    test('ml_example_46_1_proof', () => expect(
        linearize(ml_example_46_1_proof, '', 'A ↔ A')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: 'A',                 reason: 'Assumption' },
            { as: '',  ln: 2, statement: 'A → A',             reason: '1,1 →I' },
            { as: '',  ln: 3, statement: '(A → A) & (A → A)', reason: '2,2 &I' },
            { as: '',  ln: 4, statement: 'A ↔ A',             reason: '3 defn' }
        ]
    ))
    const ml_example_46_2_proof = try_parse('λ(A: o).λ(B: o).λ(_0: ml (iff A (not B))).noti (iff A B) (λ(_1: ml (iff A B)).(λ(_2: ml (and (imp A (not B)) (imp (not B) A))).(λ(_3: ml (and (imp A B) (imp B A))).(λ(_4: ml (imp A (not B))).λ(_5: ml (imp (not B) A)).(λ(_6: ml (imp A B)).λ(_7: ml (imp B A)).(λ(_8: ml A).(λ(_13: ml B).(λ(_14: ml (not B)).(λ(_15: ml absurd)._15) (note B _14 _13)) (impe A (not B) _4 _8)) (impe A B _6 _8)) (impe (not B) A _5 (noti B (λ(_9: ml B).(λ(_10: ml A).(λ(_11: ml (not B)).(λ(_12: ml absurd)._12) (note B _11 _9)) (impe A (not B) _4 _10)) (impe B A _7 _9))))) (andel (imp A B) (imp B A) _3) (ander (imp A B) (imp B A) _3)) (andel (imp A (not B)) (imp (not B) A) _2) (ander (imp A (not B)) (imp (not B) A) _2)) (dfl A B _1)) (dfl A (not B) _0))')
    test('ml_example_46_2_proof', () => expect(
        linearize(ml_example_46_2_proof, 'A ↔ ~B', '~(A ↔ B)')
    ).toEqual(
        // This proof is one line shorter than the one MacLogic I generated, but is still correct according to MacLogic I.
        [
            { as: '1',      ln: 1, statement: 'A ↔ ~B',              reason: 'Premise' },
            { as: '2',      ln: 2, statement: 'A ↔ B',               reason: 'Assumption' },
            { as: '1',      ln: 3, statement: '(A → ~B) & (~B → A)', reason: '1 defn' },
            { as: '1',      ln: 4, statement: 'A → ~B',              reason: '3 &E' },
            { as: '1',      ln: 5, statement: '~B → A',              reason: '3 &E' },
            { as: '6',      ln: 6, statement: 'B',                   reason: 'Assumption' },
            { as: '2',      ln: 7, statement: '(A → B) & (B → A)',   reason: '2 defn' },
            { as: '2',      ln: 8, statement: 'B → A',               reason: '7 &E' },
            { as: '2,6',    ln: 9, statement: 'A',                   reason: '8,6 →E' },
            { as: '1,2,6', ln: 10, statement: '~B',                  reason: '4,9 →E' },
            { as: '1,2,6', ln: 11, statement: '⋏',                   reason: '10,6 ~E' },
            { as: '1,2',   ln: 12, statement: '~B',                  reason: '6,11 ~I' },
            { as: '1,2',   ln: 13, statement: 'A',                   reason: '5,12 →E' },
            { as: '2',     ln: 14, statement: 'A → B',               reason: '7 &E' },
            { as: '1,2',   ln: 15, statement: 'B',                   reason: '14,13 →E' },
            { as: '1,2',   ln: 16, statement: '⋏',                   reason: '12,15 ~E' },
            { as: '1',     ln: 17, statement: '~(A ↔ B)',            reason: '2,16 ~I' }
        ]
    ))
    const ml_example_63_1_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(b: i).λ(A: o).λ(_0: ml (imp A (G b))).impi A (exists (λ(x: i).G x)) (λ(_1: ml A).existsi (λ(x: i).G x) b ((λ(_2: ml (G b))._2) (impe A (G b) _0 _1)))')
    test('ml_example_63_1_proof', () => expect(
        linearize(ml_example_63_1_proof, 'A → Gb', 'A → (∃x)Gx')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: 'A → Gb',     reason: 'Premise' },
            { as: '2',   ln: 2, statement: 'A',          reason: 'Assumption' },
            { as: '1,2', ln: 3, statement: 'Gb',         reason: '1,2 →E' },
            { as: '1,2', ln: 4, statement: '(∃x)Gx',     reason: '3 ∃I' },
            { as: '1',   ln: 5, statement: 'A → (∃x)Gx', reason: '2,4 →I' }
        ]
    ))
    const ml_example_63_2_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(H: Π(x: i).o).λ(a: i).λ(_0: ml (forall (λ(x: i).imp (F x) (G x)))).λ(_1: ml (F a)).existsi (λ(x: i).imp (not (G x)) (H x)) a (impi (not (G a)) (H a) (λ(_2: ml (not (G a))).dn (H a) (noti (not (H a)) (λ(_3: ml (not (H a))).(λ(_4: ml (imp (F a) (G a))).(λ(_5: ml (G a)).(λ(_6: ml absurd)._6) (note (G a) _2 _5)) (impe (F a) (G a) _4 _1)) (foralle (λ(x: i).imp (F x) (G x)) a _0)))))')
    test('ml_example_63_2_proof', () => expect(
        linearize(ml_example_63_2_proof, '(∀x)(Fx → Gx), Fa', '(∃x)(~Gx → Hx)')
    ).toEqual(
        [
            { as: '1',     ln: 1, statement: '(∀x)(Fx → Gx)',  reason: 'Premise' },
            { as: '2',     ln: 2, statement: 'Fa',             reason: 'Premise' },
            { as: '3',     ln: 3, statement: '~Ga',            reason: 'Assumption' },
            { as: '4',     ln: 4, statement: '~Ha',            reason: 'Assumption' },
            { as: '1',     ln: 5, statement: 'Fa → Ga',        reason: '1 ∀E' },
            { as: '1,2',   ln: 6, statement: 'Ga',             reason: '5,2 →E' },
            { as: '1,2,3', ln: 7, statement: '⋏',              reason: '3,6 ~E' },
            { as: '1,2,3', ln: 8, statement: '~~Ha',           reason: '4,7 ~I' },
            { as: '1,2,3', ln: 9, statement: 'Ha',             reason: '8 DN' },
            { as: '1,2',  ln: 10, statement: '~Ga → Ha',       reason: '3,9 →I' },
            { as: '1,2',  ln: 11, statement: '(∃x)(~Gx → Hx)', reason: '10 ∃I' }
        ]
    ))
    const ml_example_63_3_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(_0: ml (forall (λ(x: i).imp (F x) (G x)))).λ(_1: ml (forall (λ(x: i).F x))).foralli (λ(x: i).G x) (λ(a: i).(λ(_2: ml (F a)).(λ(_3: ml (imp (F a) (G a))).(λ(_4: ml (G a))._4) (impe (F a) (G a) _3 _2)) (foralle (λ(x: i).imp (F x) (G x)) a _0)) (foralle (λ(x: i).F x) a _1))')
    test('ml_example_63_3_proof', () => expect(
        linearize(ml_example_63_3_proof, '(∀x)(Fx → Gx), (∀x)Fx', '(∀x)Gx')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: '(∀x)(Fx → Gx)', reason: 'Premise' },
            { as: '2',   ln: 2, statement: '(∀x)Fx',        reason: 'Premise' },
            { as: '1',   ln: 3, statement: 'Fa → Ga',       reason: '1 ∀E' },
            { as: '2',   ln: 4, statement: 'Fa',            reason: '2 ∀E' },
            { as: '1,2', ln: 5, statement: 'Ga',            reason: '3,4 →E' },
            { as: '1,2', ln: 6, statement: '(∀x)Gx',        reason: '5 ∀I' }
        ]
    ))
    const ml_example_63_4_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(_0: ml (not (exists (λ(x: i).and (F x) (G x))))).foralli (λ(x: i).imp (F x) (not (G x))) (λ(a: i).impi (F a) (not (G a)) (λ(_1: ml (F a)).noti (G a) (λ(_2: ml (G a)).(λ(_3: ml absurd)._3) (note (exists (λ(x: i).and (F x) (G x))) _0 (existsi (λ(x: i).and (F x) (G x)) a (andi (F a) (G a) _1 _2))))))')
    test('ml_example_63_4_proof', () => expect(
        linearize(ml_example_63_4_proof, '~(∃x)(Fx & Gx)', '(∀x)(Fx → ~Gx)')
    ).toEqual(
        [
            { as: '1',     ln: 1, statement: '~(∃x)(Fx & Gx)', reason: 'Premise' },
            { as: '2',     ln: 2, statement: 'Fa',             reason: 'Assumption' },
            { as: '3',     ln: 3, statement: 'Ga',             reason: 'Assumption' },
            { as: '2,3',   ln: 4, statement: 'Fa & Ga',        reason: '2,3 &I' },
            { as: '2,3',   ln: 5, statement: '(∃x)(Fx & Gx)',  reason: '4 ∃I' },
            { as: '1,2,3', ln: 6, statement: '⋏',              reason: '1,5 ~E' },
            { as: '1,2',   ln: 7, statement: '~Ga',            reason: '3,6 ~I' },
            { as: '1',     ln: 8, statement: 'Fa → ~Ga',       reason: '2,7 →I' },
            { as: '1',     ln: 9, statement: '(∀x)(Fx → ~Gx)', reason: '8 ∀I' }
        ]
    ))
    const ml_example_63_5_proof = try_parse('λ(F: Π(x: i).o).λ(_0: ml (not (forall (λ(x: i).F x)))).dn (exists (λ(x: i).not (F x))) (noti (not (exists (λ(x: i).not (F x)))) (λ(_1: ml (not (exists (λ(x: i).not (F x))))).(λ(_2: ml absurd)._2) (note (forall (λ(x: i).F x)) _0 (foralli (λ(x: i).F x) (λ(a: i).dn (F a) (noti (not (F a)) (λ(_3: ml (not (F a))).(λ(_4: ml absurd)._4) (note (exists (λ(x: i).not (F x))) _1 (existsi (λ(x: i).not (F x)) a _3)))))))))')
    test('ml_example_63_5_proof', () => expect(
        linearize(ml_example_63_5_proof, '~(∀x)Fx', '(∃x)~Fx')
    ).toEqual(
        [
            { as: '1',    ln: 1, statement: '~(∀x)Fx',   reason: 'Premise' },
            { as: '2',    ln: 2, statement: '~(∃x)~Fx',  reason: 'Assumption' },
            { as: '3',    ln: 3, statement: '~Fa',       reason: 'Assumption' },
            { as: '3',    ln: 4, statement: '(∃x)~Fx',   reason: '3 ∃I' },
            { as: '2,3',  ln: 5, statement: '⋏',         reason: '2,4 ~E' },
            { as: '2',    ln: 6, statement: '~~Fa',      reason: '3,5 ~I' },
            { as: '2',    ln: 7, statement: 'Fa',        reason: '6 DN' },
            { as: '2',    ln: 8, statement: '(∀x)Fx',    reason: '7 ∀I' },
            { as: '1,2',  ln: 9, statement: '⋏',         reason: '1,8 ~E' },
            { as: '1',   ln: 10, statement: '~~(∃x)~Fx', reason: '2,9 ~I' },
            { as: '1',   ln: 11, statement: '(∃x)~Fx',   reason: '10 DN' }
        ]
    ))
    const ml_example_63_6_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(_0: ml (forall (λ(x: i).imp (F x) (forall (λ(y: i).G y))))).foralli (λ(x: i).forall (λ(y: i).imp (F x) (G y))) (λ(a: i).foralli (λ(y: i).imp (F a) (G y)) (λ(b: i).impi (F a) (G b) (λ(_1: ml (F a)).(λ(_2: ml (imp (F a) (forall (λ(y: i).G y)))).(λ(_3: ml (forall (λ(y: i).G y))).(λ(_4: ml (G b))._4) (foralle (λ(y: i).G y) b _3)) (impe (F a) (forall (λ(y: i).G y)) _2 _1)) (foralle (λ(x: i).imp (F x) (forall (λ(y: i).G y))) a _0))))')
    test('ml_example_63_6_proof', () => expect(
        linearize(ml_example_63_6_proof, '(∀x)(Fx → (∀y)Gy)', '(∀x)(∀y)(Fx → Gy)')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: '(∀x)(Fx → (∀y)Gy)', reason: 'Premise' },
            { as: '2',   ln: 2, statement: 'Fa',                reason: 'Assumption' },
            { as: '1',   ln: 3, statement: 'Fa → (∀y)Gy',       reason: '1 ∀E' },
            { as: '1,2', ln: 4, statement: '(∀y)Gy',            reason: '3,2 →E' },
            { as: '1,2', ln: 5, statement: 'Gb',                reason: '4 ∀E' },
            { as: '1',   ln: 6, statement: 'Fa → Gb',           reason: '2,5 →I' },
            { as: '1',   ln: 7, statement: '(∀y)(Fa → Gy)',     reason: '6 ∀I' },
            { as: '1',   ln: 8, statement: '(∀x)(∀y)(Fx → Gy)', reason: '7 ∀I' }
        ]
    ))
    const ml_example_64_2_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(_0: ml (forall (λ(x: i).imp (F x) (G x)))).λ(_1: ml (exists (λ(x: i).not (G x)))).existse (λ(x: i).not (G x)) (exists (λ(x: i).not (F x))) _1 (λ(a: i).λ(_2: ml (not (G a))).existsi (λ(x: i).not (F x)) a (noti (F a) (λ(_3: ml (F a)).(λ(_4: ml (imp (F a) (G a))).(λ(_5: ml (G a)).(λ(_6: ml absurd)._6) (note (G a) _2 _5)) (impe (F a) (G a) _4 _3)) (foralle (λ(x: i).imp (F x) (G x)) a _0))))')
    test('ml_example_64_2_proof', () => expect(
        linearize(ml_example_64_2_proof, '(∀x)(Fx → Gx), (∃x)~Gx', '(∃x)~Fx')
    ).toEqual(
        [
            { as: '1',      ln: 1, statement: '(∀x)(Fx → Gx)', reason: 'Premise' },
            { as: '2',      ln: 2, statement: '(∃x)~Gx',       reason: 'Premise' },
            { as: '3',      ln: 3, statement: '~Ga',           reason: 'Assumption' },
            { as: '4',      ln: 4, statement: 'Fa',            reason: 'Assumption' },
            { as: '1',      ln: 5, statement: 'Fa → Ga',       reason: '1 ∀E' },
            { as: '1,4',    ln: 6, statement: 'Ga',            reason: '5,4 →E' },
            { as: '1,3,4',  ln: 7, statement: '⋏',             reason: '3,6 ~E' },
            { as: '1,3',    ln: 8, statement: '~Fa',           reason: '4,7 ~I' },
            { as: '1,3',    ln: 9, statement: '(∃x)~Fx',       reason: '8 ∃I' },
            { as: '1,2',   ln: 10, statement: '(∃x)~Fx',       reason: '2,3,9 ∃E' }
        ]
    ))
    const ml_example_64_3_proof = try_parse('λ(F: Π(x: i).o).λ(_0: ml (exists (λ(x: i).not (F x)))).noti (forall (λ(x: i).F x)) (λ(_1: ml (forall (λ(x: i).F x))).existse (λ(x: i).not (F x)) absurd _0 (λ(a: i).λ(_2: ml (not (F a))).(λ(_3: ml (F a)).(λ(_4: ml absurd)._4) (note (F a) _2 _3)) (foralle (λ(x: i).F x) a _1)))')
    test('ml_example_64_3_proof', () => expect(
        linearize(ml_example_64_3_proof, '(∃x)~Fx', '~(∀x)Fx')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: '(∃x)~Fx', reason: 'Premise' },
            { as: '2',   ln: 2, statement: '(∀x)Fx',  reason: 'Assumption' },
            { as: '3',   ln: 3, statement: '~Fa',     reason: 'Assumption' },
            { as: '2',   ln: 4, statement: 'Fa',      reason: '2 ∀E' },
            { as: '2,3', ln: 5, statement: '⋏',       reason: '3,4 ~E' },
            { as: '1,2', ln: 6, statement: '⋏',       reason: '1,3,5 ∃E' },
            { as: '1',   ln: 7, statement: '~(∀x)Fx', reason: '2,6 ~I' }
        ]
    ))
    const ml_example_64_4_proof = try_parse('λ(F: Π(x: i).o).λ(A: o).λ(_0: ml (exists (λ(x: i).imp (F x) A))).impi (forall (λ(x: i).F x)) A (λ(_1: ml (forall (λ(x: i).F x))).existse (λ(x: i).imp (F x) A) A _0 (λ(a: i).λ(_2: ml (imp (F a) A)).(λ(_3: ml (F a)).(λ(_4: ml A)._4) (impe (F a) A _2 _3)) (foralle (λ(x: i).F x) a _1)))')
    test('ml_example_64_4_proof', () => expect(
        linearize(ml_example_64_4_proof, '(∃x)(Fx → A)', '(∀x)Fx → A')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: '(∃x)(Fx → A)', reason: 'Premise' },
            { as: '2',   ln: 2, statement: '(∀x)Fx',       reason: 'Assumption' },
            { as: '3',   ln: 3, statement: 'Fa → A',       reason: 'Assumption' },
            { as: '2',   ln: 4, statement: 'Fa',           reason: '2 ∀E' },
            { as: '2,3', ln: 5, statement: 'A',            reason: '3,4 →E' },
            { as: '1,2', ln: 6, statement: 'A',            reason: '1,3,5 ∃E' },
            { as: '1',   ln: 7, statement: '(∀x)Fx → A',   reason: '2,6 →I' }
        ]
    ))
    const ml_example_64_5_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(_0: ml (exists (λ(x: i).exists (λ(y: i).and (F x) (G y))))).existse (λ(x: i).exists (λ(y: i).and (F x) (G y))) (exists (λ(y: i).exists (λ(x: i).and (G y) (F x)))) _0 (λ(a: i).λ(_1: ml (exists (λ(y: i).and (F a) (G y)))).existse (λ(y: i).and (F a) (G y)) (exists (λ(y: i).exists (λ(x: i).and (G y) (F x)))) _1 (λ(b: i).λ(_2: ml (and (F a) (G b))).(λ(_3: ml (F a)).λ(_4: ml (G b)).existsi (λ(y: i).exists (λ(x: i).and (G y) (F x))) b (existsi (λ(x: i).and (G b) (F x)) a (andi (G b) (F a) _4 _3))) (andel (F a) (G b) _2) (ander (F a) (G b) _2)))')
    test('ml_example_64_5_proof', () => expect(
        linearize(ml_example_64_5_proof, '(∃x)(∃y)(Fx & Gy)', '(∃y)(∃x)(Gy & Fx)')
    ).toEqual(
        [
            { as: '1',  ln: 1, statement: '(∃x)(∃y)(Fx & Gy)', reason: 'Premise' },
            { as: '2',  ln: 2, statement: '(∃y)(Fa & Gy)',     reason: 'Assumption' },
            { as: '3',  ln: 3, statement: 'Fa & Gb',           reason: 'Assumption' },
            { as: '3',  ln: 4, statement: 'Gb',                reason: '3 &E' },
            { as: '3',  ln: 5, statement: 'Fa',                reason: '3 &E' },
            { as: '3',  ln: 6, statement: 'Gb & Fa',           reason: '4,5 &I' },
            { as: '3',  ln: 7, statement: '(∃x)(Gb & Fx)',     reason: '6 ∃I' },
            { as: '3',  ln: 8, statement: '(∃y)(∃x)(Gy & Fx)', reason: '7 ∃I' },
            { as: '2',  ln: 9, statement: '(∃y)(∃x)(Gy & Fx)', reason: '2,3,8 ∃E' },
            { as: '1', ln: 10, statement: '(∃y)(∃x)(Gy & Fx)', reason: '1,2,9 ∃E' }
        ]
    ))
    const ml_example_64_6_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(_0: ml (forall (λ(x: i).exists (λ(y: i).and (F x) (G y))))).dn (exists (λ(y: i).forall (λ(x: i).and (F x) (G y)))) (noti (not (exists (λ(y: i).forall (λ(x: i).and (F x) (G y))))) (λ(_1: ml (not (exists (λ(y: i).forall (λ(x: i).and (F x) (G y)))))).(λ(_2: ml absurd)._2) (note (exists (λ(y: i).forall (λ(x: i).and (F x) (G y)))) _1 (individuali (exists (λ(y: i).forall (λ(x: i).and (F x) (G y)))) (λ(b: i).existsi (λ(y: i).forall (λ(x: i).and (F x) (G y))) b (foralli (λ(x: i).and (F x) (G b)) (λ(a: i).(λ(_3: ml (exists (λ(y: i).and (F a) (G y)))).existse (λ(y: i).and (F a) (G y)) (and (F a) (G b)) _3 (λ(c: i).λ(_4: ml (and (F a) (G c))).(λ(_5: ml (F a)).λ(_6: ml (G c)).andi (F a) (G b) _5 (dn (G b) (noti (not (G b)) (λ(_7: ml (not (G b))).(λ(_8: ml absurd)._8) (note (exists (λ(y: i).forall (λ(x: i).and (F x) (G y)))) _1 (existsi (λ(y: i).forall (λ(x: i).and (F x) (G y))) c (foralli (λ(x: i).and (F x) (G c)) (λ(d: i).(λ(_9: ml (exists (λ(y: i).and (F d) (G y)))).existse (λ(y: i).and (F d) (G y)) (and (F d) (G c)) _9 (λ(e: i).λ(_10: ml (and (F d) (G e))).(λ(_11: ml (F d)).λ(_12: ml (G e)).andi (F d) (G c) _11 _6) (andel (F d) (G e) _10) (ander (F d) (G e) _10))) (foralle (λ(x: i).exists (λ(y: i).and (F x) (G y))) d _0))))))))) (andel (F a) (G c) _4) (ander (F a) (G c) _4))) (foralle (λ(x: i).exists (λ(y: i).and (F x) (G y))) a _0))))))))')
    test('ml_example_64_6_proof', () => expect(
        linearize(ml_example_64_6_proof, '(∀x)(∃y)(Fx & Gy)', '(∃y)(∀x)(Fx & Gy)')
    ).toEqual(
        // There is definitely a simpler proof than this
        [
            { as: '1',      ln: 1, statement: '(∀x)(∃y)(Fx & Gy)',   reason: 'Premise' },
            { as: '2',      ln: 2, statement: '~(∃y)(∀x)(Fx & Gy)',  reason: 'Assumption' },
            { as: '1',      ln: 3, statement: '(∃y)(Fa & Gy)',       reason: '1 ∀E' },
            { as: '4',      ln: 4, statement: 'Fa & Gc',             reason: 'Assumption' },
            { as: '4',      ln: 5, statement: 'Fa',                  reason: '4 &E' },
            { as: '6',      ln: 6, statement: '~Gb',                 reason: 'Assumption' },
            { as: '1',      ln: 7, statement: '(∃y)(Fd & Gy)',       reason: '1 ∀E' },
            { as: '8',      ln: 8, statement: 'Fd & Ge',             reason: 'Assumption' },
            { as: '8',      ln: 9, statement: 'Fd',                  reason: '8 &E' },
            { as: '4',     ln: 10, statement: 'Gc',                  reason: '4 &E' },
            { as: '4,8',   ln: 11, statement: 'Fd & Gc',             reason: '9,10 &I' },
            { as: '1,4',   ln: 12, statement: 'Fd & Gc',             reason: '7,8,11 ∃E' },
            { as: '1,4',   ln: 13, statement: '(∀x)(Fx & Gc)',       reason: '12 ∀I' },
            { as: '1,4',   ln: 14, statement: '(∃y)(∀x)(Fx & Gy)',   reason: '13 ∃I' },
            { as: '1,2,4', ln: 15, statement: '⋏',                   reason: '2,14 ~E' },
            { as: '1,2,4', ln: 16, statement: '~~Gb',                reason: '6,15 ~I' },
            { as: '1,2,4', ln: 17, statement: 'Gb',                  reason: '16 DN' },
            { as: '1,2,4', ln: 18, statement: 'Fa & Gb',             reason: '5,17 &I' },
            { as: '1,2',   ln: 19, statement: 'Fa & Gb',             reason: '3,4,18 ∃E' },
            { as: '1,2',   ln: 20, statement: '(∀x)(Fx & Gb)',       reason: '19 ∀I' },
            { as: '1,2',   ln: 21, statement: '(∃y)(∀x)(Fx & Gy)',   reason: '20 ∃I' },
            { as: '1,2',   ln: 22, statement: '⋏',                   reason: '2,21 ~E' },
            { as: '1',     ln: 23, statement: '~~(∃y)(∀x)(Fx & Gy)', reason: '2,22 ~I' },
            { as: '1',     ln: 24, statement: '(∃y)(∀x)(Fx & Gy)',   reason: '23 DN' }
        ]
    ))
    const ml_example_83_1_proof = try_parse('λ(L: Π(x: i).Π(y: i).o).λ(_0: ml (exists (λ(x: i).forall (λ(y: i).L x y)))).existse (λ(x: i).forall (λ(y: i).L x y)) (forall (λ(y: i).exists (λ(x: i).L x y))) _0 (λ(a: i).λ(_1: ml (forall (λ(y: i).L a y))).foralli (λ(y: i).exists (λ(x: i).L x y)) (λ(b: i).existsi (λ(x: i).L x b) a ((λ(_2: ml (L a b))._2) (foralle (λ(y: i).L a y) b _1))))')
    test('ml_example_83_1_proof', () => expect(
        linearize(ml_example_83_1_proof, '(∃x)(∀y)Lxy', '(∀y)(∃x)Lxy')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: '(∃x)(∀y)Lxy', reason: 'Premise' },
            { as: '2', ln: 2, statement: '(∀y)Lay',     reason: 'Assumption' },
            { as: '2', ln: 3, statement: 'Lab',         reason: '2 ∀E' },
            { as: '2', ln: 4, statement: '(∃x)Lxb',     reason: '3 ∃I' },
            { as: '2', ln: 5, statement: '(∀y)(∃x)Lxy', reason: '4 ∀I' },
            { as: '1', ln: 6, statement: '(∀y)(∃x)Lxy', reason: '1,2,5 ∃E' }
        ]
    ))
    const ml_example_83_2_proof = try_parse('λ(R: Π(x: i).Π(y: i).o).λ(_0: ml (forall (λ(x: i).exists (λ(y: i).R x y)))).λ(_1: ml (forall (λ(x: i).forall (λ(y: i).imp (R x y) (R y x))))).foralli (λ(x: i).exists (λ(y: i).and (R x y) (R y x))) (λ(a: i).(λ(_2: ml (exists (λ(y: i).R a y))).existse (λ(y: i).R a y) (exists (λ(y: i).and (R a y) (R y a))) _2 (λ(b: i).λ(_3: ml (R a b)).existsi (λ(y: i).and (R a y) (R y a)) b (andi (R a b) (R b a) _3 ((λ(_4: ml (forall (λ(y: i).imp (R a y) (R y a)))).(λ(_5: ml (imp (R a b) (R b a))).(λ(_6: ml (R b a))._6) (impe (R a b) (R b a) _5 _3)) (foralle (λ(y: i).imp (R a y) (R y a)) b _4)) (foralle (λ(x: i).forall (λ(y: i).imp (R x y) (R y x))) a _1))))) (foralle (λ(x: i).exists (λ(y: i).R x y)) a _0))')
    test('ml_example_83_2_proof', () => expect(
        linearize(ml_example_83_2_proof, '(∀x)(∃y)Rxy, (∀x)(∀y)(Rxy → Ryx)', '(∀x)(∃y)(Rxy & Ryx)')
    ).toEqual(
        [
            { as: '1',    ln: 1, statement: '(∀x)(∃y)Rxy',         reason: 'Premise' },
            { as: '2',    ln: 2, statement: '(∀x)(∀y)(Rxy → Ryx)', reason: 'Premise' },
            { as: '1',    ln: 3, statement: '(∃y)Ray',             reason: '1 ∀E' },
            { as: '4',    ln: 4, statement: 'Rab',                 reason: 'Assumption' },
            { as: '2',    ln: 5, statement: '(∀y)(Ray → Rya)',     reason: '2 ∀E' },
            { as: '2',    ln: 6, statement: 'Rab → Rba',           reason: '5 ∀E' },
            { as: '2,4',  ln: 7, statement: 'Rba',                 reason: '6,4 →E' },
            { as: '2,4',  ln: 8, statement: 'Rab & Rba',           reason: '4,7 &I' },
            { as: '2,4',  ln: 9, statement: '(∃y)(Ray & Rya)',     reason: '8 ∃I' },
            { as: '1,2', ln: 10, statement: '(∃y)(Ray & Rya)',     reason: '3,4,9 ∃E' },
            { as: '1,2', ln: 11, statement: '(∀x)(∃y)(Rxy & Ryx)', reason: '10 ∀I' }
        ]
    ))
    const ml_example_83_3_proof = try_parse('λ(F: Π(x: i).o).λ(G: Π(x: i).o).λ(R: Π(x: i).Π(y: i).o).λ(S: Π(x: i).Π(y: i).o).λ(_0: ml (forall (λ(x: i).imp (F x) (G x)))).λ(_1: ml (forall (λ(x: i).forall (λ(y: i).imp (R x y) (S y x))))).λ(_2: ml (forall (λ(x: i).forall (λ(y: i).imp (S x y) (S y x))))).foralli (λ(x: i).imp (exists (λ(y: i).and (F x) (R x y))) (exists (λ(y: i).and (G x) (S x y)))) (λ(a: i).impi (exists (λ(y: i).and (F a) (R a y))) (exists (λ(y: i).and (G a) (S a y))) (λ(_3: ml (exists (λ(y: i).and (F a) (R a y)))).existse (λ(y: i).and (F a) (R a y)) (exists (λ(y: i).and (G a) (S a y))) _3 (λ(b: i).λ(_4: ml (and (F a) (R a b))).(λ(_5: ml (F a)).λ(_6: ml (R a b)).(λ(_7: ml (imp (F a) (G a))).(λ(_8: ml (G a)).existsi (λ(y: i).and (G a) (S a y)) b (andi (G a) (S a b) _8 ((λ(_9: ml (forall (λ(y: i).imp (R a y) (S y a)))).(λ(_10: ml (imp (R a b) (S b a))).(λ(_11: ml (S b a)).(λ(_12: ml (forall (λ(y: i).imp (S b y) (S y b)))).(λ(_13: ml (imp (S b a) (S a b))).(λ(_14: ml (S a b))._14) (impe (S b a) (S a b) _13 _11)) (foralle (λ(y: i).imp (S b y) (S y b)) a _12)) (foralle (λ(x: i).forall (λ(y: i).imp (S x y) (S y x))) b _2)) (impe (R a b) (S b a) _10 _6)) (foralle (λ(y: i).imp (R a y) (S y a)) b _9)) (foralle (λ(x: i).forall (λ(y: i).imp (R x y) (S y x))) a _1)))) (impe (F a) (G a) _7 _5)) (foralle (λ(x: i).imp (F x) (G x)) a _0)) (andel (F a) (R a b) _4) (ander (F a) (R a b) _4))))')
    test('ml_example_83_3_proof', () => expect(
        linearize(ml_example_83_3_proof, '(∀x)(Fx → Gx), (∀x)(∀y)(Rxy → Syx), (∀x)(∀y)(Sxy → Syx)', '(∀x)((∃y)(Fx & Rxy) → (∃y)(Gx & Sxy))')
    ).toEqual(
        [
            { as: '1',        ln: 1, statement: '(∀x)(Fx → Gx)',                         reason: 'Premise' },
            { as: '2',        ln: 2, statement: '(∀x)(∀y)(Rxy → Syx)',                   reason: 'Premise' },
            { as: '3',        ln: 3, statement: '(∀x)(∀y)(Sxy → Syx)',                   reason: 'Premise' },
            { as: '4',        ln: 4, statement: '(∃y)(Fa & Ray)',                        reason: 'Assumption' },
            { as: '5',        ln: 5, statement: 'Fa & Rab',                              reason: 'Assumption' },
            { as: '1',        ln: 6, statement: 'Fa → Ga',                               reason: '1 ∀E' },
            { as: '5',        ln: 7, statement: 'Fa',                                    reason: '5 &E' },
            { as: '1,5',      ln: 8, statement: 'Ga',                                    reason: '6,7 →E' },
            { as: '3',        ln: 9, statement: '(∀y)(Sby → Syb)',                       reason: '3 ∀E' },
            { as: '3',       ln: 10, statement: 'Sba → Sab',                             reason: '9 ∀E' },
            { as: '2',       ln: 11, statement: '(∀y)(Ray → Sya)',                       reason: '2 ∀E' },
            { as: '2',       ln: 12, statement: 'Rab → Sba',                             reason: '11 ∀E' },
            { as: '5',       ln: 13, statement: 'Rab',                                   reason: '5 &E' },
            { as: '2,5',     ln: 14, statement: 'Sba',                                   reason: '12,13 →E' },
            { as: '2,3,5',   ln: 15, statement: 'Sab',                                   reason: '10,14 →E' },
            { as: '1,2,3,5', ln: 16, statement: 'Ga & Sab',                              reason: '8,15 &I' },
            { as: '1,2,3,5', ln: 17, statement: '(∃y)(Ga & Say)',                        reason: '16 ∃I' },
            { as: '1,2,3,4', ln: 18, statement: '(∃y)(Ga & Say)',                        reason: '4,5,17 ∃E' },
            { as: '1,2,3',   ln: 19, statement: '(∃y)(Fa & Ray) → (∃y)(Ga & Say)',       reason: '4,18 →I' },
            { as: '1,2,3',   ln: 20, statement: '(∀x)((∃y)(Fx & Rxy) → (∃y)(Gx & Sxy))', reason: '19 ∀I' }
        ]
    ))
    const ml_example_83_4_proof = try_parse('λ(T: Π(x: i).Π(y: i).o).λ(_0: ml (forall (λ(x: i).imp (exists (λ(y: i).T y x)) (forall (λ(z: i).not (T x z)))))).λ(_1: ml (forall (λ(x: i).forall (λ(y: i).imp (T y x) (T x x))))).foralli (λ(x: i).forall (λ(y: i).not (T x y))) (λ(a: i).foralli (λ(y: i).not (T a y)) (λ(b: i).noti (T a b) (λ(_2: ml (T a b)).(λ(_3: ml (imp (exists (λ(y: i).T y b)) (forall (λ(z: i).not (T b z))))).(λ(_4: ml (forall (λ(z: i).not (T b z)))).(λ(_5: ml (forall (λ(y: i).imp (T y b) (T b b)))).(λ(_6: ml (imp (T a b) (T b b))).(λ(_7: ml (T b b)).(λ(_8: ml (not (T b b))).(λ(_9: ml absurd)._9) (note (T b b) _8 _7)) (foralle (λ(z: i).not (T b z)) b _4)) (impe (T a b) (T b b) _6 _2)) (foralle (λ(y: i).imp (T y b) (T b b)) a _5)) (foralle (λ(x: i).forall (λ(y: i).imp (T y x) (T x x))) b _1)) (impe (exists (λ(y: i).T y b)) (forall (λ(z: i).not (T b z))) _3 (existsi (λ(y: i).T y b) a _2))) (foralle (λ(x: i).imp (exists (λ(y: i).T y x)) (forall (λ(z: i).not (T x z)))) b _0))))')
    test('ml_example_83_4_proof', () => expect(
        linearize(ml_example_83_4_proof, '(∀x)((∃y)Tyx → (∀z)~Txz), (∀x)(∀y)(Tyx → Txx)', '(∀x)(∀y)~Txy')
    ).toEqual(
        [
            { as: '1',      ln: 1, statement: '(∀x)((∃y)Tyx → (∀z)~Txz)', reason: 'Premise' },
            { as: '2',      ln: 2, statement: '(∀x)(∀y)(Tyx → Txx)',      reason: 'Premise' },
            { as: '3',      ln: 3, statement: 'Tab',                      reason: 'Assumption' },
            { as: '1',      ln: 4, statement: '(∃y)Tyb → (∀z)~Tbz',       reason: '1 ∀E' },
            { as: '3',      ln: 5, statement: '(∃y)Tyb',                  reason: '3 ∃I' },
            { as: '1,3',    ln: 6, statement: '(∀z)~Tbz',                 reason: '4,5 →E' },
            { as: '1,3',    ln: 7, statement: '~Tbb',                     reason: '6 ∀E' },
            { as: '2',      ln: 8, statement: '(∀y)(Tyb → Tbb)',          reason: '2 ∀E' },
            { as: '2',      ln: 9, statement: 'Tab → Tbb',                reason: '8 ∀E' },
            { as: '2,3',   ln: 10, statement: 'Tbb',                      reason: '9,3 →E' },
            { as: '1,2,3', ln: 11, statement: '⋏',                        reason: '7,10 ~E' },
            { as: '1,2',   ln: 12, statement: '~Tab',                     reason: '3,11 ~I' },
            { as: '1,2',   ln: 13, statement: '(∀y)~Tay',                 reason: '12 ∀I' },
            { as: '1,2',   ln: 14, statement: '(∀x)(∀y)~Txy',             reason: '13 ∀I' }
        ]
    ))
    const ml_example_45_12 = try_parse('λ(A: o).λ(B: o).λ(_0: ml (not (imp A (not A)))).λ(_1: ml (not (or A B))).(λ(_2: ml absurd)._2) (note (imp A (not A)) _0 (impi A (not A) (λ(_3: ml A).(λ(_4: ml absurd).noti A (λ(_5: ml A)._4)) (note (or A B) _1 (oril A B _3)))))')
    test('ml_example_45_12', () => expect(
        linearize(ml_example_45_12, '~(A → ~A), ~(A ∨ B)', '⋏')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: '~(A → ~A)', reason: 'Premise' },
            { as: '2',   ln: 2, statement: '~(A ∨ B)',  reason: 'Premise' },
            { as: '3',   ln: 3, statement: 'A',         reason: 'Assumption' },
            { as: '3',   ln: 4, statement: 'A ∨ B',     reason: '3 ∨I_left' },
            { as: '2,3', ln: 5, statement: '⋏',         reason: '2,4 ~E' },
            { as: '2',   ln: 6, statement: '~A',        reason: '3,5 ~I' },
            { as: '2',   ln: 7, statement: 'A → ~A',    reason: '3,6 →I' },
            { as: '1,2', ln: 8, statement: '⋏',         reason: '1,7 ~E' }
        ]
    ))
    // The following test is interesting assert_linear_proof_is_valid originally flagged it as incorrect, despite MacLogic I outputting the same proof for the same list of Tactics.
    // The fix was relatively simple -- don't union then filter, filter then union.
    const ml_example_45_20b = try_parse('λ(A: o).λ(B: o).λ(C: o).λ(_0: ml (and (or A B) (or A C))).(λ(_1: ml (or A B)).λ(_2: ml (or A C)).ore A B (or A (and B C)) _1 (λ(_3: ml A).ore A C (or A (and B C)) _2 (λ(_4: ml A).oril A (and B C) _3) (λ(_4: ml C).oril A (and B C) _3)) (λ(_3: ml B).ore A C (or A (and B C)) _2 (λ(_5: ml A).oril A (and B C) _5) (λ(_5: ml C).orir A (and B C) (andi B C _3 _5)))) (andel (or A B) (or A C) _0) (ander (or A B) (or A C) _0)')
    test('ml_example_45_20b', () => expect(
        linearize(ml_example_45_20b, '(A ∨ B) & (A ∨ C)', 'A ∨ (B & C)')
    ).toEqual([
        { as: '1',    ln: 1, statement: '(A ∨ B) & (A ∨ C)', reason: 'Premise' },
        { as: '1',    ln: 2, statement: 'A ∨ B',             reason: '1 &E' },
        { as: '3',    ln: 3, statement: 'A',                 reason: 'Assumption' },
        { as: '1',    ln: 4, statement: 'A ∨ C',             reason: '1 &E' },
        { as: '3',    ln: 5, statement: 'A ∨ (B & C)',       reason: '3 ∨I_left' },
        { as: '6',    ln: 6, statement: 'C',                 reason: 'Assumption' },
        { as: '1,3',  ln: 7, statement: 'A ∨ (B & C)',       reason: '4,3,5,6,5 ∨E' },
        { as: '8',    ln: 8, statement: 'B',                 reason: 'Assumption' },
        { as: '6,8',  ln: 9, statement: 'B & C',             reason: '8,6 &I' },
        { as: '6,8', ln: 10, statement: 'A ∨ (B & C)',       reason: '9 ∨I_right' },
        { as: '1,8', ln: 11, statement: 'A ∨ (B & C)',       reason: '4,3,5,6,10 ∨E' },
        { as: '1',   ln: 12, statement: 'A ∨ (B & C)',       reason: '2,3,7,8,11 ∨E' }
    ]))

    // try_parse('P(phi: P(x: i).o).P(p: P(t: i).ml (phi t)).ml (forall phi)')
    // try_parse('P(phi: P(x: i).o).P(t: i).P(p: ml (forall phi)).ml (phi t)')
    const alpha_equals_example = try_parse('L(F: P(x: i).o).L(_0: ml (forall (L(x: i).F x))).foralli (L(y: i).F y) (L(a: i).foralle (L(x: i).F x) a _0)')
    test('forall x Fx |- forall y Fy', () => expect(
        linearize(alpha_equals_example, '(∀x)Fx', '(∀y)Fy')
    ).toEqual([
        { as: '1', ln: 1, statement: '(∀x)Fx', reason: 'Premise' },
        { as: '1', ln: 2, statement: 'Fa', reason: '1 ∀E' },
        { as: '1', ln: 3, statement: '(∀y)Fy', reason: '2 ∀I' }
    ]))

    const too_many_lines_example = try_parse('λ(A: o).λ(B: o).λ(_0: ml A).dn (imp B A) (noti (not (imp B A)) (λ(_1: ml (not (imp B A))).(λ(_2: ml absurd)._2) (note (imp B A) _1 (impi B A (λ(_3: ml B)._0)))))')
    test('too many lines example', () => expect(
        linearize(too_many_lines_example, 'A', 'B → A')
    ).toEqual(
        [
            { as: '1',   ln: 1, statement: 'A',         reason: 'Premise' },
            { as: '2',   ln: 2, statement: 'B',         reason: 'Assumption' },
            { as: '1',   ln: 3, statement: 'B → A',     reason: '2,1 →I' },
          ]
    ))

    const unused_premise = try_parse('λ(A: o).λ(B: o).λ(_0: ml A).λ(_1: ml (imp B A))._0')
    test('unused premise', () => expect(
        linearize(unused_premise, 'A, B → A', 'A')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: 'A', reason: 'Premise' },
            { as: '2', ln: 2, statement: 'B → A', reason: 'Premise' }
        ]
    ))

    const duplicate_premises = try_parse('L(A: o).L(_0: ml A).L(_1: ml A)._0')
    test('duplicate premises', () => expect(
        linearize(duplicate_premises, 'A, A', 'A')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: 'A', reason: 'Premise' }
        ]
    ))

    const weird_lem_application = try_parse('L(A: o).L(B: o).λ(_0: ml A).(λ(_1: ml (or A (not A))).ore A (not A) (imp B A) _1 (λ(_2: ml A).impi B A (λ(_3: ml B)._0)) (λ(_2: ml (not A)).impi B A (λ(_4: ml B)._0))) (lem A)')
    test('weird_lem_application', () => expect(
        linearize(weird_lem_application, 'A', 'B → A')
    ).toEqual(
        [
            { as: '1', ln: 1, statement: 'A', reason: 'Premise' },
            { as: '2', ln: 2, statement: 'B', reason: 'Assumption' },
            { as: '1', ln: 3, statement: 'B → A', reason: '2,1 →I' }
        ]
    ))

    const w = ov('w')
    const bad_qs3 = la(ov('G'), pred(1), la(ov('F'), pred(1), la(a, i, la(iv(0), ml(exists(w, not(and(F(w), G(a))))), flapp(con('qs3'), make_qs_phi(w, la(x, i, and(F(x), G(a)))), iv(0))))))
    test('bad_qs3', () => expect(
        linearize(bad_qs3, '\\Ew-(Fw & Ga)', '-\\Aw(Fw & Ga)')
    ).toEqual([
        { as: '1', ln: 1, statement: '(∃w)~(Fw & Ga)', reason: 'Premise' },
        { as: '1', ln: 2, statement: '~(∀w)(Fw & Ga)', reason: '1 qs3' }
    ]))
})