import { useIntl } from 'react-intl';
import useProductReviews from '../hooks/useProductReviews';
import StarRating from './StarRating';

const ProductRatingSummary = ({ productId }) => {
  const { formatMessage } = useIntl();
  const { reviewsCount, averageRating } = useProductReviews({ productId });
  if (!reviewsCount) return null;

  return (
    <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
      <StarRating value={averageRating || 0} size="sm" />
      {averageRating ? averageRating.toFixed(1) : null}
      <span className="underline-offset-4 hover:underline">
        {formatMessage(
          { id: 'review_count', defaultMessage: '{count, plural, one {# review} other {# reviews}}' },
          { count: reviewsCount },
        )}
      </span>
    </a>
  );
};

export default ProductRatingSummary;
