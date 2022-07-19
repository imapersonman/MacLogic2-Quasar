/* eslint-disable @typescript-eslint/ban-types */
import { Sequent, sequent_to_string } from 'coastline/src/construction/sequent';

export type ProblemTree =
    | OpenProblem
    | CurrentProblem
    | SplitProblem
    | ClosedProblem

export class OpenProblem { constructor(readonly id: number, readonly seq: Sequent) {} }
export const is_open_problem = (o: unknown): o is OpenProblem => o instanceof OpenProblem
export const open_problem = (id: number, seq: Sequent) => new OpenProblem(id, seq)

export class CurrentProblem { constructor(readonly id: number, readonly seq: Sequent) {} }
export const is_current_problem = (c: unknown): c is CurrentProblem => c instanceof CurrentProblem
export const current_problem = (id: number, seq: Sequent) => new CurrentProblem(id, seq)

export class SplitProblem { constructor(readonly id: number, readonly seq: Sequent, readonly reason: string, readonly children: ProblemTree[]) {} }
export const is_split_problem = (c: unknown): c is SplitProblem => c instanceof SplitProblem
export const split_problem = (id: number, seq: Sequent, reason: string, children: ProblemTree[]) => new SplitProblem(id, seq, reason, children)

export class ClosedProblem { constructor(readonly id: number, readonly seq: Sequent) {} }
export const is_closed_problem = (c: unknown): c is ClosedProblem => c instanceof ClosedProblem
export const closed_problem = (id: number, seq: Sequent) => new ClosedProblem(id, seq)

export const display_problem_tree = (tree: ProblemTree): object => {
    const problem_obj = { sequent: sequent_to_string(tree.seq) }
    if (is_split_problem(tree))
        return { ...tree, ...problem_obj, children: tree.children.map(display_problem_tree) }
    return { ...tree as CurrentProblem, ...problem_obj }
}

// Things you can do with a ProblemTree:
// - close_at_id (if it's current or open)
// - split_at_id (if it's current or open)
// - make_current_at_id (if it's open)
// - any other operations are invalid

// Because the three functions share a testing strategy, I'll a function that abstracts each case and test that instead.
export const select_and_modify_problem_tree = (
    fspp: (found_split_problem: SplitProblem) => ProblemTree,
    fclp: (found_closed_problem: ClosedProblem) => ProblemTree,
    fcup: (found_current_problem: CurrentProblem) => ProblemTree,
    fopp: (found_open_problem: OpenProblem) => ProblemTree
) => (tree: ProblemTree, id: number): ProblemTree => {
    if (is_open_problem(tree) && tree.id === id) return fopp(tree)
    if (is_current_problem(tree) && tree.id === id) return fcup(tree)
    if (is_closed_problem(tree) && tree.id === id) return fclp(tree)
    if (is_split_problem(tree))
        if (tree.id === id)
            return fspp(tree)
        else
            return split_problem(tree.id, tree.seq, tree.reason, tree.children.map((st) => select_and_modify_problem_tree(fspp, fclp, fcup, fopp)(st, id)))
    return tree
}

// close_at_id: (tree: ProblemTree, id: number) => ProblemTree
// Searches the given ProblemTree for the first SubTree with the given id and converts it into a ClosedTree if it is found.
// If the SubTree at the given id is a SplitProblem or a ClosedProblem, an error is thrown.
export const close_at_id = select_and_modify_problem_tree(
    (found_split_problem) => { throw new Error(`Cannot close a SplitProblem (id: ${found_split_problem.id})`) },
    (found_closed_problem) => { throw new Error(`Cannot close a ClosedProblem (id: ${found_closed_problem.id})`) },
    (found_current_problem) => closed_problem(found_current_problem.id, found_current_problem.seq),
    (found_open_problem) => closed_problem(found_open_problem.id, found_open_problem.seq)
)

// split_at_id: (tree: ProblemTree, id: number, children: ProblemTree[]) => ProblemTree
// Searches the given ProblemTree for the first SubTree with the given id and converts it into a SplitProblem with the given children.
// If the SubTree at the given id is a SplitProblem or a ClosedProblem, an error is thrown.
export const split_at_id = (tree: ProblemTree, id: number, reason: string, children: ProblemTree[]) => select_and_modify_problem_tree(
    (found_split_problem) => { throw new Error(`Cannot split a SplitProblem (id: ${found_split_problem.id})`) },
    (found_closed_problem) => { throw new Error(`Cannot split a ClosedProblem (id: ${found_closed_problem.id})`) },
    (found_current_problem) => split_problem(found_current_problem.id, found_current_problem.seq, reason, children),
    (found_open_problem) => split_problem(found_open_problem.id, found_open_problem.seq, reason, children)
)(tree, id)

// make_current_at_id: (tree: ProblemTree, id: number) => ProblemTree
// Searches the given ProblemTree for the first SubTree with the given id and converts it into a CurrentProblem.
// If the SubTree at the given id is a SplitProblem or a ClosedProblem, an error is thrown.
export const make_current_at_id = select_and_modify_problem_tree(
    (found_split_problem) => { throw new Error(`Cannot make a SplitProblem current (id: ${found_split_problem.id})`) },
    (found_closed_problem) => { throw new Error(`Cannot make a ClosedProblem current (id: ${found_closed_problem.id})`) },
    (found_current_problem) => current_problem(found_current_problem.id, found_current_problem.seq),
    (found_open_problem) => current_problem(found_open_problem.id, found_open_problem.seq)
)