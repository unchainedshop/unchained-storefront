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
    <div className="text-xs text-muted-foreground space-y-0.5">
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
          <span className="text-subtle-foreground">
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
  <div className="text-xs text-muted-foreground space-y-0.5">
    {plan?.usageCalculationType && (
      <p>
        <span className="font-medium">
          {formatMessage({ id: 'usage_type', defaultMessage: 'Usage type' })}
          :{' '}
        </span>
        {plan.usageCalculationType}
      </p>
    )}
    {plan?.billingInterval && plan?.billingIntervalCount ? (
      <p>
        <span className="font-medium">
          {formatMessage({
            id: 'billing_interval',
            defaultMessage: 'Billing',
          })}
          :{' '}
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
            defaultMessage: 'Trial',
          })}
          :{' '}
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
    <div className="group relative bg-surface border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:border-0">
      <div className="relative aspect-square overflow-hidden bg-muted">
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
              <PhotoIcon className="h-12 w-12 text-subtle-foreground" />
            </div>
          )}
        </Link>

        {isBundle && (
          <div className="absolute top-3 left-3 z-10">
            <span className="badge badge-warning shadow-sm">
              {formatMessage({ id: 'bundle_badge', defaultMessage: 'Bundle' })}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link href={getProductHref(product?.texts?.slug)}>
              <h3 className="text-base font-semibold text-foreground transition-colors duration-200 hover:text-muted-foreground">
                {product?.texts?.title}
              </h3>
            </Link>

            {isBundle && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-warning-soft text-warning border border-warning/40">
                {formatMessage({
                  id: 'bundle_badge',
                  defaultMessage: 'Bundle',
                })}
              </span>
            )}
          </div>

          {product?.texts?.subtitle && (
            <p className="text-sm text-muted-foreground">
              {product.texts.subtitle}
            </p>
          )}

          {product?.texts?.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
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
          <div className="text-sm font-semibold text-foreground">
            <ProductPrice product={product} compact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
