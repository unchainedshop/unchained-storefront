import { ImageLoader } from 'next/legacy/image';

const defaultNextImageLoader: ImageLoader = ({ src, width, quality }) =>
  `${src}?w=${width}&q=${quality || 75}`;

export default defaultNextImageLoader;
