import { obj } from 'coastline/src/machine/object'
import { term_parser } from './term_parser'

describe('term_parser', () => {
    test('()', () => expect(term_parser.Term.parse('()')).toEqual({ status: true, value: obj('TermList', []) }))
    test('a', () => expect(term_parser.Term.parse('a')).toEqual({ status: true, value: obj('TermAtom', 'a') }))
    test('.cool', () => expect(term_parser.Term.parse('.cool')).toEqual({ status: true, value: obj('TermVariable', 'cool') }))
    test('       \t .cool\n\t', () => expect(term_parser.Term.parse('       \t .cool\n\t')).toEqual({ status: true, value: obj('TermVariable', 'cool') }))
    test('(a b c)', () => expect(term_parser.Term.parse('(a b c)')).toEqual({ status: true, value: obj('TermList', [obj('TermAtom', 'a'), obj('TermAtom', 'b'), obj('TermAtom', 'c')]) }))
    test('   (    a b  c   )  ', () => expect(term_parser.Term.parse('   (    a b  c   )  ')).toEqual({ status: true, value: obj('TermList', [obj('TermAtom', 'a'), obj('TermAtom', 'b'), obj('TermAtom', 'c')]) }))
    test(' \t  (  \n\t  a \tb \n c   \t)  \n', () => expect(term_parser.Term.parse('(a b c)')).toEqual({ status: true, value: obj('TermList', [obj('TermAtom', 'a'), obj('TermAtom', 'b'), obj('TermAtom', 'c')]) }))
    test('(() (  a b c) (.v) ())', () => expect(term_parser.Term.parse('(() (  a b c) (.v) ())').status).toBeTruthy())
    test('(a .b c)', () => expect(term_parser.Term.parse('(a .b c)').status).toBeTruthy())
    test('(.b)', () => expect(term_parser.Term.parse('(.b)').status).toBeTruthy())
    test('(() ())', () => expect(term_parser.Term.parse('(() ())')).toEqual({ status: true, value: obj('TermList', [obj('TermList', []), obj('TermList', [])]) }))
    test('((()))', () => expect(term_parser.Term.parse('((()))')).toEqual({ status: true, value: obj('TermList', [obj('TermList', [obj('TermList', [])])]) }))
})