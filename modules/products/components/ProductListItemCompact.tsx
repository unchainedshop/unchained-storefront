import Image from 'next/image';
import Link from 'next/link';
import { PhotoIcon } from '@heroicons/react/20/solid';
import { useIntl } from 'react-intl';

import getProductHref from '../../common/utils/getProductHref';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import ProductPrice from '../../common/components/ProductPrice';

const shortenAddress = (address) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

const ProductImage = ({ product }) => {
  return (
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
    </div>
  );
};

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

const PlanProductMetadata = ({ plan, formatMessage }) => {
  return (
    <>
      {plan?.usageCalculationType && (
        <span className="flex items-center gap-1">
          <span className="font-medium">
            {formatMessage({ id: 'usage_type', defaultMessage: 'Usage:' })}
          </span>
          {plan.usageCalculationType}
        </span>
      )}
      {plan?.billingInterval && plan?.billingIntervalCount ? (
        <span className="flex items-center gap-1">
          <span className="font-medium">
            {formatMessage({
              id: 'billing_interval',
              defaultMessage: 'Billing:',
            })}
          </span>
          {plan.billingIntervalCount} {plan.billingInterval.toLowerCase()}
        </span>
      ) : (
        formatMessage({ id: 'free', defaultMessage: 'Free' })
      )}
      {plan?.trialInterval && plan?.trialIntervalCount ? (
        <span className="flex items-center gap-1">
          <span className="font-medium">
            {formatMessage({ id: 'trial_interval', defaultMessage: 'Trial:' })}
          </span>
          {plan.trialIntervalCount} {plan.trialInterval.toLowerCase()}
        </span>
      ) : null}
    </>
  );
};

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

  return (
    <div className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-slate-900 dark:border-0">
      <div className="flex flex-col lg:flex-row gap-5">
        <ProductImage product={product} />

        <div className="flex-1 flex flex-col justify-between p-4">
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
            {product?.texts?.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {product?.texts?.description}
              </p>
            )}
          </div>

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

        <ProductRightActions product={product} formatMessage={formatMessage} />
      </div>
    </div>
  );
};

export default ProductListItemCompact;
