import {
  sequenceT,
} from 'fp-ts/Apply';
import {
  tailRec,
} from 'fp-ts/ChainRec';
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
import listT from '@/filter/type/listT';
import recordT from '@/filter/type/recordT';
import restT from '@/filter/type/restT';
import returnT from '@/filter/type/returnT';
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

type Result<T extends EvalType | ErrorType> = {
  type: T,
  nodes: readonly VNode<SettingState>[],
  typeMap: Record<number, EvalType>,
};

const errorResult = (typeMap: Record<number, EvalType>): Result<ErrorType> => ({
  type: errorT,
  nodes: [errorNode],
  typeMap,
});

const replaceVarType = (
  typeMap: Record<number, EvalType>,
) => (
  type: EvalType,
): EvalType => pipe(
  replaceVarType(typeMap),
  (r) => (
    type.tag === 'var' && type.type in typeMap ? typeMap[type.type]
    : type.tag === 'func' ? funcT([
      RNEA.map(O.map(r))(type.type[0]),
      O.map(r)(type.type[1]),
    ])
    : type.tag === 'tuple' ? pipe(
      type.type,
      RA.map((x) => (x.tag === 'rest' ? restT(r(x.type))
      : r(x))),
      tupleT,
    )
    : type.tag === 'record' ? pipe(
      type.type,
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
  e: EvalType,
) => (
  a: EvalType | ErrorType,
): En.Endomorphism<Record<number, EvalType>> => (
  e.tag === 'var' && a.tag !== 'error' ? setRecord<number, EvalType>(e.type)(a)
  : e.tag === 'func' && a.tag === e.tag ? pipe(
    RA.zip([...e.type[0], e.type[1]], [...a.type[0], a.type[1]]),
    RA.map((x) => sequenceT(O.Apply)(...x)),
    RA.compact,
    RA.map((x) => updateTypeMap(x[0])(x[1])),
    concatAll(En.getMonoid()),
  )
  : e.tag === 'tuple' && a.tag === e.tag ? pipe(
    RA.zip(e.type, a.type),
    () => identity,
  )
  : identity);

type ExpNodeFunc = (
  expectedType: EvalType,
) => (
  context: RecordType,
) => (
  m: Record<number, EvalType>,
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
  m: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  s: SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, Identifier>,
): Result<EvalType | ErrorType> => (pair.ele.name in context.type ? pipe(
  context.type[pair.ele.name],
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
  m: Record<number, EvalType>,
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
  O.map((x) => f(unknownT)(x.type)(m)(c)(s)(pipe(
    pair,
    EOP.prop('property'),
  ))),
  O.map((x) => ({
    type: x.type,
    nodes: x.nodes,
  })),
  O.let('typeMap', (x) => updateTypeMap(expectedType)(x.type)(m)),
  O.getOrElse<Result<EvalType | ErrorType>>(() => errorResult(m)),
);

const primitiveTupleUI = (
  pri: Primitive,
): R.Reader<EvalType, O.Option<UI>> => flow(
  O.fromPredicate((x): x is TupleType => x.tag === 'tuple'),
  O.map((x) => x.type),
  O.filter((x): x is [RestType] => x.length === 1 && x[0].tag === 'rest'),
  O.map(([x]) => x.type),
  O.filter((x): x is SimpleType => x.tag === 'simple'),
  O.map((x) => x.type),
  O.filter((x) => x.pri === pri),
  O.map((x) => x.ui),
);

const callNode = (
  f: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  m: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  s:SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, CallExpression>,
): Result<EvalType | ErrorType> => pipe(
  f(funcT([[O.of(unknownT)], O.of(expectedType)]))(
    typeRoot,
  )(m)(c)(s)(pipe(
    pair,
    EOP.prop('callee'),
  )),
  O.fromPredicate((x): x is Result<FunctionType> => x.type.tag === 'func'),
  O.bindTo('calleeResult'),
  O.bind('argumentResult', (ctx) => pipe(
    pair.ele.argument,
    O.map((arg) => pipe(
      ctx.calleeResult.type.type[0][0],
      O.getOrElse<EvalType>(constant(unknownT)),
      replaceVarType(ctx.calleeResult.typeMap),
      (x) => f(x)(typeRoot)({})(c)(s)({
        ele: arg,
        opt: pipe(
          pair.opt,
          Op.prop('argument'),
          Op.some,
        ),
      }),
    )),
    O.alt(constant(O.of<Result<EvalType | ErrorType>>(errorResult(m)))),
  )),
  O.map((ctx) => pipe(
    ctx.argumentResult,
    (result) => [
      ...ctx.calleeResult.nodes,
      ...pipe(
        result.nodes,
        pipe(
          ctx.calleeResult.type.type[0][0],
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
      returnT(ctx.calleeResult.type),
      O.getOrElse<EvalType | ErrorType>(constant(errorT)),
    )),
    I.let(
      'typeMap',
      (x) => updateTypeMap(expectedType)(x.type)(ctx.argumentResult.typeMap),
    ),
  )),
  O.getOrElse<Result<EvalType | ErrorType>>(constant(errorResult(m))),
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
  m: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  pair: EOP.ElementOpticPair<Expression, Literal>,
): Result<SimpleType> => pipe(
  pair.opt,
  Op.prop('value'),
  (value) => ({
    type: simpleT({
      pri: Primitive.string,
      ui: expectedType.tag === 'simple' ? expectedType.type.ui
      : UI.unknown,
    }),
    nodes: [
      textInput(
        editAction(
          'filterExp',
          expressionSetter(setEditString)(value)(Ed.of('')),
        )(c),
      )(pair.ele.value),
    ],
  }),
  I.let(
    'typeMap',
    (ctx) => updateTypeMap(expectedType)(ctx.type)(m),
  ),
);

const literalArrayNode = (
  expectedType: EvalType,
) => (
  m: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  pair: EOP.ElementOpticPair<Expression, LiteralArray>,
): Result<TupleType> => pipe(
  pair.opt,
  Op.prop('value'),
  (value) => ({
    type: listT(simpleT({
      pri: Primitive.string,
      ui: pipe(
        expectedType,
        primitiveTupleUI(Primitive.string),
        O.getOrElseW(constant(UI.unknown)),
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
              O.getOrElseW(constant(UI.unknown)),
            ) === UI.regex
              ? setEditRegexs
              : setEditStrings,
          )(value)(Ed.of([''])),
        )(c),
      )(pair.ele.value),
    ],
  }),
  I.let(
    'typeMap',
    (ctx) => updateTypeMap(expectedType)(ctx.type)(m),
  ),
);

const arrayNode = (
  nodeF: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  map: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  s: SettingState,
) => (
  pair: EOP.ElementOpticPair<Expression, ArrayExpression>,
): Result<EvalType | ErrorType> => pipe(
  pair,
  EOP.prop('elements'),
  (elements) => pipe(
    elements.ele,
    RA.mapWithIndex((i: number, e) => pipe(
      elements.opt,
      Op.index(i),
      EOP.of(e),
      (p) => (
        et: EvalType,
      ) => (
        m: Record<number, EvalType>,
      ) => nodeF(et)(typeRoot)(m)(c)(s)(p),
    )),
  ),
  (f) => tailRec<{
    matches: readonly {
      types: (EvalType | ErrorType)[],
      nodes: VNode<SettingState>[],
      typeMap: Record<number, EvalType>,
      eTypes: RNEA.ReadonlyNonEmptyArray<EvalType | RestType>,
    }[],
    fns: readonly (R.Reader<EvalType,
    R.Reader<Record<number, EvalType>,
    Result<EvalType | ErrorType>>>)[],
  }, O.Option<{
    types: (EvalType | ErrorType)[],
    nodes: VNode<SettingState>[],
    typeMap: Record<number, EvalType>,
  }>>(pipe(
          expectedType,
          RA.fromPredicate((x): x is TupleType => x.tag === 'tuple'),
          RA.map((x) => x.type),
          RA.filterMap(RNEA.fromReadonlyArray),
          RA.append<RNEA.ReadonlyNonEmptyArray<EvalType | RestType>>(
            [restT(unknownT)] as const,
          ),
          RA.map((x) => ({
            types: [],
            nodes: [],
            typeMap: map,
            eTypes: x,
          })),
          I.bindTo('matches'),
          I.apS('fns', f),
        ), (current) => (pipe(
          current.fns,
          RNEA.fromReadonlyArray,
          O.map(RNEA.matchLeft((currentFn, restFns) => pipe(
            current.matches,
            RA.chain((match) => pipe(
              match.eTypes,
              RNEA.matchLeft((head, tail) => (head.tag === 'rest' ? ([
                head.type,
                [tail, match.eTypes],
              ] as const) : ([
                head,
                [tail],
              ] as const))),
              ([eType, restETypes]) => ({
                eType,
                restETypes: pipe(
                  restETypes,
                  RA.filterMap(RNEA.fromReadonlyArray),
                  RNEA.fromReadonlyArray,
                ),
              }),
              (ctx) => pipe(
                ctx.restETypes,
                O.map((arr) => pipe(
                  currentFn(ctx.eType)(match.typeMap),
                  (result) => pipe(
                    arr,
                    RA.map((x) => ({
                      types: [...match.types, result.type],
                      nodes: [...match.nodes, h('div', {}, result.nodes)],
                      typeMap: result.typeMap,
                      eTypes: x,
                    })),
                  ),
                )),
                O.getOrElseW(constant([])),
              ),
            )),
            (x) => ({
              matches: x,
              fns: restFns,
            }),
          ))),
          E.fromOption(constant(pipe(
            current.matches,
            RA.head,
            O.map((x) => ({
              types: x.types,
              nodes: x.nodes,
              typeMap: x.typeMap,
            })),
          ))),
          E.swap,
        ))),
  O.map((ctx) => ({
    type: pipe(
      ctx.types,
      O.fromPredicate((v): v is EvalType[] => pipe(
        v,
        RA.every((x) => x.tag !== 'error'),
      )),
      O.map(tupleT),
      O.getOrElse<EvalType | ErrorType>(() => errorT),
    ),
    nodes: ctx.nodes,
    typeMap: ctx.typeMap,
  })),
  O.map((ctx) => ({
    ...ctx,
    typeMap: updateTypeMap(expectedType)(ctx.type)(ctx.typeMap),
  })),
  O.getOrElseW(constant(errorResult(map))),
);

const chainPairElse = <T extends Expression>(
  r: Refinement<Expression, T>,
) => <E, R>(f: (
  pair: EOP.ElementOpticPair<Expression, T>
) => R) => chainOptionElse<
EOP.ElementOpticPair<Expression, Expression>,
R,
E>(flow(
  EOP.filter<Expression, Expression, T>(r),
  O.map(f),
));

const expNode: ExpNodeFunc = (
  expectedType,
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
  expectedType,
  (t) => pipe(
    pair,
    E.right,
    chainPairElse(
      (x): x is Identifier => x.type === 'Identifier',
    )(identifierNode(t)(context)(m)(c)(s)),
    chainPairElse(
      (x): x is MemberExpression => x.type === 'MemberExpression',
    )(memberNode(expNode)(t)(m)(c)(s)),
    chainPairElse(
      (x): x is CallExpression => x.type === 'CallExpression',
    )(callNode(expNode)(t)(m)(c)(s)),
    chainPairElse(
      (x): x is Literal => x.type === 'Literal',
    )(literalNode(t)(m)(c)),
    chainPairElse(
      (x): x is LiteralArray => x.type === 'LiteralArray',
    )(literalArrayNode(t)(m)(c)),
    chainPairElse(
      (x): x is ArrayExpression => x.type === 'ArrayExpression',
    )(arrayNode(expNode)(t)(m)(c)(s)),
    E.map(() => (
      {
        type: unknownT,
        nodes: [],
        typeMap: m,
      }
    )),
    E.toUnion,
  ),
);

const filterPanel: R.Reader<
AppCommander,
R.Reader<SettingState, readonly VNode<SettingState>[]>
> = (c) => (s) => pipe(
  s.filterExp,
  (x): EOP.ElementOpticPair<Expression, Expression> => ({
    ele: x,
    opt: Op.id(),
  }),
  expNode(unknownT)(typeRoot)({})(c)(s),
  (x) => x.nodes,
);

export default filterPanel;
