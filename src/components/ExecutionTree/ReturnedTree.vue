<template>
  <div class="return_tree">
    <div class="equals">→</div>
    <ExecutionTreeComponent :updated="tree_updated" :key="key" :value="tree" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { defined } from 'coastline/src/utilities'

const ExecutionTreeComponent = defineAsyncComponent(() => import('./ExecutionTreeComponent.vue'))
const props = defineProps({
  value: Object,
  updated: Function
})
const key = ref(0)
const tree = ref(props.value)

const tree_updated = () => {
  if (defined(props.updated)) props.updated()
}
</script>

<style scoped>
.return_tree {
  display: flex;
}

.equals {
  display: inline;
  font-size: 24px;
}
</style>