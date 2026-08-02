const UI = {
  unknown: 0,
  card: 1,
  regex: 2,
} as const;

type UI = (typeof UI)[keyof typeof UI];

export default UI;
