import { syntactic_equality } from 'coastline/src/lambda_pi/syntactic_equality'
import { Ctx } from 'coastline/src/logical_framework/ctx'
import { i } from './maclogic_shorthands'

export const all_possible_variable_names = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'/*, 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'*/]

export const possible_unused_variable_names = (ctx: Ctx): string[] => {
    const used_variable_names = ctx.entries().filter(([, type]) => syntactic_equality(type, i)).map(([id]) => id)
    return possible_names_minus(used_variable_names)
}

export const possible_names_minus = (without: string[]): string[] => {
    const without_set = new Set(without)
    return all_possible_variable_names.filter((name) => !without_set.has(name))
}

export const filled_in_possible_variable_names = (basic_names: string[], used_variables: string[]): string[] => {
    const used_variable_names_set = new Set(used_variables)
    const filled_in_names: string[] = []
    let basic_index = 0
    let prime_index = 0
    while (filled_in_names.length !== basic_names.length) {
        const current_name = basic_names[basic_index] + '\''.repeat(prime_index)
        if (!used_variable_names_set.has(current_name))
            filled_in_names.push(current_name)
        basic_index = (basic_index + 1) % basic_names.length
        if (basic_index === 0)
            prime_index++
    }
    return filled_in_names
}