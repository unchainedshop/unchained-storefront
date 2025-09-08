import { useState } from 'react';
import { useIntl } from 'react-intl';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import MetaTags from '../modules/common/components/MetaTags';
import useProducts from '../modules/products/hooks/useProducts';
import ProductListItem from '../modules/products/components/ProductListItem';
import Loading from '../modules/common/components/Loading';

const Search = () => {
  const { formatMessage } = useIntl();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // You can implement actual search logic here
  const { products, loading } = useProducts({
    // Add search parameters when implementing backend search
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // TODO: Implement search logic here
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'search', defaultMessage: 'Search' })}
      />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Search Header */}
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

          {/* Search Form */}
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

          {/* Search Results */}
          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <div>
              {searchQuery && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {formatMessage(
                      {
                        id: 'search_results_for',
                        defaultMessage: "Results for '{query}'",
                      },
                      { query: searchQuery },
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
              ) : searchQuery ? (
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-300">
                    {formatMessage({
                      id: 'no_search_results',
                      defaultMessage: 'No products found matching your search.',
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
          )}
        </div>
      </div>
    </>
  );
};

export default Search;
