import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

const DeliveryStatusTypesQuery = gql`
  query OrderDeliveryStatus {
    deliveryStatusType: __type(name: "OrderDeliveryStatus") {
      options: enumValues {
        value: name
        label: description
      }
    }
  }
`;

const useDeliveryStatusTypes = () => {
  const { data, loading, error } = useQuery<any>(DeliveryStatusTypesQuery);

  const deliveryStatusType = data?.deliveryStatusType?.options || [];

  return {
    deliveryStatusType,
    loading,
    error,
  };
};

export default useDeliveryStatusTypes;
