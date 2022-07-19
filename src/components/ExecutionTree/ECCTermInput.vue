<template>
  <div class="main">
    <q-input :rules="[parse_rule]" filled v-model="string_value" style="width: 200px; margin-right: 10px;" label="ECC Term" />
    <q-btn @click="parse_string_and_respond()" label="Respond" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CoastlineControl } from 'coastline/src/machine/control';
import { CoastlineObject, is_coastline_object, Term } from 'coastline/src/machine/object';
import { ecc_terms } from './ecc_term_parser';

const props = defineProps<{
  respond: (control: CoastlineControl) => CoastlineControl
}>()

// props.respond(operator_app(build_term_def, []))

const string_value = ref('')

const parse = (text: string): CoastlineObject<Term> | string => {
  const result = ecc_terms.Expression.parse(text)
  return result.status ? result.value : `'${text}' is not an ECCTerm!`
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