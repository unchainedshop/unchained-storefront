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
        <div className="container mt-1 p-4">
          <div className="row">
            <div className="col-12">
              <AssortmentBreadcrumbs
                paths={productPath}
                currentAssortment={product?.texts}
              />
            </div>
            <div className="col-md-8" style={{ maxWidth: "50vh" }}>
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
            <div className="col-md-4">
              <h2
                className="mt-md-0 px-2"
                dangerouslySetInnerHTML={{ __html: product?.texts?.title }}
              />
              <div className="p-2">
                <h3 className="my-0">
                  <FormattedPrice price={product?.simulatedPrice} />
                </h3>
                <h4
                  className="mb-3"
                  dangerouslySetInnerHTML={{ __html: product?.texts?.subtitle }}
                />
                <Markdown>{product?.texts?.description}</Markdown>
              </div>
              <AddToCartButton productId={product?._id} {...product} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Detail;
