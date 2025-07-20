import { useMutation, gql } from '@apollo/client';

const SET_ORDER_DELIVERY_PROVIDER_MUTATION = gql`
  mutation SetOrderDeliverProvider($orderId: ID!, $deliveryProviderId: ID!) {
    setOrderDeliveryProvider(
      orderId: $orderId
      deliveryProviderId: $deliveryProviderId
    ) {
      _id
      status
      delivery {
        status
      }
    }
  }
`;

const useSetOrderDeliveryProviderMutation = () => {
  const [setOrderDeliveryProviderMutation] = useMutation(
    SET_ORDER_DELIVERY_PROVIDER_MUTATION,
  );

  const setOrderDeliveryProvider = async ({ orderId, deliveryProviderId }) => {
    await setOrderDeliveryProviderMutation({
      variables: { orderId, deliveryProviderId },
    });
  };

  return {
    setOrderDeliveryProvider,
  };
};

export default useSetOrderDeliveryProviderMutation;
