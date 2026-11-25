import Link from 'next/link';
import { useIntl } from 'react-intl';
import { HeartIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import useAddMultipleCartProducts from '../modules/cart/hooks/useAddMultipleCartProducts';
import { useAppContext } from '../modules/common/components/AppContextWrapper';
import useUser from '../modules/auth/hooks/useUser';
import MetaTags from '../modules/common/components/MetaTags';
import ProductList from '../modules/products/components/ProductList';
import ProductGridSkeleton from '../modules/products/components/ProductGridSkeleton';
import ListViewWrapper from '../modules/common/components/ListViewWrapper';
import EmptyState from '../modules/common/components/EmptyState';

const Bookmarks = () => {
  const { formatMessage } = useIntl();
  const { user, loading } = useUser();
  const products = (user?.bookmarks || []).map((b) => b.product).filter(Boolean);
  const { addMultipleCartProducts, loading: adding } = useAddMultipleCartProducts();
  const { toggleCart } = useAppContext();

  const addAllToCart = async () => {
    await addMultipleCartProducts(products.map((product) => ({ productId: product._id })));
    toggleCart(true);
  };

  return (
    <>
      <MetaTags title={formatMessage({ id: 'bookmarks', defaultMessage: 'Wishlist' })} />
      <ListViewWrapper
        title={formatMessage({ id: 'bookmarks_title', defaultMessage: 'Wishlist' })}
        actions={
          products.length > 1 && (
            <button type="button" disabled={adding} onClick={addAllToCart} className="btn btn-primary btn-sm">
              <ShoppingBagIcon className="size-4" />
              {formatMessage({ id: 'add_all_to_cart', defaultMessage: 'Add all to cart' })}
            </button>
          )
        }
      >
        {(viewMode) =>
          loading ? (
            <ProductGridSkeleton count={4} />
          ) : products.length ? (
            <ProductList products={products} totalProducts={products.length} onLoadMore={null} viewMode={viewMode} />
          ) : (
            <EmptyState
              icon={HeartIcon}
              title={formatMessage({ id: 'wishlist_empty_title', defaultMessage: 'Your wishlist is empty' })}
              description={formatMessage({
                id: 'wishlist_empty_text',
                defaultMessage: 'Tap the heart on any product to save it for later.',
              })}
            >
              <Link href="/shop" className="btn btn-primary">
                {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
              </Link>
            </EmptyState>
          )
        }
      </ListViewWrapper>
    </>
  );
};

export default Bookmarks;
