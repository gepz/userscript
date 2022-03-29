import {
  StyleProp,
} from 'hyperapp';

export default (width: number): StyleProp => ({
  flex: `0 0 ${width}px`,
  margin: '2px',
});
