import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import useSignPaymentProviderForCheckout from './hooks/useSignPaymentProviderForCheckout';
import useCheckoutCart from '../cart/hooks/useCheckoutCart';
import { useRouter } from 'next/router';

const SaferpayCheckoutButton = ({ order }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [locationUrl, setLocationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const { sign } = useSignPaymentProviderForCheckout();
  const { checkoutCart } = useCheckoutCart();

  const signPayment = async () => {
    try {
      setLoading(true);
      const data = await sign({
        orderPaymentId: order.payment._id,
        transactionContext: {
          ReturnUrl: { Url: window.location.href },
        },
      });

      if (data) {
        const parsed = JSON.parse(data);

        if (parsed.location && parsed.transactionId) {
          setTransactionId(parsed.transactionId);
          setLocationUrl(parsed.location);
          setMessage(null);
        } else {
          setMessage(
            formatMessage({
              id: 'payment_init_failed',
              defaultMessage: 'Payment initialization failed.',
            }),
          );
        }
      }
    } catch (err) {
      console.error('Error initializing Saferpay transaction:', err);
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

  const handleCompleteOrder = async () => {
    if (!transactionId) return;

    try {
      const result = await checkoutCart({
        orderId: order._id,
        paymentContext: { transactionId },
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
    const params = new URLSearchParams(window.location.search);
    const trxId = params.get('transactionId');

    if (trxId) {
      setTransactionId(trxId);
      setLoading(false);
      setMessage(
        formatMessage({
          id: 'payment_ready_to_complete',
          defaultMessage:
            'Payment authorization complete. Click below to finalize your order.',
        }),
      );
    } else {
      signPayment();
    }
  }, []);

  return (
    <div className="flex flex-col space-y-4 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
        {formatMessage({
          id: 'checkout_payment',
          defaultMessage: 'Checkout Payment',
        })}
      </h2>

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

      {!loading &&
        locationUrl &&
        !window.location.search.includes('transactionId') && (
          <a
            href={locationUrl}
            rel="noopener noreferrer"
            className="w-full text-center py-2 px-4 bg-slate-900 dark:bg-slate-700 text-white rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600"
          >
            {formatMessage({
              id: 'continue_to_payment',
              defaultMessage: 'Continue to Payment',
            })}
          </a>
        )}

      {!loading &&
        transactionId &&
        window.location.search.includes('transactionId') && (
          <button
            onClick={handleCompleteOrder}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {formatMessage({
              id: 'complete_order',
              defaultMessage: 'Complete Order',
            })}
          </button>
        )}

      {message && (
        <div className="text-sm text-center text-slate-600 dark:text-slate-300 mt-2">
          {message}
        </div>
      )}
    </div>
  );
};

export default SaferpayCheckoutButton;
