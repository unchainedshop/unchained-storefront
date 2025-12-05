import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const CHECKOUT_CART_MUTATION = gql`
  mutation CheckoutCart(
    $deliveryContext: JSON
    $paymentContext: JSON
    $orderId: ID
  ) {
    checkoutCart(
      deliveryContext: $deliveryContext
      paymentContext: $paymentContext
      orderId: $orderId
    ) {
      _id
      status
      user {
        _id
        tokens {
          _id
        }
        cart {
          _id
          items {
            _id
          }
        }
      }
    }
  }
`;

const useCheckoutCart = () => {
  const [checkoutCartMutation] = useMutation<any>(CHECKOUT_CART_MUTATION);

  const checkoutCart = async ({
    orderId = null,
    paymentContext = {},
    deliveryContext = {},
  } = {}) => {
    return checkoutCartMutation({
      variables: { orderId, paymentContext, deliveryContext },
    });
  };

  return {
    checkoutCart,
  };
};

export default useCheckoutCart;
