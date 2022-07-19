<template>
  <div class="main">
    <div v-if="ExecutionTree.is_object(tree)">
      <ObjectETreeComponent :updated="updated" :value="tree"/>
    </div>
    <div v-else-if="ExecutionTree.is_error(tree)">
      <ErrorETreeComponent :updated="updated" :value="tree"/>
    </div>
    <div v-else-if="ExecutionTree.is_options(tree)">
      <OptionsETreeComponent :updated="updated" :value="tree"/>
    </div>
    <div v-else-if="ExecutionTree.is_request(tree)">
      <RequestETreeComponent :updated="updated" :value="tree"/>
    </div>
    <div v-else-if="ExecutionTree.is_application(tree)">
      <ApplicationETreeComponent :updated="updated" :value="tree"/>
    </div>
    <div v-else>
      Unrecognized ExecutionTree!!!!!
    </div>
  </div>
</template>

<script setup>
import ObjectETreeComponent from './ObjectETreeComponent.vue'
import ErrorETreeComponent from './ErrorETreeComponent.vue';
import OptionsETreeComponent from './OptionsETreeComponent.vue';
import RequestETreeComponent from './RequestETreeComponent.vue'
import ApplicationETreeComponent from './ApplicationETreeComponent.vue'

import { ref } from 'vue'
import { ExecutionTree } from 'coastline/src/machine/execution_tree';
import { defined } from 'coastline/src/utilities'

const props = defineProps({
  value: Object,
  updated: Function
})
const tree = ref(props.value)
</script>

<style scoped>
.main {
  width: fit-content;
  white-space: nowrap;
  display: flex;
}

.error {
  background-color: red;
}

.result {
  background-color: greenyellow;
}

.neutral {
  background-color: aqua;
}
</style>
