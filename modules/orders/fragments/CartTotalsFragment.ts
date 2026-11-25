import { gql } from '@apollo/client';

const CartTotalsFragment = gql`
  fragment CartTotalsFragment on Order {
    itemsTotal: total(category: ITEMS) {
      amount
      currencyCode
    }
    discountsTotal: total(category: DISCOUNTS) {
      amount
      currencyCode
    }
    taxesTotal: total(category: TAXES) {
      amount
      currencyCode
    }
    deliveryTotal: total(category: DELIVERY) {
      amount
      currencyCode
    }
    paymentTotal: total(category: PAYMENT) {
      amount
      currencyCode
    }
    grandTotal: total {
      amount
      currencyCode
    }
    discounts {
      _id
      code
      total {
        amount
        currencyCode
      }
    }
  }
`;

export default CartTotalsFragment;
