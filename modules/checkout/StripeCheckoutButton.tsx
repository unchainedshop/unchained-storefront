import { useEffect, useState } from 'react';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import stripePromise from './stripeClient';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import Loading from '../common/components/Loading';
import useCheckoutCart from '../cart/hooks/useCheckoutCart';
import usePaymentCredentials from './hooks/usePaymentCredentials';
import useSignPaymentProviderForCheckout from './hooks/useSignPaymentProviderForCheckout';


const StripeElementsCheckout = ({ order }) => {
  const [clientSecret, setClientSecret] = useState('');
  const { sign } = useSignPaymentProviderForCheckout();

  const successUrl = `${window.location.origin}/order/${order._id}/success`;
  // const cancelUrl = `${window.location.origin}/checkout`;
  // const errorUrl = `${window.location.origin}/checkout?error=1`;

  const signStripeMutation = async () => {
    try {
      const transactionContext = {};
      const signed = await sign({
        orderPaymentId: order.payment._id,
        transactionContext,
      });
      if (signed) {
        setClientSecret(signed);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    signStripeMutation();
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'flat',
    },
  };

  if (clientSecret) {
    return (
      <Elements options={options} stripe={stripePromise}>
        <StripeCheckoutForm returnUrl={successUrl} />
      </Elements>
    );
  }
  return <Loading />;
};

const StripeCheckoutButton = ({ order }) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { checkoutCart } = useCheckoutCart();
  const { preferredCredentialsFor, loading } = usePaymentCredentials();
  const [useOtherCard, setUseOtherCard] = useState(false);
  const [paying, setPaying] = useState(false);
  const savedCredentials = preferredCredentialsFor(order.payment?.provider?._id);

  if (loading) return <Loading />;
  if (!savedCredentials || useOtherCard) return <StripeElementsCheckout order={order} />;

  // The engine charges the preferred saved credentials when no payment context is given.
  const payWithSavedCard = async () => {
    setPaying(true);
    try {
      const result = await checkoutCart({ orderId: order._id });
      router.replace(`/order/${result.data.checkoutCart._id}/success`);
    } catch {
      setPaying(false);
      setUseOtherCard(true);
    }
  };

  return (
    <div className="space-y-2">
      <button type="button" disabled={paying} onClick={payWithSavedCard} className="btn btn-primary btn-lg w-full">
        <CreditCardIcon className="size-5" />
        {formatMessage({ id: 'pay_with_saved_card', defaultMessage: 'Pay with saved card' })}
      </button>
      <button type="button" onClick={() => setUseOtherCard(true)} className="btn btn-ghost w-full">
        {formatMessage({ id: 'use_different_card', defaultMessage: 'Use a different card' })}
      </button>
    </div>
  );
};

export default StripeCheckoutButton;
