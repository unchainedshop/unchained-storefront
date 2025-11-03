import { gql } from '@apollo/client';
import AddressFragment from '../../common/fragments/AddressFragment';

const OrderDeliveryPickUpFragment = gql`
  fragment OrderDeliveryPickUpFragment on OrderDeliveryPickUp {
    _id
    provider {
      _id
      interface {
        _id
        label
        version
      }
    }
    status
    fee {
      isTaxable
      isNetPrice
      amount
      currencyCode
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

    activePickUpLocation {
      _id
      name
      address {
        ...AddressFragment
      }
      geoPoint {
        latitude
        longitude
        altitute
      }
    }
    pickUpLocations {
      _id
      name
      address {
        ...AddressFragment
      }
      geoPoint {
        latitude
        longitude
        altitute
      }
    }
  }
  ${AddressFragment}
`;

export default OrderDeliveryPickUpFragment;
