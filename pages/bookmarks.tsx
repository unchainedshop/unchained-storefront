import { useIntl } from 'react-intl';
import useUser from '../modules/auth/hooks/useUser';
import Loading from '../modules/common/components/Loading';

import MetaTags from '../modules/common/components/MetaTags';
import ProductList from '../modules/products/components/ProductList';
import ListViewWrapper from '../modules/common/components/ListViewWrapper';

const Bookmarks = () => {
  const { formatMessage } = useIntl();
  const { user, loading } = useUser();
  const bookmarkedProducts = user?.bookmarks?.map((b) => b.product);

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'bookmarks', defaultMessage: 'Bookmarks' })}
      />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <ListViewWrapper>
          {(viewMode) => (
            <div className="container mx-auto py-8" key={viewMode}>
              <div className="mb-8">
                <h1 className="text-3xl tracking-tight text-slate-900 dark:text-white">
                  {formatMessage({
                    id: 'bookmarks_title',
                    defaultMessage: 'Bookmarks',
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
                  viewMode={viewMode}
                />
              )}
            </div>
          )}
        </ListViewWrapper>
      </div>
    </>
  );
};

export default Bookmarks;
