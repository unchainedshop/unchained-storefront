import { useRouter } from 'next/router';
import useToken from '../../modules/products/hooks/useToken';
import Loading from '../../modules/common/components/Loading';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import defaultNextImageLoader from '../../modules/common/utils/defaultNextImageLoader';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';
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

  const statusColor =
    status === 'CENTRALIZED'
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-yellow-100 text-yellow-700 border-yellow-300';

  const productImage =
    ercMetadata?.image || product?.media?.[0]?.file?.url || null;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 md:gap-0">
        <h1 className="text-3xl font-bold text-gray-800">
          {formatMessage({
            id: 'token_detail_title',
            defaultMessage: 'Token Detail',
          })}
        </h1>
        <span
          className={`text-sm px-3 py-1 border rounded-full font-medium ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <section className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🪙 {formatMessage({ id: 'token_info', defaultMessage: 'Token Info' })}
        </h2>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
          <InfoItem
            id="token_id"
            label="ID"
            value={_id}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="token_quantity"
            label="Quantity"
            value={quantity}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="token_serial"
            label="Serial"
            value={tokenSerialNumber}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="token_wallet"
            label="Wallet Address"
            value={walletAddress || 'N/A'}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="token_chain_id"
            label="Chain ID"
            value={chainId}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="token_access_key"
            label="Access Key"
            value={<span className="break-all">{accessKey}</span>}
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
        </dl>
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          🛍️{' '}
          {formatMessage({
            id: 'product_info',
            defaultMessage: 'Product Info',
          })}
        </h2>

        <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden bg-gray-100">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.texts?.title || 'Product Image'}
              fill
              style={{ objectFit: 'cover' }}
              loader={defaultNextImageLoader}
              className="transition-transform duration-200 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PhotoIcon className="w-16 h-16 text-slate-400" />
            </div>
          )}
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700">
          <InfoItem
            id="product_id"
            label="Product ID"
            value={product._id}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="product_title"
            label="Title"
            formatMessage={formatMessage}
            value={
              <Link
                href={`/product/${product.texts.slug}`}
                className="text-blue-600 hover:text-blue-800 underline transition-colors"
              >
                {product.texts.title}
              </Link>
            }
          />
          <InfoItem
            id="product_subtitle"
            label="Subtitle"
            value={product.texts.subtitle}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="product_contract_standard"
            label="Contract Standard"
            value={product.contractStandard}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="product_contract_address"
            label="Contract Address"
            value={product.contractAddress}
            formatMessage={formatMessage}
          />
          <InfoItem
            id="product_token_id"
            label="Token ID"
            value={product.contractConfiguration.tokenId}
            formatMessage={formatMessage}
          />
        </dl>
      </section>
    </div>
  );
};

const InfoItem = ({ id, label, value, formatMessage }) => (
  <div>
    <dt className="font-semibold text-gray-800 text-sm uppercase tracking-wide mb-1">
      {formatMessage({ id, defaultMessage: `${label}:` })}
    </dt>
    <dd className="text-gray-700 break-words">{value}</dd>
  </div>
);

export default TokenDetailPage;
