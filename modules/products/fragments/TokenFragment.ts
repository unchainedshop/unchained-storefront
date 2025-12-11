import { gql } from '@apollo/client';

const TokenFragment = gql`
  fragment TokenFragment on Token {
    _id
    status
    quantity
    invalidatedDate
    accessKey
    isInvalidateable
    ercMetadata
    user {
      _id
    }
    product {
      _id
      tags
      texts {
        _id
        slug
        title
        subtitle
        labels
        description
      }
      media {
        _id
        file {
          _id
          url
        }
      }
      ... on TokenizedProduct {
        simulatedPrice(currencyCode: $currency) {
          amount
          currencyCode
        }
        simulatedStocks {
          quantity
        }
      }
    }
  }
`;

export default TokenFragment;
