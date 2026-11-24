import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useIntl } from 'react-intl';

import useAssortmentProducts from '../../modules/assortment/hooks/useAssortmentProducts';
import ProductList from '../../modules/products/components/ProductList';
import MetaTags from '../../modules/common/components/MetaTags';
import getMediaUrl from '../../modules/common/utils/getMediaUrl';
import Loading from '../../modules/common/components/Loading';
import ListViewWrapper from '../../modules/common/components/ListViewWrapper';
import FilterSidebar from '../../modules/filter/components/FilterSideBar';
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
    assortment: { texts, media } = {},
    filters = [],
    products,
    loadMore,
    filteredProducts,
    loading: productsLoading,
  } = useAssortmentProducts({
    slugs: slug,
    includeLeaves: true,
    filterQuery,
    queryString: debouncedQuery,
  });

  // --- Handle search form submission ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    router.push({
      pathname: '/search',
      query: { ...router.query, query: trimmedQuery },
    });
  };

  return (
    <>
      <MetaTags
        title={texts?.title}
        description={texts?.description}
        imageUrl={getMediaUrl({ media })}
      />

      <div className="min-h-screen bg-surface">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative mx-auto max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-subtle-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={formatMessage({
                id: 'search_placeholder',
                defaultMessage: 'Search...',
              })}
              className="block w-full rounded-xl border border-input bg-surface py-4 pl-12 pr-4 text-foreground placeholder-subtle-foreground focus:border-input focus:outline-none focus:ring-1 focus:ring-ring dark:border-0"
            />
          </div>
        </form>

        <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {filters.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 space-y-4">
                <FilterSidebar filters={filters} />
              </div>
            </aside>
          )}

          <main className="flex-1">
            <ListViewWrapper title={texts?.title} subtitle={texts?.subtitle}>
              {(viewMode) => (
                <Fragment>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {filteredProducts} products
                    </div>
                  </div>

                  {productsLoading ? (
                    <div className="py-10 flex justify-center">
                      <Loading />
                    </div>
                  ) : (
                    <ProductList
                      onLoadMore={loadMore}
                      totalProducts={filteredProducts}
                      products={products}
                      viewMode={viewMode}
                    />
                  )}
                </Fragment>
              )}
            </ListViewWrapper>
          </main>
        </div>
      </div>
    </>
  );
};

export default CategoryDetail;
