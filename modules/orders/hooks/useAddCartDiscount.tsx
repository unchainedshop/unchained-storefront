import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type * as GQL from '../../apollo/generated';

const AddCartDiscountMutation = gql`
  mutation AddCartDiscount($orderId: ID, $code: String!) {
    addCartDiscount(orderId: $orderId, code: $code) {
      _id
    }
  }
`;

const useAddCartDiscount = () => {
  const [addCartDiscountMutation] = useMutation<GQL.AddCartDiscountMutation, GQL.AddCartDiscountMutationVariables>(AddCartDiscountMutation, {
    refetchQueries: ['User'],
  });

  const addCartDiscount = async ({ orderId, code }) => {
    return await addCartDiscountMutation({
      variables: { orderId, code },
    });
  };

  return {
    addCartDiscount,
  };
};

export default useAddCartDiscount;
