import { useIntl } from 'react-intl';
import { XMarkIcon } from '@heroicons/react/20/solid';
import FormattedPrice from '../../common/components/FormattedPrice';
import useRemoveCartDiscount from '../../orders/hooks/useRemoveCartDiscount';

const Row = ({ label, price, negative = false, strong = false, note = null }) => (
  <div
    className={`flex items-center justify-between ${
      strong ? 'text-base font-semibold text-foreground' : 'text-sm text-muted-foreground'
    }`}
  >
    <dt>
      {label}
      {note && <span className="block text-xs text-subtle-foreground">{note}</span>}
    </dt>
    <dd className={negative ? 'text-success' : strong ? '' : 'text-foreground'}>
      {negative && '−'}
      <FormattedPrice price={negative ? { ...price, amount: Math.abs(price.amount) } : price} />
    </dd>
  </div>
);

const CartSummary = ({ cart, detailed = false }) => {
  const { formatMessage } = useIntl();
  const { removeCartDiscount } = useRemoveCartDiscount();
  if (!cart) return null;
  const hasAmount = (price) => Boolean(price?.amount);
  // Item-level discounts are already in the item prices; the order then has no DISCOUNTS total.
  const discountsIncludedInItems = Boolean(cart.discounts?.length) && !hasAmount(cart.discountsTotal);

  return (
    <dl className="space-y-2.5">
      <Row
        label={formatMessage({ id: 'subtotal', defaultMessage: 'Subtotal' })}
        price={cart.itemsTotal}
      />
      {cart.discounts?.map((discount) => (
        <Row
          key={discount._id}
          label={
            <span className="inline-flex items-center gap-1.5">
              {formatMessage({ id: 'discount', defaultMessage: 'Discount' })}
              <span className="badge gap-0.5 py-0 pr-1 font-mono">
                {discount.code}
                <button
                  type="button"
                  onClick={() => removeCartDiscount({ discountId: discount._id })}
                  className="rounded-full p-0.5 hover:bg-muted-strong hover:text-danger"
                  aria-label={formatMessage(
                    { id: 'remove_discount', defaultMessage: 'Remove discount code {code}' },
                    { code: discount.code },
                  )}
                >
                  <XMarkIcon className="size-3" />
                </button>
              </span>
            </span>
          }
          price={discount.total}
          negative
          note={
            discountsIncludedInItems
              ? formatMessage({ id: 'discount_included_in_items', defaultMessage: 'Included in item prices' })
              : null
          }
        />
      ))}
      {detailed && hasAmount(cart.deliveryTotal) && (
        <Row
          label={formatMessage({ id: 'delivery', defaultMessage: 'Delivery' })}
          price={cart.deliveryTotal}
        />
      )}
      {detailed && hasAmount(cart.paymentTotal) && (
        <Row
          label={formatMessage({ id: 'payment_fees', defaultMessage: 'Payment fees' })}
          price={cart.paymentTotal}
        />
      )}
      {detailed ? (
        <>
          <div className="border-t border-border pt-3">
            <Row
              label={formatMessage({ id: 'total', defaultMessage: 'Total' })}
              price={cart.grandTotal}
              strong
            />
          </div>
          {cart.taxesTotal?.amount > 0 && (
            <p className="text-right text-xs text-subtle-foreground">
              {formatMessage({ id: 'tax_included', defaultMessage: 'incl. Tax' })}{' '}
              <FormattedPrice price={cart.taxesTotal} />
            </p>
          )}
        </>
      ) : (
        <p className="text-xs text-subtle-foreground">
          {formatMessage({
            id: 'shipping_calculated_at_checkout',
            defaultMessage: 'Shipping and taxes are calculated at checkout.',
          })}
        </p>
      )}
    </dl>
  );
};

export default CartSummary;
