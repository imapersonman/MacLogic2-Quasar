<template>
  <div class="main">
    <q-input filled v-model="string_value" style="width: 100px; margin-right: 10px;" :label="String" />
    <q-btn @click="respond(obj('String', string_value))" label="Respond" />
  </div>
</template>

<script setup lang="ts">
import { CoastlineControl } from 'coastline/src/machine/control';
import { obj } from 'coastline/src/machine/object'
import { ref } from 'vue'

const props = defineProps<{
  respond: (control: CoastlineControl) => CoastlineControl
}>()

const string_value = ref('')
</script>

<style scoped>
.main {
  display: flex;
}
</style>