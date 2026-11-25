import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import ProductReviewFragment from '../fragments/ProductReviewFragment';
import type * as GQL from '../../apollo/generated';

const CreateProductReviewMutation = gql`
  mutation CreateProductReview($productId: ID!, $productReview: ProductReviewInput!) {
    createProductReview(productId: $productId, productReview: $productReview) {
      ...ProductReviewFragment
    }
  }
  ${ProductReviewFragment}
`;

const useCreateProductReview = () => {
  const [createProductReviewMutation] = useMutation<
    GQL.CreateProductReviewMutation,
    GQL.CreateProductReviewMutationVariables
  >(CreateProductReviewMutation, { refetchQueries: ['ProductReviews'] });

  const createProductReview = async ({ productId, rating, title, review }) =>
    createProductReviewMutation({
      variables: { productId, productReview: { rating, title, review } },
    });

  return { createProductReview };
};

export default useCreateProductReview;
