import { CheckCircleIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import useFormatDateTime from '../../common/utils/useFormatDateTime';
import FormattedPrice from '../../common/components/FormattedPrice';

const OrderListItem = ({ order }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();

  const orderStatus = {
    OPEN: {
      text: formatMessage({ id: 'ordered', defaultMessage: 'Ordered' }),
      date: 'ordered',
    },
    PENDING: {
      text: formatMessage({ id: 'pending', defaultMessage: 'Pending' }),
    },
    CONFIRMED: {
      text: formatMessage({ id: 'confirmed', defaultMessage: 'Confirmed' }),
      date: 'confirmed',
    },
    FULLFILLED: {
      text: formatMessage({ id: 'fulfilled', defaultMessage: 'FulFilled' }),
      icon: (
        <CheckCircleIcon
          className="h-5 w-5 text-green-500"
          aria-hidden="true"
        />
      ),
      date: 'fullfilled',
    },
  };

  return (
    <Link href={`/order/${order?._id}`} className="w-full">
      <div className="w-full py-6 px-2 hover:bg-slate-400 hover:text-white sm:grid sm:grid-cols-6 sm:gap-x-6 lg:gap-x-8">
        <div className="flex justify-between sm:block">
          <dt className="font-medium text-slate-900 dark:text-slate-100 sm:hidden">
            {formatMessage({
              id: 'order_date',
              defaultMessage: 'Order date',
            })}
          </dt>
          <dd className="sm:mt-1">
            <time dateTime={order.datetime}>
              {formatDateTime(order?.ordered)}
            </time>
          </dd>
        </div>
        <div className="flex justify-between pt-6 sm:block sm:pt-0">
          <dt className="font-medium text-slate-900 dark:text-slate-100 sm:hidden">
            {formatMessage({
              id: 'order_number',
              defaultMessage: 'Order number',
            })}
          </dt>
          <dd className="sm:mt-1">{order?.orderNumber}</dd>
        </div>
        <div className="flex justify-between pt-6 sm:block sm:pt-0">
          <dt className="font-medium text-slate-900 dark:text-slate-100 sm:hidden">
            {formatMessage({
              id: 'total_amount',
              defaultMessage: 'Total amount',
            })}
          </dt>
          <dd className="sm:mt-1">
            <FormattedPrice price={order.total} />
          </dd>
        </div>
        <div className="flex justify-between pt-6 sm:block sm:pt-0">
          <dt className="font-medium text-slate-900 dark:text-slate-100 sm:hidden">
            {formatMessage({
              id: 'payment_status',
              defaultMessage: 'Payment status',
            })}
          </dt>
          <dd className="sm:mt-1">{order?.payment?.status}</dd>
        </div>
        <div className="flex items-center justify-between pt-6 sm:pt-0">
          <dt className="font-medium text-slate-900 dark:text-slate-100 sm:hidden">
            {formatMessage({
              id: 'status',
              defaultMessage: 'Status',
            })}
          </dt>
          <dd className="uppercase sm:mt-1">
            <div className="flex items-center gap-x-2">
              {orderStatus[order?.status]?.icon &&
                orderStatus[order?.status].icon}
              {orderStatus[order?.status]?.text}
              {orderStatus[order?.status]?.date && (
                <>
                  {formatMessage({
                    id: 'on',
                    defaultMessage: ' on ',
                  })}
                  <time dateTime={order.datetime}>
                    {formatDateTime(order[orderStatus[order?.status].date])}
                  </time>
                </>
              )}
            </div>
          </dd>
        </div>
        <div className="flex justify-between pt-6 sm:block sm:pt-0">
          <dt className="font-medium text-slate-900 dark:text-slate-100 sm:hidden">
            {formatMessage({
              id: 'delivery_status',
              defaultMessage: 'Delivery status',
            })}
          </dt>
          <dd className="sm:mt-1">{order?.delivery?.status}</dd>
        </div>
      </div>
    </Link>
  );
};

export default OrderListItem;
