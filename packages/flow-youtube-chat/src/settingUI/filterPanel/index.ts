import {
  tailRec,
} from 'fp-ts/ChainRec';
import * as E from 'fp-ts/Either';
import * as I from 'fp-ts/Identity';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as RTu from 'fp-ts/ReadonlyTuple';
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
import SettingState from '@/SettingState';
import ErrorType from '@/filter/type/ErrorType';
import EvalType from '@/filter/type/EvalType';
import FunctionType from '@/filter/type/FunctionType';
import Primitive from '@/filter/type/Primitive';
import RecordType from '@/filter/type/RecordType';
import RestType from '@/filter/type/RestType';
import SimpleType from '@/filter/type/SimpleType';
import TupleType from '@/filter/type/TupleType';
import UI from '@/filter/type/UI';
import VariableType from '@/filter/type/VariableType';
import errorT from '@/filter/type/errorT';
import funcT from '@/filter/type/funcT';
import listT from '@/filter/type/listT';
import restT from '@/filter/type/restT';
import returnT from '@/filter/type/returnT';
import simpleT from '@/filter/type/simpleT';
import tupleT from '@/filter/type/tupleT';
import unknownT from '@/filter/type/unknownT';
import typeRoot from '@/filter/typeRoot';
import flip from '@/flip';
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
  type,
  O.fromPredicate((x): x is VariableType => x.tag === 'var'),
  O.filter((x) => x.type in typeMap),
  O.map((x) => typeMap[x.type]),
  O.getOrElse(constant(type)),
);

const assignableToVarType = (
  a: VariableType,
) => (
  b: EvalType,
): boolean => pipe(
  true,
);

const updateTypeMap = (
  expectedType: EvalType,
) => (
  actualType: EvalType | ErrorType,
) => (
  typeMap: Record<number, EvalType>,
) => pipe(
  expectedType,
  O.fromPredicate((x): x is VariableType => x.tag === 'var'),
  O.chain((et) => pipe(
    actualType,
    O.fromPredicate((x): x is EvalType => x.tag !== 'error'),
    O.filter((x) => assignableToVarType(et)(x)),
    O.map((x) => setRecord<number, EvalType>(et.type)(x)(typeMap)),
  )),
  O.getOrElse(constant(typeMap)),
);

type ExpNodeFunc = (
  exp: Expression,
) => (
  opt: Op.Optional<Expression, Expression>,
) => (
  expectedType: EvalType,
) => (
  context: RecordType,
) => (
  m: Record<number, EvalType>,
) => R.Reader<
AppCommander,
R.Reader<SettingState, Result<EvalType | ErrorType>>
>;

const identifierNode = (
  exp: Identifier,
) => (
  opt: Op.Optional<Expression, Identifier>,
) => (
  context: RecordType,
) => (
  expectedType: EvalType,
) => (
  m: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  s: SettingState,
): Result<EvalType | ErrorType> => (exp.name in context.type ? pipe(
  {
    type: context.type[exp.name],
    nodes: [h<SettingState>('div', {}, text(exp.name))],
  },
  I.bind(
    'typeMap',
    (x) => updateTypeMap(expectedType)(x.type)(m),
  ),
) : errorResult(m));

const memberNode = (
  exp: MemberExpression,
) => (
  opt: Op.Optional<Expression, MemberExpression>,
) => (
  f: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  m: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  s:SettingState,
): Result<EvalType | ErrorType> => pipe(
  f(exp.object)(pipe(
    opt,
    Op.prop('object'),
  ))(unknownT)(typeRoot)(m)(c)(s),
  O.fromPredicate((x): x is Result<RecordType> => x.type.tag === 'record'),
  O.map((x) => f(exp.property)(pipe(
    opt,
    Op.prop('property'),
  ))(unknownT)(x.type)(m)(c)(s)),
  O.map((x) => ({
    type: x.type,
    nodes: x.nodes,
  })),
  O.bind(
    'typeMap',
    (x) => O.some(updateTypeMap(expectedType)(x.type)(m)),
  ),
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

/*
(1 => 2) => (2 => 3) => 1 => 3
(1 => 2 => 3) => 2 => 1 => 3
*/

const callNode = (
  exp: CallExpression,
) => (
  opt: Op.Optional<Expression, CallExpression>,
) => (
  f: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  m: Record<number, EvalType>,
) => (
  c: AppCommander,
) => (
  s:SettingState,
): Result<EvalType | ErrorType> => pipe(
  f(exp.callee)(pipe(
    opt,
    Op.prop('callee'),
  ))(funcT([[O.some(unknownT)], O.some(expectedType)]))(
    typeRoot,
  )(m)(c)(s),
  O.fromPredicate((x): x is Result<FunctionType> => x.type.tag === 'func'),
  O.bindTo('calleeResult'),
  O.bind('argumentResult', (ctx) => pipe(
    exp.argument,
    O.map(f),
    O.map((func) => pipe(
      ctx.calleeResult.type.type,
      RTu.fst,
      ([x]) => x,
      O.getOrElse<EvalType>(constant(unknownT)),
      (x) => (func(pipe(
        opt,
        Op.prop('argument'),
        Op.some,
      ))(x)(typeRoot)(ctx.calleeResult.typeMap)(c)(s)),
    )),
    O.alt(constant(O.of<Result<EvalType | ErrorType>>(errorResult(m)))),
  )),
  O.map((ctx) => pipe(
    ctx.argumentResult,
    (result) => ([
      ...ctx.calleeResult.nodes,
      ...pipe(
        result.nodes,
        pipe(
          ctx.calleeResult.type.type,
          RTu.fst,
          (x) => x[0],
          O.chain(primitiveTupleUI(Primitive.boolean)),
          O.exists((x) => x === UI.card),
        ) ? RA.map((x) => h('div', {
          style: panelBoxStyle(212),
        }, [x]))
        : identity,
      ),
    ]),
    I.bindTo('nodes'),
    I.apS('type', pipe(
      returnT(ctx.calleeResult.type),
      O.getOrElse<EvalType | ErrorType>(constant(errorT)),
    )),
    I.bind(
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
  exp: Literal,
) => (
  opt: Op.Optional<Expression, Literal>,
) => (
  expectedType: EvalType,
) => (
  m: Record<number, EvalType>,
): R.Reader<
AppCommander,
Result<SimpleType>
> => (c) => pipe(
  opt,
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
      )(exp.value),
    ],
  }),
  I.bind(
    'typeMap',
    (ctx) => updateTypeMap(expectedType)(ctx.type)(m),
  ),
);

const literalArrayNode = (
  exp: LiteralArray,
) => (
  opt: Op.Optional<Expression, LiteralArray>,
) => (
  expectedType: EvalType,
) => (
  m: Record<number, EvalType>,
): R.Reader<
AppCommander,
Result<TupleType>
> => (c) => pipe(
  opt,
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
      )(exp.value),
    ],
  }),
  I.bind(
    'typeMap',
    (ctx) => updateTypeMap(expectedType)(ctx.type)(m),
  ),
);

const arrayNode = (
  exp: ArrayExpression,
) => (
  opt: Op.Optional<Expression, ArrayExpression>,
) => (
  nodeF: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  map: Record<number, EvalType>,
): R.Reader<
AppCommander,
R.Reader<SettingState, Result<EvalType | ErrorType>>
> => pipe(
  exp.elements,
  RA.map(nodeF),
  RA.mapWithIndex(pipe(
    opt,
    Op.prop('elements'),
    (elementsOpt) => (i: number, f) => pipe(
      elementsOpt,
      Op.component(i),
      f,
    ),
  )),
  RA.map(R.map(apply(typeRoot))),
  RA.map((x) => (
    c: AppCommander,
  ) => (
    s: SettingState,
  ) => (
    et: EvalType,
  ) => (
    m: Record<number, EvalType>,
  ) => x(et)(m)(c)(s)),
  R.sequenceArray,
  R.map(R.sequenceArray),
  R.map(R.map(flow(
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
  ))),
);

const expNode: ExpNodeFunc = (
  exp,
) => (
  opt,
) => (
  expectedType,
) => (
  context,
) => (
  m,
) => (
  c,
) => (
  s,
) => pipe(
  expectedType,
  replaceVarType(m),
  (t) => (exp.type === 'Identifier' ? identifierNode(exp)(pipe(
    opt,
    Op.filter((x): x is Identifier => x.type === 'Identifier'),
  ))(context)(t)(m)(c)(s)
  : exp.type === 'MemberExpression' ? memberNode(exp)(pipe(
    opt,
    Op.filter((x): x is MemberExpression => x.type === 'MemberExpression'),
  ))(expNode)(t)(m)(c)(s)
  : exp.type === 'CallExpression' ? callNode(exp)(pipe(
    opt,
    Op.filter((x): x is CallExpression => x.type === 'CallExpression'),
  ))(expNode)(t)(m)(c)(s)
  : exp.type === 'Literal' ? literalNode(exp)(pipe(
    opt,
    Op.filter((x): x is Literal => x.type === 'Literal'),
  ))(t)(m)(c)
  : exp.type === 'LiteralArray' ? literalArrayNode(exp)(pipe(
    opt,
    Op.filter((x): x is LiteralArray => x.type === 'LiteralArray'),
  ))(t)(m)(c)
  : exp.type === 'ArrayExpression' ? arrayNode(exp)(pipe(
    opt,
    Op.filter((x): x is ArrayExpression => x.type === 'ArrayExpression'),
  ))(expNode)(t)(m)(c)(s)
  : {
    type: unknownT,
    nodes: [],
    typeMap: m,
  }),
);

const filterPanel: R.Reader<
AppCommander,
R.Reader<SettingState, readonly VNode<SettingState>[]>
> = pipe(
  R.ask<SettingState>(),
  R.map((x) => x.filterExp),
  R.map(expNode),
  R.map(apply(Op.id())),
  R.map(apply(unknownT)),
  R.map(apply(typeRoot)),
  R.map(apply({})),
  R.map(flip),
  R.flatten,
  flip,
  R.map(R.map((x) => x.nodes)),
);

export default filterPanel;
