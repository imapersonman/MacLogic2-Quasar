import { is_empty } from 'coastline/src/utilities'

export const problem_to_display = (assumptions: string[], conclusion: string ): string => {
  return `${assumptions.join(', ')}${is_empty(assumptions) ? '' : ' '}⊢ ${conclusion}`
}

