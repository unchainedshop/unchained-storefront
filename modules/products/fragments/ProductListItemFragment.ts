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
    ...ProductPriceFragment
    ... on PlanProduct {
      texts(forceLocale: $locale) {
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
      texts(forceLocale: $locale) {
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
      texts(forceLocale: $locale) {
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
      texts(forceLocale: $locale) {
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
