import ErrorMessage from '../common/components/ErrorMessage';
import CheckoutContact from './CheckoutContact';
import CheckoutBillingAddress from './CheckoutBillingAddress';
import CheckoutPaymentMethod from './CheckoutPaymentMethod';
import { useAppContext } from '../common/components/AppContextWrapper';
import FormattedPrice from '../common/components/FormattedPrice';
import { useIntl } from 'react-intl';
import useCart from '../orders/hooks/useCart';
import AddDiscount from '../orders/components/AddDiscount';
import CartSummary from '../cart/components/CartSummary';
import useUpdateCartDelivery from '../cart/hooks/useUpdateCartDelivery';
import useUpdateCartDeliveryPickUp from '../orders/hooks/useUpdateCartDeliveryPickUp';
import CheckoutDeliverySelector from './CheckoutDeliverySelector';
import Loading from '../common/components/Loading';
import useUpdateCartDeliveryShipping from '../orders/hooks/useUpdateCartDeliveryShipping';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CheckoutStep from './CheckoutStep';

const Checkout = () => {
  const { emailSupportDisabled } = useAppContext();
  const { formatMessage } = useIntl();
  const { error, cart } = useCart();
  const { query } = useRouter();
  const orderTransactionIdFromQuery = query?.transactionId as
    | string
    | undefined;

  const { updateCartDelivery } = useUpdateCartDelivery();
  const { updateCartDeliveryPickUp } = useUpdateCartDeliveryPickUp();
  const { updateCartDeliveryShipping } = useUpdateCartDeliveryShipping();
  if (error) return <ErrorMessage message="Error loading cart" />;
  if (!cart) return <Loading />;

  const isContactDataMissing =
    !cart.contact?.emailAddress && !emailSupportDisabled;
  const isDeliverySet =
    cart?.delivery?.activePickUpLocation || cart?.delivery?.address;
  const isAddressesMissing = !cart?.billingAddress?.firstName || !isDeliverySet;

  if (!cart.items?.length && !orderTransactionIdFromQuery)
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-input px-6 py-20 text-center">
        <p className="text-lg font-semibold">
          {formatMessage({ id: 'cart_empty_title', defaultMessage: 'Your cart is empty' })}
        </p>
        <p className="mt-1 text-muted-foreground">
          {formatMessage({
            id: 'checkout_empty_text',
            defaultMessage: 'Add a few products before checking out.',
          })}
        </p>
        <Link href="/shop" className="btn btn-primary mt-6">
          {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
        </Link>
      </div>
    );

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-4">
        {!orderTransactionIdFromQuery && (
          <CheckoutStep
            number={1}
            done={Boolean(isDeliverySet)}
            title={formatMessage({ id: 'delivery', defaultMessage: 'Delivery' })}
          >
            <CheckoutDeliverySelector
              providers={cart.supportedDeliveryProviders}
              currentDelivery={cart.delivery}
              currencyCode={cart.itemsTotal?.currencyCode}
              onSelectProvider={(providerId) =>
                updateCartDelivery({ deliveryProviderId: providerId })
              }
              onSelectLocation={async (providerId, locationId) =>
                await updateCartDeliveryPickUp({
                  orderPickUpLocationId: locationId,
                  deliveryProviderId: providerId,
                })
              }
              onUpdateAddress={async (providerId, address) => {
                await updateCartDeliveryShipping({
                  deliveryProviderId: providerId,
                  address,
                });
              }}
            />
          </CheckoutStep>
        )}
        {isDeliverySet && !orderTransactionIdFromQuery && (
          <CheckoutStep number={2} done={!isAddressesMissing}>
            <CheckoutBillingAddress cart={cart} isInitial={isAddressesMissing} />
          </CheckoutStep>
        )}
        {!isAddressesMissing && !orderTransactionIdFromQuery && (
          <CheckoutStep number={3} done={!isContactDataMissing}>
            <CheckoutContact cart={cart} isInitial={isContactDataMissing} />
          </CheckoutStep>
        )}
        {!isAddressesMissing && !isContactDataMissing && (
          <CheckoutStep
            number={orderTransactionIdFromQuery ? 1 : 4}
            title={formatMessage({ id: 'payment-method', defaultMessage: 'Payment method' })}
          >
            <CheckoutPaymentMethod
              cart={cart}
              disabled={isContactDataMissing}
              hideOptions={!!orderTransactionIdFromQuery}
            />
          </CheckoutStep>
        )}
      </div>

      <aside className="card p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">
          {formatMessage({ id: 'order_summary', defaultMessage: 'Order Summary' })}
        </h2>
        <ul className="mt-4 divide-y divide-border">
          {cart.items.map((item) => (
            <li key={item._id} className="flex gap-3 py-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.product.media?.[0]?.file?.url && (
                  <img
                    src={item.product.media[0].file.url}
                    alt=""
                    className="size-full object-cover"
                  />
                )}
                <span className="absolute -right-0 -top-0 flex size-5 items-center justify-center rounded-bl-lg bg-primary text-[0.6875rem] font-semibold text-primary-foreground">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.product.texts?.title}</p>
                {item.product.texts?.subtitle && (
                  <p className="truncate text-xs text-subtle-foreground">{item.product.texts.subtitle}</p>
                )}
              </div>
              <p className="text-sm font-medium">
                <FormattedPrice price={item.total} />
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-2 border-t border-border pt-4">
          <AddDiscount orderId={cart._id} />
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <CartSummary cart={cart} detailed />
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
