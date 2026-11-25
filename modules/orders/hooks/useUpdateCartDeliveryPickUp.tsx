import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const UpdateCartDeliveryPickUpMutation = gql`
  mutation UpdateCartDeliveryPickUp(
    $deliveryProviderId: ID!
    $meta: JSON
    $orderId: ID
    $orderPickUpLocationId: ID!
  ) {
    updateCartDeliveryPickUp(
      deliveryProviderId: $deliveryProviderId
      meta: $meta
      orderPickUpLocationId: $orderPickUpLocationId
      orderId: $orderId
    ) {
      _id
    }
  }
`;

const useUpdateCartDeliveryPickUp = () => {
  const [updateCartDeliveryPickUpMutation] = useMutation<GQL.UpdateCartDeliveryPickUpMutation, GQL.UpdateCartDeliveryPickUpMutationVariables>(UpdateCartDeliveryPickUpMutation,
    {
      refetchQueries: ['CartCheckout'],
    },
  );

  const updateCartDeliveryPickUp = async ({
    orderId = null,
    orderPickUpLocationId,
    meta = null,
    deliveryProviderId,
  }) => {
    return await updateCartDeliveryPickUpMutation({
      variables: { orderId, orderPickUpLocationId, meta, deliveryProviderId },
    });
  };

  return {
    updateCartDeliveryPickUp,
  };
};

export default useUpdateCartDeliveryPickUp;
