import Link from 'next/link';
import { useIntl } from 'react-intl';
import SearchField from '../../common/components/SearchField';
import OrderListItem from './OrderListItem';

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
          <div className="flex flex-col items-center rounded-xl border border-dashed border-input px-6 py-16 text-center">
            <p className="font-semibold">
              {queryString
                ? formatMessage({ id: 'no_orders_match', defaultMessage: 'No orders match your search.' })
                : formatMessage({ id: 'no_orders_yet', defaultMessage: "You haven't placed any orders yet." })}
            </p>
            <Link href="/shop" className="btn btn-primary mt-6">
              {formatMessage({ id: 'continue_shopping', defaultMessage: 'Continue Shopping' })}
            </Link>
          </div>
        ) : (
        <div className="card mt-4 p-5 sm:mt-0 sm:p-6">
          <h2 className="sr-only">
            {formatMessage({
              id: 'recent_orders',
              defaultMessage: 'Recent orders',
            })}
          </h2>

          <dl className="divide-y divide-border text-base text-muted-foreground sm:grid sm:space-y-0 lg:flex-none">
            <div className="hidden sm:block sm:pb-6">
              <div className="flex-auto sm:grid sm:grid-cols-6 sm:gap-x-6 lg:gap-x-8">
                <div className="flex justify-between sm:block">
                  <dt className="font-medium text-foreground">
                    {formatMessage({
                      id: 'order_date',
                      defaultMessage: 'Order date',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-foreground">
                    {formatMessage({
                      id: 'order_number',
                      defaultMessage: 'Order number',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-foreground">
                    {formatMessage({
                      id: 'total_amount',
                      defaultMessage: 'Total amount',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-foreground">
                    {formatMessage({
                      id: 'payment_status',
                      defaultMessage: 'Payment status',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-foreground">
                    {formatMessage({
                      id: 'order_status',
                      defaultMessage: 'Order status',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-foreground">
                    {formatMessage({
                      id: 'Delivery_status',
                      defaultMessage: 'Delivery status',
                    })}
                  </dt>
                </div>
              </div>
              <div />
            </div>
            {orders.map((order) => (
              <OrderListItem order={order} key={order._id} />
            ))}
          </dl>
        </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
