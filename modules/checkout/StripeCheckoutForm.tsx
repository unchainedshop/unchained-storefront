import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useIntl } from 'react-intl';

export default function StripeCheckoutForm({ returnUrl }) {
  const stripe = useStripe();
  const elements = useElements();
  const { formatMessage } = useIntl();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage(
            formatMessage({
              id: 'payment_succeeded',
              defaultMessage: 'Payment succeeded!',
            }),
          );
          break;
        case 'processing':
          setMessage(
            formatMessage({
              id: 'payment_processing',
              defaultMessage: 'Your payment is processing.',
            }),
          );
          break;
        case 'requires_payment_method':
          setMessage(
            formatMessage({
              id: 'payment_failed',
              defaultMessage:
                'Your payment was not successful, please try again.',
            }),
          );
          break;
        default:
          setMessage(
            formatMessage({
              id: 'payment_error',
              defaultMessage: 'Something went wrong.',
            }),
          );
          break;
      }
    });
  }, [stripe, formatMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(
          error.message ||
            formatMessage({
              id: 'payment_validation_error',
              defaultMessage: 'Validation error occurred.',
            }),
        );
      } else {
        setMessage(
          formatMessage({
            id: 'unexpected_error',
            defaultMessage: 'An unexpected error occurred.',
          }),
        );
      }
    }

    setIsLoading(false);
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm"
    >
      <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
        {formatMessage({
          id: 'checkout_payment',
          defaultMessage: 'Checkout Payment',
        })}
      </h2>

      <PaymentElement id="payment-element" />

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full py-2 px-4 bg-slate-900 dark:bg-slate-700 text-white rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-600 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center space-x-2">
            <div className="spinner border-t-2 border-white rounded-full w-4 h-4 animate-spin" />
            <span>
              {formatMessage({
                id: 'processing_payment',
                defaultMessage: 'Processing...',
              })}
            </span>
          </span>
        ) : (
          formatMessage({ id: 'pay_now', defaultMessage: 'Pay now' })
        )}
      </button>

      {message && (
        <div
          id="payment-message"
          className="text-sm text-center text-slate-600 dark:text-slate-300 mt-2"
        >
          {message}
        </div>
      )}
    </form>
  );
}
