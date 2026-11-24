import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';

import useAssortmentProducts from '../../modules/assortment/hooks/useAssortmentProducts';
import ProductList from '../../modules/products/components/ProductList';
import MetaTags from '../../modules/common/components/MetaTags';
import getMediaUrl from '../../modules/common/utils/getMediaUrl';
import ProductGridSkeleton from '../../modules/products/components/ProductGridSkeleton';
import ListViewWrapper from '../../modules/common/components/ListViewWrapper';
import FilterLayout from '../../modules/filter/components/FilterLayout';
import useRouteFilterQuery from '../../modules/filter/hooks/useRouteFilterQuery';

const CategoryDetail = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { slug: slugs } = router.query;
  const slug = slugs?.length ? slugs[slugs.length - 1] : '';

  const { filterQuery } = useRouteFilterQuery();

  const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
  const initialQuery = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);

      const currentQuery = router.query.query || '';
      if (currentQuery !== searchQuery) {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, query: searchQuery || undefined },
          },
          undefined,
          { shallow: true },
        );
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // --- Fetch products ---
  const {
    assortment,
    filters = [],
    products,
    loadMore,
    filteredProducts,
    loading: productsLoading,
  } = useAssortmentProducts({
    slugs: slug,
    filterQuery,
    queryString: debouncedQuery,
  });
  const texts = assortment?.texts;
  const media = assortment?.media;

  return (
    <>
      <MetaTags
        title={texts?.title}
        description={texts?.description}
        imageUrl={getMediaUrl({ media })}
      />

      <ListViewWrapper title={texts?.title} subtitle={texts?.subtitle}>
        {(viewMode) => (
          <FilterLayout filters={filters} resultCount={filteredProducts ?? null}>
            <div className="relative mb-6 max-w-sm">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={formatMessage({ id: 'search_in_category', defaultMessage: 'Search in this category' })}
                placeholder={formatMessage({ id: 'search_in_category', defaultMessage: 'Search in this category' })}
                className="input pl-10"
              />
            </div>
            {productsLoading && !products?.length ? (
              <ProductGridSkeleton />
            ) : products?.length ? (
              <ProductList
                onLoadMore={loadMore}
                totalProducts={filteredProducts}
                products={products}
                viewMode={viewMode}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-input py-16 text-center text-muted-foreground">
                {formatMessage({ id: 'no_products_found', defaultMessage: 'No products match your filters.' })}
              </div>
            )}
          </FilterLayout>
        )}
      </ListViewWrapper>
    </>
  );
};

export default CategoryDetail;
