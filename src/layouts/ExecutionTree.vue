<template>
  <q-layout view="hHh Lpr fFf"> <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <!-- <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Header
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <!-- (Optional) The Footer -->
    <!-- <q-footer>
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>
          Footer
        </q-toolbar-title>
      </q-toolbar>
    </q-footer> -->

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <!-- <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-grey-2"
    >
      <q-scroll-area class="fit q-pa-sm">
        Yert
      </q-scroll-area>
    </q-drawer> -->

    <q-page-container style="padding-bottom: 500px; padding-right: 5000px;">
      <!-- This is where pages get injected -->
      <!-- <router-view /> -->
      <div v-for="(root, index) in roots">
        <ExecutionTreeComponent :key="index" :value="root" />
      </div>
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ExecutionTreeComponent from 'src/components/ExecutionTree/ExecutionTreeComponent.vue'
import { ExecutionTree } from 'coastline/src/machine/execution_tree'
import { operator_app } from 'coastline/src/machine/operator';
import { apply_substitution_def_2, ArithmeticExpression, ArithmeticOVM, binary_tree_options, build_term_def, check_ecc_free_variables, check_ecc_term_abbreviate, constants_in_pierce_term_def, depth_of_pierce_term_def, ECCTerm, ECCTermEVM, ECCTermOVM, ecc_capture_avoiding_substitution_def, ecc_free_variables_def, ecc_reduce_completely_def, ecc_static_distance_def, ecc_terms_alpha_equal_def, ecc_term_options, evaluate_arithmetic_expression_def, evaluate_boolean_pierce_term_def, fib_def, make_pierce_term_options_tree, merge_def, merge_sort_def, pierce_set_size_def, PTermOVM, size_of_pierce_term_def, start_unification_def, Subst, succ_def, succ_options, Term, TermOVM, terms_set_def } from 'coastline/src/machine/examples';
import { req2 } from 'coastline/src/machine/request';
import { first, is_array, is_empty, is_string, rest } from 'coastline/src/utilities';
import { expect_type, expect_types } from 'coastline/src/machine/utilities';
import { CoastlineControl } from 'coastline/src/machine/control';
import { ecc, ecc_examples } from 'src/components/ExecutionTree/ecc_terms';
import { CoastlineObject, ecc_term_types, obj, object_constructor } from 'coastline/src/machine/object';

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value;
}

// const root = ExecutionTree.root_from_control(operator_app(build_term_def, []))
// const root = ExecutionTree.root_from_control(operator_app(fib_def, [obj('Natural_Number', 3)]))


// const trm = object_constructor('Term')
const atm = object_constructor('TermAtom')
const va_ = object_constructor('TermVariable')
const lst = object_constructor('TermList')
const substitution = (...pairs: [CoastlineObject<TermOVM, 'TermVariable'>, CoastlineObject<TermOVM, Term>][]): CoastlineObject<TermOVM, Subst> => {
    if (is_empty(pairs))
        return obj('EmptySub', [])
    return obj('NonEmptySub', { variable: first(pairs)[0], term: first(pairs)[1], rest: substitution(...rest(pairs)) })
}
const coastline_term_from_json = (json: any): CoastlineObject<TermOVM, Term> => {
    if (is_string(json))
        if (json[0] === '.')
            return obj('TermVariable', json.substring(1))
        else
            return obj('TermAtom', json)
    if (is_array(json))
        return obj('TermList', json.map(coastline_term_from_json))
    throw new Error
}

const nat = object_constructor('Natural_Number')
const int = object_constructor('Integer')
const neg = (e: CoastlineObject<ArithmeticOVM, ArithmeticExpression>) => obj('NegativeExpression', { expression: e })
const plus = (left: CoastlineObject<ArithmeticOVM, ArithmeticExpression>, right: CoastlineObject<ArithmeticOVM, ArithmeticExpression>) => obj('PlusExpression', { left, right })
const minus = (left: CoastlineObject<ArithmeticOVM, ArithmeticExpression>, right: CoastlineObject<ArithmeticOVM, ArithmeticExpression>) => obj('MinusExpression', { left, right })
const times = (left: CoastlineObject<ArithmeticOVM, ArithmeticExpression>, right: CoastlineObject<ArithmeticOVM, ArithmeticExpression>) => obj('TimesExpression', { left, right })

const p_true = obj('PierceTerm', 'true')
const p_false = obj('PierceTerm', 'false')
const p_0 = obj('PierceTerm', '0')
const p_succ = (t: CoastlineObject<PTermOVM, 'PierceTerm'>) => obj('PierceTerm', { succ: t })
const p_pred = (t: CoastlineObject<PTermOVM, 'PierceTerm'>) => obj('PierceTerm', { pred: t })
const p_iszero = (t: CoastlineObject<PTermOVM, 'PierceTerm'>) => obj('PierceTerm', { iszero: t })
const p_if_then_else = (t1: CoastlineObject<PTermOVM, 'PierceTerm'>, t2: CoastlineObject<PTermOVM, 'PierceTerm'>, t3: CoastlineObject<PTermOVM, 'PierceTerm'>) => obj('PierceTerm', { if: t1, then: t2, else: t3 })

const [u, v, w, x, y, z] = ecc.vars('u', 'v', 'w', 'x', 'y', 'z')

type ECCSubstitutionExample = [CoastlineObject<ECCTermOVM, 'ECCVariable'>, CoastlineObject<ECCTermOVM, ECCTerm>, CoastlineObject<ECCTermOVM, ECCTerm>]

const ecc_substitution_examples: ECCSubstitutionExample[] = [
  [ecc.var('x'), ecc.var('y'), ecc.la(ecc.var('y'), ecc.var('y'), ecc.var('x'))],
  [ecc.var('x'), ecc.var('y'), ecc.la(ecc.var('y'), ecc.var('y'), ecc.var('y'))],
  // [ecc.var('x'), ecc.var('r'), ]
]

const mk_ecc_substitution_example = (example: ECCSubstitutionExample): ExecutionTree<ECCTermOVM, ECCTermEVM, CoastlineControl<ECCTermOVM, ECCTermEVM>> =>
  ExecutionTree.root_from_control(operator_app(ecc_capture_avoiding_substitution_def, [
    example[0],
    example[1],
    example[2]
  ]))

type ECCTermsAlphaEqualExample = [CoastlineObject<ECCTermOVM, ECCTerm>, CoastlineObject<ECCTermOVM, ECCTerm>]

const ecc_terms_alpha_equal_examples: ECCTermsAlphaEqualExample[] = [
  [
    ecc.la(x, ecc.prop, ecc.la(y, ecc.prop, ecc.app(x, ecc.app(x, y)))),
    ecc.la(u, ecc.prop, ecc.la(v, ecc.prop, ecc.app(u, ecc.app(u, v))))
  ],
  [
    ecc.si(x, y, x),
    ecc.si(z, y, x)
  ]
]

const mk_ecc_terms_alpha_equal_example = (example: ECCTermsAlphaEqualExample): ExecutionTree<ECCTermOVM, ECCTermEVM, CoastlineControl<ECCTermOVM, ECCTermEVM>> =>
  ExecutionTree.root_from_control(operator_app(ecc_terms_alpha_equal_def, [
    example[0],
    example[1]
  ]))

type ECCReduceCompletelyExample = CoastlineObject<ECCTermOVM, ECCTerm>

const ecc_reduce_completely_examples: ECCReduceCompletelyExample[] = [
  // no beta redexes
  ecc.prop,
  ecc.var('cool'),
  ecc.type(13),
  ecc.app(ecc.var('A'), ecc.var('B')),
  ecc.app(ecc.app(x, y), ecc.app(u, v)),
  ecc.arrow(x, y),
  ecc.arrow(ecc.app(x, y), ecc.arrow(u, v)),
  ecc.product(x, y),
  ecc.product(ecc.app(x, y), ecc.arrow(u, v)),
  ecc.pair(x, y, z),
  ecc.pair(ecc.product(w, z), ecc.pair(u, x, y), ecc.pair(v, y, v)),
  ecc.project('left', x),
  ecc.project('left', ecc.pair(x, y, z)),
  ecc.project('right', y),
  ecc.project('right', ecc.pair(x, y, z)),
  ecc.la(x, y, z),
  ecc.la(y, ecc.app(x, y), ecc.app(u, v)),
  ecc.pi(x, y, z),
  ecc.pi(y, ecc.app(x, y), ecc.app(u, v)),
  ecc.si(x, y, z),
  ecc.si(y, ecc.app(x, y), ecc.app(u, v)),
  // close but not quite beta-redexes
  ecc.app(ecc.pi(y, y, y), x),
  ecc.app(ecc.si(y, y, y), x),
  // beta redexes
  ecc.app(ecc.la(y, y, y), x),
  ecc.app(ecc.la(y, x, ecc.app(y, x)), ecc.la(w, y, ecc.app(y, w))),
  ecc.app(ecc.la(x, x, ecc.app(x, x)), ecc.la(x, x, ecc.app(x, x))),
]

const mk_ecc_reduce_completely_example = (example: ECCReduceCompletelyExample) =>
  ExecutionTree.root_from_control(operator_app(ecc_reduce_completely_def, [example]))

const roots = [
  // ...ecc_reduce_completely_examples.map(mk_ecc_reduce_completely_example),
  // ExecutionTree.root_from_control(operator_app(ecc_reduce_completely_def, [req2(...ecc_term_types)])),
  // ...ecc_examples.map(ExecutionTree.root_from_control),
  // ...ecc_examples.map((example) => ExecutionTree.root_from_control(check_ecc_free_variables(example))),
  // ...ecc_examples.map((example) => ExecutionTree.root_from_control(check_ecc_term_abbreviate(example))),
  // ...ecc_substitution_examples.map(mk_ecc_substitution_example),
  // ...ecc_terms_alpha_equal_examples.map(mk_ecc_terms_alpha_equal_example),
  // ExecutionTree.root_from_control(req2(...ecc_term_types)),
  // ExecutionTree.root_from_control(operator_app(ecc_static_distance_def, [obj('ECCSDContext', []), req2(...ecc_term_types)]))
  // ...ecc_examples.map((example) => ExecutionTree.root_from_control(operator_app(ecc_static_distance_def, [obj('ECCSDContext', []), example])))
  // ExecutionTree.root_from_control(ecc_term_options())
  ExecutionTree.root_from_control(operator_app(fib_def, [obj('Natural_Number', 0)])),
  ExecutionTree.root_from_control(operator_app(fib_def, [obj('Natural_Number', 1)])),
  ExecutionTree.root_from_control(operator_app(fib_def, [obj('Natural_Number', 2)])),
  ExecutionTree.root_from_control(operator_app(fib_def, [obj('Natural_Number', 3)])),
  ExecutionTree.root_from_control(operator_app(fib_def, [obj('Natural_Number', 8)])),
  ExecutionTree.root_from_control(operator_app(fib_def, [obj('Natural_Number', 10)])),
  // ExecutionTree.root_from_control(
  //   operator_app(apply_substitution_def_2, [
  //       substitution([va_('x'), atm('a')], [va_('y'), atm('b')], [va_('z'), atm('c')]),
  //       coastline_term_from_json(['.z', '.y', '.x'])
  //   ])
  // ),
  // ExecutionTree.root_from_control(operator_app(build_term_def, [])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [va_('x'), va_('x')])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [va_('x'), va_('y')])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [atm('a'), atm('a')])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [atm('a'), va_('x')])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [atm('a'), atm('b')])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [lst([atm('g'), atm('a'), va_('x')]), lst([atm('g'), atm('a'), atm('b')])])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [va_('x'), lst([atm('f'), va_('x')])])),
  // test_unify("f(.x, .x) =? f(.y, .z)", g_x_x, g_y_z, left_j_unify_right_j_expected)
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [lst([va_('x'), va_('x')]), lst([va_('y'), va_('z')])])),
  // ExecutionTree.root_from_control(operator_app(start_unification_def, [lst([atm('f'), va_('z'), lst([atm('f'), va_('y'), va_('z')])]), lst([atm('f'), atm('a'), lst([atm('f'), lst([atm('f'), atm('a'), atm('a')]), atm('a')])])])),
  // ExecutionTree.root_from_control(
  //   operator_app(start_unification_def, [
  //     req2('TermAtom', 'TermVariable', 'TermList'),
  //     req2('TermAtom', 'TermVariable', 'TermList')
  //   ])
  // ),
  // ExecutionTree.root_from_control(succ_options()),
  // ExecutionTree.root_from_control(binary_tree_options()),
  ExecutionTree.root_from_control(operator_app(merge_sort_def, [obj('NaturalList', [])])),
  ExecutionTree.root_from_control(operator_app(merge_sort_def, [obj('NaturalList', [nat(9)])])),
  ExecutionTree.root_from_control(operator_app(merge_sort_def, [obj('NaturalList', [2, 1, 7, 5, 8].map(nat))])),
  ExecutionTree.root_from_control(operator_app(merge_sort_def, [obj('NaturalList', [3, 4, 2, 1, 7, 5, 8, 9, 0, 6].map(nat))])),
  ExecutionTree.root_from_control(operator_app(merge_sort_def, [req2('NaturalList')])),
  // ExecutionTree.root_from_control(operator_app(merge_def, [obj('NaturalList', [nat(8), nat(9)]), obj('NaturalList', [nat(8)])])),
  // ExecutionTree.root_from_control(operator_app(evaluate_arithmetic_expression_def, [int(3)])),
  // ExecutionTree.root_from_control(operator_app(evaluate_arithmetic_expression_def, [neg(int(39))])),
  // ExecutionTree.root_from_control(operator_app(evaluate_arithmetic_expression_def, [plus(int(3), int(8))])),
  // ExecutionTree.root_from_control(operator_app(evaluate_arithmetic_expression_def, [minus(int(3), int(8))])),
  // ExecutionTree.root_from_control(operator_app(evaluate_arithmetic_expression_def, [times(int(6), int(4))])),
  // ExecutionTree.root_from_control(operator_app(evaluate_arithmetic_expression_def, [plus(times(int(3), int(5)), times(int(9), int(2)))])),
  // ExecutionTree.root_from_control(make_pierce_term_options_tree()),
  // ExecutionTree.root_from_control(operator_app(pierce_set_size_def, [operator_app(terms_set_def, [obj('Natural_Number', 0)])])),
  // ExecutionTree.root_from_control(operator_app(pierce_set_size_def, [operator_app(terms_set_def, [obj('Natural_Number', 1)])])),
  // ExecutionTree.root_from_control(operator_app(pierce_set_size_def, [operator_app(terms_set_def, [obj('Natural_Number', 2)])])),
  // don't run this next line - there are too many terms!!!
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_true])),
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_false])),
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_0])),
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_succ(p_0)])),
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_succ(p_succ(p_0))])),
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_pred(p_pred(p_0))])),
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_pred(p_succ(p_iszero(p_false)))])),
  // ExecutionTree.root_from_control(operator_app(constants_in_pierce_term_def, [p_if_then_else(p_pred(p_succ(p_iszero(p_false))), p_pred(p_pred(p_0)), p_succ(p_true))])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_true])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_false])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_0])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_succ(p_0)])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_succ(p_succ(p_0))])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_pred(p_pred(p_0))])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_pred(p_succ(p_iszero(p_false)))])),
  // ExecutionTree.root_from_control(operator_app(size_of_pierce_term_def, [p_if_then_else(p_pred(p_succ(p_iszero(p_false))), p_pred(p_pred(p_0)), p_succ(p_true))])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_true])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_false])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_0])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_succ(p_0)])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_succ(p_succ(p_0))])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_pred(p_pred(p_0))])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_pred(p_succ(p_iszero(p_false)))])),
  // ExecutionTree.root_from_control(operator_app(depth_of_pierce_term_def, [p_if_then_else(p_pred(p_succ(p_iszero(p_false))), p_pred(p_pred(p_0)), p_succ(p_true))])),
  // ExecutionTree.root_from_control(operator_app(evaluate_boolean_pierce_term_def, [p_true])),
  // ExecutionTree.root_from_control(operator_app(evaluate_boolean_pierce_term_def, [p_false])),
  // ExecutionTree.root_from_control(operator_app(evaluate_boolean_pierce_term_def, [p_if_then_else(p_true, p_0, p_false)])),
  // ExecutionTree.root_from_control(operator_app(evaluate_boolean_pierce_term_def, [p_if_then_else(p_false, p_0, p_true)])),
  // ExecutionTree.root_from_control(operator_app(evaluate_boolean_pierce_term_def, [p_if_then_else(p_if_then_else(p_true, p_false, p_true), p_0, p_true)])),
]
/*
// From a failed rule_test test.
const f_z_f_y_z = f("f", v("z"), f_y_z)
const f_a_a = f("f", a, a)
const f_a_f_f_a_a_a = f("f", a, f("f", f("f", a, a), a))
test_unify("f(z, f(y, z)) =? f(a, f(f(a, a), a))  -->  { y |-> f(a, a), z |-> a }", f_z_f_y_z, f_a_f_f_a_a_a, mk_sub([["y", f_a_a], ["z", a]]))
test_unify("f(a, f(f(a, a), a)) =? f(z, f(y, z))  -->  { y |-> f(a, a), z |-> a }", f_a_f_f_a_a_a, f_z_f_y_z, mk_sub([["y", f_a_a], ["z", a]]))
const f_b_a = f("f", b, a)
const f_a_f_b_a = f("f", a, f_b_a)
test_unify("f(a, f(b, a)) =? f(z, f(y, z))  -->  { y |-> b, z |-> a }", f_a_f_b_a, f_z_f_y_z, mk_sub([["y", b], ["z", a]]))
test_unify("f(z, f(y, z)) =? f(a, f(b, a))  -->  { y |-> b, z |-> a }", f_z_f_y_z, f_a_f_b_a, mk_sub([["y", b], ["z", a]]))
test_unify("f(y, z) =? f(b, a)  -->  { y |-> b, z |-> a }", f_b_a, f_y_z, mk_sub([["y", b], ["z", a]]))

// From a failed attach_tests test.
// I never tested the case in which a function on the left attempted to unify with an atom on the right.
test_unify("f(a) =? b  -->  undefined", f_a, b, new ConflictingEquations([{}, [[f_a, b]]], [[f_a, b]]))
test_unify("b =? f(a)  -->  undefined", b, f_a, new ConflictingEquations([{}, [[b, f_a]]], [[b, f_a]]))

// From a failed attach_tests test.
const z = v("z")
const g_y_z = f("g", y, z)
const left_j_unify_right_j_expected = mk_default_substitution([["x", z], ["y", z]])
if (left_j_unify_right_j_expected === undefined) throw new Error("shouldn't happen")
test_unify("f(.x, .x) =? f(.y, .z)", g_x_x, g_y_z, left_j_unify_right_j_expected)
*/

</script>
