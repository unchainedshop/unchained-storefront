import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';

export const SHOP_INFO_QUERY = gql`
  query ShopInfo {
    shopInfo {
      _id
      vapidPublicKey
      version
    }
  }
`;

const useShopInfo = () => {
  const { data, loading, error } = useQuery<any>(SHOP_INFO_QUERY);

  return {
    loading,
    error,
    shopInfo: data?.shopInfo,
  };
};

export default useShopInfo;
