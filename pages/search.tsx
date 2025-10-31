import { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import MetaTags from '../modules/common/components/MetaTags';
import ProductListItem from '../modules/products/components/ProductListItem';
import Loading from '../modules/common/components/Loading';
import { useRouter } from 'next/router';
import useSearch from '../modules/products/hooks/useSearch';
import useRouteFilterQuery from '../modules/filter/hooks/useFilterContext';
import FilterSidebar from '../modules/filter/components/FilterSideBar';

const Search = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { filterQuery } = useRouteFilterQuery();
  const searchParams = new URLSearchParams(router.asPath.split('?')[1]);
  const initialQuery = searchParams.get('query') || '';

  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

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
      <MetaTags
        title={formatMessage({ id: 'search', defaultMessage: 'Search' })}
      />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {formatMessage({
                id: 'search_products',
                defaultMessage: 'Search Products',
              })}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {formatMessage({
                id: 'search_description',
                defaultMessage: "Find exactly what you're looking for",
              })}
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative mx-auto max-w-2xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={formatMessage({
                  id: 'search_placeholder',
                  defaultMessage: 'Search for products...',
                })}
                className="block w-full rounded-xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-slate-900 placeholder-slate-500 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-0 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
              />
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <div className="flex gap-8">
              {filters.length ? (
                <div className="w-64 flex-shrink-0 space-y-4">
                  <FilterSidebar filters={filters} />
                </div>
              ) : null}

              <div className="flex-1">
                {debouncedQuery && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {formatMessage(
                        {
                          id: 'search_results_for',
                          defaultMessage: "Results for '{query}'",
                        },
                        { query: debouncedQuery },
                      )}
                    </h2>
                  </div>
                )}

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                      <div
                        key={product?._id}
                        className="group transform transition-transform duration-300 hover:scale-105"
                      >
                        <ProductListItem product={product} />
                      </div>
                    ))}
                  </div>
                ) : debouncedQuery ? (
                  <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-300">
                      {formatMessage({
                        id: 'no_search_results',
                        defaultMessage:
                          'No products found matching your search.',
                      })}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-300">
                      {formatMessage({
                        id: 'search_instruction',
                        defaultMessage: 'Enter a search term to find products.',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
