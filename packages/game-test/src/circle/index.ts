import * as IO from 'fp-ts/IO';
import {
  pipe,
} from 'fp-ts/function';
import * as PIXI from 'pixi.js';

export default (radius: number): IO.IO<PIXI.Graphics> => () => pipe(
  new PIXI.GraphicsGeometry(),
  (geometry) => pipe(
    {
      fs: Object.assign(new PIXI.FillStyle(), {
        color: 0x9966FF,
        visible: true,
      }),
      ls: new PIXI.LineStyle(),
    },
    (x) => geometry.drawShape(new PIXI.Circle(0, 0, radius), x.fs, x.ls),
  ),
  (x) => new PIXI.Graphics(x),
);
