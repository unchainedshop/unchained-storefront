import Link from 'next/link';
import { useIntl } from 'react-intl';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useUser from '../../auth/hooks/useUser';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import { useAppContext } from '../../common/components/AppContextWrapper';
import AddDiscount from '../../orders/components/AddDiscount';

const SideCart = ({ isOpen }) => {
  const { user } = useUser();
  const { formatMessage } = useIntl();
  const { toggleCart } = useAppContext();
  const close = () => toggleCart(false);
  const cart = user?.cart;
  const items = cart?.items || [];
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Dialog open={isOpen} onClose={close} className="relative z-1050">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-pop transition duration-300 ease-out data-closed:translate-x-full"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <DialogTitle className="text-base font-semibold">
            {formatMessage({ id: 'in_cart', defaultMessage: 'Cart' })}
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-subtle-foreground">
                {formatMessage(
                  { id: 'cart_item_count', defaultMessage: '{count, plural, one {# item} other {# items}}' },
                  { count: itemCount },
                )}
              </span>
            )}
          </DialogTitle>
          <button
            type="button"
            onClick={close}
            className="btn-icon -mr-2"
            aria-label={formatMessage({ id: 'close', defaultMessage: 'Close' })}
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        {!items.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBagIcon className="size-7 text-subtle-foreground" />
            </span>
            <div>
              <p className="font-semibold">
                {formatMessage({ id: 'cart_empty_title', defaultMessage: 'Your cart is empty' })}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatMessage({
                  id: 'cart_empty_text',
                  defaultMessage: 'Find something you love and it will show up here.',
                })}
              </p>
            </div>
            <Link href="/shop" onClick={close} className="btn btn-primary">
              {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <CartItem key={item._id} {...item} />
                ))}
              </ul>
              <div className="border-t border-border py-4">
                <AddDiscount orderId={cart._id} />
              </div>
            </div>
            <div className="space-y-4 border-t border-border bg-background px-5 py-5">
              <CartSummary cart={cart} />
              <div className="grid gap-2">
                <Link href="/checkout" onClick={close} className="btn btn-primary btn-lg w-full">
                  {formatMessage({ id: 'to_checkout', defaultMessage: 'Checkout' })}
                </Link>
                <Link href="/cart" onClick={close} className="btn btn-ghost w-full">
                  {formatMessage({ id: 'view_cart', defaultMessage: 'View cart' })}
                </Link>
              </div>
            </div>
          </>
        )}
      </DialogPanel>
    </Dialog>
  );
};

export default SideCart;
