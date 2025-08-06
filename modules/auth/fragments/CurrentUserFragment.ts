import { gql } from '@apollo/client';
import AddressFragment from '../../common/fragments/AddressFragment';
import ProductFragment from '../../products/fragments/ProductFragment';
import ProductPriceFragment from '../../products/fragments/ProductPriceFragment';

const CurrentUserFragment = gql`
  fragment CurrentUser on User {
    _id
    isGuest
    name
    username
    pushSubscriptions {
      endpoint
      _id
      userAgent
      expirationTime
    }
    emails {
      address
      verified
    }
    roles
    orders {
      _id
    }
    isInitialPassword
    lastLogin {
      timestamp
      countryCode
      locale
    }
    bookmarks {
      _id
      created
      product {
        ...ProductDetails
        ...ProductPriceFragment
      }
    }

    profile {
      phoneMobile
      address {
        ...AddressFragment
      }
    }
    cart {
      _id
      billingAddress {
        ...AddressFragment
      }

      contact {
        telNumber
        emailAddress
      }
      itemsTotal: total(category: ITEMS) {
        amount
        currencyCode
      }
      items {
        _id
        quantity
        unitPrice {
          amount
          currencyCode
        }
        total {
          amount
          currencyCode
        }
        product {
          ...ProductDetails
          ...ProductPriceFragment
        }
      }
      paymentInfo: payment {
        _id
        status
        provider {
          _id
          type
          interface {
            _id
            label
            version
          }
        }
        ... on OrderPaymentGeneric {
          _id
        }
      }
      taxes: total(category: TAXES) {
        amount
        currencyCode
      }
      delivery: total(category: DELIVERY) {
        amount
        currencyCode
      }
      payment: total(category: PAYMENT) {
        amount
        currencyCode
      }
      deliveryInfo: delivery {
        _id
        provider {
          _id
        }
        ... on OrderDeliveryShipping {
          address {
            ...AddressFragment
          }
        }
      }
      total {
        amount
        currencyCode
      }
      currency {
        _id
        isoCode
      }
      supportedPaymentProviders {
        _id
        type
        interface {
          _id
          label
          version
        }
      }
      supportedDeliveryProviders {
        _id
        type
        interface {
          _id
          label
          version
        }
        simulatedPrice {
          amount
          currencyCode
        }
      }
    }
  }
  ${ProductFragment}
  ${AddressFragment}
  ${ProductPriceFragment}
`;

export default CurrentUserFragment;
