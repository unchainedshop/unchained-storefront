import { gql } from '@apollo/client';
import ProductDetailFragment from '../fragments/ProductFragment';
import { useQuery } from '@apollo/client/react';

export const TokenQuery = gql`
  query TokenScanInfo($tokenId: ID!) {
    token(tokenId: $tokenId) {
      _id
      status
      quantity
      user {
        _id
        name
        lastContact {
          emailAddress
          telNumber
        }
      }
      walletAddress
      chainId
      ercMetadata
      product {
        ... on TokenizedProduct {
          contractStandard
          contractAddress
          contractConfiguration {
            tokenId
            supply
            ercMetadataProperties
          }
          texts {
            _id
            slug
            title
            subtitle
            labels
          }
        }
        ...ProductDetailFragment
      }
      invalidatedDate
      isInvalidateable
      accessKey

      tokenSerialNumber

      expiryDate
      contractAddress
    }
  }
  ${ProductDetailFragment}
`;

const useToken = ({ tokenId, hash = null }) => {
  const { data, error, loading } = useQuery<any>(TokenQuery, {
    variables: { tokenId },
    notifyOnNetworkStatusChange: true,
  });
  return {
    token: data?.token,
    loading,
    error,
  };
};

export default useToken;
