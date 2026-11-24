import { gql } from '@apollo/client';
import AddressFragment from '../../common/fragments/AddressFragment';
import CartTotalsFragment from '../../orders/fragments/CartTotalsFragment';
import ProductDetailFragment from '../../products/fragments/ProductFragment';
import ProductPriceFragment from '../../products/fragments/ProductPriceFragment';

const CurrentUserFragment = gql`
  fragment CurrentUser on User {
    _id
    isGuest
    primaryEmail {
      address
    }
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
      ...CartTotalsFragment
      billingAddress {
        ...AddressFragment
      }

      contact {
        telNumber
        emailAddress
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
        simulatedPrice(currencyCode: $currency) {
          amount
          currencyCode
        }
      }
    }
  }
  ${ProductDetailFragment}
  ${AddressFragment}
  ${CartTotalsFragment}
  ${ProductPriceFragment}
`;

export default CurrentUserFragment;
