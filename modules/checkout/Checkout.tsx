import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ErrorMessage from '../common/components/ErrorMessage';
import CheckoutContact from './CheckoutContact';
import CheckoutAddresses from './CheckoutAddresses';
import CheckoutPaymentMethod from './CheckoutPaymentMethod';
import { useAppContext } from '../common/components/AppContextWrapper';
import usePushNotification from '../context/push-notification/usePushNotification';
import FormattedPrice from '../common/components/FormattedPrice';
import { useIntl } from 'react-intl';

export const CART_CHECKOUT_QUERY = gql`
  query CartCheckout {
    me {
      _id
      cart {
        _id
        items {
          _id
          quantity
          unitPrice {
            amount
            currencyCode
          }
          total {
            amount
            currencyCode
          }
          product {
            _id
            texts {
              title
              subtitle
            }
            media {
              _id
              file {
                url
              }
            }
          }
        }
        itemsTotal: total(category: ITEMS) {
          amount
          currencyCode
        }
        taxesTotal: total(category: TAXES) {
          amount
          currencyCode
        }
        deliveryTotal: total(category: DELIVERY) {
          amount
          currencyCode
        }
        grandTotal: total {
          amount
          currencyCode
        }
        payment {
          _id
          fee {
            amount
            currencyCode
          }
          provider {
            _id
            type
            interface {
              _id
              label
              version
            }
          }
        }
        supportedPaymentProviders {
          _id
          type
          interface {
            _id
            label
            version
          }
        }
        contact {
          telNumber
          emailAddress
        }
        billingAddress {
          firstName
          lastName
          addressLine
          addressLine2
          postalCode
          regionCode
          city
          countryCode
        }
        delivery {
          _id
          ... on OrderDeliveryShipping {
            address {
              firstName
              lastName
              addressLine
              addressLine2
              postalCode
              regionCode
              city
              countryCode
            }
          }
        }
      }
    }
  }
`;

const Checkout = () => {
  const { emailSupportDisabled } = useAppContext();
  const { formatMessage } = useIntl();
  const { loading, error, data } = useQuery<any>(CART_CHECKOUT_QUERY, {
    notifyOnNetworkStatusChange: true,
  });
  const { isSubscribed } = usePushNotification();

  if (error) return <ErrorMessage message="Error loading cart" />;
  if (!data?.me?.cart) return <div>Loading</div>;

  const isAddressesMissing =
    !data.me.cart.delivery?.address?.firstName &&
    !data.me.cart.billingAddress?.firstName;
  const isContactDataMissing =
    !data.me.cart.contact?.emailAddress && !emailSupportDisabled;

  // Extract different total categories using aliases
  const itemsTotal = data.me.cart.itemsTotal;
  const taxesTotal = data.me.cart.taxesTotal;
  const deliveryTotal = data.me.cart.deliveryTotal;
  const grandTotal = data.me.cart.grandTotal;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Forms - Left Side */}
        <div className="lg:col-span-2 space-y-8">
          <CheckoutAddresses
            cart={data.me.cart}
            isInitial={isAddressesMissing}
          />
          {!isAddressesMissing && (
            <CheckoutContact
              cart={data.me.cart}
              isInitial={isContactDataMissing}
            />
          )}
          {!isAddressesMissing && !isContactDataMissing && (
            <CheckoutPaymentMethod
              cart={data.me.cart}
              disabled={isContactDataMissing}
            />
          )}
        </div>

        {/* Cart Summary - Right Side */}
        <div className="lg:col-span-1">
          <div className="sticky top-16">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6">
              <h2 className="text-lg font-medium text-slate-900 dark:text-white mb-6">
                {formatMessage({
                  id: 'order_summary',
                  defaultMessage: 'Order Summary',
                })}
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {data.me.cart.items?.length > 0 ? (
                  data.me.cart.items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.media?.[0]?.file?.url ? (
                          <img
                            src={item.product.media[0].file.url}
                            alt={item.product.texts.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-slate-400 text-xs">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {item.product.texts.title}
                        </h3>
                        {item.product.texts.subtitle && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {item.product.texts.subtitle}
                          </p>
                        )}
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            <FormattedPrice price={item.total} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">
                      Your cart is empty
                    </p>
                  </div>
                )}
              </div>

              {/* Order Totals */}
              {data.me.cart.items?.length > 0 && (
                <>
                  <div className="border-t border-slate-200 dark:border-0 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>
                        {formatMessage({
                          id: 'subtotal',
                          defaultMessage: 'Subtotal',
                        })}
                      </span>
                      <span>
                        <FormattedPrice price={itemsTotal} />
                      </span>
                    </div>

                    {/* Versandgebühren (Delivery/Shipping) */}
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>
                        {formatMessage({
                          id: 'shipping',
                          defaultMessage: 'Shipping',
                        })}
                      </span>
                      <span>
                        <FormattedPrice
                          price={
                            deliveryTotal || {
                              amount: 0,
                              currencyCode: itemsTotal?.currencyCode || 'CHF',
                            }
                          }
                        />
                      </span>
                    </div>

                    {/* MwSt (Taxes) */}
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                      <span>
                        {formatMessage({
                          id: 'tax',
                          defaultMessage: 'Tax',
                        })}
                      </span>
                      <span>
                        <FormattedPrice
                          price={
                            taxesTotal || {
                              amount: 0,
                              currencyCode: itemsTotal?.currencyCode || 'CHF',
                            }
                          }
                        />
                      </span>
                    </div>

                    {data.me.cart.payment?.fee && (
                      <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                        <span>
                          {formatMessage({
                            id: 'payment_fee',
                            defaultMessage: 'Payment Fee',
                          })}
                        </span>
                        <span>
                          <FormattedPrice price={data.me.cart.payment.fee} />
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-200 dark:border-0 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-medium text-slate-900 dark:text-white">
                      <span>Gesamtsumme</span>
                      <span>
                        <FormattedPrice price={grandTotal} />
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
