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
import EmptyState from '../modules/common/components/EmptyState';
import Link from 'next/link';
import PageHeader from '../modules/common/components/PageHeader';

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

  const { products, filters, categories, loading } = useSearch({
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

      <PageHeader
        centered
        eyebrow={formatMessage({ id: 'search', defaultMessage: 'Search' })}
        title={
          debouncedQuery
            ? formatMessage({ id: 'search_results_for', defaultMessage: "Results for '{query}'" }, { query: debouncedQuery })
            : formatMessage({ id: 'search_products', defaultMessage: 'Search products' })
        }
      >
        <form role="search" onSubmit={handleSearch} className="mx-auto w-full max-w-2xl">
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
      </PageHeader>

      {debouncedQuery && categories.length > 0 && (
        <nav aria-label={formatMessage({ id: 'matching_categories', defaultMessage: 'Matching categories' })} className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatMessage({ id: 'matching_categories', defaultMessage: 'Matching categories' })}:
          </span>
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/shop/${category.texts?.slug}`}
              className="badge badge-accent px-3 py-1 text-sm hover:opacity-80"
            >
              {category.texts?.title}
            </Link>
          ))}
        </nav>
      )}

      <FilterLayout filters={filters} resultCount={debouncedQuery && !loading ? products.length : null}>
        {loading ? (
          <ProductGridSkeleton />
        ) : products.length > 0 ? (
          <ProductList products={products} totalProducts={products.length} onLoadMore={null} />
        ) : (
          <EmptyState
            icon={MagnifyingGlassIcon}
            title={
              debouncedQuery
                ? formatMessage({ id: 'no_search_results', defaultMessage: 'No products found matching your search.' })
                : formatMessage({ id: 'search_instruction', defaultMessage: 'Enter a search term to find products.' })
            }
            description={
              debouncedQuery
                ? formatMessage({ id: 'search_hint', defaultMessage: 'Try a different or more general term.' })
                : formatMessage({ id: 'search_browse_hint', defaultMessage: 'Or browse our categories to discover something new.' })
            }
          >
            <Link href="/shop" className="btn btn-secondary">
              {formatMessage({ id: 'browse_categories', defaultMessage: 'Shop by category' })}
            </Link>
          </EmptyState>
        )}
      </FilterLayout>
    </>
  );
};

export default Search;
