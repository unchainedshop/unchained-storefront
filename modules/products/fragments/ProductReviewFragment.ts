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
    # ProductReviewVote._id is declared non-null but the engine stores votes without one
    ownVotes {
      type
    }
  }
`;

export default ProductReviewFragment;
