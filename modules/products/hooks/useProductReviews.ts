import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import ProductReviewFragment from '../fragments/ProductReviewFragment';
import type * as GQL from '../../apollo/generated';

export const PRODUCT_REVIEWS_QUERY = gql`
  query ProductReviews($productId: ID!, $limit: Int) {
    product(productId: $productId) {
      _id
      reviewsCount
      reviews(limit: $limit, sort: [{ key: "created", value: DESC }]) {
        ...ProductReviewFragment
      }
    }
  }
  ${ProductReviewFragment}
`;

const useProductReviews = ({ productId, limit = 50 }: { productId: string; limit?: number }) => {
  const { data, loading } = useQuery<GQL.ProductReviewsQuery, GQL.ProductReviewsQueryVariables>(
    PRODUCT_REVIEWS_QUERY,
    { variables: { productId, limit }, skip: !productId },
  );
  const reviews = data?.product?.reviews || [];
  const rated = reviews.filter((review) => review.rating);
  const averageRating = rated.length
    ? rated.reduce((acc, review) => acc + review.rating, 0) / rated.length
    : null;

  return {
    reviews,
    reviewsCount: data?.product?.reviewsCount || 0,
    averageRating,
    loading,
  };
};

export default useProductReviews;
