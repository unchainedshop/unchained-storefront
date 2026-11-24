import AccountLayout from '../../modules/auth/components/AccountLayout';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import MetaTags from '../../modules/common/components/MetaTags';
import OrderList from '../../modules/orders/components/OrderList';
import useOrderList from '../../modules/orders/hooks/useUserOrderList';
import Loading from '../../modules/common/components/Loading';

const Order = () => {
  const { orders, loading } = useOrderList();

  const { query, push } = useRouter();
  const { formatMessage } = useIntl();

  const { queryString, ...restQuery } = query;
  const setQueryString = (searchString) => {
    if (searchString)
      push({
        query: {
          ...restQuery,
          queryString: searchString,
        },
      });
    else
      push({
        query: {
          ...restQuery,
        },
      });
  };

  return (
    <>
      <MetaTags
        title={formatMessage({ id: 'my_orders', defaultMessage: 'My orders' })}
      />
      <AccountLayout
        title={formatMessage({ id: 'order_history', defaultMessage: 'Order History' })}
      >
        {loading ? (
          <Loading />
        ) : (
          <OrderList
            orders={orders}
            queryString={queryString}
            setQueryString={setQueryString}
          />
        )}
      </AccountLayout>
    </>
  );
};

export default Order;
