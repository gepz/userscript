import errorNode from '@/settingUI/errorNode';
import type * as nodeFunction from '@/settingUI/filter/NodeFunction';
import ErrorType, * as errorType from '@/type/ErrorType';
import GenericMap from '@/type/GenericMap';
import Type from '@/type/Type';

export default (
  type: Type | ErrorType,
) => (
  typeMap: GenericMap,
): nodeFunction.Result => ({
  type,
  constrainedType: errorType.error,
  nodes: [errorNode],
  typeMap,
});

