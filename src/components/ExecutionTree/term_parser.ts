import { obj } from 'coastline/src/machine/object'
import P from 'parsimmon'

export const term_parser = P.createLanguage({
  Term: (r) => r.JustTerm.trim(P.optWhitespace),
  JustTerm: (r) => P.alt(r.Atom, r.Variable, r.List),
  Atom: () => P.regexp(/[A-Za-z0-9]+/).map((str) => obj('TermAtom', str)),
  Variable: () => P.string('.').then(P.regexp(/[A-Za-z0-9]+/)).map((str) => obj('TermVariable', str)),
  List: (r) => r.JustTerm.sepBy(P.whitespace).wrap(P.string('(').skip(P.optWhitespace), P.optWhitespace.skip(P.string(')'))).map((ts) => obj('TermList', ts))
})