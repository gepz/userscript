import * as O from 'fp-ts/Option';

type MainComponentState = O.Option<{
  uploadedImage: ImageBitmap,
  displayContext: CanvasRenderingContext2D,
  characters: readonly string[],
  characterImageData: readonly ImageData[]
  closestText: string
}>;

export default MainComponentState;
