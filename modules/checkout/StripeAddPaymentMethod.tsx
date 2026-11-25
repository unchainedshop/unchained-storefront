import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import stripePromise from './stripeClient';
import usePaymentCredentials from './hooks/usePaymentCredentials';
import Loading from '../common/components/Loading';
import ErrorMessage from '../common/components/ErrorMessage';

const SetupForm = ({ paymentProviderId, onDone }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { formatMessage } = useIntl();
  const { register } = usePaymentCredentials();
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSaving(true);
    setError(null);
    const { setupIntent, error: stripeError } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
      confirmParams: { return_url: window.location.href },
    });
    if (stripeError) {
      setError(stripeError.message);
      setSaving(false);
      return;
    }
    await register(paymentProviderId, { setupIntentId: setupIntent.id });
    setSaving(false);
    onDone();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PaymentElement />
      {error && <ErrorMessage message={error} />}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="btn btn-ghost">
          {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        </button>
        <button type="submit" disabled={!stripe || saving} className="btn btn-primary">
          {formatMessage({ id: 'save_payment_method', defaultMessage: 'Save payment method' })}
        </button>
      </div>
    </form>
  );
};

const StripeAddPaymentMethod = ({ paymentProviderId, onDone }) => {
  const { signRegistration } = usePaymentCredentials();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    signRegistration(paymentProviderId)
      .then(setClientSecret)
      .catch((e) => setError(e.message));
  }, [paymentProviderId]);

  if (error) return <ErrorMessage message={error} />;
  if (!clientSecret) return <Loading />;
  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat' } }}>
      <SetupForm paymentProviderId={paymentProviderId} onDone={onDone} />
    </Elements>
  );
};

export default StripeAddPaymentMethod;
