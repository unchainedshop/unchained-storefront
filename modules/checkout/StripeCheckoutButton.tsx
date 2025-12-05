import { useEffect, useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';
import Loading from '../common/components/Loading';
import useSignPaymentProviderForCheckout from './hooks/useSignPaymentProviderForCheckout';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

const StripeCheckoutButton = ({ order }) => {
  const [clientSecret, setClientSecret] = useState('');
  const { sign } = useSignPaymentProviderForCheckout();

  const successUrl = `${window.location.origin}/order/${order._id}/success`;
  // const cancelUrl = `${window.location.origin}/checkout`;
  // const errorUrl = `${window.location.origin}/checkout?error=1`;

  const signStripeMutation = async () => {
    try {
      const transactionContext = {};
      const { data } = await sign({
        orderPaymentId: order.payment._id,
        transactionContext,
      });
      if (data?.signPaymentProviderForCheckout) {
        setClientSecret(data.signPaymentProviderForCheckout);
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

export default StripeCheckoutButton;
