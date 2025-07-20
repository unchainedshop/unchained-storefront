import { useRouter } from 'next/router';
import { Fragment } from 'react';

import useAssortmentProducts from '../../modules/assortment/hooks/useAssortmentProducts';
import ProductList from '../../modules/products/components/ProductList';
import MetaTags from '../../modules/common/components/MetaTags';
import getMediaUrl from '../../modules/common/utils/getMediaUrl';
import Loading from '../../modules/common/components/Loading';
import ListViewWrapper from '../../modules/common/components/ListViewWrapper';

const CategoryDetail = () => {
  const router = useRouter();
  const { slug: slugs } = router.query;
  const slug = slugs?.length ? slugs[(slugs?.length || 0) - 1] : '';

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
        <ListViewWrapper title={texts?.title} subtitle={texts?.subtitle}>
          {(viewMode) => (
            <Fragment>
              <div className="mb-6 flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  {filteredProducts} products
                </div>
              </div>
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
            </Fragment>
          )}
        </ListViewWrapper>
      </div>
    </>
  );
};

export default CategoryDetail;
