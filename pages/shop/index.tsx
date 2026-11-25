import { useIntl } from 'react-intl';
import { ShoppingBagIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

import CategoryListItem from '../../modules/assortment/components/CategoryListItem';
import useAssortments from '../../modules/assortment/hooks/useAssortments';
import MetaTags from '../../modules/common/components/MetaTags';
import PageHeader from '../../modules/common/components/PageHeader';
import EmptyState from '../../modules/common/components/EmptyState';
import ListViewWrapper from '../../modules/common/components/ListViewWrapper';
import FilterLayout from '../../modules/filter/components/FilterLayout';
import useRouteFilterQuery from '../../modules/filter/hooks/useRouteFilterQuery';
import ProductList from '../../modules/products/components/ProductList';
import ProductGridSkeleton from '../../modules/products/components/ProductGridSkeleton';
import useSearch from '../../modules/products/hooks/useSearch';

// Categories are browsable on top; every published product is listed below,
// so products that are not assigned to any category can still be found.
const Shop = () => {
  const { formatMessage } = useIntl();
  const { assortments, loading: categoriesLoading } = useAssortments();
  const { filterQuery } = useRouteFilterQuery();
  const { products, filters, filteredProductsCount, loading, loadMore } = useSearch({
    filterQuery,
    limit: 24,
  });

  return (
    <>
      <MetaTags title={formatMessage({ id: 'nav_store', defaultMessage: 'Shop' })} />
      <PageHeader
        icon={ShoppingBagIcon}
        title={formatMessage({ id: 'nav_store', defaultMessage: 'Shop' })}
        description={formatMessage({
          id: 'shop_description',
          defaultMessage: 'Browse our categories or explore the full collection.',
        })}
      />

      {(categoriesLoading || assortments.length > 0) && (
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            {formatMessage({ id: 'shop_by_category', defaultMessage: 'Shop by Category' })}
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {categoriesLoading
              ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton aspect-[4/3] rounded-xl" />)
              : assortments.map((category) => <CategoryListItem key={category._id} category={category} />)}
          </div>
        </section>
      )}

      <section>
        <ListViewWrapper heading={formatMessage({ id: 'nav_shop_all', defaultMessage: 'All products' })}>
          {(viewMode) => (
            <FilterLayout filters={filters} resultCount={loading && !products?.length ? null : filteredProductsCount}>
              {loading && !products?.length ? (
                <ProductGridSkeleton />
              ) : products?.length ? (
                <ProductList
                  products={products}
                  totalProducts={filteredProductsCount}
                  onLoadMore={loadMore}
                  viewMode={viewMode}
                />
              ) : (
                <EmptyState
                  icon={Squares2X2Icon}
                  title={formatMessage({ id: 'no_products', defaultMessage: 'No products available' })}
                  description={formatMessage({
                    id: 'no_products_text',
                    defaultMessage: 'New products are on their way. Check back soon.',
                  })}
                />
              )}
            </FilterLayout>
          )}
        </ListViewWrapper>
      </section>
    </>
  );
};

export default Shop;
