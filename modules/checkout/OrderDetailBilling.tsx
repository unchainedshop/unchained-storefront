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

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
          {formatMessage({
            id: 'billing_address',
            defaultMessage: 'Billing address',
          })}
        </h4>
        <div className="text-sm text-slate-900 dark:text-white space-y-1">
          <div className="font-medium">
            {order?.billingAddress?.firstName} {order?.billingAddress?.lastName}
          </div>
          <div>{order?.billingAddress?.addressLine}</div>
          <div>
            {order?.billingAddress?.postalCode} {order?.billingAddress?.city}
          </div>
          <div className="flex items-center gap-2">
            <span>{order?.country?.flagEmoji}</span>
            <span>{order?.country?.name}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-0 pt-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              {formatMessage({
                id: 'subtotal',
                defaultMessage: 'Subtotal',
              })}
            </span>
            <span className="text-slate-900 dark:text-white font-medium">
              <FormattedPrice price={order?.itemsTotal} />
            </span>
          </div>

          {order?.totalDelivery && order?.totalDelivery?.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Shipping
              </span>
              <span className="text-slate-900 dark:text-white font-medium">
                <FormattedPrice price={order?.totalDelivery} />
              </span>
            </div>
          )}

          {order?.totalTax && order?.totalTax?.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                {taxIncluded
                  ? formatMessage({
                      id: 'tax_included',
                      defaultMessage: 'incl. Tax',
                    })
                  : formatMessage({
                      id: 'tax',
                      defaultMessage: 'Tax',
                    })}
              </span>
              <span className="text-slate-900 dark:text-white font-medium">
                <FormattedPrice price={order?.totalTax} />
              </span>
            </div>
          )}

          {order?.totalPayment && order?.totalPayment?.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Fees</span>
              <span className="text-slate-900 dark:text-white font-medium">
                <FormattedPrice price={order?.totalPayment} />
              </span>
            </div>
          )}

          {order?.totalDiscount && order?.totalDiscount?.amount > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Discount
              </span>
              <span className="text-slate-900 dark:text-white font-medium">
                -<FormattedPrice price={order?.totalDiscount} />
              </span>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-0 pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-900 dark:text-white">
                {formatMessage({
                  id: 'total',
                  defaultMessage: 'Total',
                })}
              </span>
              <span className="font-semibold text-xl text-slate-900 dark:text-white">
                <FormattedPrice price={calculatedTotal} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailBilling;
