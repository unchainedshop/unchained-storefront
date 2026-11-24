import { useIntl } from 'react-intl';
import FormattedPrice from '../../common/components/FormattedPrice';

const Row = ({ label, price, negative = false, strong = false }) => (
  <div
    className={`flex items-center justify-between ${
      strong ? 'text-base font-semibold text-foreground' : 'text-sm text-muted-foreground'
    }`}
  >
    <dt>{label}</dt>
    <dd className={negative ? 'text-success' : strong ? '' : 'text-foreground'}>
      {negative && '−'}
      <FormattedPrice price={negative ? { ...price, amount: Math.abs(price.amount) } : price} />
    </dd>
  </div>
);

const CartSummary = ({ cart, detailed = false }) => {
  const { formatMessage } = useIntl();
  if (!cart) return null;
  const hasAmount = (price) => Boolean(price?.amount);

  return (
    <dl className="space-y-2.5">
      <Row
        label={formatMessage({ id: 'subtotal', defaultMessage: 'Subtotal' })}
        price={cart.itemsTotal}
      />
      {cart.discounts?.map((discount) => (
        <Row
          key={discount._id}
          label={`${formatMessage({ id: 'discount', defaultMessage: 'Discount' })} · ${discount.code}`}
          price={discount.total}
          negative
        />
      ))}
      {detailed && hasAmount(cart.delivery) && (
        <Row
          label={formatMessage({ id: 'delivery', defaultMessage: 'Delivery' })}
          price={cart.delivery}
        />
      )}
      {detailed && hasAmount(cart.payment) && (
        <Row
          label={formatMessage({ id: 'payment_fees', defaultMessage: 'Payment fees' })}
          price={cart.payment}
        />
      )}
      {detailed ? (
        <>
          <div className="border-t border-border pt-3">
            <Row
              label={formatMessage({ id: 'total', defaultMessage: 'Total' })}
              price={cart.total}
              strong
            />
          </div>
          {hasAmount(cart.taxes) && (
            <p className="text-right text-xs text-subtle-foreground">
              {formatMessage({ id: 'tax_included', defaultMessage: 'incl. Tax' })}{' '}
              <FormattedPrice price={cart.taxes} />
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
