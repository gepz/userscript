import diff, {
  Difference,
} from 'microdiff';

// microdiff only accepts object/array roots; primitive config values get a
// hand-rolled root-level change entry instead.
export default (oldValue: unknown, value: unknown): Difference[] => (
  typeof oldValue === 'object' && oldValue !== null
  && typeof value === 'object' && value !== null
    ? diff(oldValue, value)
    : [
      {
        type: 'CHANGE',
        path: [],
        oldValue,
        value,
      },
    ]
);
