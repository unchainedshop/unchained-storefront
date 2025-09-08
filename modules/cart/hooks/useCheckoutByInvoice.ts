import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const CHECKOUT_CART_BY_INVOICE_MUTATION = gql`
  mutation CheckoutCartByInvoice {
    checkoutCart {
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

const useCheckoutByInvoice = () => {
  const [checkoutByInvoiceMutation] = useMutation<any>(
    CHECKOUT_CART_BY_INVOICE_MUTATION,
  );

  const checkoutByInvoice = async () => checkoutByInvoiceMutation();

  return {
    checkoutByInvoice,
  };
};

export default useCheckoutByInvoice;
