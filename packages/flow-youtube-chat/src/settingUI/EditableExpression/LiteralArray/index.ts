import Editable from '@/ui/Editable';

export default interface LiteralArray {
  type: 'LiteralArray';
  value: Editable<readonly string[]>
}
