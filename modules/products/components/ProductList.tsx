import { useIntl } from 'react-intl';
import { ChevronDoubleDownIcon, PhotoIcon } from '@heroicons/react/20/solid';
import Image from 'next/legacy/image';
import Link from 'next/link';

import ProductListItem from './ProductListItem';
import Button from '../../common/components/Button';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import getProductHref from '../../common/utils/getProductHref';
import ProductPrice from '../../common/components/ProductPrice';

const ProductList = ({
  products,
  totalProducts,
  onLoadMore,
  viewMode = 'grid',
}) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className="mx-auto max-w-full">
        <h2 className="sr-only">
          {formatMessage({ id: 'products', defaultMessage: 'Products' })}
        </h2>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={`grid-${product?._id}`} className="group relative">
                <ProductListItem product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={`list-${product?._id}`}
                className="group relative bg-white border border-slate-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg dark:bg-slate-900 dark:border-0"
              >
                <div className="lg:flex gap-5">
                  <div className="w-full h-100 lg:h-64 lg:w-48 flex-shrink-0 relative overflow-hidden bg-slate-50 dark:bg-slate-700">
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

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <Link href={getProductHref(product?.texts?.slug)}>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors duration-200 hover:text-slate-700 dark:hover:text-slate-200">
                          {product?.texts?.title}
                        </h3>
                      </Link>
                      {product?.texts?.subtitle && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                          {product?.texts?.subtitle}
                        </p>
                      )}
                      {product?.texts?.description && (
                        <p className="text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          {product?.texts?.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div className="text-xl font-semibold text-slate-900 dark:text-white">
                      <ProductPrice product={product} />
                    </div>
                    <Link
                      href={getProductHref(product?.texts?.slug)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 transition-colors duration-200 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      {formatMessage({
                        id: 'view_product_detail',
                        defaultMessage: 'View Details',
                      })}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalProducts > products?.length && (
          <div className="items-center py-8 text-center">
            <Button
              icon={<ChevronDoubleDownIcon className="mr-2 h-6 w-6" />}
              text={formatMessage({
                id: 'load_more',
                defaultMessage: 'Load More',
              })}
              aria-label={formatMessage({
                id: 'load_more',
                defaultMessage: 'Load More',
              })}
              type="button"
              className="dark:text-white"
              onClick={onLoadMore}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
