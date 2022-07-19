<template>
  <div class="main">
    <q-input filled v-model="number_value" type="number" style="width: 100px; margin-right: 10px;" label="Integer" />
    <q-btn @click="respond_with_integer()" label="Respond" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { obj } from 'coastline/src/machine/object'
import { CoastlineControl } from 'coastline/src/machine/control';
import { is_string } from 'coastline/src/utilities';

const props = defineProps<{
  respond: (o: CoastlineControl) => void
}>()

const number_value = ref(0)
watchEffect(() => console.log(number_value.value))

const respond_with_integer = () => {
  const actual_integer = is_string(number_value.value) ? parseInt(number_value.value) : number_value.value
  props.respond(obj('Integer', actual_integer))
}
</script>

<style scoped>
.main {
  display: flex;
}
</style>
