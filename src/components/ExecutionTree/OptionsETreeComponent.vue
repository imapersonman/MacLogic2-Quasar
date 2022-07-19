<template>
  <div class="main">
    <div class="options">
      <div v-for="[label] in control.options" :key="label" @click="choose(label)">
        <!-- <Clickable v-if="chosen_label === label">
          &gt; {{ label }} &lt;
        </Clickable> -->
        <Clickable :class="{ choice: chosen_label === label }">
          <div class="label">{{ label }}</div>
        </Clickable>
      </div>
    </div>
    <div class="return_tree" v-if="return_tree !== undefined">
      <ReturnedTree :key="key" :updated="updated" :value="return_tree" />
    </div>
  </div>

</template>

<script setup>
import Clickable from './Clickable.vue'

import { ref, computed } from 'vue'
import { OptionsETree } from 'coastline/src/machine/execution_tree';
import ReturnedTree from './ReturnedTree.vue';
import { defined } from 'coastline/src/utilities'

const props = defineProps({ value: OptionsETree, updated: Function })
const tree = ref(props.value)
const control = computed(() => tree.value.control)

const key = ref(0)

const chosen_label = computed(() => tree.value.get_chosen_path())
const return_tree = computed(() => tree.value.get_return_tree())

const choose = (label) => {
  tree.value.choose(label)
  key.value++
  if (defined(props.updated)) props.updated()
}
</script>

<style scoped>
.main {
  display: flex;
}

.main > div {
  display: inline;
}

.label {
  padding-left: 4px;
  padding-right: 4px;
}

.choice {
  background-color: cyan;
  width: fit-content;
}

.options {
  display: block;
  border: 2px solid black;
  padding: 5px;
  margin: 5px;
  height: fit-content;
}

.equals {
  font-size: 24px;
}
</style>
