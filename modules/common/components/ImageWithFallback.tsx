import Image from 'next/image';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import defaultNextImageLoader from '../utils/defaultNextImageLoader';

const ImageWithFallback = ({ fallbackSrc = '', src, ...props }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const { formatMessage } = useIntl();

  return (
    <Image
      src={imageSrc}
      blurDataURL="/no-image.jpg"
      loader={defaultNextImageLoader}
      alt={formatMessage({
        id: 'image-not-found',
        defaultMessage: 'Image not found',
      })}
      placeholder="blur"
      {...props}
      onError={() => {
        setImageSrc(fallbackSrc || '/no-image.jpg');
      }}
    />
  );
};

export default ImageWithFallback;
