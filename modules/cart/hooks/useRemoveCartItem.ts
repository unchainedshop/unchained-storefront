import { gql } from '@apollo/client';

import { useMutation } from '@apollo/client/react';

export const REMOVE_CART_ITEM_MUTATION = gql`
  mutation RemoveCartItem($itemId: ID!) {
    removeCartItem(itemId: $itemId) {
      _id
      order {
        _id
        items {
          _id
          total {
            amount
            currencyCode
          }
          unitPrice {
            amount
            currencyCode
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
      }
    }
  }
`;

const useRemoveCartItem = () => {
  const [removeCartItemMutation] = useMutation<any>(REMOVE_CART_ITEM_MUTATION);

  const removeCartItem = async ({ itemId }) => {
    await removeCartItemMutation({ variables: { itemId } });
  };

  return {
    removeCartItem,
  };
};

export default useRemoveCartItem;
