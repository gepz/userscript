import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';

import VarTypeMap from '@/filter/VarTypeMap';
import EvalType from '@/filter/type/EvalType';
import FunctionType from '@/filter/type/FunctionType';
import Primitive from '@/filter/type/Primitive';
import UI from '@/filter/type/UI';
import VariableType from '@/filter/type/VariableType';
import funcT from '@/filter/type/funcT';
import listT from '@/filter/type/listT';
import primitiveT from '@/filter/type/primitiveT';
import recordT from '@/filter/type/recordT';
import simpleT from '@/filter/type/simpleT';
import tupleT from '@/filter/type/tupleT';
import unknownT from '@/filter/type/unknownT';
import varT from '@/filter/type/varT';

const noVoidFuncT = (
  typeMap: VarTypeMap,
  argTypes: RNEA.ReadonlyNonEmptyArray<EvalType>,
  returnType: Exclude<EvalType, FunctionType>,
) => funcT({
  typeMap,
  type: [
    RNEA.map(O.of)(argTypes),
    O.of(returnType),
  ],
});

const mapAsUnknowns = (n: number) => ({
  ...RA.replicate(n, unknownT),
});

export default recordT({
  or: noVoidFuncT(
    {},
    [
      listT(simpleT({
        pri: Primitive.boolean,
        ui: UI.card,
      })),
    ],
    primitiveT(Primitive.boolean),
  ),
  and: noVoidFuncT(
    {},
    [
      listT(simpleT({
        pri: Primitive.boolean,
        ui: UI.card,
      })),
    ],
    primitiveT(Primitive.boolean),
  ),
  flip:
     noVoidFuncT(
       mapAsUnknowns(3),
       [
         noVoidFuncT(
           {},
           [
             varT(0),
             varT(1),
           ],
           varT(2),
         ),
         varT(1),
         varT(0),
       ],
       varT(2),
     ),
  flow: noVoidFuncT(
    mapAsUnknowns(3),
    [
      tupleT([
        noVoidFuncT(
          {},
          [varT(0)],
          varT(1),
        ),
        noVoidFuncT(
          {},
          [varT(1)],
          varT(2),
        ),
      ]),
      varT(0),
    ],
    varT(2),
  ),
  RA: recordT({
    some: noVoidFuncT(
      mapAsUnknowns(1),
      [
        noVoidFuncT(
          {},
          [varT(0)],
          primitiveT(Primitive.boolean),
        ),
        listT(varT(0)),
      ],
      primitiveT(Primitive.boolean),
    ),
    compact: noVoidFuncT(
      {},
      [listT(unknownT)],
      listT(unknownT),
    ),
  }),
  O: recordT({
    exists: noVoidFuncT(
      mapAsUnknowns(1),
      [
        noVoidFuncT(
          {},
          [varT(0)],
          primitiveT(Primitive.boolean),
        ),
        unknownT,
      ],
      primitiveT(Primitive.boolean),
    ),
  }),
  inText: noVoidFuncT(
    {},
    [
      unknownT,
      primitiveT(Primitive.string),
    ],
    primitiveT(Primitive.boolean),
  ),
  eqText: noVoidFuncT(
    {},
    [
      unknownT,
      primitiveT(Primitive.string),
    ],
    primitiveT(Primitive.boolean),
  ),
  matchedByText: noVoidFuncT(
    {},
    [
      unknownT,
      simpleT({
        pri: Primitive.string,
        ui: UI.regex,
      }),
    ],
    simpleT({
      pri: Primitive.boolean,
      ui: UI.regex,
    }),
  ),
  isVisible: noVoidFuncT(
    {},
    [unknownT],
    primitiveT(Primitive.boolean),
  ),
});
