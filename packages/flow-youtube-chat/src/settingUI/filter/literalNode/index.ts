import * as I from '@effect/data/Identity';
import {
  flow,
} from '@effect/data/Function';

import * as EOP from '@/ElementOpticPair';
import Primitive from '@/type/Primitive';
import * as simpleType from '@/type/SimpleType';
import UI from '@/type/UI';
import Literal from '@/settingUI/EditableExpression/Literal';
import editAction from '@/settingUI/editAction';
import type NodeFunction from '@/settingUI/filter/NodeFunction';
import setEditString from '@/settingUi/setter/setEditString';
import * as Ed from '@userscript/ui/Editable';
import textInput from '@userscript/ui/textInput';

export default (
  f: NodeFunction,
): NodeFunction<Literal> => ({
  expectedType,
  typeMap,
  commander,
}) => flow(
  EOP.prop('value'),
  (value) => ({
    type: simpleType.of({
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
