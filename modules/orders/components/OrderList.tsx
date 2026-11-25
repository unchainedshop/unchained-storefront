import Link from 'next/link';
import { useIntl } from 'react-intl';
import SearchField from '../../common/components/SearchField';
import OrderListItem from './OrderListItem';
import EmptyState from '../../common/components/EmptyState';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const OrderList = ({ orders, queryString, setQueryString }) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div>
        <p className="-mt-4 mb-6 text-sm text-muted-foreground">
          {formatMessage({
            id: 'manage_orders',
            defaultMessage:
              'Check the status of recent orders, manage returns, and download invoices.',
          })}
        </p>

        <div className="mb-6 max-w-sm">
          <SearchField
            defaultValue={queryString}
            onInputChange={setQueryString}
          />
        </div>

        {!orders?.length ? (
          <EmptyState
            icon={ShoppingBagIcon}
            title={
              queryString
                ? formatMessage({ id: 'no_orders_match', defaultMessage: 'No orders match your search.' })
                : formatMessage({ id: 'no_orders_yet', defaultMessage: "You haven't placed any orders yet." })
            }
            description={formatMessage({ id: 'orders_empty_text', defaultMessage: 'Your orders and their status will show up here.' })}
          >
            <Link href="/shop" className="btn btn-primary">
              {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
            </Link>
          </EmptyState>
        ) : (
        <div className="card mt-4 p-5 sm:mt-0 sm:p-6">
          <h2 className="sr-only">
            {formatMessage({
              id: 'recent_orders',
              defaultMessage: 'Recent orders',
            })}
          </h2>

          <div
            aria-hidden
            className="hidden border-b border-border pb-3 text-xs font-semibold uppercase tracking-wider text-subtle-foreground sm:grid sm:grid-cols-6 sm:gap-x-6 sm:pr-7 lg:gap-x-8"
          >
            <span>{formatMessage({ id: 'order_date', defaultMessage: 'Order date' })}</span>
            <span>{formatMessage({ id: 'order_number', defaultMessage: 'Order number' })}</span>
            <span>{formatMessage({ id: 'total_amount', defaultMessage: 'Total amount' })}</span>
            <span>{formatMessage({ id: 'payment_status', defaultMessage: 'Payment status' })}</span>
            <span>{formatMessage({ id: 'order_status', defaultMessage: 'Order status' })}</span>
            <span>{formatMessage({ id: 'delivery_status', defaultMessage: 'Delivery status' })}</span>
          </div>
          <div className="mt-2 space-y-1">
            {orders.map((order) => (
              <OrderListItem order={order} key={order._id} />
            ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
