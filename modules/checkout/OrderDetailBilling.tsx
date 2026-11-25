import { useIntl } from 'react-intl';
import FormattedPrice from '../common/components/FormattedPrice';

const OrderDetailBilling = ({ order }) => {
  const { formatMessage } = useIntl();

  const currencyCode =
    order?.total?.currencyCode || order?.itemsTotal?.currencyCode || 'CHF';

  // The engine's order.total is the authoritative grand total and is correct
  // for both net (tax added on top) and gross (tax-inclusive) pricing. Only
  // fall back to a manual sum if it is somehow unavailable.
  const calculatedTotal =
    order?.total?.amount != null
      ? { amount: order.total.amount, currencyCode }
      : {
          amount:
            (order?.itemsTotal?.amount || 0) +
            (order?.totalTax?.amount || 0) +
            (order?.totalDelivery?.amount || 0) +
            (order?.totalPayment?.amount || 0) -
            (order?.totalDiscount?.amount || 0),
          currencyCode,
        };

  // Tax is "included" (gross pricing) when the item/fee/discount lines already
  // sum to the grand total; otherwise it is added on top (net pricing). This
  // keeps the breakdown internally consistent for both models.
  const taxIncluded =
    order?.total?.amount != null &&
    (order?.itemsTotal?.amount || 0) +
      (order?.totalDelivery?.amount || 0) +
      (order?.totalPayment?.amount || 0) -
      (order?.totalDiscount?.amount || 0) ===
      order.total.amount;

  const Row = ({ label, price, negative = false }) => (
    <div className="flex justify-between text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={negative ? 'font-medium text-success' : 'font-medium'}>
        {negative && '−'}
        <FormattedPrice price={price} />
      </dd>
    </div>
  );

  return (
    <dl className="space-y-2.5">
      <Row label={formatMessage({ id: 'subtotal', defaultMessage: 'Subtotal' })} price={order?.itemsTotal} />
      {order?.totalDelivery?.amount > 0 && (
        <Row label={formatMessage({ id: 'shipping', defaultMessage: 'Shipping' })} price={order.totalDelivery} />
      )}
      {order?.totalPayment?.amount > 0 && (
        <Row label={formatMessage({ id: 'payment_fees', defaultMessage: 'Payment fees' })} price={order.totalPayment} />
      )}
      {order?.totalDiscount?.amount ? (
        <Row
          label={formatMessage({ id: 'discount', defaultMessage: 'Discount' })}
          price={{ ...order.totalDiscount, amount: Math.abs(order.totalDiscount.amount) }}
          negative
        />
      ) : null}
      {order?.totalTax?.amount > 0 && !taxIncluded && (
        <Row label={formatMessage({ id: 'tax', defaultMessage: 'Tax' })} price={order.totalTax} />
      )}
      <div className="flex items-baseline justify-between border-t border-border pt-3">
        <dt className="font-semibold">{formatMessage({ id: 'total', defaultMessage: 'Total' })}</dt>
        <dd className="text-xl font-bold">
          <FormattedPrice price={calculatedTotal} />
        </dd>
      </div>
      {order?.totalTax?.amount > 0 && taxIncluded && (
        <p className="text-right text-xs text-subtle-foreground">
          {formatMessage({ id: 'tax_included', defaultMessage: 'incl. Tax' })}{' '}
          <FormattedPrice price={order.totalTax} />
        </p>
      )}
    </dl>
  );
};

export default OrderDetailBilling;
