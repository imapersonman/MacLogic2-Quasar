<template>
  <div>
    <div class="row title no-wrap" data-cy="finishedText">
      <div class="text-h5" style="display: inline;">Finished Constructing Proof</div>
      <div class="right_side float-right">
        <Transition name="fade">
          <div style="display: inline" v-if="disable_copy" class="q-mr-md">Copied!</div>
        </Transition>
        <q-btn label="Copy to Clipboard" @click="copy_proof_to_clipboard(proof_display)" />
      </div>
    </div>
    <!-- <div class="q-mt-md">
      <div class="row" v-for="line in proof_display">
        <div class="col-2">{{ line.as }}</div>
        <div class="col">{{ proof_line_display_to_middle_column(line) }}</div>
        <div class="col-4">{{ line.reason }}</div>
      </div>
    </div> -->
    <div class="q-mt-md row no-wrap">
      <div class="column q-mr-xl text-no-wrap">
        <div v-for="line in proof_display">
          <div v-if="line.as.length === 0">&nbsp;</div>
          <div v-else>{{ line.as }}</div>
        </div>
      </div>
      <div class="column q-mr-xs text-no-wrap" style="align-items: flex-end;">
        <div v-for="line in proof_display">({{ line.ln }})</div>
      </div>
      <div class="column q-mr-xl text-no-wrap">
        <div v-for="line in proof_display">{{ line.statement }}</div>
      </div>
      <div class="column q-mr-xl text-no-wrap">
        <div v-for="line in proof_display">{{ line.reason }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ast } from 'coastline/src/lambda_pi/ast';
import { display_proof, ProofLine, ProofLineDisplay } from '../linear_proof2';
import { copyToClipboard } from 'quasar';
import { ref } from 'vue';
import { defined } from 'coastline/src/utilities';

const { proof, statement_to_string, reason_map } = defineProps<{
  proof: ProofLine[]
  statement_to_string?: (statement: Ast) => string
  reason_map?: (reason: string) => string
}>()

const proof_display = display_proof(proof, statement_to_string, reason_map)

const proof_display_to_string = (pd: ProofLineDisplay[]): string => {
  const right_padding = 4
  const a_pad = Math.max(...pd.map((line) => line.as.length)) + right_padding
  const s_pad = Math.max(...pd.map((line) => line.statement.length)) + right_padding
  const l_pad = Math.max(...pd.map((line) => `(${line.ln})`.length))
  return pd.map((line) => `${line.as.padEnd(a_pad, ' ')}${`(${line.ln})`.padStart(l_pad, ' ')} ${line.statement.padEnd(s_pad, ' ')}${line.reason}`).join('\n')
}

let copied_message_timer: any = undefined
const disable_copy = ref(false)
const og_copy_label = 'Copy to Clipboard'
const copied_copy_label = 'Copied!'
const copy_label = ref(og_copy_label)

const copy_proof_to_clipboard = (pd: ProofLineDisplay[]) => {
  copy_label.value = copied_copy_label
  if (defined(copied_message_timer) && disable_copy.value)
    clearTimeout(copied_message_timer)
  copied_message_timer = setTimeout(() => { copy_label.value = og_copy_label; disable_copy.value = false }, 3000)
  disable_copy.value = true
  copyToClipboard(proof_display_to_string(pd))
}
</script>

<style scoped>
.title {
  display: inline;
}

.right_side {
  display: inline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
