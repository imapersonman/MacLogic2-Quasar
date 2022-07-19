import { mk_map } from 'coastline/src/map/RecursiveMap';
import { Sequent, sequent } from 'coastline/src/construction/sequent';
import { absurd, and, exists, forall, i, iff, imp, ml, not, o, pred } from '../../src/components/MacLogicConstructor/maclogic_shorthands';
import { app, iv, la, ov, ovlist } from 'coastline/src/lambda_pi/shorthands';
import { interaction, MacLogicResponse, TacticId } from '../../src/components/MacLogicConstructor/construction_interaction';
import { InteractionController } from '../../src/components/MacLogicConstructor/interaction_controller';
import { Ast } from 'coastline/src/lambda_pi/ast';
import { defined } from 'coastline/src/utilities';
import { proven_sequent } from '../../src/components/MacLogicConstructor/proven_sequent';

const [A, B, C, R, T, x, a, b] = ovlist('A', 'B', 'C', 'R', 'T', 'x', 'a', 'b')
const [q, w, y, z] = ovlist('q', 'w', 'y', 'z')
const [F, G, H] = [(x: Ast) => app(ov('F'), x), (x: Ast) => app(ov('G'), x), (x: Ast) => app(ov('H'), x)]

const test_tactic_error = (description: string, tactic: TacticId, start_sequent: Sequent) => {
    const ic = new InteractionController(interaction)
    ic.step({ type: 'Problem', value: start_sequent })
    const next_state = ic.step({ type: 'Tactic', value: tactic })
    test(`${tactic} -- ${description} -- results in an error`, () => expect(next_state.error).toBeDefined())
}

const test_tactic_success = (description: string, tactic: TacticId, start_sequent: Sequent, responses: MacLogicResponse[], result_sequents: Sequent[]) => {
    const ic = new InteractionController(interaction)
    let next_state = ic.step({ type: 'Problem', value: start_sequent })
    next_state = ic.step({ type: 'Tactic', value: tactic })

    for (const response of responses)
        // If the response is invalid, an exception will occur.
        next_state = ic.step(response)

    if (defined(next_state.request))
        throw new Error('Next state has a request!')
    test(`${tactic} -- ${description} -- is successful`, () => expect(next_state.new_problems).toEqual(result_sequents))
}

test_tactic_error('no assumptions', 'ande',
    sequent(mk_map(['R', o]), ml(R)))
test_tactic_error('no unifying assumptions', 'ande',
    sequent(mk_map<Ast>(['A', o], ['B', o], ['C', o], ['R', o], [iv(0).id, ml(A)], [iv(1).id, ml(B)], [iv(2).id, ml(C)]), ml(R)))
test_tactic_success('only unifying assumptions',
    'ande', sequent(mk_map<Ast>(['A', o], ['B', o], ['C', o], ['R', o], ['T', o], [iv(0).id, ml(and(A, B))], [iv(1).id, ml(and(B, C))], [iv(2).id, ml(and(R, T))]), ml(R)), [{ type: 'UnifyingAssumption', value: 1 }], [
        sequent(mk_map([iv(0).id, ml(and(A, B))], [iv(2).id, ml(and(R, T))], [iv(3).id, ml(B)], [iv(4).id, ml(C)]), ml(R)),
    ])
test_tactic_success('mostly unifying assumptions',
    'ande', sequent(mk_map<Ast>(['A', o], ['B', o], ['R', o], ['T', o], [iv(0).id, ml(and(A, B))], [iv(1).id, ml(B)], [iv(2).id, ml(and(R, T))]), ml(R)), [{ type: 'UnifyingAssumption', value: 1 }], [
        sequent(mk_map([iv(0).id, ml(and(A, B))], [iv(1).id, ml(B)], [iv(3).id, ml(R)], [iv(4).id, ml(T)]), ml(R)),
    ])

test_tactic_success('no absurdity, A := A & R',
    'efq', sequent(mk_map<Ast>(['R', o], ['A', o], [iv(0).id, ml(and(A, R))]), ml(R)), [{ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['A', o], ['R', o]), and(R, A), o) } }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(A, R))]), ml(absurd)),
        sequent(mk_map<Ast>([iv(0).id, ml(and(A, R))], [iv(1).id, ml(and(R, A))]), ml(R))
    ])
test_tactic_success('failing problem from 6.3.Examples.2 (failed because the new problem ctx did not include any old individuals).',
    'efq', sequent(mk_map<Ast>(['F', pred(1)], ['G', pred(1)], ['H', pred(1)], ['a', i], [iv(0).id, ml(forall(x, imp(F(x), G(x))))], [iv(1).id, ml(F(a))]), ml(H(a))), [{ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['H', pred(1)], ['a', i]), H(a), o) } }], [
        sequent(mk_map<Ast>([iv(0).id, ml(forall(x, imp(F(x), G(x))))], [iv(1).id, ml(F(a))]), ml(absurd)),
        sequent(mk_map<Ast>([iv(0).id, ml(forall(x, imp(F(x), G(x))))], [iv(1).id, ml(F(a))], [iv(2).id, ml(H(a))]), ml(H(a)))
    ])
test_tactic_success('failing problem from 6.3.Examples.2 that also introduces a new constant.',
    'efq', sequent(mk_map<Ast>(['F', pred(1)], ['G', pred(1)], ['H', pred(1)], ['a', i], [iv(0).id, ml(forall(x, imp(F(x), G(x))))], [iv(1).id, ml(F(a))]), ml(H(a))), [{ type: 'SequentOrTheoremSubstitution', value: { 'A': proven_sequent(mk_map(['H', pred(1)], ['b', i]), H(b), o) } }], [
        sequent(mk_map<Ast>([iv(0).id, ml(forall(x, imp(F(x), G(x))))], [iv(1).id, ml(F(a))], ['b', i]), ml(absurd)),
        sequent(mk_map<Ast>([iv(0).id, ml(forall(x, imp(F(x), G(x))))], [iv(1).id, ml(F(a))], ['b', i], [iv(2).id, ml(H(b))]), ml(H(a)))
    ])


test_tactic_error('no unifying assumptions or conclusion', 'df',
    sequent(mk_map<Ast>(['A', o], ['B', o], ['C', o], [iv(0).id, ml(and(A, B))], [iv(1).id, ml(and(B, C))]), ml(and(A, C))))
test_tactic_success('only one unifying assumption',
    'df', sequent(mk_map<Ast>(['A', o], ['B', o], ['C', o], [iv(0).id, ml(and(A, B))], [iv(1).id, ml(iff(B, C))]), ml(and(A, C))), [], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(A, B))], [iv(2).id, ml(and(imp(B, C), imp(C, B)))]), ml(and(A, C)))
    ])
test_tactic_success('unifying conclusion',
    'df', sequent(mk_map<Ast>(['A', o], ['B', o], ['C', o], [iv(0).id, ml(and(A, B))], [iv(1).id, ml(and(B, C))]), ml(iff(A, C))), [], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(A, B))], [iv(1).id, ml(and(B, C))]), ml(and(imp(A, C), imp(C, A))))
    ])
test_tactic_success('unifying assumptions and conclusion, selecting second assumption',
    'df', sequent(mk_map<Ast>(['A', o], ['B', o], ['C', o], [iv(0).id, ml(iff(A, B))], [iv(1).id, ml(iff(B, C))]), ml(iff(A, C))), [{ type: 'UnifyingAssumptionOrConclusion', value: 1 }], [
        sequent(mk_map<Ast>([iv(0).id, ml(iff(A, B))], [iv(2).id, ml(and(imp(B, C), imp(C, B)))]), ml(iff(A, C)))
    ])

test_tactic_success('simple',
    'qs1', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(['F', pred(1)]), la(x, i, F(x)), pred(1)) }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(forall(x, not(F(x))))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(not(exists(x, F(x))))]), ml(R))
    ])
test_tactic_success('simple',
    'qs2', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(['F', pred(1)]), la(y, i, F(y)), pred(1)) }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(not(exists(y, F(y))))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(forall(y, not(F(y))))]), ml(R))
    ])
test_tactic_success('simple',
    'qs3', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(['F', pred(1)]), la(w, i, F(w)), pred(1)) }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(exists(w, not(F(w))))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(not(forall(w, F(w))))]), ml(R))
    ])
test_tactic_success('simple',
    'qs4', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'QuantifierShiftSubstitution', value: proven_sequent(mk_map(['F', pred(1)]), la(z, i, F(z)), pred(1)) }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(not(forall(z, F(z))))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(exists(z, not(F(z))))]), ml(R))
    ])

test_tactic_success('z to x',
    'avu', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'AlphabeticVarianceSubstitution', value: { old_variable: 'z', proven_sequent: proven_sequent(mk_map(['F', pred(1)]), la(x, i, F(x)), pred(1)) } }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(forall(z, F(z)))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(forall(x, F(x)))]), ml(R))
    ])
test_tactic_success('y to q',
    'avu', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'AlphabeticVarianceSubstitution', value: { old_variable: 'y', proven_sequent: proven_sequent(mk_map(['F', pred(1)]), la(q, i, F(q)), pred(1)) } }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(forall(y, F(y)))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(forall(q, F(q)))]), ml(R))
    ])
test_tactic_success('w to z',
    'ave', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'AlphabeticVarianceSubstitution', value: { old_variable: 'w', proven_sequent: proven_sequent(mk_map(['F', pred(1)]), la(z, i, F(z)), pred(1)) } }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(exists(w, F(w)))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(exists(z, F(z)))]), ml(R))
    ])
test_tactic_success('q to w',
    'ave', sequent(mk_map<Ast>(['T', o], ['R', o], [iv(0).id, ml(and(T, R))]), ml(R)), [{ type: 'AlphabeticVarianceSubstitution', value: { old_variable: 'q', proven_sequent: proven_sequent(mk_map(['F', pred(1)]), la(w, i, F(w)), pred(1)) } }], [
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))]), ml(exists(q, F(q)))),
        sequent(mk_map<Ast>([iv(0).id, ml(and(T, R))], [iv(1).id, ml(exists(w, F(w)))]), ml(R))
    ])