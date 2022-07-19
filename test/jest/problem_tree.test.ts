import { Sequent, sequent } from 'coastline/src/construction/sequent';
import { Ast } from 'coastline/src/lambda_pi/ast';
import { mk_map } from 'coastline/src/map/RecursiveMap';
import { app, iv, ov, ovlist } from 'coastline/src/lambda_pi/shorthands';
import { and, exists, forall, imp, ml } from '../../src/components/MacLogicConstructor/maclogic_shorthands';
import { split_problem, open_problem, closed_problem, current_problem, ProblemTree, select_and_modify_problem_tree } from '../../src/components/MacLogicConstructor/problem_tree';

const [A, B, C, R, S, T, x, y, a, b] = ovlist('A', 'B', 'C', 'R', 'S', 'T', 'x', 'y', 'a', 'b')

export const pt_seq = (as: Ast[], c: Ast): Sequent => sequent(mk_map(...as.map<[string, Ast]>((a, index) => [iv(index).id, a])), c)

export const and_association_1 =
    current_problem(0, pt_seq([ml(and(A, and(B, C)))], ml(and(and(A, B), C))))
export const and_association_2 =
    split_problem(0, pt_seq([ml(and(A, and(B, C)))], ml(and(and(A, B), C))), 'ande', [
        current_problem(1, pt_seq([ml(A), ml(and(B, C))], ml(and(and(A, B), C)))),
    ])
export const and_association_3 =
    split_problem(0, pt_seq([ml(and(A, and(B, C)))], ml(and(and(A, B), C))), 'ande', [
        split_problem(1, pt_seq([ml(A), ml(and(B, C))], ml(and(and(A, B), C))), 'ande', [
            current_problem(2, pt_seq([ml(A), ml(B), ml(C)], ml(and(and(A, B), C))))
        ]),
    ])
export const and_association_4 =
    split_problem(0, pt_seq([ml(and(A, and(B, C)))], ml(and(and(A, B), C))), 'ande', [
        split_problem(1, pt_seq([ml(A), ml(and(B, C))], ml(and(and(A, B), C))), 'ande', [
            split_problem(2, pt_seq([ml(A), ml(B), ml(C)], ml(and(and(A, B), C))), 'andi', [
                current_problem(3, pt_seq([ml(A), ml(B), ml(C)], ml(and(A, B)))),
                open_problem(4, pt_seq([ml(A), ml(B), ml(C)], ml(C)))
            ])
        ]),
    ])
export const and_association_5 =
    split_problem(0, pt_seq([ml(and(A, and(B, C)))], ml(and(and(A, B), C))), 'ande', [
        split_problem(1, pt_seq([ml(A), ml(and(B, C))], ml(and(and(A, B), C))), 'ande', [
            split_problem(2, pt_seq([ml(A), ml(B), ml(C)], ml(and(and(A, B), C))), 'andi', [
                split_problem(3, pt_seq([ml(A), ml(B), ml(C)], ml(and(A, B))), 'andi', [
                    closed_problem(5, pt_seq([ml(A), ml(B), ml(C)], ml(A))),
                    closed_problem(6, pt_seq([ml(A), ml(B), ml(C)], ml(B)))
                ]),
                closed_problem(4, pt_seq([ml(A), ml(B), ml(C)], ml(C)))
            ])
        ]),
    ])

export const implication_collapse_1 =
    current_problem(0, pt_seq([ml(imp(R, imp(S, T))), ml(S)], ml(imp(R, T))))
export const implication_collapse_2 =
    split_problem(0, pt_seq([ml(imp(R, imp(S, T))), ml(S)], ml(imp(R, T))), 'impi', [
        current_problem(1, pt_seq([ml(imp(R, imp(S, T))), ml(S), ml(R)], ml(T)))
    ])
export const implication_collapse_3 =
    split_problem(0, pt_seq([ml(imp(R, imp(S, T))), ml(S)], ml(imp(R, T))), 'impi', [
        split_problem(1, pt_seq([ml(imp(R, imp(S, T))), ml(S), ml(R)], ml(T)), 'impe', [
            closed_problem(2, pt_seq([ml(imp(R, imp(S, T))), ml(S), ml(R)], ml(R))),
            current_problem(3, pt_seq([ml(S), ml(R), ml(imp(S, T))], ml(T)))
        ])
    ])
export const implication_collapse_4 =
    split_problem(0, pt_seq([ml(imp(R, imp(S, T))), ml(S)], ml(imp(R, T))), 'impi', [
        split_problem(1, pt_seq([ml(imp(R, imp(S, T))), ml(S), ml(R)], ml(T)), 'impe', [
            closed_problem(2, pt_seq([ml(imp(R, imp(S, T))), ml(S), ml(R)], ml(R))),
            split_problem(3, pt_seq([ml(S), ml(R), ml(imp(S, T))], ml(T)), 'impe', [
                closed_problem(4, pt_seq([ml(S), ml(R), ml(imp(S, T))], ml(S))),
                closed_problem(5, pt_seq([ml(S), ml(R), ml(T)], ml(T)))
            ])
        ])
    ])

const [F, G] = [(x: Ast) => app(ov('F'), x), (x: Ast) => app(ov('G'), x)]

export const forall_pullout_1 =
    current_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))))
export const forall_pullout_2 =
    split_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))), 'foralli', [
        current_problem(1, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(y, imp(F(a), G(y))))))
    ])
export const forall_pullout_3 =
    split_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))), 'foralli', [
        split_problem(1, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(y, imp(F(a), G(y))))), 'foralli', [
            current_problem(2, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(imp(F(a), G(b)))))
        ])
    ])
export const forall_pullout_4 =
    split_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))), 'foralli', [
        split_problem(1, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(y, imp(F(a), G(y))))), 'foralli', [
            split_problem(2, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(imp(F(a), G(b)))), 'impi', [
                current_problem(3, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a))], ml(G(b))))
            ])
        ])
    ])
export const forall_pullout_5 =
    split_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))), 'foralli', [
        split_problem(1, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(y, imp(F(a), G(y))))), 'foralli', [
            split_problem(2, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(imp(F(a), G(b)))), 'impi', [
                split_problem(3, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a))], ml(G(b))), 'foralle', [
                    current_problem(4, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(imp(F(a), forall(y, G(y))))], ml(G(b))))
                ])
            ])
        ])
    ])
export const forall_pullout_6 =
    split_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))), 'foralli', [
        split_problem(1, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(y, imp(F(a), G(y))))), 'foralli', [
            split_problem(2, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(imp(F(a), G(b)))), 'impi', [
                split_problem(3, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a))], ml(G(b))), 'foralle', [
                    split_problem(4, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(imp(F(a), forall(y, G(y))))], ml(G(b))), 'impe', [
                        closed_problem(5, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(imp(F(a), forall(y, G(y))))], ml(F(a)))),
                        current_problem(6, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(forall(y, G(y)))], ml(G(b))))
                    ])
                ])
            ])
        ])
    ])
export const forall_pullout_7 =
    split_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))), 'foralli', [
        split_problem(1, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(y, imp(F(a), G(y))))), 'foralli', [
            split_problem(2, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(imp(F(a), G(b)))), 'impi', [
                split_problem(3, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a))], ml(G(b))), 'foralle', [
                    split_problem(4, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(imp(F(a), forall(y, G(y))))], ml(G(b))), 'impe', [
                        closed_problem(5, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(imp(F(a), forall(y, G(y))))], ml(F(a)))),
                        split_problem(6, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(forall(y, G(y)))], ml(G(b))), 'foralle', [
                            closed_problem(7, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(forall(y, G(y))), ml(G(b))], ml(G(b))))
                        ])
                    ])
                ])
            ])
        ])
    ])

export const exists_and_exists_conjunct_1 =
    current_problem(0, pt_seq([ml(exists(x, and(F(x), G(x))))], ml(exists(x, F(x)))))
export const exists_and_exists_conjunct_2 =
    split_problem(0, pt_seq([ml(exists(x, and(F(x), G(x))))], ml(exists(x, F(x)))), 'existse', [
        current_problem(1, pt_seq([ml(and(F(a), G(a)))], ml(exists(x, F(x)))))
    ])
export const exists_and_exists_conjunct_3 =
    split_problem(0, pt_seq([ml(exists(x, and(F(x), G(x))))], ml(exists(x, F(x)))), 'existse', [
        split_problem(1, pt_seq([ml(and(F(a), G(a)))], ml(exists(x, F(x)))), 'ande', [
            current_problem(2, pt_seq([ml(F(a)), ml(G(a))], ml(exists(x, (F(x))))))
        ])
    ])
export const exists_and_exists_conjunct_4 =
    split_problem(0, pt_seq([ml(exists(x, and(F(x), G(x))))], ml(exists(x, F(x)))), 'existse', [
        split_problem(1, pt_seq([ml(and(F(a), G(a)))], ml(exists(x, F(x)))), 'ande', [
            split_problem(2, pt_seq([ml(F(a)), ml(G(a))], ml(exists(x, F(x)))), 'existsi', [
                closed_problem(3, pt_seq([ml(F(a)), ml(G(a))], ml(F(a))))
            ])
        ])
    ])

describe('select_and_modify_problem_tree', () => {
    const mod_tree = (tree: ProblemTree, message: string) => split_problem(-1, pt_seq([], S), message, [tree])
    const example_func = select_and_modify_problem_tree(
        (found_split_problem) => mod_tree(found_split_problem, 'found_split_problem'),
        (found_closed_problem) => mod_tree(found_closed_problem, 'found_closed_problem'),
        (found_current_problem) => mod_tree(found_current_problem, 'found_current_problem'),
        (found_open_problem) => mod_tree(found_open_problem, 'found_open_problem')
    )
    it('given tree has the given id but it\'s a SplitProblem', () => expect(
        example_func(implication_collapse_3, 1)
    ).toEqual(
        split_problem(0, pt_seq([ml(imp(R, imp(S, T))), ml(S)], ml(imp(R, T))), 'impi', [
            mod_tree(
                split_problem(1, pt_seq([ml(imp(R, imp(S, T))), ml(S), ml(R)], ml(T)), 'impe', [
                    closed_problem(2, pt_seq([ml(imp(R, imp(S, T))), ml(S), ml(R)], ml(R))),
                    current_problem(3, pt_seq([ml(S), ml(R), ml(imp(S, T))], ml(T)))
                ]),
                'found_split_problem'
            )
        ])
    ))
    it('given tree has the given id but it\'s a ClosedProblem', () => expect(
        example_func(forall_pullout_7, 5)
    ).toEqual(
        split_problem(0, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(x, forall(y, imp(F(x), G(y)))))), 'foralli', [
            split_problem(1, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(forall(y, imp(F(a), G(y))))), 'foralli', [
                split_problem(2, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y)))))], ml(imp(F(a), G(b)))), 'impi', [
                    split_problem(3, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a))], ml(G(b))), 'foralle', [
                        split_problem(4, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(imp(F(a), forall(y, G(y))))], ml(G(b))), 'impe', [
                            mod_tree(
                                closed_problem(5, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(imp(F(a), forall(y, G(y))))], ml(F(a)))),
                                'found_closed_problem'
                            ),
                            split_problem(6, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(forall(y, G(y)))], ml(G(b))), 'foralle', [
                                closed_problem(7, pt_seq([ml(forall(x, imp(F(x), forall(y, G(y))))), ml(F(a)), ml(forall(y, G(y))), ml(G(b))], ml(G(b))))
                            ])
                        ])
                    ])
                ])
            ])
        ])
    ))
    it('given tree has the given id and it\'s a CurrentProblem', () => expect(
        example_func(and_association_4, 3)
    ).toEqual(
        split_problem(0, pt_seq([ml(and(A, and(B, C)))], ml(and(and(A, B), C))), 'ande', [
            split_problem(1, pt_seq([ml(A), ml(and(B, C))], ml(and(and(A, B), C))), 'ande', [
                split_problem(2, pt_seq([ml(A), ml(B), ml(C)], ml(and(and(A, B), C))), 'andi', [
                    mod_tree(
                        current_problem(3, pt_seq([ml(A), ml(B), ml(C)], ml(and(A, B)))),
                        'found_current_problem'
                    ),
                    open_problem(4, pt_seq([ml(A), ml(B), ml(C)], ml(C)))
                ])
            ]),
        ])
    ))
    it('given tree has the given id and it\'s an OpenProblem', () => expect(
        example_func(and_association_4, 4)
    ).toEqual(
        split_problem(0, pt_seq([ml(and(A, and(B, C)))], ml(and(and(A, B), C))), 'ande', [
            split_problem(1, pt_seq([ml(A), ml(and(B, C))], ml(and(and(A, B), C))), 'ande', [
                split_problem(2, pt_seq([ml(A), ml(B), ml(C)], ml(and(and(A, B), C))), 'andi', [
                    current_problem(3, pt_seq([ml(A), ml(B), ml(C)], ml(and(A, B)))),
                    mod_tree(
                        open_problem(4, pt_seq([ml(A), ml(B), ml(C)], ml(C))),
                        'found_open_problem'
                    )
                ])
            ]),
        ])
    ))
    it('given tree does not have the given id but it\'s a CurrentProblem', () => expect(
        example_func(and_association_1, 2)
    ).toEqual(
        and_association_1
    ))
    it('given tree does not have the given id but it\'s an OpenProblem', () => expect(
        example_func(open_problem(and_association_1.id, and_association_1.seq), 2)
    ).toEqual(
        open_problem(and_association_1.id, and_association_1.seq)
    ))
})