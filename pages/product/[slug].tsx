import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import Markdown from 'react-markdown';
import { useState } from 'react';
import { LockClosedIcon, TruckIcon } from '@heroicons/react/24/outline';

import useProductDetail from '../../modules/products/hooks/useProductDetail';

import MetaTags from '../../modules/common/components/MetaTags';
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

  const price =
    isConfigurable && resolvedProducts.length > 0 ? (
      resolvedProducts.length === 1 ? (
        <ProductPrice product={resolvedProducts[0]} />
      ) : (
        <ProductPrice
          product={{
            simulatedPriceRange: {
              minPrice: {
                amount: minPrice,
                currencyCode: resolvedProducts[0].catalogPrice.currencyCode,
              },
              maxPrice: {
                amount: maxPrice,
                currencyCode: resolvedProducts[0].catalogPrice.currencyCode,
              },
            },
          }}
        />
      )
    ) : (
      <ProductPrice product={product} />
    );

  return (
    <>
      <MetaTags
        title={product?.texts?.title}
        imageUrl={getMediaUrl(product)}
        description={product?.texts?.description}
      />

      {loading ? (
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-6 w-1/4" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        </div>
      ) : (
        <div className="space-y-16">
          <div>
            <AssortmentBreadcrumbs
              paths={productPath}
              currentAssortment={product?.texts}
            />
            <div className="mt-4 grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="overflow-hidden rounded-2xl bg-muted">
                <ProductImageGallery product={product} isBundle={isBundle} />
              </div>

              <div className="lg:sticky lg:top-24 lg:self-start">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {product?.texts?.brand && (
                      <p className="text-sm font-medium uppercase tracking-wider text-subtle-foreground">
                        {product.texts.brand}
                      </p>
                    )}
                    <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                      {product?.texts?.title}
                    </h1>
                    {product?.texts?.subtitle && (
                      <p className="mt-2 text-lg text-muted-foreground">
                        {product.texts.subtitle}
                      </p>
                    )}
                  </div>
                  <BookmarkButton productId={product?._id} className="border border-border" />
                </div>

                <div className="mt-5 flex items-center gap-3 text-2xl font-semibold">
                  {price}
                  {isBundle && (
                    <span className="badge badge-warning">
                      {intl.formatMessage({ id: 'bundle_badge', defaultMessage: 'Bundle' })}
                    </span>
                  )}
                </div>

                {isConfigurable && (
                  <div className="mt-8">
                    <ProductVariationSelector
                      product={product}
                      selectedOptions={selectedOptions}
                      setSelectedOptions={setSelectedOptions}
                    />
                  </div>
                )}

                <div className="mt-8 space-y-3">
                  <ProductAddToCart
                    product={product}
                    resolvedProducts={resolvedProducts}
                    isConfigurable={isConfigurable}
                  />
                  {isConfigurable && resolvedProducts.length !== 1 && (
                    <p className="text-sm text-muted-foreground">
                      {intl.formatMessage({
                        id: 'select_options_to_add',
                        defaultMessage: 'Select your options to add this product to the cart.',
                      })}
                    </p>
                  )}
                  <ProductQuotationButton product={product} />
                </div>

                <ul className="mt-8 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <TruckIcon className="size-5 text-subtle-foreground" />
                    {intl.formatMessage({ id: 'perk_shipping_text', defaultMessage: 'Shipped quickly to your door' })}
                  </li>
                  <li className="flex items-center gap-2">
                    <LockClosedIcon className="size-5 text-subtle-foreground" />
                    {intl.formatMessage({ id: 'perk_secure_text', defaultMessage: 'Card, invoice and more' })}
                  </li>
                </ul>

                {product?.texts?.description && (
                  <div className="prose prose-sm mt-8 max-w-none border-t border-border pt-6 text-muted-foreground dark:prose-invert">
                    <Markdown>{product.texts.description}</Markdown>
                  </div>
                )}
              </div>
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
