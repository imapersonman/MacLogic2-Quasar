<template>
  <div class="text-h5">Derivation</div>
  <q-tree dense v-model:expanded="problemIds" :nodes="derivationTree" ref="derivation_tree" node-key="id" />
</template>

<script setup lang="ts">

const { derivationTree, problemIds } = defineProps<{
  derivationTree: any[],
  problemIds: number[]
}>()
</script>
