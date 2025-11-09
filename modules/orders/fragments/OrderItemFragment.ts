import { gql } from '@apollo/client';

const OrderItemFragment = gql`
  fragment OrderItemDetails on OrderItem {
    _id
    product {
      _id
      texts(forceLocale: $locale) {
        _id
        slug
        brand
        vendor
        title
        subtitle
      }
      media {
        _id
        file {
          _id
          url
        }
      }
    }
    quantity
    discounts {
      orderDiscount {
        total {
          amount
          currencyCode
        }
        code
      }
      total {
        amount
        currencyCode
      }
    }
    unitPrice {
      amount
      isTaxable
      isNetPrice
      currencyCode
    }
    total {
      amount
      isTaxable
      isNetPrice
      currencyCode
    }
  }
`;

export default OrderItemFragment;
