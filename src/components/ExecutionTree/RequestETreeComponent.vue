<template>
  <div class="main">
    <div class="input" v-if="arrays_equal(tree.control.object_types, ['String'])">
      <StringInput :respond="respond" />
    </div>
    <div class="input" v-else-if="arrays_equal(tree.control.object_types, ['TermAtom', 'TermVariable', 'TermList'])">
      <TermInput :respond="respond" />
    </div>
    <div class="input" v-else-if="arrays_equal(tree.control.object_types, ['Natural_Number'])">
      <NaturalNumberInput :respond="respond" />
    </div>
    <div class="input" v-else-if="arrays_equal(tree.control.object_types, ['NaturalList'])">
      <NaturalListInput :respond="respond" />
    </div>
    <div class="input" v-else-if="arrays_equal(tree.control.object_types, ['Integer'])">
      <IntegerInput :respond="respond" />
    </div>
    <div class="input" v-else-if="arrays_equal(tree.control.object_types, ecc_term_types)">
      <ECCTermInput :respond="respond" />
    </div>
    <div v-if="return_tree !== undefined">
      <ReturnedTree :key="key" :updated="updated" :value="return_tree" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { arrays_equal } from 'coastline/src/utilities'
import { ecc_term_types } from 'coastline/src/machine/object'
import { defined } from 'coastline/src/utilities'

import ReturnedTree from './ReturnedTree.vue';
import StringInput from './StringInput.vue';
import TermInput from './TermInput.vue';
import NaturalNumberInput from './NaturalNumberInput.vue';
import IntegerInput from './IntegerInput.vue';
import NaturalListInput from './NaturalListInput.vue';
import ECCTermInput from './ECCTermInput.vue';

const props = defineProps({
  value: Object,
  updated: Function
})
const tree = ref(props.value)
// const request_data = tree.value.control.data
const return_tree = computed(() => tree.value.get_return_tree())

const key = ref(0)

const respond = (control) => {
  console.log(control)
  tree.value.respond(control)
  key.value++
  if (defined(props.updated)) props.updated()
}
</script>

<style scoped>
.main {
  display: flex;
}

.input {
  border: 2px solid black;
  padding: 5px;
  margin: 5px;
  display: flex;
  height: fit-content;
  width: fit-content;
}
</style>
