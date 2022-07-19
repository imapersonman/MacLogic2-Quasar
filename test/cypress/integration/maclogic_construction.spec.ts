import { defined, first, is_empty, rest } from 'coastline/src/utilities'
import { root_directory } from 'assets/maclogic_problems'
import { is_problem_description, is_problem_directory, ProblemCommand, ProblemDescription, ProblemDirectory, ProblemEntry } from 'src/components/MacLogicConstructor/problem_browser'

const to_visit = ''
const valid_variable_names = ['q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
const valid_constant_names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']

const run_problem_command = (p: ProblemCommand) => {
    if (p.type === 'Tactic') run_tactic(p.value)
    else if (p.type === 'UnifyingAssumption')
        respond_with_unifying_assumption_index(p.value)
    else if (p.type === 'UnifyingAssumptionOrConclusion')
        respond_with_unifying_assumption_or_conclusion_index(p.value)
    else if (p.type === 'AnyFreeVariable')
        respond_with_any_variable_name(p.value)
    else if (p.type === 'UnusedFreeVariable')
        respond_with_unused_variable_index(p.value)
    else if (p.type === 'SequentOrTheoremSubstitution')
        respond_with_sequent_or_theorem_substitution(...p.value)
    else if (p.type === 'QuantifierShiftSubstitution')
        respond_with_quantifier_shift_substitution(p.value.variable, p.value.scope)
    else throw new Error(`Unrecognized ProblemCommand:\n${JSON.stringify(p)}`)
}

const test_specific_problem_entry = (e: ProblemEntry, ...names: string[]): void => {
    if (is_empty(names)) {
        if (is_problem_description(e))
            test_problem_description(e)
        else if (is_problem_directory(e))
            test_problem_directory(e)
    } else if (is_problem_description(e)) {
        // just run anyway, even though we overshot.
        test_problem_description(e)
    } else if (is_problem_directory(e)) {
        const next_entry = e.entries.find((e) => e.name === first(names))
        if (!defined(next_entry))
            throw new Error(`Can\'t find ProblemEntry with name ${first(names)}`)
        test_specific_problem_entry(next_entry, ...rest(names))
    }
}

const test_problem_directory = (d: ProblemDirectory) =>
    describe(d.name, () => d.entries.forEach(test_problem_entry))

const test_problem_description = (d: ProblemDescription) =>
    describe(`${d.name}: constructs ${d.assumptions} ⊢ ${d.conclusion}`, () => {
        before(() => start_problem(d.assumptions, d.conclusion))
        afterEach(() => { assert_finished(); restart() })
        d.test_scripts?.forEach((script, index) => it(`test script at index ${index}`, () => script.forEach(run_problem_command)))
    })

const test_problem_entry = (entry: ProblemEntry) => {
    if (is_problem_directory(entry))
        return test_problem_directory(entry)
    else if (is_problem_description(entry))
        return test_problem_description(entry)
    throw new Error(`Unrecognized ProblemEntry:\n${JSON.stringify(entry)}`)
}

it.skip('playground', () => {
    cy.visit(to_visit)
    start_problem('A <-> -A', 'A & -A')
    run_tactic('df')
    run_tactic('ande')
    run_tactic('andi')
    run_tactic('impe')
    respond_with_unifying_assumption_index(1)
    run_tactic('noti')
    run_tactic('impe')
    respond_with_unifying_assumption_index(0)
    run_tactic('note')
    run_tactic('noti')
    run_tactic('impe')
    respond_with_unifying_assumption_index(0)
    run_tactic('note')
    assert_finished()
})

describe('tests generated from folder structure', () => {
    before(() => {
        cy.visit(to_visit)
    })
    // test_specific_problem_entry(root_directory as ProblemEntry, 'Chapter 4', 'Section 5', 'Examples', '4')
    test_specific_problem_entry(root_directory as ProblemEntry)
    // test_problem_entry(root_directory as ProblemEntry)
})

const check_okay_clickable = (okay_button: string, input_elements_and_values: [string, string][], clickable: boolean) => {
    input_elements_and_values.forEach(([ie, v]) => {
        cy.get(`[data-cy=${CSS.escape(ie)}]`).clear()
        if (v.length !== 0)
            cy.get(`[data-cy=${CSS.escape(ie)}]`).type(v)
    })
    if (clickable)
        cy.get(`[data-cy=${CSS.escape(okay_button)}]`).should('be.enabled')
    else
        cy.get(`[data-cy=${CSS.escape(okay_button)}]`).should('be.disabled')
}

describe('special cases', () => {
    beforeEach(() => {
        cy.visit(to_visit)
    })
    it('disables OK on empty and on invalid constant name, and enables it for good stuff', () => {
        start_problem('A → Gb, A', '\\ExGx')
        run_tactic('existsi')
        // fickle tests but this isn't likely to change so I'm okay with it.
        const clickable_values = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']
        clickable_values.forEach((v) => check_okay_clickable('closeAnyVariableDialog', [['anyVariableInput', v]], true))
        const non_clickable_values = [...valid_variable_names, '', '   ', 'Ha', 'A']
        non_clickable_values.forEach((v) => check_okay_clickable('closeAnyVariableDialog', [['anyVariableInput', v]], false))
    })
    it('allows the user to click the custom button dialog more than once', () => {
        cy.get('[data-cy=newProblem]').click()
        cy.get('[data-cy=assumptionsText]').type('A')
        cy.get('[data-cy=conclusionText]').type('B')
        cy.get('[data-cy=start]').click()
        cy.get('[data-cy=newProblem]').click()
    })
    it('disables the okay button when a substitution instance is invalid and enables it when it is valid', () => {
        start_problem('C → D, ~D', '~C')
        run_tactic('mt')
        const clickable_values = [['A', 'B'], ['C', 'D'], ['Ha', 'Hb'], ['', ''], ['A', ''], ['', 'A'], ['A', 'A']]
        clickable_values.forEach(([Av, Bv]) =>
            check_okay_clickable('closeSequentOrTheoremSubstitutionDialog', [['substitutionA', Av], ['substitutionB', Bv]], true))
        const non_clickable_values = [['9i4jowfe', 'A'], ['A', '9i4jowfe'], ['Dd', 'C'], ['C', 'Dd'], ['Ha', 'Hab'], ['Hx', 'A'], ['Hx', '\\AxFa']]
        non_clickable_values.forEach(([Av, Bv]) =>
            check_okay_clickable('closeSequentOrTheoremSubstitutionDialog', [['substitutionA', Av], ['substitutionB', Bv]], false))
    })
    it('disables the okay button when substitution instance ctxs disagree', () => {
        start_problem('C → D, ~D', '~C')
        run_tactic('mt')
        cy.get('[data-cy=substitutionA]').type('B')
        cy.get('[data-cy=substitutionB]').type('Bc')
        cy.get('[data-cy=closeSequentOrTheoremSubstitutionDialog]').should('be.disabled')
    })
    it('disables the okay button when a substitution instance ctx disagrees with the problem ctx', () => {
        start_problem('C → D, ~D', '~C')
        run_tactic('mt')
        cy.get('[data-cy=substitutionA]').type('Cc')
        cy.get('[data-cy=closeSequentOrTheoremSubstitutionDialog]').should('be.disabled')
    })
    it('disables the OK button on problem entry when two elaborated types disagree, then should be enabled when they agree again', () => {
        cy.get('[data-cy=newProblem]').click()
        cy.get('[data-cy=conclusionText]').type('\\AxFx & F')
        cy.get('[data-cy=start]').should('be.disabled')
        cy.get('[data-cy=conclusionText]').type('a')
    })
    it('disables the okay button when QS1-QS4 is given an invalid set of inputs and enabled otherwise', () => {
        start_problem('A', 'B')
        const enabled = [
            ...valid_variable_names.map((n) => [n, `F${n}`]),
        ]
        const disabled = [
            ...valid_constant_names.map((n) => [n, `F${n}`]),
            ['x', 'A'],
            ['q', 'Bq'],
            ['y', '\\AyFy']
        ]
        const run = (t: string) => {
            run_tactic(t)
            enabled.forEach(([v, scope]) => check_okay_clickable('closeQuantifierShiftSubstitutionDialog', [['variable', v], ['scope', scope]], true))
            disabled.forEach(([v, scope]) => check_okay_clickable('closeQuantifierShiftSubstitutionDialog', [['variable', v], ['scope', scope]], false))
            cancel_tactic()
        }
        run('qs1')
        // run('qs2')
        // run('qs3')
        // run('qs4')
    })
    it('disables the okay button when ave and avu is given an invalid set of inputs and enabled otherwise', () => {
        start_problem('A', 'B')
        const enabled = [
            ...valid_variable_names.map((n) => [n, n === 'x' ? 'y' : 'x', `F${n}`]),
        ]
        const disabled = [
            ...valid_constant_names.map((n) => [n, n === 'a' ? 'b' : 'a', `F${n}`]),
            ['x', 'x', 'Ax'],
            ['q', 'Bq', 'w'],
            ['y', 'x', '\\AyFy'],
            ['y', 'x', '\\AxFxy']
        ]
        const run = (t: string) => {
            run_tactic(t)
            enabled.forEach(([old_v, new_v, scope]) =>
                check_okay_clickable('closeAlphabeticVarianceSubstitutionDialog', [['old_variable', old_v], ['new_variable', new_v], ['scope', scope]], true))
            disabled.forEach(([old_v, new_v, scope]) =>
                check_okay_clickable('closeAlphabeticVarianceSubstitutionDialog', [['old_variable', old_v], ['new_variable', new_v], ['scope', scope]], false))
            cancel_tactic()
        }
        run('avu')
        // run('ave')
    })
    it('immediately solves trivial problems', () => {
        start_problem('A', 'A')
        assert_finished()
    })
    it('complains when no unifying assumption has been found in A & B ⊢ B', () => {
        start_problem('A & B', 'B')
        run_tactic('impe')
        cy.get('[data-cy=noUnifyingAssumptionsFoundDialog]')
    })
    it('complains when no unifying conclusion has been found in A & B ⊢ B', () => {
        start_problem('A & B', 'B')
        run_tactic('andi')
        cy.get('[data-cy=noUnifyingConclusionFoundDialog]')
    })
    it('almost constructs ⊢ A ∨ ~A, undoes everything, then redoes everything and finishes the construction', () => {
        start_problem('', 'A ∨ ~A')
        run_tactic('dn')
        run_tactic('noti')
        run_tactic('note')
        run_tactic('orir')
        run_tactic('noti')
        run_tactic('note')
        undo()
        undo()
        undo()
        undo()
        undo()
        undo()
        redo()
        redo()
        undo()
        redo()
        run_tactic('note')
        run_tactic('orir')
        run_tactic('noti')
        run_tactic('note')
        run_tactic('oril')
        assert_finished()
    })
    it('can undo from a finished state', () => {
        start_problem('A \\/ A', 'A')
        run_tactic('ore')
        undo()
    })
    it('does not show a prompt when undo is pressed', () => {
        start_problem('A & B, C & D', 'A & D')
        run_tactic('ande')
        respond_with_unifying_assumption_index(0)
        undo()
        cy.get('[data-cy=unifyingAssumptionDialog]').should('not.exist')
    })
    it('shows dialog prompt with existse no unifying assumptions found error while constructing A → Gb ⊢ A → (∃x)Gx', () => {
        start_problem('A → Gb', 'A → (∃x)Gx')
        run_tactic('impi')
        run_tactic('existse')
        cy.get('[data-cy=noUnifyingAssumptionsFoundDialog]')
    })
    it('restarts properly', () => {
        start_problem('∀x(Fx -> ∀yGy)', '∀x∀y(Fx -> Gy)')
        run_tactic('foralli')
        respond_with_unused_variable_index(0)
        run_tactic('foralli')
        respond_with_unused_variable_index(0)
        run_tactic('impi')
        restart()
        run_tactic('foralli')
        respond_with_unused_variable_index(0)
        run_tactic('foralli')
        respond_with_unused_variable_index(0)
        run_tactic('impi')
        run_tactic('foralle')
        respond_with_any_variable_name('a')
        run_tactic('impe')
        run_tactic('foralle')
        respond_with_unifying_assumption_index(1)
        respond_with_any_variable_name('b')
        assert_finished()
    })
    it('can cancel tactics from within requests', () => {
        start_problem('∀xFx, ∀xGx', 'Ga & Fb')
        run_tactic('foralle')
        cancel_tactic()
        cy.get('[data-cy=redo]').should('be.disabled')
        run_tactic('foralle')
        respond_with_unifying_assumption_index(1)
        cancel_tactic()
        cy.get('[data-cy=redo]').should('be.disabled')
        run_tactic('foralle')
        respond_with_unifying_assumption_index(0)
        respond_with_any_variable_name('b')
        run_tactic('foralle')
        respond_with_unifying_assumption_index(1)
        respond_with_any_variable_name('a')
        run_tactic('andi')
        assert_finished()
    })
    it('does not save error states', () => {
        start_problem('A & B', 'B & A')
        run_tactic('noti')
        dismiss_error()
        cy.get('[data-cy=undo]').should('be.disabled')
    })
    it('complains when no unifying assumption conclusion has been found in A & B ⊢ B for <-> Def', () => {
        start_problem('A & B', 'B')
        run_tactic('df')
        cy.get('[data-cy=noUnifyingAssumptionsOrConclusionFoundDialog]')
    })
    it('complains when no unifying assumption has been found for foralli in ∀x(Fx → Gx), Fa ⊢ ∃x(~Gx → Hx)', () => {
        start_problem('∀x(Fx → Gx), Fa', '∃x(~Gx → Hx)')
        run_tactic('foralli')
        cy.get('[data-cy=noUnifyingConclusionFoundDialog]')
    })
    it('complains when no unifying assumption has been found for foralli in ∀x(Fx → Gx), Fa ⊢ ∀x(~Gx → Hx)', () => {
        start_problem('∀x(Fx → Gx), Fa', '∀x(~Gx → Hx)')
        run_tactic('existsi')
        cy.get('[data-cy=noUnifyingConclusionFoundDialog]')
    })
    it('complains when a bound variable is given to an AnyFreeVariable dialog', () => {
        start_problem('', '\\Ex\\Ey(Fx & Gy)')
        run_tactic('existsi')
        cy.get('[data-cy=anyVariableInput]').type('y')
        cy.get('[data-cy=closeAnyVariableDialog]').should('be.disabled')
    })
    it.skip('does not override the redo stack when closing dialogs', () => {
        start_problem('A & B, C & D, E & G', 'A & D')
        run_tactic('ande')
        respond_with_unifying_assumption_index(0)
        run_tactic('ande')
        cancel_tactic()
        undo()
        run_tactic('ande')
        cancel_tactic()
        // Redo is disabled because
        redo()
    })
})

const dismiss_error = () => {
    cy.get('[data-cy=dismissError]').click()
}    

const undo = () => {
    cy.get('[data-cy=undo]').click()
}    

const redo = () => {
    cy.get('[data-cy=redo]').click()
}    

const restart = () => {
    cy.get('[data-cy=restart]').click()
}

const cancel_tactic = () => {
    cy.get('[data-cy=cancelTactic]').click()
}

const start_problem = (assumptions: string, conclusion: string) => {
    cy.get('[data-cy=newProblem]').click()
    if (assumptions !== '')
    cy.get('[data-cy=assumptionsText]').clear().type(assumptions, { parseSpecialCharSequences: false })
    cy.get('[data-cy=conclusionText]').clear().type(conclusion, { parseSpecialCharSequences: false })
    cy.get('[data-cy=start]').click()
}    

const run_tactic = (tactic: string) => {
    cy.get(`[data-cy=${CSS.escape(tactic)}Tactic]`).click()
    cy.get('[data-cy=runTactic]').click()
}    

const respond_with_unifying_assumption_index = (uai: number) => {
    cy.get('[data-cy=unifyingAssumptionDialog]').get(`[data-cy=uaIndex${uai}]`).click()
    cy.get('[data-cy=closeUnifyingAssumptionDialog]').click()
}    

const respond_with_sequent_or_theorem_substitution = (...substitutions: [string, string][]) => {
    for (const [id, ast_string] of substitutions) {
        cy.get(`[data-cy=substitution${id}]`).clear().type(ast_string)
    }
    if (substitutions.length !== 0)
        cy.get('[data-cy=closeSequentOrTheoremSubstitutionDialog]').click()
}

const respond_with_quantifier_shift_substitution = (variable: string, scope: string) => {
    cy.get('[data-cy=variable]').clear().type(variable)
    cy.get('[data-cy=scope]').clear().type(scope)
    cy.get('[data-cy=closeQuantifierShiftSubstitutionDialog]').click()
}

const respond_with_unifying_assumption_or_conclusion_index = (uai: number) => {
    cy.get('[data-cy=unifyingAssumptionOrConclusionDialog]').get(`[data-cy=uacIndex${uai}]`).click()
    cy.get('[data-cy=closeUnifyingAssumptionOrConclusionDialog]').click()
}

const respond_with_unused_variable_index = (uvi: number) => {
    cy.get('[data-cy=unusedVariableDialog]').get(`[data-cy=nameIndex${uvi}]`).click()
    cy.get('[data-cy=closeUnusedVariableDialog]').click()
}

const respond_with_any_variable_name = (name: string) => {
    if (name !== '')
        cy.get('[data-cy=anyVariableInput]').clear().type(name)
    cy.get('[data-cy=closeAnyVariableDialog]').click()
}

const assert_finished = () => {
    cy.get('[data-cy=finishedText]')
}