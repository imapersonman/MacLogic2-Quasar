<template>
  <q-dialog ref="noUnifyingAssumptionsFoundDialog" model-value data-cy="noUnifyingAssumptionsFoundDialog" @hide="cancelDialog()">
    <q-card>
      <q-card-section>
        <b>Couldn't find any assumptions to use with {{ tacticDisplay }}</b>
      </q-card-section>
      <q-card-section class="column">
        <div class="row">The assumption should look like: {{ pattern }}</div>
      </q-card-section>
      <q-card-actions class="float-right">
        <q-btn label="Dismiss" v-close-popup data-cy="dismissError"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
defineProps<{
  tacticDisplay: string
  pattern: string
  cancelDialog(): void
}>()
</script>
