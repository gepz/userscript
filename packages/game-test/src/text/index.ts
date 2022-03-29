import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';
import * as PIXI from 'pixi.js';

export default (text: string): IO.IO<PIXI.Text> => pipe(
  () => new PIXI.Text(
    text,
    {
      fill: 'hsla(0, 0%, 100%, 0.5)',
    },
  ),
  IO.chainFirst((x) => () => { x.anchor.set(0.5); }),
);
