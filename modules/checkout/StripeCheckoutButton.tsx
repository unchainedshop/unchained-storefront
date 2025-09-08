import { useEffect, useState } from 'react';
import getConfig from 'next/config';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from './StripeCheckoutForm';

const {
  publicRuntimeConfig: { publishableKey },
} = getConfig();

const stripePromise = loadStripe(publishableKey);

export const SIGN_STRIPE_MUTATION = gql`
  mutation SignPaymentProviderForCheckout(
    $orderPaymentId: ID!
    $transactionContext: JSON
  ) {
    signPaymentProviderForCheckout(
      orderPaymentId: $orderPaymentId
      transactionContext: $transactionContext
    )
  }
`;

const StripeCheckoutButton = ({ order }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [signStripeMutation] = useMutation<any>(SIGN_STRIPE_MUTATION);

  const successUrl = `${window.location.origin}/order/${order._id}/success`;
  // const cancelUrl = `${window.location.origin}/checkout`;
  // const errorUrl = `${window.location.origin}/checkout?error=1`;

  const sign = async () => {
    try {
      const transactionContext = {};
      const { data } = await signStripeMutation({
        variables: { orderPaymentId: order.payment._id, transactionContext },
      });
      if (data?.signPaymentProviderForCheckout) {
        setClientSecret(data.signPaymentProviderForCheckout);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    sign();
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
  return <div>Loading...</div>;
};

export default StripeCheckoutButton;
