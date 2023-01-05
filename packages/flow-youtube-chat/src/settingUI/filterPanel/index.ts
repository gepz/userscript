import {
  generate,
} from 'astring';
import {
  omit,
} from 'fp-ts-std/ReadonlyStruct';
import {
  sequenceT,
} from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as En from 'fp-ts/Endomorphism';
import * as I from 'fp-ts/Identity';
import {
  concatAll,
} from 'fp-ts/Monoid';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import {
  Refinement,
} from 'fp-ts/Refinement';
import {
  pipe,
  apply,
  constant,
  flow,
  identity,
} from 'fp-ts/function';
import {
  h,
  text,
  VNode,
} from 'hyperapp';
import * as Op from 'monocle-ts/Optional';

import AppCommander from '@/AppCommander';
import * as EOP from '@/ElementOpticPair';
import SettingState from '@/SettingState';
import chainOptionElse from '@/chainOptionElse';
import VarTypeMap from '@/filter/VarTypeMap';
import ErrorType from '@/filter/type/ErrorType';
import EvalType from '@/filter/type/EvalType';
import FunctionType from '@/filter/type/FunctionType';
import Primitive from '@/filter/type/Primitive';
import RecordType from '@/filter/type/RecordType';
import RestType from '@/filter/type/RestType';
import SimpleType from '@/filter/type/SimpleType';
import TupleType from '@/filter/type/TupleType';
import UI from '@/filter/type/UI';
import errorT from '@/filter/type/errorT';
import funcT from '@/filter/type/funcT';
import functionOf from '@/filter/type/functionOf';
import listT from '@/filter/type/listT';
import recordT from '@/filter/type/recordT';
import restT from '@/filter/type/restT';
import returnOf from '@/filter/type/returnOf';
import simpleT from '@/filter/type/simpleT';
import tupleT from '@/filter/type/tupleT';
import unknownT from '@/filter/type/unknownT';
import typeRoot from '@/filter/typeRoot';
import mapObject from '@/mapObject';
import setRecord from '@/setRecord';
import ArrayExpression from '@/settingUI/EditableExpression/ArrayExpression';
import CallExpression from '@/settingUI/EditableExpression/CallExpression';
import Expression from '@/settingUI/EditableExpression/Expression';
import Identifier from '@/settingUI/EditableExpression/Identifier';
import Literal from '@/settingUI/EditableExpression/Literal';
import LiteralArray from '@/settingUI/EditableExpression/LiteralArray';
import MemberExpression from '@/settingUI/EditableExpression/MemberExpression';
import toJsepExp from '@/settingUI/EditableExpression/toJsepExp';
import editAction from '@/settingUI/editAction';
import errorNode from '@/settingUI/errorNode';
import setEditRegexs from '@/settingUI/setEditRegexs';
import setEditString from '@/settingUI/setEditString';
import setEditStrings from '@/settingUI/setEditStrings';
import EditSetter from '@/ui/EditSetter';
import * as Ed from '@/ui/Editable';
import panelBoxStyle from '@/ui/panelBoxStyle';
import textAreaRow from '@/ui/textAreaRow';
import textInput from '@/ui/textInput';

const simplifyExpressionForLog = (obj: unknown): unknown => pipe(
  Array.isArray(obj) ? RA.map(simplifyExpressionForLog)(obj)
  : typeof obj === 'object' && obj !== null ? pipe(
    obj,
    E.right,
    chainOptionElse(flow(
      O.fromPredicate((x): x is {
        computed: unknown
      } => 'computed' in x),
      O.map(omit(['computed'])),
    )),
    E.extend(E.toUnion),
    chainOptionElse(flow(
      O.fromPredicate((x): x is {
        type: unknown
      } => 'type' in x && Object.keys(x).length === 2),
      O.chain((o) => pipe(
        Object.entries(o),
        RA.findFirst(([k]) => k !== 'type'),
        O.map(([, v]) => ({
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          [o.type as string]: v,
        })),
      )),
      O.map(simplifyExpressionForLog),
    )),
    E.extend(E.toUnion),
    chainOptionElse(flow(
      O.fromPredicate((x): x is {
        Identifier: string
      } => typeof x === 'object' && x !== null && 'Identifier' in x
       && typeof x.Identifier === 'string' && Object.keys(x).length === 1),
      O.map((x) => x.Identifier),
      O.map(simplifyExpressionForLog),
    )),
    E.extend(E.toUnion),
    chainOptionElse(flow(
      O.fromPredicate(
        // eslint-disable-next-line no-underscore-dangle
        (x): x is O.Option<unknown> => typeof x === 'object'
         && x !== null && '_tag' in x,
      ),
      O.map(O.getOrElseW(() => 'None')),
      O.map(simplifyExpressionForLog),
    )),
    E.toUnion,
    (x) => (typeof x === 'object' && x !== null
      ? mapObject(([k, v]) => [k, simplifyExpressionForLog(v)])(x)
      : x),
  ) : obj,
);

const simplifyTypeForLog = (obj: unknown): unknown => pipe(
  Array.isArray(obj) ? RA.map(simplifyTypeForLog)(obj)
  : typeof obj === 'object' && obj !== null ? pipe(
    obj,
    E.right,
    chainOptionElse(flow(
      O.fromPredicate((x): x is {
        tag: unknown
      } => 'tag' in x && Object.keys(x).length === 2),
      O.chain((o) => pipe(
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
    E.extend(E.toUnion),
    chainOptionElse(flow(
      O.fromPredicate((x): x is {
        tag: unknown
      } => typeof x === 'object'
      && x !== null && 'tag' in x && Object.keys(x).length === 1),
      O.map((x) => x.tag),
      O.map(simplifyTypeForLog),
    )),
    E.extend(E.toUnion),
    chainOptionElse(flow(
      O.fromPredicate((x): x is {
        var: number
      } => typeof x === 'object'
      && x !== null && 'var' in x && typeof x.var === 'number'
       && Object.keys(x).length === 1),
      O.map((x) => `var-${x.var}`),
      O.map(simplifyTypeForLog),
    )),
    E.extend(E.toUnion),
    chainOptionElse(flow(
      O.fromPredicate((x): x is {
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
    E.extend(E.toUnion),
    chainOptionElse(flow(
      O.fromPredicate(
        // eslint-disable-next-line no-underscore-dangle
        (x): x is O.Option<unknown> => typeof x === 'object'
         && x !== null && '_tag' in x,
      ),
      O.map(O.getOrElseW(() => 'None')),
      O.map(simplifyTypeForLog),
    )),
    E.toUnion,
    (x) => (typeof x === 'object' && x !== null
      ? mapObject(([k, v]) => [k, simplifyTypeForLog(v)])(x)
      : x),
  ) : obj,
);

type Result<T extends EvalType | ErrorType> = {
  type: T,
  nodes: readonly VNode<SettingState>[],
  typeMap: VarTypeMap,
};

const errorResult = (typeMap: VarTypeMap): Result<ErrorType> => ({
  type: errorT,
  nodes: [errorNode],
  typeMap,
});

const replaceVarType = (
  typeMap: VarTypeMap,
) => (
  type: EvalType,
): EvalType => pipe(
  replaceVarType(typeMap),
  (r) => (
    type.tag === 'var' && type.value in typeMap ? typeMap[type.value]
    : type.tag === 'func' ? pipe(
      RNEA.map(O.map(r))(type.value.type[0]),
      (replacedParams) => pipe(
        type.value.type[1],
        O.map(r),
        O.map((x) => (x.tag === 'func' ? funcT({
          typeMap: {},
          type: [
            RNEA.concat(x.value.type[0])(replacedParams),
            x.value.type[1],
          ],
        })
        : funcT({
          typeMap: {},
          type: [replacedParams, O.of(x)],
        }))),
        O.getOrElse(() => funcT({
          typeMap: {},
          type: [replacedParams, O.none],
        })),
      ),
    )
    : type.tag === 'tuple' ? pipe(
      type.value,
      RA.map((x) => (x.tag === 'rest' ? restT(r(x.value))
      : r(x))),
      tupleT,
    )
    : type.tag === 'record' ? pipe(
      type.value,
      mapObject(([k, v]) => [k, r(v)]),
      recordT,
    )
    : type),
);

const assignableToFunc = (
  a: FunctionType,
) => (
  b: FunctionType,
): boolean => pipe(
  true,
);

const updateTypeMap = (
  expected: EvalType,
) => (
  actual: EvalType | ErrorType,
): En.Endomorphism<VarTypeMap> => (
  expected.tag === 'var'
  && actual.tag !== 'error'
  && actual.tag !== 'unknown'
  && actual.tag !== 'var' ? setRecord<number, EvalType>(
    expected.value,
  )(actual)
  : expected.tag === 'func' && actual.tag === expected.tag ? pipe(
    expected.value.type[0].length,
    (x) => (x < actual.value.type[0].length ? pipe(
      actual.value.type[0],
      RNEA.splitAt(x),
      ([a, b]) => [
        a,
        O.of(funcT({
          typeMap: {},
          type: [
            pipe(
              RNEA.fromReadonlyArray(b),
              O.getOrElse(
                (): RNEA.ReadonlyNonEmptyArray<O.Option<EvalType>> => [O.none],
              ),
            ),
            actual.value.type[1],
          ],
        })),
      ] as const,
    ) : actual.value.type),
    (x) => RA.zip(
      [...expected.value.type[0], expected.value.type[1]],
      [...x[0], x[1]],
    ),
    RA.map((x) => sequenceT(O.Apply)(...x)),
    RA.compact,
    RA.map(([e, a]) => updateTypeMap(e)(a)),
    concatAll(En.getMonoid()),
  )
  : expected.tag === 'tuple' && actual.tag === expected.tag ? pipe(
    RA.zip(expected.value, actual.value),
    RA.takeLeftWhile(
      (x): x is readonly [EvalType, EvalType] => x[0].tag !== 'rest'
      && x[1].tag !== 'rest',
    ),
    RA.map(([e, a]) => updateTypeMap(e)(a)),
    concatAll(En.getMonoid()),
  )
  : identity);

type ExpNodeFunc = (
  expectedType: EvalType,
) => (
  context: RecordType,
) => (
  m: VarTypeMap,
) => (
  c: AppCommander,
) => (
  s: SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, Expression>,
) => Result<EvalType | ErrorType>;

const identifierNode = (
  expectedType: EvalType,
) => (
  context: RecordType,
) => (
  m: VarTypeMap,
) => (
  c: AppCommander,
) => (
  s: SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, Identifier>,
): Result<EvalType | ErrorType> => (pair.ele.name in context.value ? pipe(
  context.value[pair.ele.name],
  (type) => pipe(
    updateTypeMap(type)(expectedType)({}),
    (x) => (console.log(
      `Before Replace: ${generate(toJsepExp(pair.ele))}\n`,
      `${JSON.stringify(simplifyTypeForLog(type), null, 2)}\n`,
      Object.keys(m).length === 0 ? undefined : m,
      Object.keys(x).length === 0 ? undefined : x,
    ), x),
    (x) => replaceVarType(x)(type),
  ),
  (type) => ({
    type,
    nodes: [h<SettingState>('div', {}, text(pair.ele.name))],
    typeMap: updateTypeMap(expectedType)(type)(m),
  }),
) : errorResult(m));

const memberNode = (
  f: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  m: VarTypeMap,
) => (
  c: AppCommander,
) => (
  s:SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, MemberExpression>,
): Result<EvalType | ErrorType> => pipe(
  f(unknownT)(typeRoot)(m)(c)(s)(pipe(
    pair,
    EOP.prop('object'),
  )),
  O.fromPredicate((x): x is Result<RecordType> => x.type.tag === 'record'),
  O.map((x) => f(expectedType)(x.type)(m)(c)(s)(pipe(
    pair,
    EOP.prop('property'),
  ))),
  O.getOrElseW(() => errorResult(m)),
);

const primitiveTupleUI = (
  pri: Primitive,
): R.Reader<EvalType, O.Option<UI>> => flow(
  O.fromPredicate((x): x is TupleType => x.tag === 'tuple'),
  O.map((x) => x.value),
  O.filter((x): x is [RestType] => x.length === 1 && x[0].tag === 'rest'),
  O.map(([x]) => x.value),
  O.filter((x): x is SimpleType => x.tag === 'simple'),
  O.map((x) => x.value),
  O.filter((x) => x.pri === pri),
  O.map((x) => x.ui),
);

const callNode = (
  f: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  m: VarTypeMap,
) => (
  c: AppCommander,
) => (
  s:SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, CallExpression>,
): Result<EvalType | ErrorType> => pipe(
  f(functionOf(unknownT)(expectedType))(
    typeRoot,
  )(m)(c)(s)(pipe(
    pair,
    EOP.prop('callee'),
  )),
  O.fromPredicate((x): x is Result<FunctionType> => x.type.tag === 'func'),
  O.bindTo('calleeResult'),
  O.bind('argumentResult', (ctx) => pipe(
    pair,
    EOP.prop('argument'),
    EOP.some,
    O.map((arg) => pipe(
      ctx.calleeResult.type.value.type[0][0],
      O.getOrElseW(() => unknownT),
      replaceVarType(ctx.calleeResult.typeMap),
      (expected) => pipe(
        f(expected)(typeRoot)({})(c)(s)(arg),
        (x) => ({
          ...x,
          typeMap: updateTypeMap(expected)(x.type)(x.typeMap),
        }),
      ),
    )),
    O.alt(() => O.of<Result<EvalType | ErrorType>>(errorResult(m))),
  )),
  O.map((ctx) => pipe(
    ctx.argumentResult,
    (result) => [
      ...ctx.calleeResult.nodes,
      ...pipe(
        result.nodes,
        pipe(
          ctx.calleeResult.type.value.type[0][0],
          O.chain(primitiveTupleUI(Primitive.boolean)),
          O.exists((x) => x === UI.card),
        ) ? RA.map((x) => h('div', {
          style: panelBoxStyle(212),
        }, [x]))
        : identity,
      ),
    ],
    I.bindTo('nodes'),
    I.apS('type', pipe(
      returnOf(ctx.calleeResult.type),
      O.getOrElse<EvalType | ErrorType>(() => errorT),
    )),
    I.let(
      'typeMap',
      (x) => updateTypeMap(expectedType)(x.type)(ctx.calleeResult.typeMap),
    ),
  )),
  O.getOrElse<Result<EvalType | ErrorType>>(() => errorResult(m)),
);

const expressionSetter = <T>(
  setter: EditSetter<T>,
) => (
  opt: Op.Optional<Expression, T>,
) => (
  empty: T,
) => pipe(
  setter,
  R.map(R.map(
    (f) => (x: Expression) => pipe(
      opt.getOption(x),
      O.getOrElse(constant(empty)),
      f,
      opt.set,
      apply(x),
    ),
  )),
);

const literalNode = (
  expectedType: EvalType,
) => (
  m: VarTypeMap,
) => (
  c: AppCommander,
): R.Reader<
EOP.ElementOpticPair<Expression, Literal>,
Result<SimpleType>
> => flow(
  EOP.prop('value'),
  (value) => ({
    type: simpleT({
      pri: Primitive.string,
      ui: expectedType.tag === 'simple' ? expectedType.value.ui
      : UI.unknown,
    }),
    nodes: [
      textInput(
        editAction(
          'filterExp',
          expressionSetter(setEditString)(value.opt)(Ed.of('')),
        )(c),
      )(value.ele),
    ],
  }),
  I.let('typeMap', (x) => updateTypeMap(expectedType)(x.type)(m)),
);

const literalArrayNode = (
  expectedType: EvalType,
) => (
  m: VarTypeMap,
) => (
  c: AppCommander,
): R.Reader<
EOP.ElementOpticPair<Expression, LiteralArray>,
Result<TupleType>
> => flow(
  EOP.prop('value'),
  (value) => ({
    type: listT(simpleT({
      pri: Primitive.string,
      ui: pipe(
        expectedType,
        primitiveTupleUI(Primitive.string),
        O.getOrElseW(() => UI.unknown),
      ),
    })),
    nodes: [
      textAreaRow(
        18,
        editAction(
          'filterExp',
          expressionSetter(
            pipe(
              expectedType,
              primitiveTupleUI(Primitive.string),
              O.getOrElseW(() => UI.unknown),
            ) === UI.regex
              ? setEditRegexs
              : setEditStrings,
          )(value.opt)(Ed.of([''])),
        )(c),
      )(value.ele),
    ],
  }),
  I.let('typeMap', (x) => updateTypeMap(expectedType)(x.type)(m)),
);

const arrayNode = (
  nodeF: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  map: VarTypeMap,
) => (
  c: AppCommander,
) => (
  s: SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, ArrayExpression>,
): Result<EvalType | ErrorType> => pipe(
  pair,
  EOP.prop('elements'),
  EOP.toArray,
  RA.mapWithIndex((i, e) => (
    et: EvalType,
  ) => (
    m: VarTypeMap,
  ) => nodeF(et)(typeRoot)(m)(c)(s)(e)),
  RA.reduce(pipe(
    expectedType,
    RA.fromPredicate((x): x is TupleType => x.tag === 'tuple'),
    RA.map((x) => x.value),
    RA.filter(RA.isNonEmpty),
    RA.append<RNEA.ReadonlyNonEmptyArray<EvalType | RestType>>(
      [restT(unknownT)] as const,
    ),
    RA.map((x): {
      types: (EvalType | ErrorType)[],
      nodes: VNode<SettingState>[],
      typeMap: VarTypeMap,
      expectedTupleTypes: RNEA.ReadonlyNonEmptyArray<EvalType | RestType>,
    } => ({
      types: [],
      nodes: [],
      typeMap: map,
      expectedTupleTypes: x,
    })),
  ), (matches, elementFn) => pipe(
    matches,
    RA.chain((match) => pipe(
      match.expectedTupleTypes,
      RNEA.matchLeft((first, rest) => (first.tag === 'rest' ? ([
        first.value,
        [rest, match.expectedTupleTypes],
      ] as const) : ([first, [rest]] as const))),
      ([firstType, restTypesList]) => pipe(
        restTypesList,
        RA.filter(RA.isNonEmpty),
        RA.match(() => [], (() => flow(
          RA.map(pipe(
            elementFn(replaceVarType(match.typeMap)(firstType))(match.typeMap),
            (x) => (restTypes) => ({
              types: [...match.types, x.type],
              nodes: [...match.nodes, h('div', {}, x.nodes)],
              typeMap: x.typeMap,
              expectedTupleTypes: restTypes,
            }),
          )),
        ))()),
      ),
    )),
  )),
  RA.head,
  O.map(omit(['expectedTupleTypes'])),
  O.map((ctx) => pipe(
    ctx.types,
    O.fromPredicate(RA.every((x): x is EvalType => x.tag !== 'error')),
    O.matchW(() => errorT, tupleT),
    (type) => ({
      type,
      nodes: ctx.nodes,
      typeMap: updateTypeMap(expectedType)(type)(ctx.typeMap),
    }),
  )),
  O.getOrElseW(() => errorResult(map)),
);

const chainPairElse = <T extends Expression>(
  r: Refinement<Expression, T>,
) => <E, R>(
  f: R.Reader<EOP.ElementOpticPair<Expression, T>, R>,
) => chainOptionElse<EOP.ElementOpticPair<Expression, Expression>, R, E>(flow(
  EOP.filter<Expression, Expression, T>(r),
  O.map(f),
));

const expNode: ExpNodeFunc = (
  e,
) => (
  context,
) => (
  m,
) => (
  c,
) => (
  s,
) => (
  pair,
) => pipe(
  pair,
  flow(
    (x) => (console.log(
      `${generate(toJsepExp(x.ele))}\n`,
      `${JSON.stringify(simplifyTypeForLog(e), null, 2)}\n`,
      Object.keys(m).length === 0 ? undefined : m,
    ), x),
    E.right,
    chainPairElse(
      (x): x is Identifier => x.type === 'Identifier',
    )(identifierNode(e)(context)(m)(c)(s)),
    chainPairElse(
      (x): x is MemberExpression => x.type === 'MemberExpression',
    )(memberNode(expNode)(e)(m)(c)(s)),
    chainPairElse(
      (x): x is CallExpression => x.type === 'CallExpression',
    )(callNode(expNode)(e)(m)(c)(s)),
    chainPairElse(
      (x): x is Literal => x.type === 'Literal',
    )(literalNode(e)(m)(c)),
    chainPairElse(
      (x): x is LiteralArray => x.type === 'LiteralArray',
    )(literalArrayNode(e)(m)(c)),
    chainPairElse(
      (x): x is ArrayExpression => x.type === 'ArrayExpression',
    )(arrayNode(expNode)(e)(m)(c)(s)),
  ),
  E.map(() => ({
    type: unknownT,
    nodes: [],
    typeMap: m,
  })),
  E.toUnion,
  (x) => (console.log(
    `Return: ${generate(toJsepExp(pair.ele))}\n`,
    `${JSON.stringify(simplifyTypeForLog(x.type), null, 2)}\n`,
    Object.keys(x.typeMap).length === 0 ? undefined : x.typeMap,
  ), x),
);

export default (
  c: AppCommander,
) => (
  s: SettingState,
): readonly VNode<SettingState>[] => expNode(unknownT)(typeRoot)({})(c)(s)(
  EOP.of(s.filterExp),
).nodes;
