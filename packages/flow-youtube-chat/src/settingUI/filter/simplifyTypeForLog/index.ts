import * as E from 'effect/Either';
import {
  pipe,
  flow,
} from 'effect/Function';
import * as O from 'effect/Option';
import * as RA from 'effect/ReadonlyArray';

import mapObject from '@/mapObject';
import Primitive from '@/type/Primitive';
import SimpleType from '@/type/SimpleType';
import UI from '@/type/UI';

import chainOptionElse from '@/chainOptionElse';

const simplifyTypeForLog = (obj: unknown): unknown => pipe(
  Array.isArray(obj) ? RA.map(simplifyTypeForLog)(obj)
  : typeof obj === 'object' && obj !== null ? pipe(
    obj,
    E.right,
    chainOptionElse(flow(
      O.liftPredicate((x): x is {
        tag: unknown
      } => 'tag' in x && Object.keys(x).length === 2),
      O.flatMap((o) => pipe(
        Object.entries(o),
        RA.findFirst(([k]) => k !== 'tag'),
        O.map(([, v]) => ({
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [o.tag as string]: v,
        })),
      )),
      O.map(simplifyTypeForLog),
    )),
    E.extend(E.merge),
    chainOptionElse(flow(
      O.liftPredicate((x): x is {
        tag: unknown
      } => typeof x === 'object'
      && x !== null && 'tag' in x && Object.keys(x).length === 1),
      O.map((x) => x.tag),
      O.map(simplifyTypeForLog),
    )),
    E.extend(E.merge),
    chainOptionElse(flow(
      O.liftPredicate((x): x is {
        var: number
      } => typeof x === 'object'
      && x !== null && 'var' in x && typeof x.var === 'number'
       && Object.keys(x).length === 1),
      O.map((x) => `var-${x.var}`),
      O.map(simplifyTypeForLog),
    )),
    E.extend(E.merge),
    chainOptionElse(flow(
      O.liftPredicate((x): x is {
        simple: SimpleType['value']
      } => typeof x === 'object'
      && x !== null && 'simple' in x && Object.keys(x).length === 1),
      O.map(({
        simple: {
          pri, ui,
        },
      }) => `${pri === Primitive.boolean ? 'bool'
      : pri === Primitive.string ? 'string'
      : 'unknown'}-${ui === UI.card ? 'card'
      : ui === UI.regex ? 'regex'
      : 'unknown'}`),
      O.map(simplifyTypeForLog),
    )),
    E.extend(E.merge),
    chainOptionElse(flow(
      O.liftPredicate(
        // eslint-disable-next-line no-underscore-dangle
        (x): x is O.Option<unknown> => typeof x === 'object'
         && x !== null && '_tag' in x,
      ),
      O.map(O.getOrElse(() => 'None')),
      O.map(simplifyTypeForLog),
    )),
    E.merge,
    (x) => (typeof x === 'object' && x !== null
      ? mapObject(([k, v]) => [k, simplifyTypeForLog(v)])(x)
      : x),
  ) : obj,
);

export default simplifyTypeForLog;
