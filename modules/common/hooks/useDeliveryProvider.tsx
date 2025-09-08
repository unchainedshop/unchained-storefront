import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

export const DELIVERY_PROVIDERS_QUERY = gql`
  query DeliveryProvidersQuery($type: DeliveryProviderType) {
    deliveryProviders(type: $type) {
      _id
      isActive
      created
      updated
      deleted
      type
      interface {
        _id
        label
        version
      }
    }
  }
`;

const useDeliveryProviders = ({ type = null } = {}) => {
  const { data, loading, error } = useQuery<any>(DELIVERY_PROVIDERS_QUERY, {
    variables: { type },
  });

  return {
    loading,
    error,
    deliveryProviders: data?.deliveryProviders || [],
  };
};

export default useDeliveryProviders;
