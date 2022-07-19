import { imv } from 'coastline/src/lambda_pi/shorthands'
import { Ast } from 'coastline/src/lambda_pi/ast'
import { try_match } from 'coastline/src/unification/shorthands'
import { ml } from './maclogic_shorthands'

export const unwrap_ml = (ast: Ast): Ast => try_match(ml(imv(0)), ast)[imv(0).id]