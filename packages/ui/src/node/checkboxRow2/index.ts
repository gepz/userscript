import {
  h,
  type ComponentType,
} from 'preact';

const checkboxRow2: ComponentType<{
  label: string,
  checked: boolean,
  onchange: (e: Event) => void
}> = ({
  label, checked, onchange,
}) => h('div', {}, h('label', {}, [
  label,
  h('input', {
    type: 'checkbox',
    checked,
    onchange,
  }),
]));

export default checkboxRow2;
