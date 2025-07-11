import getConfig from "next/config";
import { useIntl } from "react-intl";
import Link from "next/link";

import Image from "next/image";

import MetaTags from "../modules/common/components/MetaTags";
import defaultNextImageLoader from "../modules/common/utils/defaultNextImageLoader";
import useProducts from "../modules/products/hooks/useProducts";
import ProductListItem from "../modules/products/components/ProductListItem";
import Loading from "../modules/common/components/Loading";

const {
  publicRuntimeConfig: { theme },
} = getConfig();

const Home = () => {
  const { products, loading } = useProducts({ tags: ["featured"] });
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
              <div className="container mx-auto px-4 text-center text-white sm:px-6 lg:px-8">
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

        {/* Latest Drops Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                {formatMessage({
                  id: "latest_drops",
                  defaultMessage: "Latest Drops",
                })}
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {formatMessage({
                  id: "view_all",
                  defaultMessage: "View all",
                })}{" "}
                →
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : (
              products.length !== 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.slice(0, 3).map((product) => (
                    <div
                      key={product?._id}
                      className="group relative transform transition-transform duration-300 hover:scale-105"
                    >
                      <ProductListItem product={product} disableBookmark />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                {formatMessage({
                  id: "featured_products",
                  defaultMessage: "Featured Products",
                })}
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {formatMessage({
                  id: "view_all",
                  defaultMessage: "View all",
                })}{" "}
                →
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : (
              products.length !== 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.slice(0, 4).map((product) => (
                    <div
                      key={product?._id}
                      className="group relative transform transition-transform duration-300 hover:scale-105"
                    >
                      <ProductListItem product={product} disableBookmark />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        {/* Weekly Picks Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                {formatMessage({
                  id: "weekly_picks",
                  defaultMessage: "Weekly Picks",
                })}
              </h2>
              <Link
                href="/shop"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {formatMessage({
                  id: "view_all",
                  defaultMessage: "View all",
                })}{" "}
                →
              </Link>
            </div>

            {loading ? (
              <Loading />
            ) : (
              products.length !== 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.slice(0, 3).map((product) => (
                    <div
                      key={product?._id}
                      className="group relative transform transition-transform duration-300 hover:scale-105"
                    >
                      <ProductListItem product={product} disableBookmark />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
