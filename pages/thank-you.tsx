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
                <h1 className="text-sm font-medium text-success">
                  {formatMessage({
                    id: 'thank_you',
                    defaultMessage: 'Thank you!',
                  })}
                </h1>
              </FadeInSection>

              <FadeInSection delay={400}>
                <p className="mt-2 text-4xl tracking-tight text-foreground sm:text-5xl">
                  {formatMessage({
                    id: 'thank_you_header',
                    defaultMessage: 'Thank You for Placing this Order with Us!',
                  })}
                </p>
              </FadeInSection>

              <FadeInSection delay={600}>
                <p className="mt-6 text-base text-subtle-foreground leading-relaxed">
                  {formatMessage({
                    id: 'thank_you_description',
                    defaultMessage:
                      'It has reached us and an email with the order placement  confirmation is on its way. To avoid any potential  miscommunication, please check your spam, perhaps the email landed  there.',
                  })}
                </p>
              </FadeInSection>
              <FadeInSection delay={800}>
                <div className="mt-8 bg-gradient-to-r from-success-soft to-accent rounded-xl p-6 border border-success/40">
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
                            <dt className="text-foreground font-semibold">
                              {chunks}
                            </dt>
                          ),
                          dd: (chunks) => (
                            <dd className="mt-2 text-lg font-semibold text-success">
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
                            <dt className="text-foreground font-semibold">
                              {chunks}
                            </dt>
                          ),
                          dd: (chunks) => (
                            <dd className="mt-2 text-muted-foreground font-medium">
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
                <div className="mt-8 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Order Summary
                  </h3>
                  <div className="rounded-xl border border-border bg-surface shadow-sm dark:border-0 overflow-hidden">
                    <ul className="divide-y divide-border">
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
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  Delivery & Payment Details
                </h3>
              </FadeInSection>

              <FadeInSection delay={1500}>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                  <div>
                    <dt className="font-medium text-foreground">
                      {formatMessage({
                        id: 'shipping_address',
                        defaultMessage: 'Shipping Address',
                      })}
                    </dt>
                    <dd className="mt-2">
                      {order?.delivery?.provider?.type === 'SHIPPING' ? (
                        <address className="mt-3 not-italic text-subtle-foreground">
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
                    <dt className="font-medium text-foreground">
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
                        <p className="text-subtle-foreground">
                          {order?.payment?.provider?.interface?.label}
                          &nbsp;&nbsp;
                          {order?.payment?.provider?.interface?.version}
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-subtle-foreground">
                          <span>{order?.payment?.provider?.type}</span>
                          <span className="mx-2 inline-flex items-center rounded-full bg-success-soft px-3 py-0.5 text-sm font-medium text-success">
                            {order?.payment?.status}
                          </span>
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p className="text-muted-foreground">
                          <FormattedPrice price={order?.payment?.fee} />
                        </p>
                      </div>
                      <div className="ml-4 mt-4">
                        <p>
                          {order?.payment?.paid ? (
                            <div className="flex items-center">
                              <AnimatedCheckmark size="sm" delay={1500} />
                              <span className="mx-2 text-success font-medium">
                                {formatMessage({
                                  id: 'paid_on',
                                  defaultMessage: 'paid on',
                                })}
                              </span>
                              <time
                                dateTime={order?.paid}
                                className="text-muted-foreground"
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
                <div className="mt-8 border-t border-border dark:border-0 py-8 text-center">
                  <Link
                    href="/shop"
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
