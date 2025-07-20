import { useIntl } from 'react-intl';

import usePaymentStatusTypes from '../orders/hooks/usePaymentStatusTypes';
import usePaymentProviderTypes from '../orders/hooks/usePaymentProviderTypes';
import useFormatDateTime from '../common/utils/useFormatDateTime';
import { getInterfaceLabel } from '../common/utils/utils';
import FormattedPrice from '../common/components/FormattedPrice';
import StatusInformation from '../common/components/StatusInformation';

const OrderDetailPayment = ({ order }) => {
  const { paymentProviderType } = usePaymentProviderTypes();
  const { paymentStatusTypes } = usePaymentStatusTypes();
  const { formatDateTime } = useFormatDateTime();
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="py-4 text-lg font-medium text-slate-900 dark:text-slate-200">
          {formatMessage({
            id: 'paid',
            defaultMessage: 'Paid',
          })}
        </h2>
        <span className="mr-2 block rounded-full py-1 text-xs font-semibold leading-5">
          <FormattedPrice price={order.payment.fee} />
        </span>
        <span className="font-medium">
          {formatDateTime(order.payment.paid, {
            timeStyle: 'short',
            dateStyle: 'medium',
          })}
        </span>
      </div>

      <div className="border-t border-slate-50 dark:border-0 px-4 py-4 sm:px-6">
        <span className="mb-5  block">
          <span className="font-medium text-slate-600 dark:text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
            {getInterfaceLabel(order.payment?.provider?.interface)}
          </span>
        </span>
        <div className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-200">
          {formatMessage({
            id: 'method',
            defaultMessage: 'Method',
          })}
        </div>
        <span className="c mr-2 block rounded-full py-1 text-xs font-semibold leading-5">
          {paymentProviderType.map((type) => (
            <StatusInformation
              key={type.value}
              enumType={type.value}
              currentType={order.payment?.provider?.type}
              label={type.label}
            />
          ))}
        </span>
        <div className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-200 print:hidden">
          {formatMessage({
            id: 'payment_status',
            defaultMessage: 'Status',
          })}
        </div>
        <span className="mr-2 block rounded-full py-1 text-xs font-semibold leading-5 print:hidden">
          {paymentStatusTypes.map((type) => (
            <StatusInformation
              key={type.value}
              enumType={type.value}
              currentType={order.payment?.status}
              label={type.label}
            />
          ))}
        </span>
      </div>
    </div>
  );
};

export default OrderDetailPayment;
