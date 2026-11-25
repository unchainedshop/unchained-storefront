import { gql } from '@apollo/client';

const ProductReviewFragment = gql`
  fragment ProductReviewFragment on ProductReview {
    _id
    created
    rating
    title
    review
    author {
      _id
      name
    }
    upvotes: voteCount(type: UPVOTE)
    ownVotes {
      _id
      type
    }
  }
`;

export default ProductReviewFragment;
