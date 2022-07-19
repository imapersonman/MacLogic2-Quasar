<template>
  <q-dialog ref="variableIsNotFreeDialog" model-value data-cy="variableIsNotFreeDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section>
        <b>The given Constant name '{{ constantName }}' is not free in the current problem</b>
      <div class="row">Current Problem: {{ currentProblem }}</div>
      </q-card-section>
      <q-card-actions>
        <q-btn label="OK" v-close-popup data-cy="dismissError" color="primary"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{
  currentProblem: string
  constantName: string
  cancelDialog(): void
}>()
</script>
