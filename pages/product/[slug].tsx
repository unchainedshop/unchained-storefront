import { useRouter } from 'next/router';
import ImageGallery from 'react-image-gallery';
import { useIntl } from 'react-intl';

import Markdown from 'react-markdown';
import useProductDetail from '../../modules/products/hooks/useProductDetail';
import AddToCartButton from '../../modules/cart/components/AddToCartButton';
import MetaTags from '../../modules/common/components/MetaTags';
import getAssortmentPath from '../../modules/assortment/utils/getAssortmentPath';
import AssortmentBreadcrumbs from '../../modules/assortment/components/AssortmentBreadcrumbs';
import getMediaUrl from '../../modules/common/utils/getMediaUrl';
import getMediaUrls from '../../modules/common/utils/getMediaUrls';
import NotFound from '../404';
import Loading from '../../modules/common/components/Loading';
import ProductPrice from '../../modules/common/components/ProductPrice';
import { BookmarkIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import useUser from '../../modules/auth/hooks/useUser';
import useConditionalBookmarkProduct from '../../modules/cart/hooks/useConditionalBookmarkProduct';
import useRemoveBookmark from '../../modules/common/hooks/useRemoveBookmark';
import ProductVariants from '../../modules/products/components/ProductVariants';

const Detail = () => {
  const router = useRouter();
  const intl = useIntl();
  const { product, paths, loading } = useProductDetail({
    slug: router.query.slug,
  });
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();
  const { removeBookmark } = useRemoveBookmark();
  const { user } = useUser();

  const [filteredBookmark] =
    user?.bookmarks?.filter(
      (bookmark) => bookmark?.product?._id === product?._id,
    ) || [];

  const productPath = getAssortmentPath(paths);

  if (!product && !loading)
    return (
      <NotFound
        page={intl.formatMessage({
          id: 'product',
          defaultMessage: 'Product',
        })}
      />
    );
  return (
    <>
      <MetaTags
        title={product?.texts?.title}
        imageUrl={getMediaUrl(product)}
        description={product?.texts?.description}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto py-8">
          <div className="mb-6">
            <AssortmentBreadcrumbs
              paths={productPath}
              currentAssortment={product?.texts}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="w-full">
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
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1
                      className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white mb-2"
                      dangerouslySetInnerHTML={{
                        __html: product?.texts?.title,
                      }}
                    />
                    <h2
                      className="text-lg text-slate-600 dark:text-slate-300 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: product?.texts?.subtitle,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-white/90 p-3 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg dark:bg-slate-900/90"
                    onClick={() =>
                      filteredBookmark
                        ? removeBookmark({
                            bookmarkId: filteredBookmark?._id,
                          })
                        : conditionalBookmarkProduct({
                            productId: product?._id,
                          })
                    }
                    aria-label={
                      filteredBookmark
                        ? 'Remove from bookmarks'
                        : 'Add to bookmarks'
                    }
                  >
                    <BookmarkIcon
                      className={classNames('h-5 w-5 transition-colors', {
                        'text-amber-500 hover:text-amber-600': filteredBookmark,
                        'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white':
                          !filteredBookmark,
                      })}
                    />
                  </button>
                </div>
                <div className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white mb-6">
                  <ProductPrice product={product} />
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <Markdown>{product?.texts?.description}</Markdown>
              </div>

              {product?.proxies?.map((proxy) => (
                <ProductVariants
                  key={proxy._id}
                  proxy={proxy}
                  activeProductId={product._id}
                />
              ))}

              <div className="pt-4">
                <AddToCartButton productId={product?._id} {...product} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
