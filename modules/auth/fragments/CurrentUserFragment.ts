import { gql } from '@apollo/client';
import AddressFragment from '../../common/fragments/AddressFragment';
import ProductDetailFragment from '../../products/fragments/ProductFragment';
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
        ...ProductDetailFragment
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
      discounts {
        _id
        code
        total {
          amount
          currencyCode
        }
        discounted {
          total {
            amount
            currencyCode
          }
        }
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
          ...ProductDetailFragment
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
      discountsTotal: total(category: DISCOUNTS) {
        amount
        currencyCode
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
  ${ProductDetailFragment}
  ${AddressFragment}
  ${ProductPriceFragment}
`;

export default CurrentUserFragment;
