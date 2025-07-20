import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import MetaTags from '../../../modules/common/components/MetaTags';

import useOrderDetail from '../../../modules/orders/hooks/useOrderDetail';
import NotFound from '../../404';
import useRedirect from '../../../modules/auth/hooks/useRedirect';
import Loading from '../../../modules/common/components/Loading';
import OrderDetail from '../../../modules/checkout/OrderDetail';

const OrderDetailPage = () => {
  const router = useRouter();
  const intl = useIntl();
  const { order, loading } = useOrderDetail({
    orderId: router.query?._id,
  });

  useRedirect({ to: '/login', matchGuests: true, matchAnonymous: true });

  if (!order && !loading)
    return (
      <NotFound
        page={intl.formatMessage({ id: 'order', defaultMessage: 'Order' })}
      />
    );

  return (
    <>
      <MetaTags
        title={`${intl.formatMessage(
          { id: 'order_numbered', defaultMessage: 'Order: {orderNumber}' },
          {
            orderNumber: order?.orderNumber,
          },
        )}`}
      />
      {loading && !order ? <Loading /> : <OrderDetail order={order} />}
    </>
  );
};

export default OrderDetailPage;
