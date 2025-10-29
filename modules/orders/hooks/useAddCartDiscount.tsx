import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const AddCartDiscountMutation = gql`
  mutation AddCartDiscount($orderId: ID, $code: String!) {
    addCartDiscount(orderId: $orderId, code: $code) {
      _id
    }
  }
`;

const useAddCartDiscount = () => {
  const [addCartDiscountMutation] = useMutation(AddCartDiscountMutation, {
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
