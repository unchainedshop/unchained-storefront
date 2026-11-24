import Link from 'next/link';
import { useIntl } from 'react-intl';
import { HeartIcon } from '@heroicons/react/24/outline';
import useUser from '../modules/auth/hooks/useUser';
import MetaTags from '../modules/common/components/MetaTags';
import ProductList from '../modules/products/components/ProductList';
import ProductGridSkeleton from '../modules/products/components/ProductGridSkeleton';
import ListViewWrapper from '../modules/common/components/ListViewWrapper';

const Bookmarks = () => {
  const { formatMessage } = useIntl();
  const { user, loading } = useUser();
  const products = (user?.bookmarks || []).map((b) => b.product).filter(Boolean);

  return (
    <>
      <MetaTags title={formatMessage({ id: 'bookmarks', defaultMessage: 'Wishlist' })} />
      <ListViewWrapper title={formatMessage({ id: 'bookmarks_title', defaultMessage: 'Wishlist' })}>
        {(viewMode) =>
          loading ? (
            <ProductGridSkeleton count={4} />
          ) : products.length ? (
            <ProductList products={products} totalProducts={products.length} onLoadMore={null} viewMode={viewMode} />
          ) : (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-input px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-muted">
                <HeartIcon className="size-6 text-subtle-foreground" />
              </span>
              <p className="mt-4 font-semibold">
                {formatMessage({ id: 'wishlist_empty_title', defaultMessage: 'Your wishlist is empty' })}
              </p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {formatMessage({
                  id: 'wishlist_empty_text',
                  defaultMessage: 'Tap the heart on any product to save it for later.',
                })}
              </p>
              <Link href="/shop" className="btn btn-primary mt-6">
                {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
              </Link>
            </div>
          )
        }
      </ListViewWrapper>
    </>
  );
};

export default Bookmarks;
