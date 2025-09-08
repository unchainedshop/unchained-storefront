import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

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
  const { data, loading, error } = useQuery<any>(OrderStatusTypesQuery);

  const orderStatusType = data?.orderStatusType?.options || [];

  return {
    orderStatusType,
    loading,
    error,
  };
};

export default useOrderStatusTypes;
