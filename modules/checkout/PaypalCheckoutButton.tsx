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
      console.error('Error initializing Paypal payment:', err);
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
      console.error('Error completing order:', err);
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
    <div className="flex flex-col space-y-4 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
      {loading && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="spinner border-t-2 border-slate-900 dark:border-white rounded-full w-5 h-5 animate-spin" />
          <span className="text-slate-700 dark:text-slate-300">
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
          currency: order?.grandTotal?.currencyCode,
          intent: 'capture',
        }}
      >
        <PayPalButtons
          createOrder={(data, actions) =>
            actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    value: (order?.grandTotal?.amount / 100).toFixed(2),
                    currency_code: order?.grandTotal?.currencyCode,
                  },
                },
              ],
            })
          }
          onApprove={async (data, actions) => {
            await handleCompleteOrder(data.orderID);
          }}
          onError={(err) => {
            console.error('PayPal error:', err);
            setMessage('Error processing PayPal payment. Please try again.');
          }}
        />
      </PayPalScriptProvider>
      {message && (
        <div className="text-sm text-center text-slate-600 dark:text-slate-300 mt-2">
          {message}
        </div>
      )}
    </div>
  );
};

export default PaypalCheckoutButton;
