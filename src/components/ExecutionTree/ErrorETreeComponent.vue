<template>
  <div class="main">
    {{ display_coastline_error(tree.control) }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { display_coastline_error } from 'coastline/src/machine/error'
import { CoastlineControl } from 'coastline/src/machine/control';
import { ErrorETree, ExecutionTree } from 'coastline/src/machine/execution_tree';
import { defined } from 'coastline/src/utilities'

const props = defineProps<{
  value: ErrorETree,
  updated: () => void
}>()

const tree = ref(props.value)
</script>

<style scoped>
.main {
  background-color: indianred;
  border: 2px solid black;
  padding: 5px;
  margin: 5px;
  height: fit-content;
}
</style>
