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
import flip from '@/flip';
import ArrayExpression from '@/settingUI/EditableExpression/ArrayExpression';
import CallExpression from '@/settingUI/EditableExpression/CallExpression';
import Expression from '@/settingUI/EditableExpression/Expression';
import Identifier from '@/settingUI/EditableExpression/Identifier';
import Literal from '@/settingUI/EditableExpression/Literal';
import LiteralArray from '@/settingUI/EditableExpression/LiteralArray';
import MemberExpression from '@/settingUI/EditableExpression/MemberExpression';
import editAction from '@/settingUI/editAction';
import setEditRegexs from '@/settingUI/setEditRegexs';
import setEditString from '@/settingUI/setEditString';
import setEditStrings from '@/settingUI/setEditStrings';
import EditSetter from '@/ui/EditSetter';
import * as Ed from '@/ui/Editable';
import panelBoxStyle from '@/ui/panelBoxStyle';
import textAreaRow from '@/ui/textAreaRow';
import textInput from '@/ui/textInput';

enum Primitive {
  unknown,
  boolean,
  string,
}

enum UI {
  unknown,
  card,
  regex,
}

type TaggedType<T1 extends string, T2> = {
  tag: T1,
  type: T2,
};

type VariableType = TaggedType<'var', number>;
type SimpleType = TaggedType<'simple', {
  pri: Primitive,
  ui: UI,
}>;
type RestType = TaggedType<'rest', EvalType>;
type FunctionType = TaggedType<'func', readonly [
  readonly O.Option<EvalType>[] & {
    readonly 0: O.Option<EvalType>
  },
  O.Option<EvalType>,
]>;
type TupleType = TaggedType<'tuple', readonly (EvalType | RestType)[]>;
type RecordType = TaggedType<'record', {
  [key: string]: EvalType,
} >;

type ErrorType = {
  tag: 'error',
};

type EvalType = VariableType
| SimpleType
| FunctionType
| TupleType
| RecordType;

const makeType = <A extends TaggedType<string, unknown>>(
  tag: A['tag'],
) => (
  type: A['type'],
) => ({
  tag,
  type,
});

const varT = makeType<VariableType>('var');
const simpleT = makeType<SimpleType>('simple');
const primitiveT = (pri: Primitive) => makeType<SimpleType>('simple')({
  pri,
  ui: UI.unknown,
});

const funcT = makeType<FunctionType>('func');
const tupleT = makeType<TupleType>('tuple');
const restT = makeType<RestType>('rest');
const recordT = makeType<RecordType>('record');
const listT = (x: EvalType) => tupleT([restT(x)]);

const errorType: ErrorType = {
  tag: 'error',
};

const unknownType = primitiveT(Primitive.unknown);

const errorNode = text('error');

type Result<T extends EvalType | ErrorType> = {
  type: T,
  nodes: readonly VNode<SettingState>[],
};

const errorResult: Result<ErrorType> = {
  type: errorType,
  nodes: [errorNode],
};

const typeRoot = recordT({
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
        varT(0),
        varT(1),
        varT(2),
      ]),
      varT(0),
    ]),
    O.some(varT(2)),
  ]),
  RA: recordT({
    some: funcT([
      RNEA.map(O.some)([
        funcT([
          [O.some(varT(0))],
          O.some(unknownType),
        ]),
        listT(varT(0)),
      ]),
      O.some(unknownType),
    ]),
    compact: funcT([
      [O.some(listT(unknownType))],
      O.some(listT(unknownType)),
    ]),
  }),
  O: recordT({
    exists: funcT([
      RNEA.map(O.some)([
        funcT([
          [O.some(varT(0))],
          O.some(unknownType),
        ]),
        unknownType,
      ]),
      O.some(unknownType),
    ]),
  }),
  inText: funcT([
    RNEA.map(O.some)([
      unknownType,
      primitiveT(Primitive.string),
    ]),
    O.some(primitiveT(Primitive.boolean)),
  ]),
  eqText: funcT([
    RNEA.map(O.some)([
      unknownType,
      primitiveT(Primitive.string),
    ]),
    O.some(primitiveT(Primitive.boolean)),
  ]),
  matchedByText: funcT([
    RNEA.map(O.some)([
      unknownType,
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
    [O.some(unknownType)],
    O.some(primitiveT(Primitive.boolean)),
  ]),
});

type ExpNodeFunc = (
  exp: Expression,
) => (
  opt: Op.Optional<Expression, Expression>,
) => (
  expectedType: EvalType,
) => (
  context: RecordType,
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
  c: AppCommander,
) => (
  s:SettingState,
): Result<EvalType | ErrorType> => (exp.name in context.type ? {
  type: context.type[exp.name],
  nodes: [h('div', {}, text(exp.name))],
} : errorResult);

const memberNode = (
  exp: MemberExpression,
) => (
  opt: Op.Optional<Expression, MemberExpression>,
) => (
  f: ExpNodeFunc,
) => (
  c: AppCommander,
) => (
  s:SettingState,
): Result<EvalType | ErrorType> => pipe(
  f(exp.object)(pipe(
    opt,
    Op.prop('object'),
  ))(unknownType)(typeRoot)(c)(s),
  O.fromPredicate((x): x is Result<RecordType> => x.type.tag === 'record'),
  O.map((x) => f(exp.property)(pipe(
    opt,
    Op.prop('property'),
  ))(unknownType)(x.type)(c)(s)),
  O.map((x) => ({
    type: x.type,
    nodes: x.nodes,
  })),
  O.getOrElse<Result<EvalType | ErrorType>>(() => errorResult),
);

const callNode = (
  exp: CallExpression,
) => (
  opt: Op.Optional<Expression, CallExpression>,
) => (
  f: ExpNodeFunc,
) => (
  expectedType: EvalType,
) => (
  c: AppCommander,
) => (
  s:SettingState,
): Result<EvalType | ErrorType> => pipe(
  f(exp.callee)(pipe(
    opt,
    Op.prop('callee'),
  ))(expectedType)(typeRoot)(c)(s),
  O.fromPredicate((x): x is Result<FunctionType> => x.type.tag === 'func'),
  O.bindTo('calleeResult'),
  O.bind('argumentResult', (r) => pipe(
    exp.argument,
    O.map(f),
    O.map((func) => pipe(
      r.calleeResult.type.type,
      RTu.fst,
      ([x]) => x,
      O.getOrElse<EvalType>(constant(unknownType)),
      (x) => (func(pipe(
        opt,
        Op.prop('argument'),
        Op.some,
      ))(x)(typeRoot)(c)(s)),
    )),
    O.alt(constant(O.of<Result<EvalType | ErrorType>>(errorResult))),
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
          O.exists((x) => x.tag === 'simple' && x.type.ui === UI.card),
        ) ? RA.map((x) => h('div', {
          style: panelBoxStyle(212),
        }, [x]))
        : identity,
      ),
    ]),
    I.bindTo('nodes'),
    I.apS('type', pipe(
      ctx.calleeResult.type.type,
      O.fromPredicate((x): x is readonly [readonly [
        O.Option<EvalType>,
        O.Option<EvalType>,
        ...O.Option<EvalType>[],
      ], O.Option<EvalType>] => RTu.fst(x).length > 1),
      O.map(flow(
        RTu.mapFst(
          ([, ...tail]): RNEA.ReadonlyNonEmptyArray<
          O.Option<EvalType>
          > => tail,
        ),
        funcT,
      )),
      O.getOrElseW(() => pipe(
        ctx.calleeResult.type.type,
        RTu.snd,
        O.getOrElse<EvalType | ErrorType>(constant(errorType)),
      )),
    )),
  )),
  O.getOrElse<Result<EvalType | ErrorType>>(constant(errorResult)),
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
);

const stringTupleUI: R.Reader<EvalType, O.Option<UI>> = flow(
  O.fromPredicate((x): x is TupleType => x.tag === 'tuple'),
  O.map((x) => x.type),
  O.filter((x): x is [RestType] => x.length === 1 && x[0].tag === 'rest'),
  O.map(([x]) => x.type),
  O.filter((x): x is SimpleType => x.tag === 'simple'),
  O.map((x) => x.type),
  O.filter((x) => x.pri === Primitive.string),
  O.map((x) => x.ui),
);

const literalArrayNode = (
  exp: LiteralArray,
) => (
  opt: Op.Optional<Expression, LiteralArray>,
) => (
  expectedType: EvalType,
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
        stringTupleUI,
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
              stringTupleUI,
              O.getOrElseW(constant(UI.unknown)),
            ) === UI.regex
              ? setEditRegexs
              : setEditStrings,
          )(value)(Ed.of([''])),
        )(c),
      )(exp.value),
    ],
  }
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
): R.Reader<
AppCommander,
R.Reader<SettingState, Result<EvalType | ErrorType>>
> => pipe(
  exp.elements,
  (e) => (
    pipe(
      e,
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
      RA.map(apply(expectedType)),
      RA.map(apply(typeRoot)),
      R.sequenceArray,
      R.map(R.sequenceArray),
      R.map(R.map(flow(
        RA.reduce<Result<EvalType | ErrorType>, {
          types: (EvalType | ErrorType)[],
          nodes: VNode<SettingState>[],
        }>({
              types: [],
              nodes: [],
            }, (x, y) => ({
              types: [...x.types, y.type],
              nodes: [...x.nodes, h('div', {}, y.nodes)],
            })),
        (ctx) => ({
          type: pipe(
            ctx.types,
            O.fromPredicate((v): v is EvalType[] => pipe(
              v,
              RA.every((x) => x.tag !== 'error'),
            )),
            O.map(tupleT),
            O.getOrElse<EvalType | ErrorType>(() => errorType),
          ),
          nodes: ctx.nodes,
        }),
      ))),
    )
  ),
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
  c,
) => (
  s,
) => (exp.type === 'Identifier' ? identifierNode(exp)(pipe(
  opt,
  Op.filter((x): x is Identifier => x.type === 'Identifier'),
))(context)(c)(s)
: exp.type === 'MemberExpression' ? memberNode(exp)(pipe(
  opt,
  Op.filter((x): x is MemberExpression => x.type === 'MemberExpression'),
))(expNode)(c)(s)
: exp.type === 'CallExpression' ? callNode(exp)(pipe(
  opt,
  Op.filter((x): x is CallExpression => x.type === 'CallExpression'),
))(expNode)(expectedType)(c)(s)
: exp.type === 'Literal' ? literalNode(exp)(pipe(
  opt,
  Op.filter((x): x is Literal => x.type === 'Literal'),
))(expectedType)(c)
: exp.type === 'LiteralArray' ? literalArrayNode(exp)(pipe(
  opt,
  Op.filter((x): x is LiteralArray => x.type === 'LiteralArray'),
))(expectedType)(c)
: exp.type === 'ArrayExpression' ? arrayNode(exp)(pipe(
  opt,
  Op.filter((x): x is ArrayExpression => x.type === 'ArrayExpression'),
))(expNode)(expectedType)(c)(s)
: {
  type: unknownType,
  nodes: [],
}
);

const filterPanel: R.Reader<
AppCommander,
R.Reader<SettingState, readonly VNode<SettingState>[]>
> = pipe(
  R.ask<SettingState>(),
  R.map((x) => x.filterExp),
  R.map(expNode),
  R.map(apply(Op.id())),
  R.map(apply(unknownType)),
  R.map(apply(typeRoot)),
  R.map(flip),
  R.flatten,
  flip,
  R.map(R.map((x) => x.nodes)),
);

export default filterPanel;
