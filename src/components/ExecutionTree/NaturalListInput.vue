<template>
  <div class="main">
    <q-input :rules="[parse_rule]" filled v-model="list_string" style="width: 100px; margin-right: 10px;" :label="String" />
    <q-btn @click="parse_and_respond()" label="Respond" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CoastlineControl } from 'app/../coastline/src/machine/control';
import { obj } from 'coastline/src/machine/object'
import P from 'parsimmon'

const props = defineProps<{
  respond: (control: CoastlineControl) => CoastlineControl
}>()

const natural_list_parser = P.createLanguage({
  Natural: () => P.regexp(/[0-9]+/).map((s) => obj('Natural_Number', parseInt(s))),
  List: (r) => r.Natural.sepBy(P.string(',').trim(P.optWhitespace)).map((ns) => obj('NaturalList', ns))
})

const list_string = ref('')

const parse_and_respond = () => {
  const parsed = natural_list_parser.List.parse(list_string.value)
  if (parsed.status)
    props.respond(parsed.value)
}

const parse_rule = (text) => {
  const parsed = natural_list_parser.List.parse(text)
  return parsed.status
}
</script>
