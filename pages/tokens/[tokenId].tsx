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
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-amber-50 text-amber-700 ring-amber-200';

  const productImage =
    ercMetadata?.image || product?.media?.[0]?.file?.url || null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-5xl space-y-8">        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
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
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white font-medium  hover:bg-slate-700 transition"
                  
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
        
        <Section title="🛍️ Product Info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">            
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-100">
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
                  <PhotoIcon className="h-14 w-14 text-gray-400" />
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
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
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
  <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    {children}
  </section>
);

const InfoItem = ({ id, label, value, formatMessage }) => (
  <div>
    <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
      {formatMessage({ id, defaultMessage: label })}
    </dt>
    <dd className="text-gray-900 break-words">{value}</dd>
  </div>
);

export default TokenDetailPage;
