const UI = {
  unknown: 'unknown',
  card: 'card',
  regex: 'regex',
} as const;

type UI = (typeof UI)[keyof typeof UI];

export default UI;
