import { gql } from '@apollo/client';
import AddressFragment from '../../common/fragments/AddressFragment';

const OrderDeliveryShippingFragment = gql`
  fragment OrderDeliveryShippingFragment on OrderDeliveryShipping {
    _id
    fee {
      amount
      currencyCode
    }
    address {
      ...AddressFragment
    }
    discounts {
      orderDiscount {
        _id
        code
        total {
          amount
          currencyCode
        }
        discounted {
          _id
          total {
            amount
            currencyCode
          }
        }
      }
      _id
      total {
        amount
        currencyCode
      }
    }

    provider {
      _id
      type
      simulatedPrice {
        amount
        currencyCode
      }

      interface {
        _id
        label
        version
      }
    }
  }
  ${AddressFragment}
`;

export default OrderDeliveryShippingFragment;
