import { gql } from '@apollo/client';

const ProductPriceFragment = gql`
  fragment ProductPriceFragment on Product {
    ... on SimpleProduct {
      simulatedPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
      catalogPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
      leveledCatalogPrices(currencyCode: $currency) {
        minQuantity
        maxQuantity
        price {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
      }
    }
    ... on PlanProduct {
      simulatedPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
      catalogPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
      leveledCatalogPrices(currencyCode: $currency) {
        minQuantity
        maxQuantity
        price {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
      }
    }
    ... on TokenizedProduct {
      simulatedPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
      catalogPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
      leveledCatalogPrices(currencyCode: $currency) {
        minQuantity
        maxQuantity
        price {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
      }
    }
    ... on ConfigurableProduct {
      catalogPriceRange(currencyCode: $currency) {
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
      simulatedPriceRange(currencyCode: $currency) {
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
    ... on BundleProduct {
      simulatedPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
      leveledCatalogPrices(currencyCode: $currency) {
        minQuantity
        maxQuantity
        price {
          isTaxable
          isNetPrice
          amount
          currencyCode
        }
      }
      catalogPrice(currencyCode: $currency) {
        isTaxable
        isNetPrice
        amount
        currencyCode
      }
    }
  }
`;

export default ProductPriceFragment;
