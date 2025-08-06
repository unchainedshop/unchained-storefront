import { gql } from '@apollo/client';

const ProductPriceFragment = gql`
  fragment ProductPriceFragment on Product {
    ... on SimpleProduct {
      simulatedPrice {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
    }
    ... on PlanProduct {
      simulatedPrice {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
    }
    ... on TokenizedProduct {
      simulatedPrice {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
    }
    ... on ConfigurableProduct {
      catalogPriceRange {
        minPrice {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
        maxPrice {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
      }
      simulatedPriceRange {
        minPrice {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
        maxPrice {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
      }
    }
  }
`;

export default ProductPriceFragment;
