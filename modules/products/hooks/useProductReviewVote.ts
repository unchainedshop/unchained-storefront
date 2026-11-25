import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import ProductReviewFragment from '../fragments/ProductReviewFragment';
import type * as GQL from '../../apollo/generated';

const AddProductReviewVoteMutation = gql`
  mutation AddProductReviewVote($productReviewId: ID!, $type: ProductReviewVoteType!) {
    addProductReviewVote(productReviewId: $productReviewId, type: $type) {
      ...ProductReviewFragment
    }
  }
  ${ProductReviewFragment}
`;

const RemoveProductReviewVoteMutation = gql`
  mutation RemoveProductReviewVote($productReviewId: ID!, $type: ProductReviewVoteType) {
    removeProductReviewVote(productReviewId: $productReviewId, type: $type) {
      ...ProductReviewFragment
    }
  }
  ${ProductReviewFragment}
`;

const useProductReviewVote = () => {
  const [addVote] = useMutation<GQL.AddProductReviewVoteMutation, GQL.AddProductReviewVoteMutationVariables>(
    AddProductReviewVoteMutation,
  );
  const [removeVote] = useMutation<
    GQL.RemoveProductReviewVoteMutation,
    GQL.RemoveProductReviewVoteMutationVariables
  >(RemoveProductReviewVoteMutation);

  const toggleVote = async ({ productReviewId, type, active }) =>
    active
      ? removeVote({ variables: { productReviewId, type } })
      : addVote({ variables: { productReviewId, type } });

  return { toggleVote };
};

export default useProductReviewVote;
