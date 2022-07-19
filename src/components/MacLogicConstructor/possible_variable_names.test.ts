import { mk_map } from 'coastline/src/map/RecursiveMap';
import { i, o } from './maclogic_shorthands';
import { all_possible_variable_names, filled_in_possible_variable_names, possible_names_minus, possible_unused_variable_names } from './possible_variable_names';

test('empty ctx returns everything', () => expect(possible_unused_variable_names(mk_map())).toEqual(all_possible_variable_names))
test('non-empty ctx without individuals returns everything', () => expect(possible_unused_variable_names(mk_map(['a', o], ['b', o], ['c', o]))).toEqual(all_possible_variable_names))
test('non-empty ctx with individuals returns correct stuffs', () => expect(possible_unused_variable_names(mk_map(['a', i], ['b', o], ['y', i], ['k', o]))).toEqual(
    // ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'z']
    possible_names_minus(['a', 'y'])
))

describe('filled_in_possible_variable_names', () => {
    test('empty basics, empty assumptions', () => expect(
        filled_in_possible_variable_names(
            [],
            []
        )
    ).toEqual(
        []
    ))

    test('non-empty basics, empty assumptions', () => expect(
        filled_in_possible_variable_names(
            ['a', 'b', 'c', 'd', 'e'],
            []
        )
    ).toEqual(
        ['a', 'b', 'c', 'd', 'e']
    ))

    test('non-empty basics, empty assumptions, conclusion with bound variables', () => expect(
        filled_in_possible_variable_names(
            ['a', 'b', 'c', 'd', 'x', 'e'],
            ['x', 'y', 'z']
        )
    ).toEqual(
        ['a', 'b', 'c', 'd', 'e', 'a\'']
    ))

    test('non-empty basics, non-empty assumptions with some used names', () => expect(
        filled_in_possible_variable_names(
            ['a', 'b', 'c', 'd', 'e'],
            ['A', 'B', 'C']
        )
    ).toEqual(
        ['a', 'b', 'c', 'd', 'e']
    ))

    test('non-empty basics, non-empty assumptions with some individuals', () => expect(
        filled_in_possible_variable_names(
            ['a', 'b', 'c', 'd', 'e'],
            ['a', 'b', 'c', 'B']
        )
    ).toEqual(
        ['d', 'e', 'a\'', 'b\'', 'c\'']
    ))

    test('non-empty basics, non-empty assumptions with some secondary individuals but not primary', () => expect(
        filled_in_possible_variable_names(
            ['a', 'b', 'c', 'd', 'e'],
            ['a\'', 'e\'', 'b', 'B']
        )
    ).toEqual(
        ['a', 'c', 'd', 'e', 'b\'']
    ))

    test('non-empty basics, non-empty assumptions with some individuals with the same base', () => expect(
        filled_in_possible_variable_names(
            ['a', 'b', 'c', 'd', 'e'],
            ['a', 'b\'', 'e\'', 'a\'', 'b']
        )
    ).toEqual(
        ['c', 'd', 'e', 'c\'', 'd\'']
    ))
})
