import GameState from '@/GameState';

export default (): GameState => ({
  difficulty: 0,
  endGame: false,
  dt: 0,
  now: 0,
  leftDown: false,
  rightDown: false,
  upDown: false,
  downDown: false,
  shootDown: false,
  interactDown: false,
  inputX: 0,
  inputY: 0,
  displayRoot: [],
  displayTreeMap: new Map(),
  stringMap: new Map(),
});
