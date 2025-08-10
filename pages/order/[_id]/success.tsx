import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import MetaTags from '../../../modules/common/components/MetaTags';
import useOrderDetail from '../../../modules/orders/hooks/useOrderDetail';
import NotFound from '../../404';
import useRedirect from '../../../modules/auth/hooks/useRedirect';
import Loading from '../../../modules/common/components/Loading';
import OrderDetail from '../../../modules/checkout/OrderDetail';
import { useAppContext } from '../../../modules/common/components/AppContextWrapper';
import ConfettiCelebration from '../../../modules/common/components/ConfettiCelebration';
import AnimatedCheckmark from '../../../modules/common/components/AnimatedCheckmark';
import FadeInSection from '../../../modules/common/components/FadeInSection';

const OrderSuccessTankYouPage = () => {
  const router = useRouter();
  const { emailSupportDisabled } = useAppContext();
  const intl = useIntl();
  const { order, loading } = useOrderDetail({
    orderId: router.query?._id,
  });

  useRedirect({ to: '/login', matchGuests: false, matchAnonymous: true });

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
      {loading ? (
        <Loading />
      ) : (
        <div>
          <ConfettiCelebration
            trigger={!!order}
            duration={3000}
            particleCount={75}
            colors={['#059669', '#10b981', '#34d399', '#6ee7b7']}
          />

          <FadeInSection className="mt-10 mx-auto max-w-6xl bg-white dark:bg-slate-900 p-8 rounded-lg border border-slate-200 dark:border-0 print:hidden">
            <div className="flex items-center gap-4 mb-6">
              <AnimatedCheckmark size="lg" delay={500} />
              <h1 className="text-2xl text-slate-900 dark:text-white">
                {intl.formatMessage({
                  id: 'order_confirmation',
                  defaultMessage: 'Order Confirmation',
                })}
              </h1>
            </div>

            <FadeInSection delay={400}>
              <div className="space-y-3 text-slate-600 dark:text-slate-300">
                <p>
                  {intl.formatMessage({
                    id: 'order_received_processing',
                    defaultMessage:
                      'Your order has been received and is being processed.',
                  })}
                  {!emailSupportDisabled && (
                    <>
                      {' '}
                      {intl.formatMessage({
                        id: 'email_confirmation_shortly',
                        defaultMessage:
                          "You'll receive an email confirmation shortly.",
                      })}
                    </>
                  )}
                </p>
              </div>
            </FadeInSection>
          </FadeInSection>

          <FadeInSection delay={800}>
            <OrderDetail order={order} />
          </FadeInSection>
        </div>
      )}
    </>
  );
};

export default OrderSuccessTankYouPage;
