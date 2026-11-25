import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const USER_TOKENS_QUERY = gql`
  query UserTokens {
    me {
      _id
      tokens {
        _id
        walletAddress
        chainId
        tokenSerialNumber
        ercMetadata
        product {
          _id
        }
        status
        quantity
        isInvalidateable
        expiryDate
        contractAddress
        accessKey
      }
    }
  }
`;

const useUserTokens = () => {
  const { data, loading, error } = useQuery<GQL.UserTokensQuery, GQL.UserTokensQueryVariables>(USER_TOKENS_QUERY);

  return {
    loading,
    error,
    tokens: data?.me?.tokens,
  };
};

export default useUserTokens;
