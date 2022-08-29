import * as Ed from '@/ui/Editable';

export default interface Literal {
  type: 'Literal';
  value: Ed.Editable<string>
}
