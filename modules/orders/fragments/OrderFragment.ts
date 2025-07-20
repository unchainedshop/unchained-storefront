import { gql } from '@apollo/client';

const OrderFragment = gql`
  fragment OrderFragment on Order {
    _id
    status
    created
    updated
    ordered
    country {
      flagEmoji
      name
    }
    delivery {
      _id
      provider {
        _id
        type
        simulatedPrice {
          amount
          currencyCode
        }
      }
      status
      fee {
        amount
        currencyCode
      }
    }
    orderNumber
    total {
      amount
      currencyCode
    }
    supportedPaymentProviders {
      _id
      type
    }
    supportedDeliveryProviders {
      _id
      type
      simulatedPrice {
        amount
        currencyCode
      }
    }

    payment {
      _id
      status
      paid
      fee {
        amount
        currencyCode
      }
      provider {
        _id
        type
        interface {
          _id
        }
      }
    }
  }
`;

export default OrderFragment;
