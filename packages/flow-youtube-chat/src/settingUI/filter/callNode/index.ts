import * as I from 'effect/Identity';
import * as O from 'effect/Option';
import {
  pipe,
} from 'effect/Function';

import * as EOP from '@/ElementOpticPair';
import CallExpression from '@/settingUI/editableExpression/CallExpression';
import type NodeFunction from '@/settingUI/filter/NodeFunction';
import type * as nodeFunction from '@/settingUI/filter/NodeFunction';
import errorResult from '@/settingUI/filter/errorResult';
import ErrorType from '@/type/ErrorType';
import FunctionType, * as functionType from '@/type/FunctionType';
import Type from '@/type/Type';
import * as unknownType from '@/type/UnknownType';

export default (
  f: NodeFunction,
): NodeFunction<CallExpression> => ({
  expectedType,
  typeMap,
  commander,
}) => (pair) => pipe(
  f(functionType.fromParamAndReturn(unknownType.unknown)(expectedType))(
    global,
  )(m)(c)(pipe(
    pair,
    EOP.prop('callee'),
  )),
  O.liftPredicate(
    (x): x is nodeFunction.Result<FunctionType> => x.type.tag === 'func',
  ),
  O.bindTo('calleeResult'),
  O.bind('argumentResult', (ctx) => pipe(
    pair,
    EOP.prop('argument'),
    EOP.some,
    O.map((arg) => pipe(
      ctx.calleeResult.type.value[0][0].type,
      replaceVarType(ctx.calleeResult.typeMap),
      (expected) => pipe(
        f(expected)(global)(ctx.calleeResult.type.value[0][0].map)(c)(arg),
        (x) => ({
          ...x,
          typeMap: updateTypeMap(expected)(x.type)(x.typeMap),
        }),
      ),
    )),
    O.alt(() => O.some<nodeFunction.Result<Type | ErrorType>>(
      errorResult(m),
    )),
  )),
  O.map((ctx) => pipe(
    ctx.argumentResult,
    (result) => [
      ...ctx.calleeResult.nodes,
      ...pipe(
        result.nodes,
        pipe(
          ctx.calleeResult.type.value[0][0].type,
          primitiveTupleUI(Primitive.boolean),
          O.exists((x) => x === UI.card),
        ) ? RA.map((x) => h('div', {
          style: panelBoxStyle(212),
        }, [x]))
        : identity,
      ),
    ],
    I.bindTo('nodes'),
    I.apS('type', pipe(functionType.returnOf(ctx.calleeResult.type))),
    I.let(
      'typeMap',
      (x) => updateTypeMap(expectedType)(x.type)(ctx.calleeResult.typeMap),
    ),
  )),
  O.getOrElse<nodeFunction.Result<Type | ErrorType>>(() => errorResult(m)),
);

