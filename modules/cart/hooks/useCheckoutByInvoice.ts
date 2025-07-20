import { useMutation, gql } from '@apollo/client';

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
  const [checkoutByInvoiceMutation] = useMutation(
    CHECKOUT_CART_BY_INVOICE_MUTATION,
  );

  const checkoutByInvoice = async () => checkoutByInvoiceMutation();

  return {
    checkoutByInvoice,
  };
};

export default useCheckoutByInvoice;
