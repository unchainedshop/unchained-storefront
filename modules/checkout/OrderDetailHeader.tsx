import { useIntl } from 'react-intl';
import Badge from '../common/components/Badge';
import useFormatDateTime from '../common/utils/useFormatDateTime';

import { normalizeCurrencyISOCode } from '../common/utils/utils';
import DetailHeader from './DetailHeader';

const OrderDetailHeader = ({ order }) => {
  const { formatMessage, locale } = useIntl();
  const { formatDateTime } = useFormatDateTime();

  return (
    <div className="space-y-4">
      {/* Order Number */}
      <div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
          {formatMessage({
            id: 'order_number_label',
            defaultMessage: 'Order Number',
          })}
        </div>
        <div className="text-xl font-semibold text-slate-900 dark:text-white">
          {order?.orderNumber || 'N/A'}
        </div>
      </div>

      {/* Customer Details */}
      <div className="pt-4 border-t border-slate-200 dark:border-0">
        <DetailHeader user={order?.user} contact={order?.contact} />
      </div>

      {/* Order Date & Currency */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-0">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            {formatMessage({
              id: 'order_date_label',
              defaultMessage: 'Order Date',
            })}
          </div>
          <div className="text-sm text-slate-900 dark:text-white">
            {order?.ordered ? formatDateTime(order.ordered) : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            {formatMessage({
              id: 'currency_label',
              defaultMessage: 'Currency',
            })}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-900 dark:text-white">
            <span>{order?.country?.flagEmoji}</span>
            <span>{order?.currency?.isoCode || 'CHF'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailHeader;
