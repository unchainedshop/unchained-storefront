import { useRouter } from "next/router";
import { useState } from "react";
import { Squares2X2Icon, Bars3Icon } from "@heroicons/react/24/outline";

import useAssortmentProducts from "../../modules/assortment/hooks/useAssortmentProducts";
import ProductList from "../../modules/products/components/ProductList";
import MetaTags from "../../modules/common/components/MetaTags";
import getMediaUrl from "../../modules/common/utils/getMediaUrl";
import Loading from "../../modules/common/components/Loading";

const CategoryDetail = () => {
  const router = useRouter();
  const { slug: slugs } = router.query;
  const slug = slugs?.length ? slugs[(slugs?.length || 0) - 1] : "";
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const {
    assortment: { texts, media } = {},
    products,
    loadMore,
    filteredProducts,
    loading: productsLoading,
  } = useAssortmentProducts({
    slugs: slug,
    includeLeaves: true,
  });

  return (
    <>
      <MetaTags
        title={texts?.title}
        description={texts?.description}
        imageUrl={getMediaUrl({ media })}
      />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">
              {texts?.title}
            </h1>
            {texts?.subtitle && (
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {texts?.subtitle}
              </p>
            )}
          </div>

          {/* View Toggle */}
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              {filteredProducts} products
            </div>
            <div className="flex rounded-lg border border-slate-300 dark:border-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                <Bars3Icon className="h-4 w-4 " />
              </button>
            </div>
          </div>

          {/* Products */}
          {productsLoading ? (
            <Loading />
          ) : (
            <ProductList
              onLoadMore={loadMore}
              totalProducts={filteredProducts}
              products={products}
              viewMode={viewMode}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryDetail;
