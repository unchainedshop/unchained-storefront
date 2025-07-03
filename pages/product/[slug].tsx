/* eslint-disable react/no-danger */
import { useRouter } from "next/router";
import ImageGallery from "react-image-gallery";
import { useIntl } from "react-intl";

import Markdown from "react-markdown";
import useProductDetail from "../../modules/products/hooks/useProductDetail";
import AddToCartButton from "../../modules/cart/components/AddToCartButton";
import MetaTags from "../../modules/common/components/MetaTags";
import getAssortmentPath from "../../modules/assortment/utils/getAssortmentPath";
import AssortmentBreadcrumbs from "../../modules/assortment/components/AssortmentBreadcrumbs";
import getMediaUrl from "../../modules/common/utils/getMediaUrl";
import getMediaUrls from "../../modules/common/utils/getMediaUrls";
import NotFound from "../404";
import Loading from "../../modules/common/components/Loading";
import FormattedPrice from "../../modules/common/components/FormattedPrice";

const Detail = () => {
  const router = useRouter();
  const intl = useIntl();
  const { product, paths, loading } = useProductDetail({
    slug: router.query.slug,
  });

  const productPath = getAssortmentPath(paths);

  if (!product && !loading)
    return (
      <NotFound
        page={intl.formatMessage({
          id: "product",
          defaultMessage: "Product",
        })}
      />
    );
  return (
    <>
      <MetaTags
        title={product?.texts?.title}
        imageUrl={getMediaUrl(product)}
        description={product?.texts?.description}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              {/* Image gallery */}
              <div className="flex flex-col-reverse">
                <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                  <ImageGallery
                    lazyLoad
                    onErrorImageURL="/static/img/sun-glass-placeholder.jpeg"
                    useBrowserFullscreen
                    items={getMediaUrls(product).map((image) => ({
                      original: image,
                      thumbnail: image,
                    }))}
                    showPlayButton={false}
                    showBullets={true}
                    renderThumbInner={(item) => (
                      <div className="aspect-w-1 aspect-h-1 w-full">
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <nav aria-label="Breadcrumb" className="mb-6">
                  <AssortmentBreadcrumbs
                    paths={productPath}
                    currentAssortment={product?.texts}
                  />
                </nav>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {product?.texts?.title}
                </h1>

                <div className="mt-3">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl tracking-tight text-gray-900 dark:text-white">
                    <FormattedPrice price={product?.simulatedPrice} />
                  </p>
                </div>

                {product?.texts?.subtitle && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {product?.texts?.subtitle}
                    </h3>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="sr-only">Description</h3>
                  <div className="prose prose-sm text-gray-700 dark:text-gray-300">
                    <Markdown>{product?.texts?.description}</Markdown>
                  </div>
                </div>

                <div className="mt-10">
                  <AddToCartButton productId={product?._id} {...product} />
                </div>

                {/* Product details */}
                <section aria-labelledby="details-heading" className="mt-12">
                  <h2 id="details-heading" className="sr-only">
                    Additional details
                  </h2>

                  <div className="divide-y divide-gray-200 border-t dark:divide-gray-700 dark:border-gray-700">
                    {/* Add any additional product details here */}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
