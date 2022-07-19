import { ovlist } from 'coastline/src/lambda_pi/shorthands';
import { and, not, or } from '../../src/components/MacLogicConstructor/maclogic_shorthands';
import { instantiate_rule } from '../../src/components/MacLogicConstructor/instantiate_rule';

describe('instantiate_rule', () => {
    const [A, B, C, D] = ovlist('A', 'B', 'C', 'D')
    test('ds { A: empty, B: empty }', () => expect(
        instantiate_rule('ds', { 'A': A, 'B': B })
    ).toEqual(
        [[or(A, B), not(A)], B]
    ))
    test('ds { A: A & B, B: empty }', () => expect(
        instantiate_rule('ds', { 'A': and(A, B), 'B': B })
    ).toEqual(
        [[or(and(A, B), B), not(and(A, B))], B]
    ))
    test('ds { A: empty, B: B & A }', () => expect(
        instantiate_rule('ds', { 'A': A, 'B': and(B, A) })
    ).toEqual(
        [[or(A, and(B, A)), not(A)], and(B, A)]
    ))
    test('ds { A: C & D, B: B & A }', () => expect(
        instantiate_rule('ds', { 'A': and(C, D), 'B': and(B, A) })
    ).toEqual(
        [[or(and(C, D), and(B, A)), not(and(C, D))], and(B, A)]
    ))
    test('ds { A: B, B: B }', () => expect(
        instantiate_rule('ds', { 'A': B, 'B': B })
    ).toEqual(
        [[or(B, B), not(B)], B]
    ))
})