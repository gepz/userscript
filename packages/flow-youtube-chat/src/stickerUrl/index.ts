import {
  Array as A,
  Number as Num,
  Option as O,
  Schema as S,
  pipe,
} from 'effect';
import {
  mapInput,
} from 'effect/Order';

// The paid-sticker renderer keeps its art in the Polymer element's data
// property, not in the DOM: the #sticker img holds a placeholder GIF
// until a lazy load that routinely has not happened by the time a chat
// scrolls away, so reading the property is the only way to have the image
// at parse time. See docs/decisions.md for the evidence and the fallback
// this deliberately does not have.
const stickerData = S.Struct({
  sticker: S.Struct({
    thumbnails: S.Array(S.Struct({
      url: S.String,
      width: S.optional(S.Number),
    })),
  }),
});

export default (chat: HTMLElement): O.Option<string> => {
  const data: unknown = Reflect.get(chat, 'data');

  return pipe(
    S.decodeUnknownOption(stickerData)(data),
    // Widest variant: the flow scales it down to one lane, so the extra
    // pixels only buy sharpness on high-density displays.
    O.flatMap((x) => pipe(
      x.sticker.thumbnails,
      A.sort(mapInput(
        (thumbnail: {
          readonly width?: number | undefined
        }) => thumbnail.width ?? 0,
      )(Num.Order)),
      A.last,
    )),
    // YouTube serves these protocol-relative.
    O.map((x) => (x.url.startsWith('//') ? `https:${x.url}` : x.url)),
  );
};
