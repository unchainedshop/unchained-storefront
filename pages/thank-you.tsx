import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import Link from 'next/link';
import Image from 'next/legacy/image';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import useOrderDetail from '../modules/orders/hooks/useOrderDetail';
import MetaTags from '../modules/common/components/MetaTags';
import CartItem from '../modules/cart/components/CartItem';
import useFormatDateTime from '../modules/common/utils/useFormatDateTime';
import defaultNextImageLoader from '../modules/common/utils/defaultNextImageLoader';
import FormattedPrice from '../modules/common/components/FormattedPrice';
import ConfettiCelebration from '../modules/common/components/ConfettiCelebration';
import AnimatedCheckmark from '../modules/common/components/AnimatedCheckmark';
import CountUpAnimation from '../modules/common/components/CountUpAnimation';
import FadeInSection from '../modules/common/components/FadeInSection';

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    ?.toUpperCase()
    ?.split('')
    ?.map((char) => 127397 + Number(char?.charCodeAt() || 0));
  return String.fromCodePoint(...(codePoints || []));
}

const ThankYou = () => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();
  const { order } = useOrderDetail({
    orderId: router.query?.orderId,
  });

  if (!router.query.orderId) return '';

  return (
    <>
      <MetaTags
        title={formatMessage({
          id: 'thank_you',
          defaultMessage: 'Thank you!',
        })}
        description={formatMessage({
          id: 'thank_you_description',
          defaultMessage:
            'It has reached us and an email with the order placement  confirmation is on its way. To avoid any potential  miscommunication, please check your spam, perhaps the email landed  there.',
        })}
      />

      <ConfettiCelebration
        trigger={!!order}
        duration={4000}
        particleCount={100}
        colors={[
          '#059669',
          '#10b981',
          '#34d399',
          '#6ee7b7',
          '#a7f3d0',
          '#f59e0b',
          '#fbbf24',
        ]}
      />

      {order && (
        <div className="relative lg:min-h-full">
          <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 sm:py-12 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-16 xl:gap-x-24">
            <div className="lg:col-start-2">
              <FadeInSection
                delay={200}
                className="flex items-center gap-3 mb-4"
              >
                <AnimatedCheckmark size="lg" delay={800} />
                <h1 className="text-sm font-medium text-green-600 dark:text-green-400">
                  {formatMessage({
                    id: 'thank_you',
                    defaultMessage: 'Thank you!',
                  })}
                </h1>
              </FadeInSection>

              <FadeInSection delay={400}>
                <p className="mt-2 text-4xl tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  {formatMessage({
                    id: 'thank_you_header',
                    defaultMessage: 'Thank You for Placing this Order with Us!',
                  })}
                </p>
              </FadeInSection>

              <FadeInSection delay={600}>
                <p className="mt-6 text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                  {formatMessage({
                    id: 'thank_you_description',
                    defaultMessage:
                      'It has reached us and an email with the order placement  confirmation is on its way. To avoid any potential  miscommunication, please check your spam, perhaps the email landed  there.',
                  })}
                </p>
              </FadeInSection>
              <FadeInSection delay={800}>
                <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="md:grid md:grid-cols-2 md:gap-6">
                    <div>
                      <FormattedMessage
                        tagName="dl"
                        id="thank_you_order_number"
                        defaultMessage="<dl> <dt> Your Order Number is: </dt> <dd>
                                {orderNumber}
                              </dd> </dl> "
                        values={{
                          dl: (chunks) => (
                            <dl className="text-sm font-medium">{chunks}</dl>
                          ),
                          dt: (chunks) => (
                            <dt className="text-slate-900 dark:text-white font-semibold">
                              {chunks}
                            </dt>
                          ),
                          dd: (chunks) => (
                            <dd className="mt-2 text-lg font-semibold text-green-700 dark:text-green-400">
                              <CountUpAnimation
                                end={
                                  parseInt(
                                    order.orderNumber?.replace(/[^0-9]/g, '') ||
                                      '0',
                                  ) || 1000
                                }
                                delay={1000}
                                duration={1500}
                                prefix={
                                  order.orderNumber?.replace(/[0-9]/g, '') ||
                                  '#'
                                }
                              />
                            </dd>
                          ),
                          orderNumber: order.orderNumber,
                        }}
                      />
                    </div>
                    <div>
                      <FormattedMessage
                        tagName="dl"
                        id="thank_you_order_date"
                        defaultMessage="<dl> <dt> The Date you placed the order is: </dt> <dd>
                              {orderDate}
                              </dd> </dl> "
                        values={{
                          dl: (chunks) => (
                            <dl className="mt-4 md:mt-0 text-sm font-medium">
                              {chunks}
                            </dl>
                          ),
                          dt: (chunks) => (
                            <dt className="text-slate-900 dark:text-white font-semibold">
                              {chunks}
                            </dt>
                          ),
                          dd: (chunks) => (
                            <dd className="mt-2 text-slate-700 dark:text-slate-300 font-medium">
                              {chunks}
                            </dd>
                          ),
                          orderDate: formatDateTime(order.created),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </FadeInSection>
              <FadeInSection delay={1000}>
                <div className="mt-8 text-slate-700 dark:text-slate-300">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Order Summary
                  </h3>
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-0 overflow-hidden">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                      {(order?.items || []).map((item, index) => (
                        <FadeInSection
                          key={item._id}
                          delay={1200 + index * 100}
                        >
                          <CartItem {...item} enableUpdate={false} />
                        </FadeInSection>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay={1400}>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  Delivery & Payment Details
                </h3>
              </FadeInSection>

              <FadeInSection delay={1500}>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
                  <div>
                    <dt className="font-medium text-slate-900 dark:text-white">
                      {formatMessage({
                        id: 'shipping_address',
                        defaultMessage: 'Shipping Address',
                      })}
                    </dt>
                    <dd className="mt-2">
                      {order?.delivery?.provider?.type === 'SHIPPING' ? (
                        <address className="mt-3 not-italic text-slate-500 dark:text-slate-300">
                          <span className="block">
                            {order?.delivery?.address?.firstName}&nbsp;
                            {order?.delivery?.address?.lastName}
                          </span>
                          <span className="block">
                            {order?.delivery?.address?.addressLine}
                          </span>
                          <span className="block">
                            {order?.profile?.address?.city}&nbsp;&nbsp;
                            {getFlagEmoji(
                              order?.delivery?.address?.countryCode,
                            )}
                            &nbsp;
                            {order?.delivery?.address?.countryCode}
                          </span>
                        </address>
                      ) : (
                        <div>
                          <span className="block">
                            {formatMessage({
                              id: 'order_pickup',
                              defaultMessage: 'Order is pick up',
                            })}
                          </span>
                        </div>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-medium text-slate-900 dark:text-white">
                      {formatMessage({
                        id: 'payment-information',
                        defaultMessage: 'Payment Information',
                      })}
                    </dt>
                    <dd className="-ml-4 -mt-1">
                      <div className="ml-4 mt-4">
                        <p className="sr-only">
                          {order?.payment?.provider?.interface?.label}
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-slate-500 dark:text-slate-300">
                          {order?.payment?.provider?.interface?.label}
                          &nbsp;&nbsp;
                          {order?.payment?.provider?.interface?.version}
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-slate-500 dark:text-slate-300">
                          <span>{order?.payment?.provider?.type}</span>
                          <span className="mx-2 inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                            {order?.payment?.status}
                          </span>
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-slate-600 dark:text-slate-300">
                          <FormattedPrice price={order?.payment?.fee} />
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p>
                          {order?.payment?.paid ? (
                            <div className="flex items-center">
                              <AnimatedCheckmark size="sm" delay={1500} />
                              <span className="mx-2 text-green-700 dark:text-green-400 font-medium">
                                {formatMessage({
                                  id: 'paid_on',
                                  defaultMessage: 'paid on',
                                })}
                              </span>
                              <time
                                dateTime={order?.paid}
                                className="text-slate-600 dark:text-slate-300"
                              >
                                {formatDateTime(order?.payment?.paid)}
                              </time>
                            </div>
                          ) : null}
                        </p>
                      </div>
                    </dd>
                  </div>
                </dl>
              </FadeInSection>

              <FadeInSection delay={1600}>
                <div className="mt-8 border-t border-slate-200 dark:border-0 py-8 text-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    {formatMessage({
                      id: 'continue_shopping',
                      defaultMessage: 'Continue Shopping',
                    })}
                    <span aria-hidden="true" className="ml-2">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThankYou;
