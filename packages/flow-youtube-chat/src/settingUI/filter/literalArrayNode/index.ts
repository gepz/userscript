import {
  pipe,
  flow,
} from 'effect/Function';
import {
  Option as O,
} from 'effect';

import {
  Identity as I,
} from 'effect';

import * as EOP from '@/ElementOpticPair';
import LiteralArray from '@/settingUI/editableExpression/LiteralArray';
import editAction from '@/settingUI/editAction';
import type NodeFunction from '@/settingUI/filter/NodeFunction';
import setEditRegexes from '@/settingUi/setter/setEditRegexes';
import setEditStrings from '@/settingUi/setter/setEditStrings';
import Primitive from '@/type/Primitive';
import * as simpleType from '@/type/SimpleType';
import * as tupleType from '@/type/TupleType';
import UI from '@/type/UI';
import * as Ed from '@userscript/ui/Editable';
import textAreaRow from '@userscript/ui/textAreaRow';

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
              ? setEditRegexes
              : setEditStrings,
          )(value.opt)(Ed.of([''])),
        )(commander),
      )(value.ele),
    ],
  }),
  I.let('typeMap', (x) => updateTypeMap(expectedType)(x.type)(m)),
);
