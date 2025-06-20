import { gql, useQuery } from "@apollo/client";
import ErrorMessage from "../common/components/ErrorMessage";
import CheckoutContact from "./CheckoutContact";
import CheckoutAddresses from "./CheckoutAddresses";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";
import { useAppContext } from "../common/components/AppContextWrapper";
import usePushNotification from "../context/push-notification/usePushNotification";

export const CART_CHECKOUT_QUERY = gql`
  query CartCheckout {
    me {
      _id
      cart {
        _id
        total(category: ITEMS) {
          amount
          currencyCode
        }
        payment {
          _id
          fee {
            amount
            currencyCode
          }
          provider {
            _id
            type
            interface {
              _id
              label
              version
            }
          }
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
        contact {
          telNumber
          emailAddress
        }
        billingAddress {
          firstName
          lastName
          addressLine
          addressLine2
          postalCode
          regionCode
          city
          countryCode
        }
        delivery {
          _id
          ... on OrderDeliveryShipping {
            address {
              firstName
              lastName
              addressLine
              addressLine2
              postalCode
              regionCode
              city
              countryCode
            }
          }
        }
      }
    }
  }
`;

const Checkout = () => {
  const { emailSupportDisabled } = useAppContext();
  const { loading, error, data } = useQuery(CART_CHECKOUT_QUERY, {
    notifyOnNetworkStatusChange: true,
  });
  const { isSubscribed } = usePushNotification();

  if (error) return <ErrorMessage message="Error loading cart" />;
  if (!data?.me?.cart) return <div>Loading</div>;

  const isAddressesMissing =
    !data.me.cart.delivery?.address?.firstName &&
    !data.me.cart.billingAddress?.firstName;
  const isContactDataMissing =
    !data.me.cart.contact?.emailAddress && !emailSupportDisabled;

  return (
    <>
      <div
        data-loading={loading}
        className={`mt-5 lg:grid lg:items-start lg:gap-x-12 ${
          isAddressesMissing ? "lg:grid-cols-2" : "lg:grid-cols-2"
        }`}
      >
        <CheckoutAddresses cart={data.me.cart} isInitial={isAddressesMissing} />
        {!isAddressesMissing && (
          <CheckoutContact
            cart={data.me.cart}
            isInitial={isContactDataMissing}
          />
        )}
        {!isAddressesMissing && !isContactDataMissing && (
          <CheckoutPaymentMethod
            cart={data.me.cart}
            disabled={isContactDataMissing}
          />
        )}
      </div>
      {isContactDataMissing && !isSubscribed && (
        <div className="bg-white p-8 rounded-lg text-center print:hidden">
          <h1 className="text-2xl font-semibold text-red-500">
            Contact address is require
          </h1>
          <p className="text-gray-600">
            You have not selected any method we can use to contact you. please
            select atleast one medium we can you send you information about your
            order status in order to complete your order
          </p>
        </div>
      )}
    </>
  );
};

export default Checkout;
