import {
  pipe,
} from 'effect/Function';
import * as A from 'effect/Array';

import filterContext from '@/filter/filterContext';
import filterOperators from '@/filter/filterOperators';
import FunctionType, * as functionType from '@/type/FunctionType';
import * as genericType from '@/type/GenericType';
import * as recordType from '@/type/RecordType';
import * as simpleType from '@/type/SimpleType';
import * as tupleType from '@/type/TupleType';
import Type from '@/type/Type';
import UI from '@/type/UI';
import * as unknownType from '@/type/UnknownType';

const withUnknowns = (n: number) => <T extends Type>(
  param: T,
): functionType.ParamType => ({
  map: {
    ...A.replicate(n, unknownType.unknown),
  },
  type: param,
});

const makeFunc = (
  params: A.NonEmptyReadonlyArray<functionType.ParamType | Type>,
) => (
  returnType: functionType.FinalReturnType,
): FunctionType => pipe(
  params,
  A.map((x) => ('map' in x ? x : functionType.paramOf(x))),
  (x) => functionType.of([
    x,
    returnType,
  ]),
);

export default recordType.of({
  or: makeFunc(
    [
      tupleType.list(simpleType.of({
        pri: Primitive.boolean,
        ui: UI.card,
      })),
    ],
  )(simpleType.fromPrimitive(Primitive.boolean)),
  and: makeFunc(
    [
      tupleType.list(simpleType.of({
        pri: Primitive.boolean,
        ui: UI.card,
      })),
    ],
  )(simpleType.fromPrimitive(Primitive.boolean)),
  flip: makeFunc(
    [
      withUnknowns(3)(makeFunc(
        [
          genericType.of(0),
          genericType.of(1),
        ],
      )(genericType.of(2))),
      genericType.of(1),
      genericType.of(0),
    ],
  )(
    genericType.of(2),
  ),
  flow: makeFunc(
    [
      withUnknowns(3)(tupleType.of([
        makeFunc([genericType.of(0)])(genericType.of(1)),
        makeFunc([genericType.of(1)])(genericType.of(2)),
      ])),
      genericType.of(0),
    ],
  )(genericType.of(2)),
  RA: recordType.of({
    some: makeFunc(
      [
        withUnknowns(1)(makeFunc(
          [genericType.of(0)],
        )(simpleType.fromPrimitive(Primitive.boolean))),
        tupleType.list(genericType.of(0)),
      ],
    )(simpleType.fromPrimitive(Primitive.boolean)),
    compact: makeFunc(
      [tupleType.list(unknownType.unknown)],
    )(tupleType.list(unknownType.unknown)),
  } satisfies Record<keyof typeof filterOperators.RA, unknown>),
  O: recordType.of({
    exists: makeFunc(
      [
        withUnknowns(1)(makeFunc(
          [genericType.of(0)],
        )(simpleType.fromPrimitive(Primitive.boolean))),
        unknownType.unknown,
      ],
    )(simpleType.fromPrimitive(Primitive.boolean)),
  } satisfies Record<keyof typeof filterOperators.O, unknown>),
  inText: makeFunc(
    [
      unknownType.unknown,
      simpleType.fromPrimitive(Primitive.string),
    ],
  )(simpleType.fromPrimitive(Primitive.boolean)),
  eqText: makeFunc(
    [
      unknownType.unknown,
      simpleType.fromPrimitive(Primitive.string),
    ],
  )(simpleType.fromPrimitive(Primitive.boolean)),
  matchedByText: makeFunc(
    [
      unknownType.unknown,
      simpleType.of({
        pri: Primitive.string,
        ui: UI.regex,
      }),
    ],
  )(simpleType.of({
    pri: Primitive.boolean,
    ui: UI.regex,
  })),
  isVisible: makeFunc(
    [unknownType.unknown],
  )(simpleType.fromPrimitive(Primitive.boolean)),
  authorName: unknownType.unknown,
  message: unknownType.unknown,
  messageText: unknownType.unknown,
  paymentInfo: unknownType.unknown,
  authorID: unknownType.unknown,
} satisfies Record<keyof ReturnType<typeof filterContext>, unknown>);
