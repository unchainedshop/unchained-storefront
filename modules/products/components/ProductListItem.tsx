import { PhotoIcon } from '@heroicons/react/20/solid';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import ProductPrice from '../../common/components/ProductPrice';
import getProductHref from '../../common/utils/getProductHref';
import BookmarkButton from './BookmarkButton';

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
  const href = getProductHref(product?.texts?.slug);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        {firstMediaUrl ? (
          <Image
            src={firstMediaUrl}
            alt={product?.texts?.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loader={defaultNextImageLoader}
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <PhotoIcon className="size-12 text-subtle-foreground" />
          </div>
        )}
        {isBundle && (
          <span className="badge badge-warning absolute left-3 top-3 shadow-sm">
            {formatMessage({ id: 'bundle_badge', defaultMessage: 'Bundle' })}
          </span>
        )}
        <BookmarkButton
          productId={product?._id}
          className="absolute right-3 top-3 z-10"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">
          <Link href={href} className="after:absolute after:inset-0">
            {product?.texts?.title}
          </Link>
        </h3>
        {product?.texts?.subtitle && (
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {product.texts.subtitle}
          </p>
        )}
        {isTokenProduct && (
          <TokenProductMetadata product={product} formatMessage={formatMessage} />
        )}
        {plan && <PlanProductMetadata plan={plan} formatMessage={formatMessage} />}
        <div className="mt-auto pt-1 text-sm font-semibold text-foreground">
          <ProductPrice product={product} compact />
        </div>
      </div>
    </article>
  );
};

export default ProductListItem;
