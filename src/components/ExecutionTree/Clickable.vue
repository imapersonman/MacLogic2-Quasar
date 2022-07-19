<template>
  <div class="main">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main:hover {
  background-color: gray;
  cursor: pointer;
  width: fit-content;
}
</style>