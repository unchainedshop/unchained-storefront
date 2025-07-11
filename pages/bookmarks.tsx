import { useIntl } from "react-intl";
import useUser from "../modules/auth/hooks/useUser";
import Loading from "../modules/common/components/Loading";

import MetaTags from "../modules/common/components/MetaTags";
import ProductList from "../modules/products/components/ProductList";

const Bookmarks = () => {
  const { formatMessage } = useIntl();
  const { user, loading } = useUser();
  const bookmarkedProducts = user?.bookmarks?.map((b) => b.product);

  return (
    <>
      <MetaTags
        title={formatMessage({ id: "bookmarks", defaultMessage: "Bookmarks" })}
      />
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-light tracking-tight text-gray-900 dark:text-white">
              {formatMessage({
                id: "bookmarks_title",
                defaultMessage: "Bookmarks",
              })}
            </h1>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <ProductList
              onLoadMore={undefined}
              totalProducts={bookmarkedProducts?.length || 0}
              products={bookmarkedProducts || []}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Bookmarks;
