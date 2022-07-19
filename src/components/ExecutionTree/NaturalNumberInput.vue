<template>
  <div class="main">
    <q-input filled v-model="number_value" type="number" style="width: 100px; margin-right: 10px;" label="Natural Number" />
    <q-btn @click="respond(obj('Natural_Number', number_value))" label="Respond" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { obj } from 'coastline/src/machine/object'
import { CoastlineControl } from 'coastline/src/machine/control';

const props = defineProps<{
  respond: (o: CoastlineControl) => void
}>()

const number_value = ref(0)
</script>

<style scoped>
.main {
  display: flex;
}
</style>
