import { useIntl } from 'react-intl';
import getMediaUrls from '../../common/utils/getMediaUrls';
import ImageGallery from 'react-image-gallery';

const ProductImageGallery = ({ product, isBundle }) => {
  const intl = useIntl();

  return (
    <div className="relative w-full">
      <ImageGallery
        lazyLoad
        onErrorImageURL="/static/img/sun-glass-placeholder.jpeg"
        useBrowserFullscreen
        showThumbnails={getMediaUrls(product).length > 1}
        showPlayButton={getMediaUrls(product).length > 1}
        items={getMediaUrls(product).map((image) => ({
          original: image,
          thumbnail: image,
        }))}
      />
      {isBundle && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-500 text-white shadow-sm">
            {intl.formatMessage({
              id: 'bundle_badge',
              defaultMessage: 'Bundle',
            })}
          </span>
        </div>
      )}
    </div>
  );
};
export default ProductImageGallery;
