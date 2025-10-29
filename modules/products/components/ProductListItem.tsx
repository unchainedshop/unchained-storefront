import { PhotoIcon } from '@heroicons/react/20/solid';
import Image from 'next/legacy/image';
import Link from 'next/link';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import ProductPrice from '../../common/components/ProductPrice';
import getProductHref from '../../common/utils/getProductHref';
import { useIntl } from 'react-intl';

const ProductListItem = ({ product }) => {
  const firstMediaUrl = product?.media?.[0]?.file?.url;
  const isBundle = product?.__typename === 'BundleProduct';
  const { formatMessage } = useIntl();

  return (
    <div className="group relative">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900">
        <Link href={getProductHref(product?.texts?.slug)}>
          {firstMediaUrl ? (
            <Image
              src={firstMediaUrl}
              alt={product?.texts?.title}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-300 group-hover:opacity-75"
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
              {formatMessage({ id: 'bundle', defaultMessage: 'Bundle' })}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <Link href={getProductHref(product?.texts?.slug)}>
            <h3 className="text-sm font-medium text-slate-900 transition-colors duration-200 hover:text-slate-700 dark:text-white dark:hover:text-slate-200">
              {product?.texts?.title}
            </h3>
          </Link>

          {isBundle && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
              {formatMessage({ id: 'bundle', defaultMessage: 'Bundle' })}
            </span>
          )}
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          <ProductPrice product={product} compact={true} />
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
