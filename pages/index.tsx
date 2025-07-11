import getConfig from "next/config";
import { useIntl } from "react-intl";
import Link from "next/link";

import Image from "next/image";

import MetaTags from "../modules/common/components/MetaTags";
import defaultNextImageLoader from "../modules/common/utils/defaultNextImageLoader";
import useProducts from "../modules/products/hooks/useProducts";
import useAssortments from "../modules/assortment/hooks/useAssortments";
import ProductList from "../modules/products/components/ProductList";
import CategoryListItem from "../modules/assortment/components/CategoryListItem";
import Loading from "../modules/common/components/Loading";

const {
  publicRuntimeConfig: { theme },
} = getConfig();

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
      <MetaTags title={formatMessage({ id: "home", defaultMessage: "Home" })} />
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Hero Section */}
        <section className="relative w-screen ml-[calc(-50vw+50%)]">
          <div className="relative h-[60vh] w-full">
            <Image
              src={theme.assets.hero}
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              quality={100}
              alt={formatMessage({ id: "hero", defaultMessage: "Hero" })}
              loader={defaultNextImageLoader}
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-2 text-center text-white">
                <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {formatMessage({
                    id: "hero_title",
                    defaultMessage: "Discover Amazing Products",
                  })}
                </h1>
                <p className="mb-8 text-lg sm:text-xl">
                  {formatMessage({
                    id: "hero_subtitle",
                    defaultMessage: "Curated collection of the finest items",
                  })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {formatMessage({
                  id: "browse_categories",
                  defaultMessage: "Browse Categories",
                })}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {formatMessage({
                  id: "categories_subtitle",
                  defaultMessage:
                    "Explore our wide range of product categories",
                })}
              </p>
            </div>
          </div>

          {assortmentsLoading ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Loading />
            </div>
          ) : (
            <div className="w-screen ml-[calc(-50vw+50%)] overflow-x-auto scrollbar-hide pb-4">
              <div className="flex gap-6 scroll-smooth pl-4 xl:pl-[max(calc((100vw-80rem)/2))] pr-4 sm:pr-6 lg:pr-8">
                {assortments.map((category) => (
                  <div
                    key={category._id}
                    className="group flex-none w-64 sm:w-72 transform transition-transform duration-300 hover:scale-105"
                  >
                    <CategoryListItem category={category} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Products Section */}
        <section className="w-screen ml-[calc(-50vw+50%)] py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                {formatMessage({
                  id: "all_products",
                  defaultMessage: "All Products",
                })}
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                {formatMessage({
                  id: "products_subtitle",
                  defaultMessage: "Discover our complete collection",
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
              <ProductList
                products={products}
                totalProducts={products.length}
                viewMode="grid"
                onLoadMore={() => {
                  // Load more functionality would be implemented here
                  // For now, this is a placeholder since the home page shows a fixed set
                }}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  {formatMessage({
                    id: "no_products",
                    defaultMessage: "No products available",
                  })}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                  Debug: Products array length: {products.length}
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
