import { PhotoIcon } from '@heroicons/react/20/solid';
import Image from 'next/legacy/image';
import Link from 'next/link';

import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import ProductPrice from '../../common/components/ProductPrice';
import getProductHref from '../../common/utils/getProductHref';

const ProductListItem = ({ product }) => {
  const firstMediaUrl = product?.media?.[0]?.file?.url;

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
      </div>

      <div className="mt-4 space-y-2">
        <Link href={getProductHref(product?.texts?.slug)}>
          <h3 className="text-sm font-medium text-slate-900 transition-colors duration-200 hover:text-slate-700 dark:text-white dark:hover:text-slate-200">
            {product?.texts?.title}
          </h3>
        </Link>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <ProductPrice product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
