import Link from 'next/link';
import { useIntl } from 'react-intl';
import { LockClosedIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

import MetaTags from '../modules/common/components/MetaTags';
import useUser from '../modules/auth/hooks/useUser';
import CartItem from '../modules/cart/components/CartItem';
import CartSummary from '../modules/cart/components/CartSummary';
import AddDiscount from '../modules/orders/components/AddDiscount';
import EmptyState from '../modules/common/components/EmptyState';
import PageHeader from '../modules/common/components/PageHeader';

const Cart = () => {
  const { formatMessage } = useIntl();
  const { user, loading } = useUser();
  const cart = user?.cart;
  const items = cart?.items || [];
  const title = formatMessage({ id: 'shopping_cart', defaultMessage: 'Shopping Cart' });

  return (
    <>
      <MetaTags title={title} />
      <PageHeader
        icon={ShoppingBagIcon}
        title={title}
        description={
          items.length
            ? formatMessage(
                { id: 'cart_item_count', defaultMessage: '{count, plural, one {# item} other {# items}}' },
                { count: items.reduce((acc, item) => acc + item.quantity, 0) },
              )
            : null
        }
      />

      {loading ? (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-24" />
            ))}
          </div>
          <div className="skeleton h-64 rounded-xl" />
        </div>
      ) : !items.length ? (
        <EmptyState
          icon={ShoppingBagIcon}
          title={formatMessage({ id: 'cart_empty_title', defaultMessage: 'Your cart is empty' })}
          description={formatMessage({ id: 'cart_empty_text', defaultMessage: 'Find something you love and it will show up here.' })}
        >
          <Link href="/shop" className="btn btn-primary">
            {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
          </Link>
          <Link href="/bookmarks" className="btn btn-secondary">
            {formatMessage({ id: 'view_wishlist', defaultMessage: 'View wishlist' })}
          </Link>
        </EmptyState>
      ) : (
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <CartItem key={item._id} {...item} />
            ))}
          </ul>

          <aside className="card space-y-5 p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">
              {formatMessage({ id: 'order_summary', defaultMessage: 'Order summary' })}
            </h2>
            <AddDiscount orderId={cart._id} />
            <CartSummary cart={cart} detailed />
            <Link href="/checkout" className="btn btn-primary btn-lg w-full">
              <LockClosedIcon className="size-4" />
              {formatMessage({ id: 'to_checkout', defaultMessage: 'Checkout' })}
            </Link>
            <Link href="/shop" className="btn btn-ghost w-full">
              {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
            </Link>
          </aside>
        </div>
      )}
    </>
  );
};

export default Cart;
