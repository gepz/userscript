// eslint-disable-next-line max-len
import type ArrayExpression from '@/settingUI/EditableExpression/ArrayExpression';
import type CallExpression from '@/settingUI/EditableExpression/CallExpression';
import type Compound from '@/settingUI/EditableExpression/Compound';
import type Identifier from '@/settingUI/EditableExpression/Identifier';
import type Literal from '@/settingUI/EditableExpression/Literal';
import LiteralArray from '@/settingUI/EditableExpression/LiteralArray';
// eslint-disable-next-line max-len
import type MemberExpression from '@/settingUI/EditableExpression/MemberExpression';

type Expression = ArrayExpression
| CallExpression
| Identifier
| Literal
| LiteralArray
| MemberExpression
| Compound;

export default Expression;
