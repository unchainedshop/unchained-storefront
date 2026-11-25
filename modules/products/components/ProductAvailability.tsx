import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { TruckIcon } from '@heroicons/react/24/outline';
import useFormatDateTime from '../../common/utils/useFormatDateTime';
import getProductAvailability from '../utils/getProductAvailability';

const ProductAvailability = ({ product }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();
  const { status, quantity, earliestDelivery } = getProductAvailability(product || {});
  if (!status && !earliestDelivery) return null;

  const statusText = {
    IN_STOCK: formatMessage({ id: 'availability_in_stock', defaultMessage: 'In stock' }),
    LOW_STOCK: formatMessage({ id: 'availability_low_stock', defaultMessage: 'Only {quantity} left' }, { quantity }),
    OUT_OF_STOCK: formatMessage({ id: 'availability_out_of_stock', defaultMessage: 'Out of stock' }),
  }[status];

  return (
    <div className="space-y-1.5 text-sm">
      {status && (
        <p
          className={classNames('flex items-center gap-2 font-medium', {
            'text-success': status === 'IN_STOCK',
            'text-warning': status === 'LOW_STOCK',
            'text-danger': status === 'OUT_OF_STOCK',
          })}
        >
          <span className="size-2 rounded-full bg-current" />
          {statusText}
        </p>
      )}
      {earliestDelivery && status !== 'OUT_OF_STOCK' && (
        <p className="flex items-center gap-2 text-muted-foreground">
          <TruckIcon className="size-4" />
          {formatMessage(
            { id: 'availability_delivery_by', defaultMessage: 'Arrives by {date}' },
            { date: formatDateTime(earliestDelivery, { weekday: 'long', day: 'numeric', month: 'long' }) },
          )}
        </p>
      )}
    </div>
  );
};

export default ProductAvailability;
