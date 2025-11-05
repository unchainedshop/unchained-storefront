import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useIntl } from 'react-intl';

export const SIGN_SAFERPAY_MUTATION = gql`
  mutation SignPaymentProviderForCheckout($orderPaymentId: ID!) {
    signPaymentProviderForCheckout(orderPaymentId: $orderPaymentId)
  }
`;

const SaferpayCheckoutButton = ({ order }) => {
  const { formatMessage } = useIntl();
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [signSaferpayMutation] = useMutation<any>(SIGN_SAFERPAY_MUTATION);

  const sign = async () => {
    try {
      setLoading(true);
      const { data } = await signSaferpayMutation({
        variables: { orderPaymentId: order.payment._id },
      });

      if (data?.signPaymentProviderForCheckout) {
        const parsed = JSON.parse(data.signPaymentProviderForCheckout);
        if (parsed.location) {
          setRedirectUrl(parsed.location);
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

  useEffect(() => {
    sign();
  }, []);

  return (
    <div className="flex flex-col space-y-4 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
        {formatMessage({
          id: 'checkout_payment',
          defaultMessage: 'Checkout Payment',
        })}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="spinner border-t-2 border-slate-900 dark:border-white rounded-full w-5 h-5 animate-spin" />
          <span className="text-slate-700 dark:text-slate-300">
            {formatMessage({
              id: 'payment_preparing',
              defaultMessage: 'Preparing payment...',
            })}
          </span>
        </div>
      ) : redirectUrl ? (
        <a
          onClick={() => (window.location.href = redirectUrl)}
          className="w-full cursor-pointer text-center py-2 px-4 bg-slate-900 dark:bg-slate-700 text-white rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 disabled:opacity-50"
          target="_blank"
        >
          {formatMessage({ id: 'pay_now', defaultMessage: 'Pay Now' })}
        </a>
      ) : (
        <div className="text-sm text-center text-red-600 dark:text-red-400">
          {message ||
            formatMessage({
              id: 'payment_unable_init',
              defaultMessage: 'Unable to initialize payment.',
            })}
        </div>
      )}

      {message && redirectUrl && (
        <div className="text-sm text-center text-slate-600 dark:text-slate-300 mt-2">
          {message}
        </div>
      )}
    </div>
  );
};

export default SaferpayCheckoutButton;
