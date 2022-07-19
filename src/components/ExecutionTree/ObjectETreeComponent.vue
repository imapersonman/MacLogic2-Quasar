<template>
  <div class="main">
    <div v-if="control.type === 'Natural_Number'">
      {{ control.value }}
    </div>
    <div v-else-if="control.type === 'Boolean'">
      {{ control.value }}
    </div>
    <div v-else-if="control.type === 'String'">
      "{{ control.value }}"
    </div>
    <div v-else-if="cta('UnificationProblem', control)">
      [{{ control.value.map((ue) => display_coastline_object(ue)).join(', ') }}]
    </div>
    <div v-else-if="cta('EmptyBinTree', control) || cta('NonEmptyBinTree', control)">
      <BinaryTree :value="control" />
    </div>
    <div v-else-if="cta('NaturalList', control)">
      [{{ control.value.map((n) => n.value).join(', ') }}]
    </div>
    <div v-else-if="cta('Integer', control)">
      {{ control.value }}
    </div>
    <div v-else-if="cta('NegativeExpression', control) || cta('PlusExpression', control) || cta('MinusExpression', control) || cta('TimesExpression', control)">
      {{ display_arithmetic_expression(control) }}
    </div>
    <div v-else-if="cta('PierceTerm', control)">
      {{ display_pierce_term(control) }}
    </div>
    <div v-else-if="cta('PierceTermSet', control)">
      { {{ control.value.map(display_pierce_term).join(', ') }} }
    </div>
    <div v-else-if="cta('ECCProp', control) || cta('ECCType', control) || cta('ECCVariable', control) || cta('ECCApplication', control) || cta('ECCPi', control) || cta('ECCLambda', control) || cta('ECCSigma', control) || cta('ECCPair', control) || cta('ECCProject', control) || cta('ECCArrow', control) || cta('ECCProduct', control) || cta('ECCSD', control)">
      {{ display_ecc_term(control) }}
    </div>
    <div v-else-if="cta('ECCTermSet', control)" style="display: block;">
      {
      <div v-for="term in control.value" style="padding-left: 10px;">
        {{ display_ecc_term(term) }}
      </div>
      }
    </div>
    <div v-else-if="cta('ECCSDContext', control)">
      [{{ control.value.map(display_ecc_term).join(', ') }}]
    </div>
    <div v-else-if="cta('Confirmation', control)">
      ✓
    </div>
    <div v-else>
      {{ display_coastline_object(control) }}
    </div>
    <q-tooltip>
      {{ control.type }}
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { display_coastline_object, cta, ArithmeticExpression, CoastlineObject, ECCTerm } from 'coastline/src/machine/object';
import { ObjectETree } from 'coastline/src/machine/execution_tree';
import { defined, is_integer, is_number, is_string } from 'coastline/src/utilities';

import BinaryTree from './BinaryTree.vue'

const props = defineProps<{
  value: ObjectETree
  updated: () => void
}>()
const tree = ref(props.value)
const control = computed(() => props.value.control)

const display_ecc_term = (t: CoastlineObject<ECCTerm>): string => {
  const to_factored_string = (t: CoastlineObject<ECCTerm>): string => {
    if (cta('ECCProp', t) || cta('ECCVariable', t) || cta('ECCSD', t))
      return display_ecc_term(t)
    return `(${display_ecc_term(t)})`
  }

  if (cta('ECCProp', t))
    return 'Prop'
  if (cta('ECCType', t))
    return `Type ${t.value}`
  if (cta('ECCVariable', t))
    return `${t.value}`
  if (cta('ECCSD', t))
    return `\\${t.value}`
  if (cta('ECCApplication', t)) {
    if (cta('ECCApplication', t.value.head))
      return `${display_ecc_term(t.value.head)} ${to_factored_string(t.value.arg)}`
    return `${to_factored_string(t.value.head)} ${to_factored_string(t.value.arg)}`
  }
  if (cta('ECCPi', t))
    return `Π(${t.value.bound.value}: ${display_ecc_term(t.value.bound_type)}).${display_ecc_term(t.value.scope)}`
  if (cta('ECCLambda', t))
    return `λ(${t.value.bound.value}: ${display_ecc_term(t.value.bound_type)}).${display_ecc_term(t.value.scope)}`
  if (cta('ECCSigma', t))
    return `Σ(${t.value.bound.value}: ${display_ecc_term(t.value.bound_type)}).${display_ecc_term(t.value.scope)}`
  if (cta('ECCPair', t))
    return `pair<${display_ecc_term(t.value.pair_type)}>(${display_ecc_term(t.value.left)}, ${display_ecc_term(t.value.right)})`
  if (cta('ECCProject', t))
    return `π${t.value.project === 'left' ? '₁' : '₂'}(${display_ecc_term(t.value.pair)})`
  if (cta('ECCArrow', t))
    return `${to_factored_string(t.value.input)} → ${to_factored_string(t.value.output)}`
  if (cta('ECCProduct', t))
    return `${to_factored_string(t.value.left)} × ${to_factored_string(t.value.right)}`
  return `???${t.type}???`
}

const display_arithmetic_expression = (e: CoastlineObject<ArithmeticExpression>): string => {
  const display_sub_arithmetic_expression = (sub: CoastlineObject<ArithmeticExpression>): string => {
    if (cta('NegativeExpression', sub) || cta('PlusExpression', sub) || cta('MinusExpression', sub) || cta('TimesExpression', sub))
      return `(${display_arithmetic_expression(sub)})`
    return display_arithmetic_expression(sub)
  }
  const op_string_for_type = (type: string): string =>
    type === 'PlusExpression' ? '+'
    : type === 'MinusExpression' ? '-'
    : type === 'TimesExpression' ? '*'
    : '??????'
  if (cta('Integer', e))
    return `${e.value}`
  if (cta('NegativeExpression', e))
    return `-${display_sub_arithmetic_expression(e.value.expression)}`
  if (cta('PlusExpression', e) || cta('MinusExpression', e) || cta('TimesExpression', e))
    return `${display_sub_arithmetic_expression(e.value.left)} ${op_string_for_type(e.type)} ${display_sub_arithmetic_expression(e.value.right)}`
  return '???????????????'
}

const display_pierce_term = (p: CoastlineObject<'PierceTerm'>): string => {
  const display_sub_integer_collapsed_term = (s): string => {
    if (is_number(s) || is_string(s))
      return `${s}`
    return `(${display_integer_collapsed_pierce_term(s)})`
  }
  const integer_collapsed_pierce_term = (i: CoastlineObject<'PierceTerm'>) => {
    if (is_string(i.value)) {
      const as_int = parseInt(i.value)
      if (isNaN(as_int))
        return i.value
      return as_int
    }
    if ('if' in i.value)
      return { if: integer_collapsed_pierce_term(i.value.if), then: integer_collapsed_pierce_term(i.value.then), else: integer_collapsed_pierce_term(i.value.else) }
    if ('succ' in i.value) {
      const collapsed_input = integer_collapsed_pierce_term(i.value.succ)
      if (is_number(collapsed_input))
        return collapsed_input + 1
      return { succ: collapsed_input }
    }
    if ('pred' in i.value) {
      const collapsed_input = integer_collapsed_pierce_term(i.value.pred)
      if (is_number(collapsed_input))
        return collapsed_input - 1
      return { pred: collapsed_input }
    }
    return { iszero: integer_collapsed_pierce_term(i.value.iszero) }
  }
  const display_integer_collapsed_pierce_term = (t: any): string => {
    if (is_string(t))
      return t
    if (is_number(t))
      return `${t}`
    if ('if' in t && 'then' in t && 'else' in t)
      return `if ${display_sub_integer_collapsed_term(t.if)} then ${display_sub_integer_collapsed_term(t.then)} else ${display_sub_integer_collapsed_term(t.else)}`
    if ('succ' in t)
      return `succ ${display_sub_integer_collapsed_term(t.succ)}`
    if ('pred' in t)
      return `pred ${display_sub_integer_collapsed_term(t.pred)}`
    if ('iszero' in t)
      return `iszero ${display_sub_integer_collapsed_term(t.iszero)}`
    return '????'
  }
  return display_integer_collapsed_pierce_term(integer_collapsed_pierce_term(p))
}

</script>

<style scoped>
.main {
  border: 2px solid black;
  padding: 5px;
  margin: 5px;
  height: fit-content;
  background-color: chartreuse;
  display: flex;
}
</style>