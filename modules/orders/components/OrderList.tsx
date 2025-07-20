import { useIntl } from 'react-intl';
import SearchField from '../../common/components/SearchField';
import OrderListItem from './OrderListItem';

const OrderList = ({ orders, queryString, setQueryString }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="mx-4 max-w-full px-4 pt-16 sm:px-6 lg:px-8">
        <div className="max-w-full">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            {formatMessage({
              id: 'order_history',
              defaultMessage: 'Order History',
            })}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
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

          <dl className="divide-y divide-slate-300 border-b text-base text-slate-600 dark:text-slate-300 sm:grid sm:space-y-0 lg:flex-none">
            <div className="hidden sm:block sm:pb-6">
              <div className="flex-auto sm:grid sm:grid-cols-6 sm:gap-x-6 lg:gap-x-8">
                <div className="flex justify-between sm:block">
                  <dt className="font-medium text-slate-900 dark:text-slate-100">
                    {formatMessage({
                      id: 'order_date',
                      defaultMessage: 'Order date',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-slate-900 dark:text-slate-100">
                    {formatMessage({
                      id: 'order_number',
                      defaultMessage: 'Order number',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-slate-900 dark:text-slate-100">
                    {formatMessage({
                      id: 'total_amount',
                      defaultMessage: 'Total amount',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-slate-900 dark:text-slate-100">
                    {formatMessage({
                      id: 'payment_status',
                      defaultMessage: 'Payment status',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-slate-900 dark:text-slate-100">
                    {formatMessage({
                      id: 'order_status',
                      defaultMessage: 'Order status',
                    })}
                  </dt>
                </div>
                <div className="flex justify-between pt-6 sm:block sm:pt-0">
                  <dt className="font-medium text-slate-900 dark:text-slate-100">
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
