<template>
  <div>
    <ExecutionTreeComponent class="argument" :updated="tree_updated" :value="tree" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import { defined } from 'coastline/src/utilities'

const props = defineProps({
  value: Object,
  updated: Function
})

const ExecutionTreeComponent = defineAsyncComponent(() => import('./ExecutionTreeComponent.vue'))

const tree = ref(props.value)

const tree_updated = () => {
  if (defined(props.updated)) props.updated()
}

</script>

<style scoped>
.argument {
  border: 2px solid orange;
  padding: 2px;
  margin: 2px;
  width: fit-content;
}
</style>
