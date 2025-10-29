import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { LOGIN_AS_GUEST_MUTATION } from '../../auth/hooks/useLoginAsGuest';
import useUser from '../../auth/hooks/useUser';

export const ADD_CART_PRODUCT_MUTATION = gql`
  mutation AddCartProduct(
    $orderId: ID
    $productId: ID!
    $quantity: Int
    $configuration: [ProductConfigurationParameterInput!]
  ) {
    addCartProduct(
      productId: $productId
      quantity: $quantity
      configuration: $configuration
      orderId: $orderId
    ) {
      _id
      order {
        _id
        items {
          _id
          quantity
          total {
            amount
            currencyCode
          }
          unitPrice {
            amount
            currencyCode
          }
          discounts {
            orderDiscount {
              total {
                amount
                currencyCode
              }
              code
            }
            total {
              amount
              currencyCode
            }
          }
        }
        itemsTotal: total(category: ITEMS) {
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
        total {
          amount
          currencyCode
        }
        user {
          _id
          cart {
            _id
          }
        }
      }
    }
  }
`;

const useAddCartProduct = () => {
  const [addCartProductMutation, { client, ...mutationResults }] =
    useMutation<any>(ADD_CART_PRODUCT_MUTATION);
  const { user } = useUser();
  const [loginAsGuestMutation] = useMutation<any>(LOGIN_AS_GUEST_MUTATION);

  const addCartProduct = async (
    variables: {
      configuration: Array<{ key: string; value: string }>;
      quantity: number;
      productId: string;
    },
    options,
  ) => {
    try {
      if (!user) {
        await loginAsGuestMutation({
          awaitRefetchQueries: true,
        });
        await client.resetStore();
      }
      await addCartProductMutation({
        variables: {
          ...variables,
          orderId: user?.cart?._id,
        },
        ...options,
      });
    } catch (err: any) {
      if (err.message.toLowerCase().includes('not enough in stock')) {
        alert('Out of stock');
      }
    }
  };

  return [addCartProduct, mutationResults];
};

export default useAddCartProduct;
