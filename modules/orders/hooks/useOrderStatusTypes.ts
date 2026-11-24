import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const OrderStatusTypesQuery = gql`
  query OrderStatus {
    orderStatusType: __type(name: "OrderStatus") {
      options: enumValues {
        value: name
        label: description
      }
    }
  }
`;

const useOrderStatusTypes = () => {
  const { data, loading, error } = useQuery<GQL.OrderStatusQuery, GQL.OrderStatusQueryVariables>(OrderStatusTypesQuery);

  const orderStatusType = data?.orderStatusType?.options || [];

  return {
    orderStatusType,
    loading,
    error,
  };
};

export default useOrderStatusTypes;
