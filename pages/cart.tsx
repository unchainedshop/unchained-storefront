import { useIntl } from 'react-intl';
import Link from 'next/link';

import MetaTags from '../modules/common/components/MetaTags';
import SideCart from '../modules/cart/components/SideCart';

const Cart = () => {
  const { formatMessage } = useIntl();

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'cart', defaultMessage: 'Shopping Cart' })}
      />
      <div className="min-h-screen bg-surface">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {formatMessage({
                id: 'shopping_cart',
                defaultMessage: 'Shopping Cart',
              })}
            </h1>
          </div>

          {/* Cart content will be implemented using existing cart components */}
          <div className="text-center">
            <p className="mb-6 text-muted-foreground">
              {formatMessage({
                id: 'cart_page_note',
                defaultMessage:
                  'Cart functionality is available in the side panel. Click the cart icon in the header to view your items.',
              })}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
            >
              {formatMessage({
                id: 'continue_shopping',
                defaultMessage: 'Continue Shopping',
              })}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
