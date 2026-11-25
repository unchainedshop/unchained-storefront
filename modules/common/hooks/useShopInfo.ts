import { gql } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const SHOP_INFO_QUERY = gql`
  query ShopInfo {
    shopInfo {
      _id
      vapidPublicKey
      version
      adminUiConfig {
        loginCodeEnabled
      }
    }
  }
`;

const useShopInfo = () => {
  const { data, loading, error } = useQuery<GQL.ShopInfoQuery, GQL.ShopInfoQueryVariables>(SHOP_INFO_QUERY);

  return {
    loading,
    error,
    shopInfo: data?.shopInfo,
    loginCodeEnabled: Boolean(data?.shopInfo?.adminUiConfig?.loginCodeEnabled),
  };
};

export default useShopInfo;
