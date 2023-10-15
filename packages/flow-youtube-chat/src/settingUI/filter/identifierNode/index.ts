import {
  generate,
} from 'astring';
import {
  pipe,
} from 'effect/Function';
import {
  h,
  text,
} from 'hyperapp';

import SettingState from '@/SettingState';
import filterContextType from '@/filter/filterContextType';
import Identifier from '@/settingUI/editableExpression/Identifier';
// eslint-disable-next-line max-len
import editableExpressionToJsep from '@/settingUI/editableExpression/editableExpressionToJsep';
import type NodeFunction from '@/settingUI/filter/NodeFunction';
import errorResult from '@/settingUI/filter/errorResult';
import simplifyTypeForLog from '@/settingUI/filter/simplifyTypeForLog';

export default (
  f: NodeFunction,
): NodeFunction<Identifier> => ({
  expectedType,
  typeMap,
}) => (pair) => (pair.ele.name in filterContextType.value ? pipe(
  filterContextType.value[pair.ele.name],
  (type) => (console.log(
    `Before Replace: ${generate(editableExpressionToJsep(pair.ele))}\n`,
    `${JSON.stringify(simplifyTypeForLog(type), null, 2)}\n`,
    Object.keys(typeMap).length === 0 ? undefined : typeMap,
    // eslint-disable-next-line no-sequences
  ), type),
  (type) => ({
    type,
    nodes: [h<SettingState>('div', {}, text(pair.ele.name))],
    typeMap: updateTypeMap(expectedType)(type)(typeMap),
  }),
) : errorResult(typeMap));
