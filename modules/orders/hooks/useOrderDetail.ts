import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import OrderDetailFragment from '../fragments/OrderDetailFragment';

export const ORDER_DETAIL_QUERY = gql`
  query OrderDetailQuery($orderId: ID!) {
    order(orderId: $orderId) {
      ...OrderDetailFragment
    }
  }
  ${OrderDetailFragment}
`;

const useOrderDetail = ({ orderId }) => {
  const { data, loading, error, ...rest } = useQuery<any>(ORDER_DETAIL_QUERY, {
    variables: { orderId },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    ssr: false,
    skip: !orderId,
  });

  return {
    order: data?.order,
    loading,
    error,
    ...rest,
  };
};

export default useOrderDetail;
