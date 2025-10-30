import { PhotoIcon } from '@heroicons/react/20/solid';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import ProductPrice from '../../common/components/ProductPrice';
import getProductHref from '../../common/utils/getProductHref';

const shortenAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

const TokenProductMetadata = ({ product, formatMessage }) => {
  const contract = product?.contractConfiguration;
  const totalSupply = contract?.supply ?? 0;
  const mintedTokens = product?.tokensCount ?? 0;
  const availableTokens = totalSupply - mintedTokens;

  return (
    <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
      {product?.contractStandard && (
        <p>
          <span className="font-medium">
            {formatMessage({
              id: 'product_standard',
              defaultMessage: 'Standard:',
            })}{' '}
          </span>
          {product.contractStandard}
        </p>
      )}
      {contract?.tokenId && (
        <p>
          <span className="font-medium">
            {formatMessage({ id: 'token_id', defaultMessage: 'Token:' })}{' '}
          </span>
          {contract.tokenId}
        </p>
      )}
      {contract?.supply !== undefined && (
        <p>
          <span className="font-medium">
            {formatMessage({
              id: 'total_supply',
              defaultMessage: 'Supply:',
            })}{' '}
          </span>
          {totalSupply}{' '}
          <span className="text-slate-500 dark:text-slate-400">
            ({formatMessage({ id: 'available', defaultMessage: 'Available:' })}{' '}
            {availableTokens})
          </span>
        </p>
      )}
      {product?.contractAddress && (
        <p title={product.contractAddress}>
          <span className="font-medium">
            {formatMessage({
              id: 'contract_address',
              defaultMessage: 'Address:',
            })}{' '}
          </span>
          {shortenAddress(product.contractAddress)}
        </p>
      )}
    </div>
  );
};

const PlanProductMetadata = ({ plan, formatMessage }) => (
  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
    {plan?.usageCalculationType && (
      <p>
        <span className="font-medium">
          {formatMessage({ id: 'usage_type', defaultMessage: 'Usage:' })}{' '}
        </span>
        {plan.usageCalculationType}
      </p>
    )}
    {plan?.billingInterval && plan?.billingIntervalCount ? (
      <p>
        <span className="font-medium">
          {formatMessage({
            id: 'billing_interval',
            defaultMessage: 'Billing:',
          })}{' '}
        </span>
        {plan.billingIntervalCount} {plan.billingInterval.toLowerCase()}
      </p>
    ) : (
      <p>{formatMessage({ id: 'free', defaultMessage: 'Free' })}</p>
    )}
    {plan?.trialInterval && plan?.trialIntervalCount && (
      <p>
        <span className="font-medium">
          {formatMessage({
            id: 'trial_interval',
            defaultMessage: 'Trial:',
          })}{' '}
        </span>
        {plan.trialIntervalCount} {plan.trialInterval.toLowerCase()}
      </p>
    )}
  </div>
);

const ProductListItem = ({ product }) => {
  const { formatMessage } = useIntl();
  const firstMediaUrl = product?.media?.[0]?.file?.url;
  const isBundle = product?.__typename === 'BundleProduct';
  const isTokenProduct = !!product?.contractStandard;
  const plan = product?.plan;
  const isPlanProduct = !!plan;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-slate-900 dark:border-0">
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800">
        <Link href={getProductHref(product?.texts?.slug)}>
          {firstMediaUrl ? (
            <Image
              src={firstMediaUrl}
              alt={product?.texts?.title}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-300 group-hover:scale-105"
              loader={defaultNextImageLoader}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PhotoIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
            </div>
          )}
        </Link>

        {isBundle && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-amber-500 text-white shadow-sm">
              {formatMessage({ id: 'bundle_badge', defaultMessage: 'Bundle' })}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link href={getProductHref(product?.texts?.slug)}>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white transition-colors duration-200 hover:text-slate-700 dark:hover:text-slate-200">
                {product?.texts?.title}
              </h3>
            </Link>

            {isBundle && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                {formatMessage({
                  id: 'bundle_badge',
                  defaultMessage: 'Bundle',
                })}
              </span>
            )}
          </div>

          {product?.texts?.subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {product.texts.subtitle}
            </p>
          )}

          {product?.texts?.description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {product.texts.description}
            </p>
          )}

          <div className="mt-2">
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

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">
            <ProductPrice product={product} compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
