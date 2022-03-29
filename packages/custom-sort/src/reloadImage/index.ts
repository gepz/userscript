export default (image: HTMLImageElement): void => {
  const {
    src,
  } = image;

  image.src = '';
  image.src = src;
};
