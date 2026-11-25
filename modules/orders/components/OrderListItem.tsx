import Link from 'next/link';
import { useIntl } from 'react-intl';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import useFormatDateTime from '../../common/utils/useFormatDateTime';
import FormattedPrice from '../../common/components/FormattedPrice';
import OrderStatusBadge from './OrderStatusBadge';

const Cell = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 sm:block">
    <dt className="text-sm text-muted-foreground sm:sr-only">{label}</dt>
    <dd className="text-sm">{children}</dd>
  </div>
);

const OrderListItem = ({ order }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();

  return (
    <Link
      href={`/order/${order?._id}`}
      className="group relative -mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-accent-soft/60 focus-visible:bg-accent-soft/60 sm:pr-10"
    >
      <dl className="grid gap-2 sm:grid-cols-6 sm:items-center sm:gap-x-6 lg:gap-x-8">
        <Cell label={formatMessage({ id: 'order_date', defaultMessage: 'Order date' })}>
          <time dateTime={order?.ordered}>{formatDateTime(order?.ordered, { dateStyle: 'medium' })}</time>
        </Cell>
        <Cell label={formatMessage({ id: 'order_number', defaultMessage: 'Order number' })}>
          <span className="font-medium text-foreground group-hover:text-accent">#{order?.orderNumber}</span>
        </Cell>
        <Cell label={formatMessage({ id: 'total_amount', defaultMessage: 'Total amount' })}>
          <span className="font-semibold">
            <FormattedPrice price={order?.total} />
          </span>
        </Cell>
        <Cell label={formatMessage({ id: 'payment_status', defaultMessage: 'Payment status' })}>
          <OrderStatusBadge status={order?.payment?.status} />
        </Cell>
        <Cell label={formatMessage({ id: 'order_status', defaultMessage: 'Order status' })}>
          <OrderStatusBadge status={order?.status} />
        </Cell>
        <Cell label={formatMessage({ id: 'delivery_status', defaultMessage: 'Delivery status' })}>
          <OrderStatusBadge status={order?.delivery?.status} />
        </Cell>
      </dl>
      <ChevronRightIcon className="absolute right-3 top-1/2 hidden size-5 -translate-y-1/2 text-subtle-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground sm:block" />
    </Link>
  );
};

export default OrderListItem;
