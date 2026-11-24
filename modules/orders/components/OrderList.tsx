import { useIntl } from 'react-intl';
import SearchField from '../../common/components/SearchField';
import OrderListItem from './OrderListItem';

const OrderList = ({ orders, queryString, setQueryString }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="bg-surface">
      <div className="mx-4 max-w-full px-4 pt-16 sm:px-6 lg:px-8">
        <div className="max-w-full">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {formatMessage({
              id: 'order_history',
              defaultMessage: 'Order History',
            })}
          </h1>
          <p className="mt-2 text-sm text-subtle-foreground">
            {formatMessage({
              id: 'manage_orders',
              defaultMessage:
                'Check the status of recent orders, manage returns, and download invoices.',
            })}
          </p>
        </div>

        <div className="my-4">
          <SearchField
            defaultValue={queryString}
            onInputChange={setQueryString}
          />
        </div>

        <div className="mt-4 sm:mt-8">
          <h2 className="sr-only">
            {formatMessage({
              id: 'recent_orders',
              defaultMessage: 'Recent orders',
            })}
          </h2>

          <dl className="divide-y divide-input border-b text-base text-muted-foreground sm:grid sm:space-y-0 lg:flex-none">
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
      </div>
    </div>
  );
};

export default OrderList;
