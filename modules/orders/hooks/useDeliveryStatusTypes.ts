import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

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
  const { data, loading, error } = useQuery<GQL.OrderDeliveryStatusQuery, GQL.OrderDeliveryStatusQueryVariables>(DeliveryStatusTypesQuery);

  const deliveryStatusType = data?.deliveryStatusType?.options || [];

  return {
    deliveryStatusType,
    loading,
    error,
  };
};

export default useDeliveryStatusTypes;
