import {
  pipe,
  flow,
} from '@effect/data/Function';
import * as O from '@effect/data/Option';
import * as I from '@effect/data/Identity';

import * as EOP from '@/ElementOpticPair';
import LiteralArray from '@/settingUI/EditableExpression/LiteralArray';
import editAction from '@/settingUI/editAction';
import type NodeFunction from '@/settingUI/filter/NodeFunction';
import setEditRegexs from '@/settingUI/setEditRegexs';
import setEditStrings from '@/settingUI/setEditStrings';
import Primitive from '@/type/Primitive';
import * as simpleType from '@/type/SimpleType';
import * as tupleType from '@/type/TupleType';
import UI from '@/type/UI';
import * as Ed from '@/ui/Editable';
import textAreaRow from '@/ui/textAreaRow';

export default (
  f: NodeFunction,
): NodeFunction<LiteralArray> => ({
  expectedType,
  typeMap,
  commander,
}) => flow(
  EOP.prop('value'),
  (value) => ({
    type: tupleType.list(simpleType.of({
      pri: Primitive.string,
      ui: pipe(
        expectedType,
        primitiveTupleUI(Primitive.string),
        O.getOrElse(() => UI.unknown),
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
              O.getOrElse(() => UI.unknown),
            ) === UI.regex
              ? setEditRegexs
              : setEditStrings,
          )(value.opt)(Ed.of([''])),
        )(commander),
      )(value.ele),
    ],
  }),
  I.let('typeMap', (x) => updateTypeMap(expectedType)(x.type)(m)),
);