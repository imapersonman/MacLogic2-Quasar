<template>
  <q-tree
    :nodes="nodes"
    dense
    node-key="unique_id"
    label-key="label"
    v-model:expanded="expanded"
  />
</template>

<script setup>
const props = defineProps({
  value: Object
})

const make_q_tree_out_of_binary_tree = (binary_tree) => {
  if (binary_tree.type === 'EmptyBinTree')
    return [[JSON.stringify(binary_tree)], { unique_id: JSON.stringify(binary_tree), label: binary_tree.value.num.value }]
  const [left_expanded, left_tree] = make_q_tree_out_of_binary_tree(binary_tree.value.left)
  const [right_expanded, right_tree] = make_q_tree_out_of_binary_tree(binary_tree.value.right)
  return [[JSON.stringify(binary_tree), ...left_expanded, ...right_expanded], {
    label: binary_tree.value.num.value,
    unique_id: JSON.stringify(binary_tree),
    children: [
      left_tree,
      right_tree
    ]
  }]
}

const [expanded, tree] = make_q_tree_out_of_binary_tree(props.value)
console.log(expanded)
const nodes = [tree]
</script>
