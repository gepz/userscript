import {
  Editable,
} from '@/ui/Editable';

export default interface Literal {
  type: 'Literal';
  value: Editable<string>
}
