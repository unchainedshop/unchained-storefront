import { useIntl } from 'react-intl';

import ProductListItem from './ProductListItem';
import Button from '../../common/components/Button';
import ProductListItemCompact from './ProductListItemCompact';

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
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductListItem key={`grid-${product?._id}`} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <ProductListItemCompact
                product={product}
                key={`compact-${product._id}`}
              />
            ))}
          </div>
        )}

        {totalProducts > products?.length && (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-muted-foreground">
              {formatMessage(
                { id: 'showing_x_of_y', defaultMessage: 'Showing {shown} of {total}' },
                { shown: products.length, total: totalProducts },
              )}
            </p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted-strong">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(products.length / totalProducts) * 100}%` }}
              />
            </div>
            <Button
              variant="secondary"
              fullWidth={false}
              text={formatMessage({ id: 'load_more', defaultMessage: 'Load More' })}
              onClick={onLoadMore}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
