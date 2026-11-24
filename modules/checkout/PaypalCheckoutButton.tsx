import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import useSignPaymentProviderForCheckout from './hooks/useSignPaymentProviderForCheckout';
import useCheckoutCart from '../cart/hooks/useCheckoutCart';
import { useRouter } from 'next/router';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PaypalCheckoutButton = ({ order }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [clientId, setClientId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const { sign } = useSignPaymentProviderForCheckout();
  const { checkoutCart } = useCheckoutCart();

  const signPayment = async () => {
    try {
      setLoading(true);
      const signedCLientId = await sign({
        orderPaymentId: order.payment._id,
      });

      if (signedCLientId) {
        setClientId(signedCLientId);
      }
    } catch (err) {
      setMessage(
        formatMessage({
          id: 'payment_init_error',
          defaultMessage: 'Error initializing payment. Please try again.',
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderID) => {
    if (!clientId) return;

    try {
      const result = await checkoutCart({
        orderId: order._id,
        paymentContext: { orderID },
      });

      setMessage(
        formatMessage({
          id: 'payment_completed',
          defaultMessage: 'Payment completed successfully!',
        }),
      );
      router.replace(`/order/${result?.data?.checkoutCart?._id}/success`);
    } catch (err) {
      setMessage(
        formatMessage({
          id: 'payment_checkout_error',
          defaultMessage: 'Error completing the order. Please try again.',
        }),
      );
    }
  };

  useEffect(() => {
    signPayment();
  }, []);
  if (!clientId) return null;

  return (
    <div className="flex flex-col space-y-4">
      {loading && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="spinner border-t-2 border-primary rounded-full w-5 h-5 animate-spin" />
          <span className="text-muted-foreground">
            {formatMessage({
              id: 'payment_preparing',
              defaultMessage: 'Preparing payment...',
            })}
          </span>
        </div>
      )}

      <PayPalScriptProvider
        options={{
          clientId,
          currency: order?.currencyCode,
        }}
      >
        <PayPalButtons
          message={{ align: 'center' }}
          displayOnly={['vaultable']}
          style={{
            shape: 'sharp',

            layout: 'horizontal',
            color: 'black',
            label: 'checkout',
            tagline: false,
            disableMaxWidth: true,
          }}
          createOrder={async (data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    value: (order?.grandTotal?.amount / 100)
                      .toFixed(2)
                      .toString(),
                    currency_code: order?.currencyCode,
                  },
                  custom_id: order._id,
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            await actions.order.capture();
            await handleCompleteOrder(data?.orderID);
          }}
          onError={(err) => {
            setMessage('Error processing PayPal payment. Please try again.');
          }}
        />
      </PayPalScriptProvider>
      {message && (
        <div className="text-sm text-center text-muted-foreground mt-2">
          {message}
        </div>
      )}
    </div>
  );
};

export default PaypalCheckoutButton;
