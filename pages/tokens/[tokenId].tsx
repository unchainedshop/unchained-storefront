import TokenExportPanel from '../../modules/products/components/TokenExportPanel';
import { useRouter } from 'next/router';
import useToken from '../../modules/products/hooks/useToken';
import Loading from '../../modules/common/components/Loading';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import defaultNextImageLoader from '../../modules/common/utils/defaultNextImageLoader';
import Image from 'next/image';
import { PhotoIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import useFormatDateTime from '../../modules/common/utils/useFormatDateTime';

const TokenDetailPage = () => {
  const router = useRouter();
  const { formatDateTime } = useFormatDateTime();
  const { formatMessage } = useIntl();
  const { token, loading } = useToken({ tokenId: router.query?.tokenId });

  if (loading) return <Loading />;

  const {
    _id,
    status,
    quantity,
    walletAddress,
    chainId,
    product,
    invalidatedDate,
    accessKey,
    tokenSerialNumber,
    expiryDate,
    ercMetadata,
  } = token;

  const statusClasses =
    status === 'CENTRALIZED'
      ? 'bg-success-soft text-success ring-success'
      : 'bg-warning-soft text-warning ring-warning';

  const productImage =
    ercMetadata?.image || product?.media?.[0]?.file?.url || null;

  return (
    <div className="min-h-screen bg-muted py-8 px-4">
      <div className="mx-auto max-w-5xl space-y-8">        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            {formatMessage({
              id: 'token_detail_title',
              defaultMessage: 'Token Detail',
            })}
          </h1>

          <span
            className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ring-1 ${statusClasses}`}
          >
            {status}
          </span>
        </div>
        
        <Section title="🪙 Token Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InfoItem
              id="zugangscode_anzeigend"
              label="Zugangscode anzeigen"
              formatMessage={formatMessage}
              value={
                <a
                  href={`/download/${_id}?hash=${accessKey}`}
                  className="btn btn-primary"
                  
                >
                  Zugangscode anzeigen
                  <QrCodeIcon className="h-5 w-5" />
                </a>
              }
            />

            <InfoItem id="token_id" label="ID" value={_id} formatMessage={formatMessage} />
            <InfoItem id="token_quantity" label="Quantity" value={quantity} formatMessage={formatMessage} />
            <InfoItem id="token_serial" label="Serial" value={tokenSerialNumber} formatMessage={formatMessage} />
            <InfoItem id="token_wallet" label="Wallet Address" value={walletAddress || 'N/A'} formatMessage={formatMessage} />
            <InfoItem id="token_chain_id" label="Chain ID" value={chainId} formatMessage={formatMessage} />
            <InfoItem
              id="token_access_key"
              label="Access Key"
              value={<span className="break-all font-mono text-sm">{accessKey}</span>}
              formatMessage={formatMessage}
            />
            <InfoItem
              id="token_invalidated_date"
              label="Invalidated Date"
              value={formatDateTime(invalidatedDate) || 'N/A'}
              formatMessage={formatMessage}
            />
            <InfoItem
              id="token_expiry_date"
              label="Expiry Date"
              value={formatDateTime(expiryDate) || 'N/A'}
              formatMessage={formatMessage}
            />
          </div>
        </Section>
        
        <Section title={formatMessage({ id: 'token_export_title', defaultMessage: 'Your wallet' })}>
          <TokenExportPanel token={token} />
          {token.order && (
            <Link href={`/order/${token.order._id}`} className="link inline-block text-sm">
              {formatMessage(
                { id: 'token_from_order', defaultMessage: 'Purchased with order #{number}' },
                { number: token.order.orderNumber || token.order._id.slice(-6) },
              )}
            </Link>
          )}
        </Section>

        <Section title="🛍️ Product Info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">            
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-muted">
              {productImage ? (
                <Image
                  src={productImage}
                  alt={product.texts?.title || 'Product Image'}
                  fill
                  loader={defaultNextImageLoader}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <PhotoIcon className="h-14 w-14 text-subtle-foreground" />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem id="product_id" label="Product ID" value={product._id} formatMessage={formatMessage} />

              <InfoItem
                id="product_title"
                label="Title"
                formatMessage={formatMessage}
                value={
                  <Link
                    href={`/product/${product.texts.slug}`}
                    className="text-accent hover:text-accent font-medium underline"
                  >
                    {product.texts.title}
                  </Link>
                }
              />

              <InfoItem id="product_subtitle" label="Subtitle" value={product.texts.subtitle} formatMessage={formatMessage} />
              <InfoItem id="product_contract_standard" label="Contract Standard" value={product.contractStandard} formatMessage={formatMessage} />
              <InfoItem id="product_contract_address" label="Contract Address" value={product.contractAddress} formatMessage={formatMessage} />
              <InfoItem
                id="product_token_id"
                label="Token ID"
                value={product.contractConfiguration.tokenId}
                formatMessage={formatMessage}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
    {children}
  </section>
);

const InfoItem = ({ id, label, value, formatMessage }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-subtle-foreground mb-1">
      {formatMessage({ id, defaultMessage: label })}
    </dt>
    <dd className="text-foreground break-words">{value}</dd>
  </div>
);

export default TokenDetailPage;
