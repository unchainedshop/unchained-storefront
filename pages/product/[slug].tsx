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
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <AssortmentBreadcrumbs
              paths={productPath}
              currentAssortment={product?.texts}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="w-full">
              <ImageGallery
                lazyLoad
                onErrorImageURL="/static/img/sun-glass-placeholder.jpeg"
                useBrowserFullscreen
                items={getMediaUrls(product).map((image) => ({
                  original: image,
                  thumbnail: image,
                }))}
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col space-y-6">
              <div>
                <h1
                  className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  dangerouslySetInnerHTML={{ __html: product?.texts?.title }}
                />
                <h2
                  className="text-lg text-gray-600 dark:text-gray-300 mb-4"
                  dangerouslySetInnerHTML={{ __html: product?.texts?.subtitle }}
                />
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  <FormattedPrice price={product?.simulatedPrice} />
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <Markdown>{product?.texts?.description}</Markdown>
              </div>

              <div className="pt-4">
                <AddToCartButton productId={product?._id} {...product} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
