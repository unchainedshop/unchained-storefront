import getConfig from "next/config";
import { useIntl } from "react-intl";

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
      <div className="w-full bg-white px-4 dark:bg-slate-600 sm:px-0">
        <div className="relative w-full" style={{ height: "35vh" }}>
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
            className="mx-auto mb-4 block rounded-lg"
            alt={formatMessage({ id: "hero", defaultMessage: "Hero" })}
            loader={defaultNextImageLoader}
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          products.length !== 0 && (
            <div>
              <div className="mx-auto max-w-full pt-4 sm:pt-12">
                <div className="sm:flex sm:items-baseline sm:justify-between">
                  <h2 className="text-1xl lg:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-slate-100">
                    {formatMessage({
                      id: "featured_products",
                      defaultMessage: "Featured Products",
                    })}
                  </h2>
                </div>
              </div>
              <div className="space-y-12 divide-gray-200 grid grid-cols-2 gap-x-3 lg:grid lg:grid-cols-3 lg:gap-x-5 lg:space-y-0">
                {products.map((product) => (
                  <div
                    key={product?._id}
                    className="group relative rounded-lg sm:p-6"
                  >
                    <ProductListItem product={product} disableBookmark />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Home;
