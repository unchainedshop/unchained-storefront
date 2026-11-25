import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import MetaTags from '../../../modules/common/components/MetaTags';
import useOrderDetail from '../../../modules/orders/hooks/useOrderDetail';
import NotFound from '../../404';
import useRedirect from '../../../modules/auth/hooks/useRedirect';
import OrderConfirmation from '../../../modules/orders/components/OrderConfirmation';

const OrderSuccessPage = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { order, loading } = useOrderDetail({ orderId: router.query?._id });

  useRedirect({ to: '/login', matchGuests: false, matchAnonymous: true });

  if (!order && !loading)
    return <NotFound page={formatMessage({ id: 'order', defaultMessage: 'Order' })} />;

  if (loading)
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="skeleton h-72 rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );

  return (
    <>
      <MetaTags
        title={formatMessage(
          { id: 'order_numbered', defaultMessage: 'Order: {orderNumber}' },
          { orderNumber: order.orderNumber },
        )}
      />
      <OrderConfirmation order={order} />
    </>
  );
};

export default OrderSuccessPage;
