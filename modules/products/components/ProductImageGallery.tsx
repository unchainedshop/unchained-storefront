import { useIntl } from 'react-intl';
import ImageGallery from 'react-image-gallery';
import { PhotoIcon } from '@heroicons/react/24/outline';
import getMediaUrls from '../../common/utils/getMediaUrls';

const ProductImageGallery = ({ product, isBundle }) => {
  const intl = useIntl();
  const images = getMediaUrls(product).filter(Boolean);

  return (
    <div className="relative w-full">
      {images.length ? (
        <ImageGallery
          lazyLoad
          onErrorImageURL="/no-image.jpg"
          useBrowserFullscreen
          showThumbnails={images.length > 1}
          showPlayButton={images.length > 1}
          items={images.map((image) => ({ original: image, thumbnail: image }))}
        />
      ) : (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 text-subtle-foreground">
          <PhotoIcon className="size-16" />
          <span className="text-sm">
            {intl.formatMessage({ id: 'no_product_images', defaultMessage: 'No images yet' })}
          </span>
        </div>
      )}
      {isBundle && (
        <span className="badge badge-warning absolute left-3 top-3 z-10 shadow-sm">
          {intl.formatMessage({ id: 'bundle_badge', defaultMessage: 'Bundle' })}
        </span>
      )}
    </div>
  );
};

export default ProductImageGallery;
