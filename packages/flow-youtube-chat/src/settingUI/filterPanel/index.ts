import * as I from 'fp-ts/Identity';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  apply,
  constant,
  flow,
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
import textAreaNode from '@/settingUI/textAreaNode';
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
type FunctionType = TaggedType<'func', EvalType[]>;
type TupleType = TaggedType<'tuple', (EvalType | RestType)[]>;
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

const varType = makeType<VariableType>('var');
const simpleType = makeType<SimpleType>('simple');
const funcType = makeType<FunctionType>('func');
const tupleType = makeType<TupleType>('tuple');
const restType = makeType<RestType>('rest');
const recordType = makeType<RecordType>('record');
const listType = (x: EvalType) => tupleType([restType(x)]);

const errorType: ErrorType = {
  tag: 'error',
};

const unknownType = simpleType({
  pri: Primitive.unknown,
  ui: UI.unknown,
});

const errorNode = text('error');

type Result<T extends EvalType | ErrorType> = {
  type: T,
  nodes: readonly VNode<SettingState>[],
};

const errorResult: Result<ErrorType> = {
  type: errorType,
  nodes: [errorNode],
};

const typeRoot = recordType({
  or: funcType([
    simpleType({
      pri: Primitive.boolean,
      ui: UI.card,
    }),
    unknownType,
  ]),
  and: funcType([
    simpleType({
      pri: Primitive.boolean,
      ui: UI.card,
    }),
    unknownType,
  ]),
  flip: funcType([
    funcType([
      varType(0),
      varType(1),
      varType(2),
    ]),
    varType(1),
    varType(0),
    varType(2),
  ]),
  flow: funcType([
    tupleType([
      varType(0),
      varType(1),
      varType(2),
    ]),
    varType(0),
    varType(2),
  ]),
  RA: recordType({
    some: funcType([
      funcType([
        varType(0),
        unknownType,
      ]),
      listType(varType(0)),
      unknownType,
    ]),
    compact: funcType([
      listType(unknownType),
      listType(unknownType),
    ]),
  }),
  O: recordType({
    exists: funcType([
      funcType([
        varType(0),
        unknownType,
      ]),
      unknownType,
      unknownType,
    ]),
  }),
  inText: funcType([
    unknownType,
    simpleType({
      pri: Primitive.string,
      ui: UI.unknown,
    }),
    simpleType({
      pri: Primitive.boolean,
      ui: UI.unknown,
    }),
  ]),
  eqText: funcType([
    unknownType,
    simpleType({
      pri: Primitive.string,
      ui: UI.unknown,
    }),
    simpleType({
      pri: Primitive.boolean,
      ui: UI.unknown,
    }),
  ]),
  matchedByText: funcType([
    unknownType,
    simpleType({
      pri: Primitive.string,
      ui: UI.unknown,
    }),
    simpleType({
      pri: Primitive.boolean,
      ui: UI.unknown,
    }),
  ]),
  isVisible: funcType([
    unknownType,
    simpleType({
      pri: Primitive.boolean,
      ui: UI.unknown,
    }),
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
): Result<EvalType | ErrorType> => ({
  type: exp.name in context.type ? context.type[exp.name]
  : unknownType,
  nodes: [
    exp.name === 'inText' ? textAreaNode(
      'bannedWords',
      18,
      setEditStrings,
    )(c)(s)
    : exp.name === 'matchedByText' ? textAreaNode(
      'bannedWordRegexs',
      18,
      setEditRegexs,
    )(c)(s)
    : exp.name === 'eqText' ? textAreaNode(
      'bannedUsers',
      18,
      setEditStrings,
    )(c)(s)
    : h('div', {}, text(exp.name)),
  ],
});

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
    exp.arguments[0],
    O.fromNullable,
    O.map(f),
    O.map((a) => pipe(
      r.calleeResult.type.type[0],
      (x) => (a(pipe(
        opt,
        Op.prop('arguments'),
        Op.component(0),
      ))(x)(typeRoot)(c)(s)),
    )),
    O.altW(() => O.of(errorResult)),
  )),
  O.map((ctx) => pipe(
    ctx.argumentResult,
    (result) => (pipe(
      ctx.calleeResult.type.type[0],
      (x) => x.tag === 'simple' && x.type.ui === UI.card,
    ) ? pipe(
      result.nodes,
      RA.map((x) => h('div', {
        style: panelBoxStyle(212),
      }, [x])),
    ) : [
      ...ctx.calleeResult.nodes,
      ...result.nodes,
    ]),
    I.bindTo('nodes'),
    I.apS('type', pipe(
      ctx.calleeResult.type.type.slice(
        ctx.argumentResult.type.tag === 'error' ? 0 : 1,
      ),
      (x) => (RA.size(x) === 0 ? errorType
      : RA.size(x) === 1 ? x[0]
      : funcType(x)),
    )),
  )),
  O.getOrElse<Result<EvalType | ErrorType>>(() => errorResult),
);

const literalNode = (
  exp: Literal,
) => (
  opt: Op.Optional<Expression, Literal>,
) => (
  expectedType: EvalType,
): R.Reader<
AppCommander,
Result<EvalType | ErrorType>
> => (c) => pipe(
  opt,
  Op.prop('value'),
  (value) => ({
    type: expectedType,
    nodes: [
      textInput(
        editAction(
          'filterExp',
          pipe(
            setEditString,
            R.map(R.map(
              (f) => (x: Expression) => pipe(
                value.getOption(x),
                O.getOrElse(constant(Ed.of(''))),
                f,
                value.set,
                apply(x),
              ),
            )),
          ),
        )(c),
      )(exp.value),
    ],
  }),
);

const literalArrayNode = (
  exp: LiteralArray,
) => (
  opt: Op.Optional<Expression, LiteralArray>,
) => (
  expectedType: EvalType,
): R.Reader<
AppCommander,
Result<EvalType | ErrorType>
> => (c) => pipe(
  opt,
  Op.prop('value'),
  (value) => ({
    type: expectedType,
    nodes: [
      textAreaRow(
        18,
        editAction(
          'filterExp',
          pipe(
            setEditStrings,
            R.map(R.map(
              (f) => (x: Expression) => pipe(
                value.getOption(x),
                O.getOrElse(constant(Ed.of<readonly string[]>(['']))),
                f,
                value.set,
                apply(x),
              ),
            )),
          ),
        )(c),
      )(exp.value),
    ],
  }),
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
            O.map(tupleType),
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
