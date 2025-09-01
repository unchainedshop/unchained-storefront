import { gql } from '@apollo/client';
import ProductPriceFragment from './ProductPriceFragment';

const ProductDetailFragment = gql`
  fragment ProductDetails on Product {
    _id
    media {
      _id
      file {
        _id
        name
        url
      }
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
    ... on PlanProduct {
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
    }
    ... on SimpleProduct {
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
      dimensions {
        width
        height
        length
        weight
      }
    }

    ... on BundleProduct {
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
