import { useMutation, gql } from "@apollo/client";

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
  const [updateCartPaymentMutation] = useMutation(
    UPDATE_CART_PAYMENT_PROVIDER_MUTATION,
  );

  const updateCartPayment = async ({ paymentProviderId }) => {
    await updateCartPaymentMutation({ variables: { paymentProviderId } });
  };

  return {
    updateCartPayment,
  };
};

export default useUpdateCartPayment;
