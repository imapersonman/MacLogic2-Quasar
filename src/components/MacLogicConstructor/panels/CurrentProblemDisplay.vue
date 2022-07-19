<template>
  <div class="column q-ma-sm">
    <div class="text-h5 row">Current Problem</div>
    <div class="text-h6 row">Using</div>
      <div class="row q-ml-lg" v-for="(assumption, index) in assumptions" :key="index">{{ assumption }}</div>
    <div class="text-h6 row">Derive</div>
    <div class="row q-ml-lg" :key="conclusion">{{ conclusion }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  assumptions: string[],
  conclusion: string
}>()
</script>