import { Sequent } from 'coastline/src/construction/sequent';
import { AbstractSyntaxTree } from 'coastline/src/lambda_pi/ast';
import { unelaborate_sequent } from '../elaborate';
import { unparse } from '../parser';
import { unelaborate_then_unparse_sequent } from '../parse_then_elaborate';
import { pattern_to_display } from '../pattern_to_display';
import { LogicDisplay } from './logic_display';

export class MacLogicIIDisplay implements LogicDisplay<
    string,
    string,
    { assumptions: string[], conclusion: string },
    string
> {
    ast_to_display(ast: AbstractSyntaxTree): string {
        return pattern_to_display(ast)
    }

    sequent_to_display(seq: Sequent): string {
        return unelaborate_then_unparse_sequent(seq)
    }

    current_problem_to_display(seq: Sequent): { assumptions: string[]; conclusion: string; } {
        const unelaborated = unelaborate_sequent(seq)
        return { assumptions: unelaborated[0].map(unparse), conclusion: unparse(unelaborated[1]) }
    }

    tactic_to_display(t: string): string {
        return {
            'impi': '→I',
            'impe': '→E',
            'noti': '~I',
            'note': '~E',
            'andi': '&I',
            'ande': '&E',
            'df': '↔ Def.',
            'oril': '∨I_left',
            'orir': '∨I_right',
            'ore': '∨E',
            'dn': 'DN',
            'foralli': '∀I',
            'foralle': '∀E',
            'existsi': '∃I',
            'existse': '∃E',
            'com_and': '& Com.',
            'com_or': '∨ Com.',
            'com_bic': '↔ Com.',
            'lem': 'LEM',
            'efq': 'EFQ',
            'imp1': '→ Def. 1',
            'imp2': '→ Def. 2',
            'mt': 'MT',
            'ds': 'DS',
            'dn+': 'DN+',
            'lemma': 'Lemma',
            'dem1': 'DeM 1',
            'dem2': 'DeM 2',
            'dem3': 'DeM 3',
            'dem4': 'DeM 4',
            'dem5': 'DeM 5',
            'dem6': 'DeM 6',
            'dem7': 'DeM 7',
            'dem8': 'DeM 8',
            'pmi1': 'PMI 1',
            'pmi2': 'PMI 2',
            'qs1': 'QS 1',
            'qs2': 'QS 2',
            'qs3': 'QS 3',
            'qs4': 'QS 4',
            'avu': '∀ AV',
            'ave': '∃ AV'
        }[t] ?? t
    }
}