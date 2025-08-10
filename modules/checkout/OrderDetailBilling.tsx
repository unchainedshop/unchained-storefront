import { useIntl } from 'react-intl';
import FormattedPrice from '../common/components/FormattedPrice';

const OrderDetailBilling = ({ order }) => {
  const { formatMessage } = useIntl();

  // Calculate correct total manually as a workaround for backend calculation issue
  const calculateTotal = () => {
    const itemsAmount = order?.itemsTotal?.amount || 0;
    const taxAmount = order?.totalTax?.amount || 0;
    const deliveryAmount = order?.totalDelivery?.amount || 0;
    const paymentAmount = order?.totalPayment?.amount || 0;
    const discountAmount = order?.totalDiscount?.amount || 0;

    const calculatedTotal =
      itemsAmount + taxAmount + deliveryAmount + paymentAmount - discountAmount;

    return {
      amount: calculatedTotal,
      currencyCode:
        order?.total?.currencyCode || order?.itemsTotal?.currencyCode || 'CHF',
    };
  };

  const calculatedTotal = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Billing Address */}
      <div>
        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
          {formatMessage({
            id: 'billing_address',
            defaultMessage: 'Billing Address',
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

      {/* Order Total */}
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
                {formatMessage({
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
