import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const DeliveryProvidersTypeQuery = gql`
  query DeliveryProvidersType {
    deliveryProviderType: __type(name: "DeliveryProviderType") {
      options: enumValues {
        value: name
        label: description
      }
    }
  }
`;

const useDeliveryProviderTypes = () => {
  const { data, loading, error } = useQuery<any>(DeliveryProvidersTypeQuery);

  const deliveryProviderType = data?.deliveryProviderType?.options || [];

  return {
    deliveryProviderType,
    loading,
    error,
  };
};

export default useDeliveryProviderTypes;
