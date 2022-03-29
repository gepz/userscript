import * as Tree from 'fp-ts/Tree';

export default interface GameState {
  difficulty: number,
  endGame: boolean,
  dt: number,
  now: number,
  leftDown: boolean,
  rightDown: boolean,
  upDown: boolean,
  downDown: boolean,
  shootDown: boolean,
  interactDown: boolean,
  inputX: number,
  inputY: number,
  displayRoot: Tree.Forest<number>,
  displayTreeMap: Map<number, Tree.Tree<number>>,
  stringMap: Map<number, string>,
}
