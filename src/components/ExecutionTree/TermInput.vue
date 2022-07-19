<template>
  <div class="main">
    <q-input :rules="[parse_rule]" filled v-model="string_value" style="width: 200px; margin-right: 10px;" :label="String" />
    <q-btn @click="parse_string_and_respond()" label="Respond" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { build_term_def } from 'coastline/src/machine/examples';
import { operator_app } from 'coastline/src/machine/operator';
import { CoastlineControl } from 'coastline/src/machine/control';
import P from 'parsimmon'
import { CoastlineObject, is_coastline_object, obj, Term } from 'coastline/src/machine/object';
import { term_parser } from './term_parser';

const props = defineProps<{
  respond: (control: CoastlineControl) => CoastlineControl
}>()

// props.respond(operator_app(build_term_def, []))

const string_value = ref('')

const parse = (text: string): CoastlineObject<Term> | string => {
  const result = term_parser.Term.parse(text)
  return result.status ? result.value : `'${text}' is not a Term!`
}

const parse_rule = (text: string): boolean | string => {
  return is_coastline_object(parse(text))
}

const parse_string_and_respond = () => {
  const result = parse(string_value.value)
  if (is_coastline_object(result))
    props.respond(result)
}
</script>

<style scoped>
</style>