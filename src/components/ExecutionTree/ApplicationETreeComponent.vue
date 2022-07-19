<template>
  <div class="main">
    <div class="application">
      <div>
        {{ tree.control.definition.name }}
        {{ open_parens }}
      </div>
      <div class="argument_trees" v-if="argument_trees !== undefined">
        <div class="argument_slot" v-for="(at, index) in argument_trees">
          <div style="margin-top: auto; margin-bottom: auto;">{{ tree.control.definition.parameter_names[index] }} =</div>
          <ArgumentTree :updated="argument_updated" :value="at" />
        </div>
      </div>
      <div>
        {{ closing_paren }}
      </div>
    </div>
    <div v-if="return_tree !== undefined">
      <ReturnedTree class="return_tree" :key="return_tree_key" :value="return_tree" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ReturnedTree from './ReturnedTree.vue';
import ArgumentTree from './ArgumentTree.vue';
import { defined } from 'coastline/src/utilities'

const props = defineProps({
  value: Object,
  updated: Function
})

const tree = ref(props.value)
const return_tree_key = ref(0)

const argument_updated = () => {
  return_tree_key.value++
  console.log(`argument_updated for ${tree.value.control.definition.name}: ${return_tree_key.value}`)
  if (defined(props.updated)) props.updated()
}

const argument_trees = computed(() => tree.value.get_argument_trees())
const open_parens = computed(() => argument_trees.value.length === 0 ? '()' : '(')
const closing_paren = computed(() => argument_trees.value.length === 0 ? '' : ')')
const return_tree = computed(() => tree.value.get_return_tree())
</script>

<style scoped>
.main {
  display: flex;
}

.main > div {
  display: inline;
}

.application {
  border: 2px solid black;
  padding: 5px;
  margin: 5px;
  height: fit-content;
}

.argument_trees {
  margin-left: 20px;
}

.argument_slot {
  display: flex;
}
</style>