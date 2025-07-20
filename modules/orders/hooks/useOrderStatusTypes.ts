import { useQuery, gql } from '@apollo/client';

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
  const { data, loading, error } = useQuery(OrderStatusTypesQuery);

  const orderStatusType = data?.orderStatusType?.options || [];

  return {
    orderStatusType,
    loading,
    error,
  };
};

export default useOrderStatusTypes;
