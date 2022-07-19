import { mv } from 'coastline/src/lambda_pi/shorthands';
import { Ast } from 'coastline/src/lambda_pi/ast';
import { matches_with } from 'coastline/src/unification/first_order_match';
import { ml } from './maclogic_shorthands';

const X = mv('X')
export const ml_wrapped = (ast: Ast): boolean => matches_with(ml(X), ast)