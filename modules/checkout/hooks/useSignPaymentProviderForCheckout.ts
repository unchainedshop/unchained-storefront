import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const SIGN_SAFERPAY_MUTATION = gql`
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

const useSignPaymentProviderForCheckout = () => {
  const [signSaferpayMutation] = useMutation<any>(SIGN_SAFERPAY_MUTATION);

  const sign = async ({
    orderPaymentId,
    transactionContext = {},
  }: {
    orderPaymentId: string;
    transactionContext?: any;
  }) => {
    try {
      const { data } = await signSaferpayMutation({
        variables: { orderPaymentId, transactionContext },
      });

      if (data?.signPaymentProviderForCheckout) {
        return data.signPaymentProviderForCheckout;
      } else {
        throw new Error('Payment initialization failed.');
      }
    } catch (err) {
      console.error('Error initializing Saferpay transaction:', err);
      throw new Error('Error initializing payment. Please try again.');
    }
  };

  return { sign };
};

export default useSignPaymentProviderForCheckout;
