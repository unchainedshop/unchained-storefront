import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import useEnsureUser from '../../auth/hooks/useEnsureUser';
import CartTotalsFragment from '../../orders/fragments/CartTotalsFragment';
import type * as GQL from '../../apollo/generated';

const AddMultipleCartProductsMutation = gql`
  mutation AddMultipleCartProducts($orderId: ID, $items: [OrderItemInput!]!) {
    addMultipleCartProducts(orderId: $orderId, items: $items) {
      _id
      items {
        _id
        quantity
      }
      ...CartTotalsFragment
    }
  }
  ${CartTotalsFragment}
`;

const useAddMultipleCartProducts = () => {
  const { user, ensureUser } = useEnsureUser();
  const [addMultipleCartProductsMutation, { loading }] = useMutation<
    GQL.AddMultipleCartProductsMutation,
    GQL.AddMultipleCartProductsMutationVariables
  >(AddMultipleCartProductsMutation);

  const addMultipleCartProducts = async (items: { productId: string; quantity?: number }[]) => {
    await ensureUser();
    return addMultipleCartProductsMutation({
      variables: {
        orderId: user?.cart?._id,
        items: items.map(({ productId, quantity }) => ({ productId, quantity: quantity || 1 })),
      },
      refetchQueries: ['User'],
    });
  };

  return { addMultipleCartProducts, loading };
};

export default useAddMultipleCartProducts;
