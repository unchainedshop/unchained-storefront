import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const UPDATE_CART_PAYMENT_PROVIDER_MUTATION = gql`
  mutation UpdateCartPaymentProvider($paymentProviderId: ID) {
    updateCart(paymentProviderId: $paymentProviderId) {
      _id
      payment {
        _id
        provider {
          _id
        }
      }
      status
      taxes: total(category: TAXES) {
        amount
        currencyCode
      }
      total {
        amount
        currencyCode
      }
    }
  }
`;

const useUpdateCartPayment = () => {
  const [updateCartPaymentMutation] = useMutation<GQL.UpdateCartPaymentProviderMutation, GQL.UpdateCartPaymentProviderMutationVariables>(UPDATE_CART_PAYMENT_PROVIDER_MUTATION,
  );

  const updateCartPayment = async ({ paymentProviderId }) => {
    await updateCartPaymentMutation({ variables: { paymentProviderId } });
  };

  return {
    updateCartPayment,
  };
};

export default useUpdateCartPayment;
