import { useQuery, gql } from '@apollo/client';

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
  const { data, loading, error } = useQuery(DeliveryStatusTypesQuery);

  const deliveryStatusType = data?.deliveryStatusType?.options || [];

  return {
    deliveryStatusType,
    loading,
    error,
  };
};

export default useDeliveryStatusTypes;
