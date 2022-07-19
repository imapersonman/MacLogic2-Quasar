export const is_valid_constant_name = (name: string, names_to_avoid: string[] = []): boolean => {
  return /^[a-p]'*$/g.test(name) && !new Set(names_to_avoid).has(name)
}

export const is_valid_variable_name = (name: string, names_to_avoid: string[] = []): boolean => {
  return /^[q-z]'*$/g.test(name) && !new Set(names_to_avoid).has(name)
}