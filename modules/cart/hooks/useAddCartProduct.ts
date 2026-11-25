import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import useEnsureUser from '../../auth/hooks/useEnsureUser';
import CartTotalsFragment from '../../orders/fragments/CartTotalsFragment';
import type * as GQL from '../../apollo/generated';

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
        ...CartTotalsFragment
        user {
          _id
          cart {
            _id
          }
        }
      }
    }
  }
  ${CartTotalsFragment}
`;

const useAddCartProduct = () => {
  const [addCartProductMutation, { client, ...mutationResults }] =
    useMutation<GQL.AddCartProductMutation, GQL.AddCartProductMutationVariables>(ADD_CART_PRODUCT_MUTATION);
  const { user, ensureUser, refetchQueries } = useEnsureUser();

  const addCartProduct = async (
    variables: {
      configuration: Array<{ key: string; value: string }>;
      quantity: number;
      productId: string;
    },
    options,
  ) => {
    try {
      await ensureUser();
      await addCartProductMutation({
        variables: {
          ...variables,
          orderId: user?.cart?._id,
        },
        refetchQueries,
        ...options,
      });
      return true;
    } catch (err: any) {
      if (err.message.toLowerCase().includes('not enough in stock')) {
        alert('Out of stock');
      }
      return false;
    }
  };

  return [addCartProduct, mutationResults];
};

export default useAddCartProduct;
