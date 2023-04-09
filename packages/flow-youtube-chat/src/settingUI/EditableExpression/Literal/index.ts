import Editable from '@userscript/ui/Editable';

export default interface Literal {
  type: 'Literal';
  value: Editable<string>
}
