import { gql } from '@apollo/client';
import ProductPriceFragment from './ProductPriceFragment';

const ProductDetailFragment = gql`
  fragment ProductFragment on Product {
    _id
    tags
    media {
      _id
      file {
        _id
        name
        url
      }
    }
    texts {
      _id
      title
      subtitle
      description
      slug
      labels
      vendor
      brand
    }
    reviews {
      _id
      created
      deleted
      updated

      rating
      title
      review
    }
    ... on TokenizedProduct {
      contractConfiguration {
        tokenId
        supply
      }
      contractStandard
      contractAddress
      tokensCount
    }
    ... on PlanProduct {
      plan {
        usageCalculationType
        billingInterval
        billingIntervalCount
        trialInterval
        trialIntervalCount
      }
      salesQuantityPerUnit
      defaultOrderQuantity
    }
    ... on SimpleProduct {
      dimensions {
        width
        height
        length
        weight
      }
    }

    ... on BundleProduct {
      bundleItems {
        product {
          _id
          media {
            _id
            file {
              _id
              name
              url
            }
          }
          ...ProductPriceFragment
        }
      }
    }
    ... on ConfigurableProduct {
      variations {
        _id
        texts {
          _id
          title
          subtitle
        }
        type
        key
        options {
          _id
          texts {
            _id
            title
            subtitle
          }
          value
        }
      }
    }
  }
  ${ProductPriceFragment}
`;

export default ProductDetailFragment;
