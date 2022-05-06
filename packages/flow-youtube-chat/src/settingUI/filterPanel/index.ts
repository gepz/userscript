import * as expEval from 'expression-eval';
import * as I from 'fp-ts/Identity';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Reader';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  pipe,
  apply,
} from 'fp-ts/function';
import {
  h,
  text,
  VNode,
} from 'hyperapp';

import AppCommander from '@/AppCommander';
import SettingState from '@/SettingState';
import panelBoxStyle from '@/ui/panelBoxStyle';

enum Primitive {
  unknown,
  boolean,
  string,
}

enum UI {
  unknown,
  card,
  textArea,
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

type Result<T1, T2 extends EvalType | ErrorType = EvalType | ErrorType> = {
  type: T2,
  nodes: readonly VNode<T1>[],
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

const idNode = <T>(
  exp: expEval.parse.Identifier,
) => (
  context: RecordType,
): Result<T> => ({
  type: exp.name in context.type ? context.type[exp.name]
  : unknownType,
  nodes: [h('div', {}, text(exp.name))],
});

type ExpNodeFunc<T1> = <T2 = T1>(
  exp: expEval.parse.Expression
) => (
  expectedType: EvalType
) => (
  context: RecordType
) => Result<T2>;

const memberNode = <T>(
  exp: expEval.parse.MemberExpression,
) => (
  f: ExpNodeFunc<T>,
): Result<T> => pipe(
  f(exp.object)(unknownType)(typeRoot),
  O.fromPredicate((x): x is Result<T, RecordType> => x.type.tag === 'record'),
  O.map((x) => f(exp.property)(unknownType)(x.type)),
  O.map((x) => ({
    type: x.type,
    nodes: x.nodes,
  })),
  O.getOrElse<Result<T>>(() => ({
    type: errorType,
    nodes: [errorNode],
  })),
);

const callNode = <T>(
  exp: expEval.parse.CallExpression,
) => (
  f: ExpNodeFunc<T>,
) => (
  expectedType: EvalType,
): Result<T> => pipe(
  f(exp.callee)(expectedType)(typeRoot),
  O.fromPredicate((x): x is Result<T, FunctionType> => x.type.tag === 'func'),
  O.bindTo('calleeResult'),
  O.bind('argumentResults', (r) => pipe(
    exp.arguments,
    RA.map(f),
    RA.mapWithIndex((i, a) => pipe(
      r.calleeResult.type.type,
      (x) => (RA.size(x) - 1 > i ? a(x[i])(typeRoot)
      : {
        type: errorType,
        nodes: [errorNode],
      }),
    )),
    O.of,
  )),
  O.map((ctx) => pipe(
    ctx.argumentResults,
    RA.chainWithIndex((i, result) => (pipe(
      ctx.calleeResult.type.type[i],
      (x) => x?.tag === 'simple' && x?.type.ui === UI.card,
    ) ? pipe(
      result.nodes,
      RA.map((x) => h('div', {
        style: panelBoxStyle(212),
      }, [x])),
    ) : [
      ...ctx.calleeResult.nodes,
      ...result.nodes,
    ])),
    I.bindTo('nodes'),
    I.apS('type', pipe(
      ctx.calleeResult.type.type.slice(
        RA.size(ctx.argumentResults),
      ),
      (x) => (RA.size(x) === 0 ? errorType
      : RA.size(x) === 1 ? x[0]
      : funcType(x)),
    )),
  )),
  O.getOrElse<Result<T>>(() => ({
    type: errorType,
    nodes: [errorNode],
  })),
);

const literalNode = <T>(
  exp: expEval.parse.Literal,
) => (
  expectedType: EvalType,
): Result<T> => ({
  type: expectedType,
  nodes: expectedType.tag === 'simple'
      && expectedType.type.ui === UI.textArea
    ? [
      h('textarea', {
        value: exp.value,
      }),
    ]
    : [h('div', {}, [text(exp.value)])],
});

const arrayNode = <T>(
  exp: expEval.parse.ArrayExpression,
) => (
  f: ExpNodeFunc<T>,
) => (
  expectedType: EvalType,
): Result<T> => pipe(
  exp.elements,
  (e) => (
    expectedType.tag === 'simple'
        && expectedType.type.ui === UI.textArea
        && pipe(
          e,
          RA.every(
            (x) => x.type === 'Literal'
            // eslint-disable-next-line max-len
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
         && typeof (x as expEval.parse.Literal).value === 'string',
          ),
        ) ? pipe(
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      e as expEval.parse.Literal[],
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      RA.map((x) => (x.value as string)),
      (x) => x.join('\n'),
      (x): expEval.parse.Literal => ({
        type: 'Literal',
        value: x,
        raw: x,
      }),
      f,
      apply(expectedType),
      apply(typeRoot),
    ) : pipe(
      e,
      RA.map(f),
      RA.map(apply(expectedType)),
      RA.map(apply(typeRoot)),
      RA.reduce<Result<T>, {
        types: (EvalType | ErrorType)[],
        nodes: VNode<T>[],
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
    )
  ),
);

const expNode: ExpNodeFunc<unknown> = <T>(
  exp: expEval.parse.Expression,
) => (
  expectedType,
) => (
  context,
) => pipe(
  exp.type,
  (type) => (type === 'Identifier' ? idNode<T>(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    exp as expEval.parse.Identifier,
  )(context)
  : type === 'MemberExpression' ? memberNode<T>(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    exp as expEval.parse.MemberExpression,
  )(expNode)
  : type === 'CallExpression' ? callNode<T>(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    exp as expEval.parse.CallExpression,
  )(expNode)(expectedType)
  : type === 'Literal' ? literalNode<T>(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    exp as expEval.parse.Literal,
  )(expectedType)
  : type === 'ArrayExpression' ? arrayNode<T>(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    exp as expEval.parse.ArrayExpression,
  )(expNode)(expectedType)
  : {
    type: unknownType,
    nodes: [],
  }),
);

export default (c: AppCommander): R.Reader<
SettingState,
readonly VNode<SettingState>[]
> => (s) => pipe(
  s.filterExp,
  expNode<SettingState>,
  apply(unknownType),
  apply(typeRoot),
  (x) => x.nodes,
);
