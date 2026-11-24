import { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import MetaTags from '../modules/common/components/MetaTags';
import ProductList from '../modules/products/components/ProductList';
import ProductGridSkeleton from '../modules/products/components/ProductGridSkeleton';
import { useRouter } from 'next/router';
import useSearch from '../modules/products/hooks/useSearch';
import useRouteFilterQuery from '../modules/filter/hooks/useRouteFilterQuery';
import FilterLayout from '../modules/filter/components/FilterLayout';

const Search = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { filterQuery } = useRouteFilterQuery();
  const urlQuery = (router.query.query as string) || '';
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(urlQuery);

  useEffect(() => {
    setSearchQuery(urlQuery);
    setDebouncedQuery(urlQuery);
  }, [urlQuery]);

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { products, filters, loading } = useSearch({
    queryString: debouncedQuery,
    filterQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        query: {
          ...router.query,
          query: trimmedQuery,
        },
      });
    }
  };

  return (
    <>
      <MetaTags title={formatMessage({ id: 'search', defaultMessage: 'Search' })} />

      <form role="search" onSubmit={handleSearch} className="mx-auto mb-10 max-w-2xl">
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle-foreground" />
          <input
            type="search"
            autoFocus={!urlQuery}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={formatMessage({ id: 'search', defaultMessage: 'Search' })}
            placeholder={formatMessage({ id: 'search_products_placeholder', defaultMessage: 'Search products…' })}
            className="input rounded-full py-3.5 pl-12 text-base"
          />
        </div>
      </form>

      {debouncedQuery && (
        <h1 className="mb-6 text-2xl font-bold tracking-tight">
          {formatMessage(
            { id: 'search_results_for', defaultMessage: "Results for '{query}'" },
            { query: debouncedQuery },
          )}
        </h1>
      )}

      <FilterLayout filters={filters} resultCount={debouncedQuery && !loading ? products.length : null}>
        {loading ? (
          <ProductGridSkeleton />
        ) : products.length > 0 ? (
          <ProductList products={products} totalProducts={products.length} onLoadMore={null} />
        ) : (
          <div className="rounded-xl border border-dashed border-input py-16 text-center">
            <MagnifyingGlassIcon className="mx-auto size-8 text-subtle-foreground" />
            <p className="mt-3 font-medium">
              {debouncedQuery
                ? formatMessage({ id: 'no_search_results', defaultMessage: 'No products found matching your search.' })
                : formatMessage({ id: 'search_instruction', defaultMessage: 'Enter a search term to find products.' })}
            </p>
            {debouncedQuery && (
              <p className="mt-1 text-sm text-muted-foreground">
                {formatMessage({ id: 'search_hint', defaultMessage: 'Try a different or more general term.' })}
              </p>
            )}
          </div>
        )}
      </FilterLayout>
    </>
  );
};

export default Search;
