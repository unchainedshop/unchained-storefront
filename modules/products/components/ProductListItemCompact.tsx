import Image from 'next/image';
import Link from 'next/link';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { useIntl } from 'react-intl';

import getProductHref from '../../common/utils/getProductHref';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import ProductPrice from '../../common/components/ProductPrice';

const shortenAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

const ProductImage = ({ product, isBundle, formatMessage }) => (
  <div className="relative w-full h-48 lg:h-40 lg:w-44 flex-shrink-0 overflow-hidden bg-muted">
    <Link href={getProductHref(product?.texts?.slug)}>
      {product?.media?.[0]?.file?.url ? (
        <Image
          src={product.media[0].file.url}
          alt={product?.texts?.title}
          layout="fill"
          objectFit="cover"
          className="transition-all duration-300 group-hover:scale-105"
          loader={defaultNextImageLoader}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <PhotoIcon className="h-8 w-8 text-subtle-foreground" />
        </div>
      )}
    </Link>

    {isBundle && (
      <div className="absolute top-2 left-2 z-10">
        <span className="badge badge-warning shadow-sm">
          {formatMessage({ id: 'bundle_badge', defaultMessage: 'Bundle' })}
        </span>
      </div>
    )}
  </div>
);

const TokenProductMetadata = ({ product, formatMessage }) => {
  const contract = product?.contractConfiguration;
  const totalSupply = contract?.supply ?? 0;
  const mintedTokens = product?.tokensCount ?? 0;
  const availableTokens = totalSupply - mintedTokens;

  return (
    <>
      {product?.contractStandard && (
        <span className="flex items-center gap-1">
          <span className="font-medium">
            {formatMessage({
              id: 'product_standard',
              defaultMessage: 'Standard:',
            })}
          </span>
          {product.contractStandard}
        </span>
      )}
      {contract?.tokenId && (
        <span className="flex items-center gap-1">
          <span className="font-medium">
            {formatMessage({ id: 'token_id', defaultMessage: 'Token:' })}
          </span>
          {contract.tokenId}
        </span>
      )}
      {contract?.supply !== undefined && (
        <span className="flex items-center gap-1">
          <span className="font-medium">
            {formatMessage({ id: 'total_supply', defaultMessage: 'Supply:' })}
          </span>
          {totalSupply}{' '}
          <span className="text-subtle-foreground">
            (
            {formatMessage({
              id: 'available_tokens',
              defaultMessage: 'Available:',
            })}{' '}
            {availableTokens})
          </span>
        </span>
      )}
      {product?.contractAddress && (
        <span
          className="flex items-center gap-1 truncate"
          title={product.contractAddress}
        >
          <span className="font-medium">
            {formatMessage({
              id: 'contract_address',
              defaultMessage: 'Address:',
            })}
          </span>
          {shortenAddress(product.contractAddress)}
        </span>
      )}
    </>
  );
};

const PlanProductMetadata = ({ plan, formatMessage }) => (
  <>
    {plan?.usageCalculationType && (
      <span className="flex items-center gap-1">
        <span className="font-medium">
          {formatMessage({ id: 'usage_type', defaultMessage: 'Usage type' })}:
        </span>
        {plan.usageCalculationType}
      </span>
    )}
    {plan?.billingInterval && plan?.billingIntervalCount ? (
      <span className="flex items-center gap-1">
        <span className="font-medium">
          {formatMessage({
            id: 'billing_interval',
            defaultMessage: 'Billing',
          })}
          :
        </span>
        {plan.billingIntervalCount} {plan.billingInterval.toLowerCase()}
      </span>
    ) : (
      formatMessage({ id: 'free', defaultMessage: 'Free' })
    )}
    {plan?.trialInterval && plan?.trialIntervalCount && (
      <span className="flex items-center gap-1">
        <span className="font-medium">
          {formatMessage({ id: 'trial_interval', defaultMessage: 'Trial' })}:
        </span>
        {plan.trialIntervalCount} {plan.trialInterval.toLowerCase()}
      </span>
    )}
  </>
);

const ProductRightActions = ({ product, formatMessage }) => (
  <div className="flex flex-col justify-between items-end p-4 min-w-[180px] border-t lg:border-t-0 lg:border-l border-border">
    <div className="text-lg font-semibold text-foreground">
      <ProductPrice product={product} compact />
    </div>
    <Link
      href={getProductHref(product?.texts?.slug)}
      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary-hover transition-colors duration-200"
    >
      {formatMessage({
        id: 'view_product_detail',
        defaultMessage: 'View Details',
      })}
    </Link>
  </div>
);

const ProductListItemCompact = ({ product }) => {
  const { formatMessage } = useIntl();
  const plan = product?.plan;
  const isTokenProduct = !!product?.contractStandard;
  const isPlanProduct = !!plan;
  const isBundle = product?.__typename === 'BundleProduct';

  return (
    <div className="group relative bg-surface border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:border-0">
      <div className="flex flex-col lg:flex-row gap-5">
        <ProductImage
          product={product}
          isBundle={isBundle}
          formatMessage={formatMessage}
        />

        <div className="min-w-0 flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href={getProductHref(product?.texts?.slug)}>
                <h3 className="text-lg font-semibold text-foreground mb-1 transition-colors duration-200 hover:text-muted-foreground">
                  {product?.texts?.title}
                </h3>
              </Link>
              {product?.texts?.subtitle && (
                <p className="text-sm text-muted-foreground mb-1">
                  {product?.texts?.subtitle}
                </p>
              )}
            </div>

          </div>

          {product?.texts?.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product?.texts?.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {isTokenProduct && (
              <TokenProductMetadata
                product={product}
                formatMessage={formatMessage}
              />
            )}
            {isPlanProduct && (
              <PlanProductMetadata plan={plan} formatMessage={formatMessage} />
            )}
          </div>
          {isBundle && product.bundleItems?.length > 0 && (
            <div className="mt-4 border-t border-border pt-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle-foreground">
                {formatMessage({
                  id: 'bundle_contains',
                  defaultMessage: 'Includes:',
                })}
              </h4>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.bundleItems?.slice(0, 3).map((item, index) => {
                  const bundleProduct = item.product;
                  return (
                    <Link
                      key={bundleProduct._id || index}
                      href={getProductHref(bundleProduct.texts?.slug)}
                      className="relative z-10 flex flex-col items-center text-center hover:text-foreground"
                    >
                      <div className="relative w-14 h-14 rounded-md overflow-hidden border border-border bg-muted">
                        {bundleProduct?.media?.[0]?.file?.url ? (
                          <Image
                            src={bundleProduct.media[0].file.url}
                            alt={bundleProduct.texts?.title}
                            fill
                            className="object-cover"
                            loader={defaultNextImageLoader}
                          />
                        ) : (
                          <PhotoIcon className="h-6 w-6 text-subtle-foreground absolute inset-0 m-auto" />
                        )}
                      </div>
                      <p className="mt-1 w-16 truncate text-xs text-muted-foreground">
                        {item.quantity > 1 && `${item.quantity}× `}
                        {bundleProduct.texts?.title}
                      </p>
                    </Link>
                  );
                })}

                {product.bundleItems?.length > 3 && (
                  <div className="text-xs text-subtle-foreground ml-2">
                    {formatMessage(
                      { id: 'bundle_more_items', defaultMessage: '+{count} more' },
                      { count: product.bundleItems.length - 3 },
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
        <ProductRightActions product={product} formatMessage={formatMessage} />
      </div>
    </div>
  );
};

export default ProductListItemCompact;
