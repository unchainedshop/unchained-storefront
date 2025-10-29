import { useRouter } from 'next/router';
import ImageGallery from 'react-image-gallery';
import { useIntl } from 'react-intl';
import Markdown from 'react-markdown';
import classNames from 'classnames';
import Link from 'next/link';
import { BookmarkIcon } from '@heroicons/react/20/solid';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

import useUser from '../../modules/auth/hooks/useUser';
import useProductDetail from '../../modules/products/hooks/useProductDetail';
import useConditionalBookmarkProduct from '../../modules/cart/hooks/useConditionalBookmarkProduct';
import useRemoveBookmark from '../../modules/common/hooks/useRemoveBookmark';

import MetaTags from '../../modules/common/components/MetaTags';
import Loading from '../../modules/common/components/Loading';
import NotFound from '../404';
import AssortmentBreadcrumbs from '../../modules/assortment/components/AssortmentBreadcrumbs';
import AddToCartButton from '../../modules/cart/components/AddToCartButton';
import ProductVariants from '../../modules/products/components/ProductVariants';
import ProductListItem from '../../modules/products/components/ProductListItem';
import ProductPrice from '../../modules/common/components/ProductPrice';

import getAssortmentPath from '../../modules/assortment/utils/getAssortmentPath';
import getMediaUrl from '../../modules/common/utils/getMediaUrl';
import getMediaUrls from '../../modules/common/utils/getMediaUrls';

const Detail = () => {
  const router = useRouter();
  const intl = useIntl();
  const { user } = useUser();
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();
  const { removeBookmark } = useRemoveBookmark();

  const { product, paths, loading } = useProductDetail({
    slug: router.query.slug,
  });

  if (!product && !loading)
    return (
      <NotFound
        page={intl.formatMessage({
          id: 'product',
          defaultMessage: 'Product',
        })}
      />
    );

  const productPath = getAssortmentPath(paths);
  const { siblings, bundleItems } = product || {};
  const isBundle = product?.__typename === 'BundleProduct';
  const isQuotable =
    product?.status === 'ACTIVE' && product?.tags?.includes('quotable');

  const [filteredBookmark] =
    user?.bookmarks?.filter(
      (bookmark) => bookmark?.product?._id === product?._id,
    ) || [];

  const toggleBookmark = () =>
    filteredBookmark
      ? removeBookmark({ bookmarkId: filteredBookmark?._id })
      : conditionalBookmarkProduct({ productId: product?._id });

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

            <div className="flex flex-col space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1
                        className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white"
                        dangerouslySetInnerHTML={{
                          __html: product?.texts?.title,
                        }}
                      />
                      {isBundle && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                          {intl.formatMessage({
                            id: 'bundle_badge',
                            defaultMessage: 'Bundle',
                          })}
                        </span>
                      )}
                    </div>

                    <h2
                      className="text-lg text-slate-600 dark:text-slate-300 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: product?.texts?.subtitle || '',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className="rounded-full bg-white/90 p-3 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg dark:bg-slate-900/90"
                    onClick={() =>
                      filteredBookmark
                        ? removeBookmark({ bookmarkId: filteredBookmark?._id })
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

              {product?.texts?.description && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <Markdown>{product?.texts?.description}</Markdown>
                </div>
              )}

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

              {isQuotable && (
                <div className="pt-4">
                  <Link
                    href={`/quotation/request/${product?.texts?.slug}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-300"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                    {intl.formatMessage({
                      id: 'request-quotation-offer',
                      defaultMessage: 'Anfrage Angebot',
                    })}
                  </Link>
                </div>
              )}
            </div>
          </div>
          {isBundle && bundleItems?.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold mb-6">
                {intl.formatMessage({
                  id: 'bundle_includes',
                  defaultMessage: 'This bundle includes:',
                })}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {bundleItems.map(({ product: item }) => (
                  <div
                    key={item._id}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900"
                  >
                    <Link href={`/product/${item?.texts?.slug}`}>
                      <img
                        src={getMediaUrl(item)}
                        alt={item.texts?.title || 'Bundle item'}
                        className="w-full aspect-square object-cover"
                      />
                    </Link>

                    <div className="p-4">
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">
                        {item.texts?.title || 'Unnamed product'}
                      </h3>

                      <div className="text-slate-600 dark:text-slate-300 mb-3">
                        <ProductPrice product={item} />
                      </div>

                      <AddToCartButton productId={item._id} {...item} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {siblings?.length > 0 && (
            <section className="mt-16">
              <h2 className="text-lg font-semibold mb-4">
                {intl.formatMessage({
                  id: 'similar_products',
                  defaultMessage: 'Similar products',
                })}
              </h2>

              <div className="grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                {siblings.map((sibling) => (
                  <div key={`grid-${sibling?._id}`} className="group relative">
                    <ProductListItem product={sibling} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default Detail;
