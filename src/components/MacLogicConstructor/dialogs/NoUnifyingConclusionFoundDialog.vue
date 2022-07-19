<template>
  <q-dialog ref="dialog" model-value data-cy="noUnifyingConclusionFoundDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section>
        <b>The tactic {{ tacticDisplay }} can't be used with the current conclusion</b>
      </q-card-section>
      <q-card-section class="column">
        <div class="row">The conclusion should look like: {{ pattern }}</div>
        <div class="row">Instead, it looks like: {{ conclusion }}</div>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn ref="dismissError" label="Dismiss" v-close-popup data-cy="dismissError"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">import { QBtn, QDialog } from 'quasar';
defineProps<{
  tacticDisplay: string
  pattern: string
  conclusion: string
  cancelDialog(): void
}>()
</script>
