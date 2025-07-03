import { useRouter } from "next/router";
import { FormattedMessage, useIntl } from "react-intl";

import Link from "next/link";
import Image from "next/legacy/image";
import getConfig from "next/config";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import useOrderDetail from "../modules/orders/hooks/useOrderDetail";
import MetaTags from "../modules/common/components/MetaTags";
import CartItem from "../modules/cart/components/CartItem";
import useFormatDateTime from "../modules/common/utils/useFormatDateTime";
import defaultNextImageLoader from "../modules/common/utils/defaultNextImageLoader";
import FormattedPrice from "../modules/common/components/FormattedPrice";

const {
  publicRuntimeConfig: { theme },
} = getConfig();

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    ?.toUpperCase()
    ?.split("")
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

  if (!router.query.orderId) return "";

  return (
    <>
      <MetaTags
        title={formatMessage({
          id: "thank_you",
          defaultMessage: "Thank you!",
        })}
        description={formatMessage({
          id: "thank_you_description",
          defaultMessage:
            "It has reached us and an email with the order placement  confirmation is on its way. To avoid any potential  miscommunication, please check your spam, perhaps the email landed  there.",
        })}
      />

      {order && (
        <div className="relative lg:min-h-full">
          <div className="mx-auto max-w-2xl py-8 px-4 sm:px-6 sm:py-12 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-16 xl:gap-x-24">
            <div className="relative hidden lg:block lg:h-1/6 lg:w-full lg:pr-4 xl:pr-12">
              <Image
                src={theme.assets.logo}
                alt={formatMessage({
                  id: "shop_logo",
                  defaultMessage: "Shop logo",
                })}
                layout="fill"
                placeholder="blur"
                blurDataURL="/placeholder.png"
                className="w-full rounded"
                loader={defaultNextImageLoader}
              />
            </div>
            <div className="lg:col-start-2">
              <h1 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {formatMessage({
                  id: "thank_you",
                  defaultMessage: "Thank you!",
                })}
              </h1>
              <p className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                {formatMessage({
                  id: "thank_you_header",
                  defaultMessage: "Thank You for Placing this Order with Us!",
                })}
              </p>
              <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
                {formatMessage({
                  id: "thank_you_description",
                  defaultMessage:
                    "It has reached us and an email with the order placement  confirmation is on its way. To avoid any potential  miscommunication, please check your spam, perhaps the email landed  there.",
                })}
              </p>
              <div className="md:grid md:grid-cols-2 md:gap-2">
                <div>
                  <FormattedMessage
                    tagName="dl"
                    id="thank_you_order_number"
                    defaultMessage="<dl> <dt> Your Order Number is: </dt> <dd>
                            {orderNumber}
                          </dd> </dl> "
                    values={{
                      dl: (chunks) => (
                        <dl className="mt-8 text-sm font-medium">{chunks}</dl>
                      ),
                      dt: (chunks) => (
                        <dt className="text-slate-900 dark:text-white">
                          {chunks}
                        </dt>
                      ),
                      dd: (chunks) => (
                        <dd className="mt-2 text-slate-600 dark:text-slate-400">
                          {chunks}
                        </dd>
                      ),
                      orderNumber: order.orderNumber,
                    }}
                  />
                  <FormattedMessage
                    tagName="dl"
                    id="thank_you_order_date"
                    defaultMessage="<dl> <dt> The Date you placed the order is: </dt> <dd>
                          {orderDate}
                          </dd> </dl> "
                    values={{
                      dl: (chunks) => (
                        <dl className="mt-8 text-sm font-medium">{chunks}</dl>
                      ),
                      dt: (chunks) => (
                        <dt className="text-slate-900 dark:text-white">
                          {chunks}
                        </dt>
                      ),
                      dd: (chunks) => (
                        <dd className="mt-2 text-slate-600 dark:text-slate-400">
                          {chunks}
                        </dd>
                      ),
                      orderDate: formatDateTime(order.created),
                    }}
                  />
                </div>
              </div>
              <div className="text-slate-700 dark:text-slate-300">
                <div className="mt-4 rounded-lg border border-slate-300 bg-white shadow-xs dark:bg-slate-500">
                  <ul className="divide-y divide-slate-300">
                    {(order?.items || []).map((item) => (
                      <CartItem key={item._id} {...item} enableUpdate={false} />
                    ))}
                  </ul>
                </div>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-4 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-900 dark:text-white">
                    {formatMessage({
                      id: "shipping_address",
                      defaultMessage: "Shipping Address",
                    })}
                  </dt>
                  <dd className="mt-2">
                    {order?.delivery?.provider?.type === "SHIPPING" ? (
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
                          {getFlagEmoji(order?.delivery?.address?.countryCode)}
                          &nbsp;
                          {order?.delivery?.address?.countryCode}
                        </span>
                      </address>
                    ) : (
                      <div>
                        <span className="block">
                          {formatMessage({
                            id: "order_pickup",
                            defaultMessage: "Order is pick up",
                          })}
                        </span>
                      </div>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="font-medium text-slate-900 dark:text-white">
                    {formatMessage({
                      id: "payment-information",
                      defaultMessage: "Payment Information",
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
                          <>
                            <CheckCircleIcon
                              className="h-5 w-5 text-green-500"
                              aria-hidden="true"
                            />
                            <span className="mx-2">
                              {formatMessage({
                                id: "paid_on",
                                defaultMessage: "paid on",
                              })}
                            </span>
                            <time dateTime={order?.paid}>
                              {formatDateTime(order?.payment?.paid)}
                            </time>
                          </>
                        ) : null}
                      </p>
                    </div>
                  </dd>
                </div>
              </dl>

              <div className="mt-8 border-t border-slate-200 py-6 text-center">
                <Link
                  href="/shop"
                  className="text-sm font-medium text-slate-600 hover:text-slate-500 dark:text-slate-400 dark:hover:text-slate-500"
                >
                  {formatMessage({
                    id: "continue_shopping",
                    defaultMessage: "Continue Shopping",
                  })}

                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThankYou;
