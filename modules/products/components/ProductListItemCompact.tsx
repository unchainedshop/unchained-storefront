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
  <div className="relative w-full h-48 lg:h-40 lg:w-44 flex-shrink-0 overflow-hidden bg-slate-50 dark:bg-slate-700">
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
          <PhotoIcon className="h-8 w-8 text-slate-400 dark:text-slate-500" />
        </div>
      )}
    </Link>

    {isBundle && (
      <div className="absolute top-2 left-2 z-10">
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-500 text-white shadow-sm">
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
          <span className="text-slate-500 dark:text-slate-400">
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
  <div className="flex flex-col justify-between items-end p-4 min-w-[180px] border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800">
    <div className="text-lg font-semibold text-slate-900 dark:text-white">
      <ProductPrice product={product} compact />
    </div>
    <Link
      href={getProductHref(product?.texts?.slug)}
      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors duration-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
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
    <div className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-slate-900 dark:border-0">
      <div className="flex flex-col lg:flex-row gap-5">
        <ProductImage
          product={product}
          isBundle={isBundle}
          formatMessage={formatMessage}
        />

        <div className="flex-1 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href={getProductHref(product?.texts?.slug)}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 transition-colors duration-200 hover:text-slate-700 dark:hover:text-slate-200">
                  {product?.texts?.title}
                </h3>
              </Link>
              {product?.texts?.subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  {product?.texts?.subtitle}
                </p>
              )}
            </div>

            {isBundle && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                {formatMessage({
                  id: 'bundle_badge',
                  defaultMessage: 'Bundle',
                })}
              </span>
            )}
          </div>

          {product?.texts?.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {product?.texts?.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700 dark:text-slate-300">
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
        </div>
        {isBundle && (
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
              {formatMessage({
                id: 'bundle_contains',
                defaultMessage: 'Includes:',
              })}
            </h4>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.bundleItems?.slice(0, 3).map((item, index) => {
                const bundleProduct = item.product;
                return (
                  <div
                    key={bundleProduct._id || index}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative w-14 h-14 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      {bundleProduct?.media?.[0]?.file?.url ? (
                        <Image
                          src={bundleProduct.media[0].file.url}
                          alt={bundleProduct.texts?.title}
                          fill
                          className="object-cover"
                          loader={defaultNextImageLoader}
                        />
                      ) : (
                        <PhotoIcon className="h-6 w-6 text-slate-400 absolute inset-0 m-auto" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 truncate w-16">
                      {bundleProduct.texts?.title}
                    </p>
                  </div>
                );
              })}

              {product.bundleItems?.length > 3 && (
                <div className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                  +{product.bundleItems.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}

        <ProductRightActions product={product} formatMessage={formatMessage} />
      </div>
    </div>
  );
};

export default ProductListItemCompact;
