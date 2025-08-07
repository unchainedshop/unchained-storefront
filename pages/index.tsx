import { useIntl } from 'react-intl';

import Image from 'next/image';

import MetaTags from '../modules/common/components/MetaTags';
import defaultNextImageLoader from '../modules/common/utils/defaultNextImageLoader';
import useProducts from '../modules/products/hooks/useProducts';
import useAssortments from '../modules/assortment/hooks/useAssortments';
import ProductList from '../modules/products/components/ProductList';
import CategoryListItem from '../modules/assortment/components/CategoryListItem';
import Loading from '../modules/common/components/Loading';
import ListViewWrapper from '../modules/common/components/ListViewWrapper';

const Home = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts({ limit: 20 });
  const { assortments, loading: assortmentsLoading } = useAssortments({
    includeLeaves: true,
  });
  const { formatMessage } = useIntl();

  return (
    <>
      <MetaTags title={formatMessage({ id: 'home', defaultMessage: 'Home' })} />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Hero Section */}
        <section
          id="hero-section"
          className="relative w-screen ml-[calc(-50vw+50%)]"
        >
          <div className="relative h-[60vh] lg:h-[40vh] xl:h-[25vh] w-full">
            <Image
              src="placeholder.png"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              quality={100}
              alt={formatMessage({ id: 'hero', defaultMessage: 'Hero' })}
              loader={defaultNextImageLoader}
              priority
            />
            <div className="absolute inset-0 bg-slate-950 bg-opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-2 text-center text-white">
                <h1 className="mb-4 text-4xl text-white/50 font-semibold tracking-tight sm:text-5xl">
                  {formatMessage({
                    id: 'hero_title',
                    defaultMessage: 'Ecommerce Starter Template',
                  })}
                </h1>
                <p className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {formatMessage({
                    id: 'hero_subtitle',
                    defaultMessage: 'Powered by Unchained and Next.js',
                  })}
                </p>
                <a
                  href="https://github.com/unchainedshop/storefront"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center px-3 py-1.5 text-base font-medium rounded-md text-slate-50 hover:text-white border-2 border-slate-800 hover:border-slate-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  {formatMessage({
                    id: 'view_on_github',
                    defaultMessage: 'View on GitHub',
                  })}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                {formatMessage({
                  id: 'browse_categories',
                  defaultMessage: 'Browse Categories',
                })}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {formatMessage({
                  id: 'categories_subtitle',
                  defaultMessage:
                    'Explore our wide range of product categories',
                })}
              </p>
            </div>
          </div>

          {assortmentsLoading ? (
            <div className="px-4 sm:px-6 lg:px-8">
              <Loading />
            </div>
          ) : (
            <div className="pb-4 grid grid-cols-1 gap-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {assortments.map((category) => (
                <div key={category._id} className="transition-all duration-300">
                  <CategoryListItem category={category} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Products Section */}
        <section className="w-screen ml-[calc(-50vw+50%)] py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
          <div className="container px-6 lg:px-8 mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
                {formatMessage({
                  id: 'all_products',
                  defaultMessage: 'All Products',
                })}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {formatMessage({
                  id: 'products_subtitle',
                  defaultMessage: 'Discover our complete collection',
                })}
              </p>
            </div>

            {productsLoading ? (
              <Loading />
            ) : productsError ? (
              <div className="text-center py-12">
                <p className="text-red-600 dark:text-red-400">
                  Error loading products: {productsError.message}
                </p>
              </div>
            ) : products.length > 0 ? (
              <ListViewWrapper>
                {(viewMode) => (
                  <ProductList
                    products={products}
                    totalProducts={products.length}
                    viewMode={viewMode}
                    onLoadMore={() => {
                      // Load more functionality would be implemented here
                      // For now, this is a placeholder since the home page shows a fixed set
                    }}
                  />
                )}
              </ListViewWrapper>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  {formatMessage({
                    id: 'no_products',
                    defaultMessage: 'No products available',
                  })}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
