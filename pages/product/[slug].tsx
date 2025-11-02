import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Markdown from 'react-markdown';
import { useState } from 'react';

import useUser from '../../modules/auth/hooks/useUser';
import useProductDetail from '../../modules/products/hooks/useProductDetail';
import useConditionalBookmarkProduct from '../../modules/cart/hooks/useConditionalBookmarkProduct';
import useRemoveBookmark from '../../modules/common/hooks/useRemoveBookmark';

import MetaTags from '../../modules/common/components/MetaTags';
import Loading from '../../modules/common/components/Loading';
import NotFound from '../404';
import AssortmentBreadcrumbs from '../../modules/assortment/components/AssortmentBreadcrumbs';
import ProductPrice from '../../modules/common/components/ProductPrice';
import ProductVariants from '../../modules/products/components/ProductVariants';

import getAssortmentPath from '../../modules/assortment/utils/getAssortmentPath';
import getMediaUrl from '../../modules/common/utils/getMediaUrl';
import ProductBundleItems from '../../modules/products/components/ProductBundleItems';
import ProductQuotationButton from '../../modules/products/components/ProductQuotationButton';
import ProductImageGallery from '../../modules/products/components/ProductImageGallery';
import ProductVariationSelector from '../../modules/products/components/ProductVariationSelector';
import BookmarkButton from '../../modules/products/components/BookmarkButton';
import ProductSiblings from '../../modules/products/components/ProductSiblings';
import ProductAddToCart from '../../modules/products/components/ProductAddToCart';

const Detail = () => {
  const router = useRouter();
  const intl = useIntl();
  const { user } = useUser();
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();
  const { removeBookmark } = useRemoveBookmark();

  const { product, paths, loading } = useProductDetail({
    slug: router.query.slug,
  });
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  if (!product && !loading) {
    return (
      <NotFound
        page={intl.formatMessage({ id: 'product', defaultMessage: 'Product' })}
      />
    );
  }

  const productPath = getAssortmentPath(paths);
  const isBundle = product?.__typename === 'BundleProduct';
  const isConfigurable = product?.__typename === 'ConfigurableProduct';

  const [filteredBookmark] =
    user?.bookmarks?.filter(
      (bookmark) => bookmark?.product?._id === product?._id,
    ) || [];

  const toggleBookmark = () =>
    filteredBookmark
      ? removeBookmark({ bookmarkId: filteredBookmark?._id })
      : conditionalBookmarkProduct({ productId: product?._id });

  const resolvedAssignments = isConfigurable
    ? product.assignments.filter((assignment) =>
        Object.entries(selectedOptions).every(
          ([key, value]) =>
            assignment.vectors.find((v) => v.variation.key === key)?.option
              .value === value,
        ),
      )
    : [];

  const resolvedProducts = resolvedAssignments.map((a) => a.product);

  const minPrice =
    resolvedProducts.length > 0
      ? Math.min(...resolvedProducts.map((p) => p.catalogPrice.amount))
      : product?.catalogPrice?.amount;
  const maxPrice =
    resolvedProducts.length > 0
      ? Math.max(...resolvedProducts.map((p) => p.catalogPrice.amount))
      : product?.catalogPrice?.amount;

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
        <div className="container mx-auto py-8 space-y-12">
          <AssortmentBreadcrumbs
            paths={productPath}
            currentAssortment={product?.texts}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductImageGallery product={product} isBundle={isBundle} />

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

                  <BookmarkButton
                    filteredBookmark={filteredBookmark}
                    toggleBookmark={toggleBookmark}
                  />
                </div>

                <div className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white mb-6">
                  {isConfigurable && resolvedProducts.length > 0 ? (
                    resolvedProducts.length === 1 ? (
                      <ProductPrice product={resolvedProducts[0]} />
                    ) : (
                      <ProductPrice
                        product={{
                          simulatedPriceRange: {
                            minPrice: {
                              amount: minPrice,
                              currencyCode:
                                resolvedProducts[0].catalogPrice.currencyCode,
                            },
                            maxPrice: {
                              amount: maxPrice,
                              currencyCode:
                                resolvedProducts[0].catalogPrice.currencyCode,
                            },
                          },
                        }}
                      />
                    )
                  ) : (
                    <ProductPrice product={product} />
                  )}
                </div>
              </div>

              {product?.texts?.description && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <Markdown>{product?.texts?.description}</Markdown>
                </div>
              )}

              {isConfigurable && (
                <ProductVariationSelector
                  product={product}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                />
              )}

              <div className="pt-4">
                <ProductAddToCart
                  product={product}
                  resolvedProducts={resolvedProducts}
                  isConfigurable={isConfigurable}
                />
              </div>

              <ProductQuotationButton product={product} />
            </div>
          </div>

          {product?.proxies?.map((proxy) => (
            <ProductVariants
              key={proxy._id}
              proxy={proxy}
              activeProductId={product._id}
            />
          ))}

          <ProductBundleItems product={product} />
          <ProductSiblings product={product} />
        </div>
      )}
    </>
  );
};

export default Detail;
