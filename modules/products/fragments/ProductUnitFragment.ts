import { gql } from '@apollo/client';

const ProductUnitFragment = gql`
  fragment ProductUnitFragment on Product {
    ... on SimpleProduct {
      sku
      baseUnit
      salesUnit
      salesQuantityPerUnit
      defaultOrderQuantity
    }
    ... on BundleProduct {
      salesUnit
      salesQuantityPerUnit
      defaultOrderQuantity
    }
    ... on PlanProduct {
      salesUnit
      salesQuantityPerUnit
      defaultOrderQuantity
    }
  }
`;

export default ProductUnitFragment;
