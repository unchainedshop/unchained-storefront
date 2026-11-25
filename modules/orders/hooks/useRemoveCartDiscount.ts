import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const RemoveCartDiscountMutation = gql`
  mutation RemoveCartDiscount($discountId: ID!) {
    removeCartDiscount(discountId: $discountId) {
      _id
    }
  }
`;

const useRemoveCartDiscount = () => {
  const [removeCartDiscountMutation] = useMutation<
    GQL.RemoveCartDiscountMutation,
    GQL.RemoveCartDiscountMutationVariables
  >(RemoveCartDiscountMutation, { refetchQueries: ['User', 'CartCheckout'] });

  const removeCartDiscount = async ({ discountId }) => removeCartDiscountMutation({ variables: { discountId } });

  return { removeCartDiscount };
};

export default useRemoveCartDiscount;
