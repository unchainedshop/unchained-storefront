import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const UPDATE_CART_BILLING_ADDRESS_MUTATION = gql`
  mutation UpdateCartBillingAddress($billingAddress: AddressInput) {
    updateCart(billingAddress: $billingAddress) {
      _id
      billingAddress {
        firstName
        lastName
        addressLine
        addressLine2
        postalCode
        city
        regionCode
        countryCode
      }
    }
  }
`;

const useUpdateCartBillingAddress = () => {
  const [updateCartMutation] = useMutation<any>(
    UPDATE_CART_BILLING_ADDRESS_MUTATION,
  );

  const updateCartBillingAddress = async ({ address }) => {
    await updateCartMutation({
      variables: {
        billingAddress: address,
      },
    });
  };

  return {
    updateCartBillingAddress,
  };
};

export default useUpdateCartBillingAddress;
