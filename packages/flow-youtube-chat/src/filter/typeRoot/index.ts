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
      O.of(listT(simpleT({
        pri: Primitive.boolean,
        ui: UI.card,
      }))),
    ],
    O.of(primitiveT(Primitive.boolean)),
  ]),
  and: funcT([
    [
      O.of(listT(simpleT({
        pri: Primitive.boolean,
        ui: UI.card,
      }))),
    ],
    O.of(primitiveT(Primitive.boolean)),
  ]),
  flip: funcT([
    RNEA.map(O.of)([
      funcT([
        RNEA.map(O.of)([
          varT(0),
          varT(1),
        ]),
        O.of(varT(2)),
      ]),
      varT(1),
      varT(0),
    ]),
    O.of(varT(2)),
  ]),
  flow: funcT([
    RNEA.map(O.of)([
      tupleT([
        funcT([
          [O.of(varT(0))],
          O.of(varT(1)),
        ]),
        funcT([
          [O.of(varT(1))],
          O.of(varT(2)),
        ]),
      ]),
      varT(0),
    ]),
    O.of(varT(2)),
  ]),
  RA: recordT({
    some: funcT([
      RNEA.map(O.of)([
        funcT([
          [O.of(varT(0))],
          O.of(primitiveT(Primitive.boolean)),
        ]),
        listT(varT(0)),
      ]),
      O.of(primitiveT(Primitive.boolean)),
    ]),
    compact: funcT([
      [O.of(listT(unknownT))],
      O.of(listT(unknownT)),
    ]),
  }),
  O: recordT({
    exists: funcT([
      RNEA.map(O.of)([
        funcT([
          [O.of(varT(0))],
          O.of(primitiveT(Primitive.boolean)),
        ]),
        unknownT,
      ]),
      O.of(primitiveT(Primitive.boolean)),
    ]),
  }),
  inText: funcT([
    RNEA.map(O.of)([
      unknownT,
      primitiveT(Primitive.string),
    ]),
    O.of(primitiveT(Primitive.boolean)),
  ]),
  eqText: funcT([
    RNEA.map(O.of)([
      unknownT,
      primitiveT(Primitive.string),
    ]),
    O.of(primitiveT(Primitive.boolean)),
  ]),
  matchedByText: funcT([
    RNEA.map(O.of)([
      unknownT,
      simpleT({
        pri: Primitive.string,
        ui: UI.regex,
      }),
    ]),
    O.of(simpleT({
      pri: Primitive.boolean,
      ui: UI.regex,
    })),
  ]),
  isVisible: funcT([
    [O.of(unknownT)],
    O.of(primitiveT(Primitive.boolean)),
  ]),
});
