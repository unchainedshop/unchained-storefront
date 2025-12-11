import { gql } from '@apollo/client';
import TokenFragment from '../../products/fragments/TokenFragment';

const OrderItemFragment = gql`
  fragment OrderItemDetails on OrderItem {
    _id
    order {
      _id
    }
    product {
      _id
      texts {
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
    tokens {
      ...TokenFragment
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
  ${TokenFragment}
`;

export default OrderItemFragment;
