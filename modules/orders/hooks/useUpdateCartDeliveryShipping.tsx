import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const UpdateCartDeliveryShippingMutation = gql`
  mutation UpdateCartDeliveryShipping(
    $deliveryProviderId: ID!
    $meta: JSON
    $orderId: ID
    $address: AddressInput
  ) {
    updateCartDeliveryShipping(
      deliveryProviderId: $deliveryProviderId
      meta: $meta
      orderId: $orderId
      address: $address
    ) {
      _id
    }
  }
`;

const useUpdateCartDeliveryShipping = () => {
  const [updateCartDeliveryShippingMutation] = useMutation<GQL.UpdateCartDeliveryShippingMutation, GQL.UpdateCartDeliveryShippingMutationVariables>(UpdateCartDeliveryShippingMutation,
    {
      refetchQueries: ['CartCheckout'],
    },
  );

  const updateCartDeliveryShipping = async ({
    orderId = null,
    address = null,
    meta = null,
    deliveryProviderId,
  }) => {
    return await updateCartDeliveryShippingMutation({
      variables: { orderId, address, meta, deliveryProviderId },
    });
  };

  return {
    updateCartDeliveryShipping,
  };
};

export default useUpdateCartDeliveryShipping;
