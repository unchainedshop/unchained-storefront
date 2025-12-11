import { gql } from '@apollo/client';
import ProductPriceFragment from './ProductPriceFragment';

const ProductListItemFragment = gql`
  fragment ProductListItemFragment on Product {
    _id
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
    ...ProductPriceFragment
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
    }
  }
  ${ProductPriceFragment}
`;

export default ProductListItemFragment;
