import { useIntl } from 'react-intl';
import StarRating from './StarRating';

interface Review {
  _id: string;
  created?: string;
  rating?: number;
  title?: string;
  review?: string;
  author?: {
    username?: string;
  };
}

interface ProductReviewsProps {
  reviews?: Review[];
}

const ProductReviews = ({ reviews }: ProductReviewsProps) => {
  const { formatMessage, formatDate } = useIntl();

  if (!reviews || reviews.length === 0) {
    return (
      <section className="mt-16">
        <h2 className="text-lg font-semibold mb-4">
          {formatMessage({
            id: 'reviews.title',
            defaultMessage: 'Customer Reviews',
          })}
        </h2>
        <p className="text-slate-500">
          {formatMessage({
            id: 'reviews.empty',
            defaultMessage: 'No reviews yet',
          })}
        </p>
      </section>
    );
  }

  const averageRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

  return (
    <section className="mt-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold">
          {formatMessage({
            id: 'reviews.title',
            defaultMessage: 'Customer Reviews',
          })}
        </h2>
        <div className="flex items-center gap-2">
          <StarRating rating={averageRating} size="md" />
          <span className="text-sm text-slate-600">
            {formatMessage(
              {
                id: 'reviews.summary',
                defaultMessage: '{rating} out of 5 ({count} reviews)',
              },
              {
                rating: averageRating.toFixed(1),
                count: reviews.length,
              },
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-3">
              {review.rating && <StarRating rating={review.rating} size="sm" />}
              {review.created && (
                <span className="text-xs text-slate-400">
                  {formatDate(new Date(review.created), {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
            {review.title && (
              <h3 className="font-medium text-slate-900 mb-2">{review.title}</h3>
            )}
            {review.review && (
              <p className="text-slate-600 text-sm leading-relaxed">
                {review.review}
              </p>
            )}
            {review.author?.username && (
              <p className="text-xs text-slate-400 mt-3">
                {formatMessage(
                  {
                    id: 'reviews.by_author',
                    defaultMessage: 'By {author}',
                  },
                  { author: review.author.username },
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductReviews;
