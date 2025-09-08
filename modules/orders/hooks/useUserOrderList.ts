import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

import OrderFragment from '../fragments/OrderFragment';

export const USER_ORDERS_QUERY = gql`
  query UserOrders {
    me {
      _id
      orders {
        ...OrderFragment
      }
    }
  }
  ${OrderFragment}
`;

const useOrderList = () => {
  const { data, loading, error } = useQuery<any>(USER_ORDERS_QUERY);

  return {
    orders: data?.me?.orders || [],
    loading,
    error,
  };
};

export default useOrderList;
