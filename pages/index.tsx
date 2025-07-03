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

      {/* Hero section */}
      <div className="relative bg-white dark:bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src={theme.assets.hero}
            fill
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
            quality={100}
            placeholder="blur"
            blurDataURL="/placeholder.png"
            alt={formatMessage({ id: "hero", defaultMessage: "Hero" })}
            loader={defaultNextImageLoader}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-50"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {formatMessage({
              id: "hero_title",
              defaultMessage: "Discover Amazing Products",
            })}
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-300">
            {formatMessage({
              id: "hero_subtitle",
              defaultMessage:
                "Find the perfect items for your lifestyle with our curated collection of premium products.",
            })}
          </p>
          <div className="mt-10">
            <Link
              href="/shop"
              className="inline-block rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {formatMessage({
                id: "shop_now",
                defaultMessage: "Shop Now",
              })}
            </Link>
          </div>
        </div>
      </div>

      {/* Featured products section */}
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          {loading ? (
            <Loading />
          ) : (
            products.length !== 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {formatMessage({
                      id: "featured_products",
                      defaultMessage: "Featured Products",
                    })}
                  </h2>
                  <Link
                    href="/shop"
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    {formatMessage({
                      id: "view_all",
                      defaultMessage: "View all",
                    })}
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {products.slice(0, 4).map((product) => (
                    <ProductListItem
                      key={product?._id}
                      product={product}
                      disableBookmark
                    />
                  ))}
                </div>
              </>
            )
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">
              {formatMessage({
                id: "cta_title",
                defaultMessage: "Ready to dive in?",
              })}
            </span>
            <span className="block text-indigo-600">
              {formatMessage({
                id: "cta_subtitle",
                defaultMessage: "Start shopping today.",
              })}
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
              >
                {formatMessage({
                  id: "get_started",
                  defaultMessage: "Get started",
                })}
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                {formatMessage({
                  id: "learn_more",
                  defaultMessage: "Learn more",
                })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
