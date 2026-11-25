import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const EmptyCartMutation = gql`
  mutation EmptyCart($orderId: ID) {
    emptyCart(orderId: $orderId) {
      _id
    }
  }
`;

const useEmptyCart = () => {
  const [emptyCartMutation, { loading }] = useMutation<GQL.EmptyCartMutation, GQL.EmptyCartMutationVariables>(
    EmptyCartMutation,
    { refetchQueries: ['User', 'CartCheckout'] },
  );

  return {
    emptyCart: (orderId?: string) => emptyCartMutation({ variables: { orderId } }),
    loading,
  };
};

export default useEmptyCart;
