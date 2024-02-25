import Editable from '@userscript/ui/Editable';

export default interface LiteralArray {
  type: 'LiteralArray';
  value: Editable<readonly string[]>
}

