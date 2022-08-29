import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

import Primitive from '@/filter/type/Primitive';
import UI from '@/filter/type/UI';
import funcT from '@/filter/type/funcT';
import listT from '@/filter/type/listT';
import primitiveT from '@/filter/type/primitiveT';
import recordT from '@/filter/type/recordT';
import simpleT from '@/filter/type/simpleT';
import tupleT from '@/filter/type/tupleT';
import unknownT from '@/filter/type/unknownT';
import varT from '@/filter/type/varT';

export default recordT({
  or: funcT([
    [
      O.some(listT(simpleT({
        pri: Primitive.boolean,
        ui: UI.card,
      }))),
    ],
    O.some(primitiveT(Primitive.boolean)),
  ]),
  and: funcT([
    [
      O.some(listT(simpleT({
        pri: Primitive.boolean,
        ui: UI.card,
      }))),
    ],
    O.some(primitiveT(Primitive.boolean)),
  ]),
  flip: funcT([
    RNEA.map(O.some)([
      funcT([
        RNEA.map(O.some)([
          varT(0),
          varT(1),
        ]),
        O.some(varT(2)),
      ]),
      varT(1),
      varT(0),
    ]),
    O.some(varT(2)),
  ]),
  flow: funcT([
    RNEA.map(O.some)([
      tupleT([
        funcT([
          [O.some(varT(0))],
          O.some(varT(1)),
        ]),
        funcT([
          [O.some(varT(1))],
          O.some(varT(2)),
        ]),
      ]),
      funcT([
        [O.some(varT(0))],
        O.some(varT(2)),
      ]),
    ]),
    O.some(varT(2)),
  ]),
  RA: recordT({
    some: funcT([
      RNEA.map(O.some)([
        funcT([
          [O.some(varT(0))],
          O.some(primitiveT(Primitive.boolean)),
        ]),
        listT(varT(0)),
      ]),
      O.some(primitiveT(Primitive.boolean)),
    ]),
    compact: funcT([
      [O.some(listT(unknownT))],
      O.some(listT(unknownT)),
    ]),
  }),
  O: recordT({
    exists: funcT([
      RNEA.map(O.some)([
        funcT([
          [O.some(varT(0))],
          O.some(primitiveT(Primitive.boolean)),
        ]),
        unknownT,
      ]),
      O.some(primitiveT(Primitive.boolean)),
    ]),
  }),
  inText: funcT([
    RNEA.map(O.some)([
      unknownT,
      primitiveT(Primitive.string),
    ]),
    O.some(primitiveT(Primitive.boolean)),
  ]),
  eqText: funcT([
    RNEA.map(O.some)([
      unknownT,
      primitiveT(Primitive.string),
    ]),
    O.some(primitiveT(Primitive.boolean)),
  ]),
  matchedByText: funcT([
    RNEA.map(O.some)([
      unknownT,
      simpleT({
        pri: Primitive.string,
        ui: UI.regex,
      }),
    ]),
    O.some(simpleT({
      pri: Primitive.boolean,
      ui: UI.regex,
    })),
  ]),
  isVisible: funcT([
    [O.some(unknownT)],
    O.some(primitiveT(Primitive.boolean)),
  ]),
});
