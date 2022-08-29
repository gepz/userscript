import * as Ed from '@/ui/Editable';

export default interface LiteralArray {
  type: 'LiteralArray';
  value: Ed.Editable<readonly string[]>
}
