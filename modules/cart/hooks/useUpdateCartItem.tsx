import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

export const UPDATE_CART_ITEM_MUTATION = gql`
  mutation UpdateCartItem($itemId: ID!, $quantity: Int = 1) {
    updateCartItem(itemId: $itemId, quantity: $quantity) {
      _id
      quantity
      total {
        amount
        currencyCode
      }
      order {
        _id
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
      }
    }
  }
`;

const useUpdateCartItem = () => {
  const [updateCartItemMutation] = useMutation<GQL.UpdateCartItemMutation, GQL.UpdateCartItemMutationVariables>(UPDATE_CART_ITEM_MUTATION);

  const updateCartItem = async ({ itemId, quantity = 1 }) => {
    await updateCartItemMutation({
      variables: { itemId, quantity },
      refetchQueries: ['User'],
    });
  };

  return {
    updateCartItem,
  };
};

export default useUpdateCartItem;
