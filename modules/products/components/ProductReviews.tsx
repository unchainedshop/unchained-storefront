import { useState } from 'react';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { ChatBubbleLeftRightIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import useUser from '../../auth/hooks/useUser';
import useProductReviews from '../hooks/useProductReviews';
import useCreateProductReview from '../hooks/useCreateProductReview';
import useProductReviewVote from '../hooks/useProductReviewVote';
import useFormatDateTime from '../../common/utils/useFormatDateTime';
import EmptyState from '../../common/components/EmptyState';
import Form from '../../forms/components/Form';
import TextField from '../../forms/components/TextField';
import TextAreaField from '../../forms/components/TextAreaField';
import SubmitButton from '../../forms/components/SubmitButton';
import FormErrors from '../../forms/components/FormErrors';
import StarRating from './StarRating';

const RatingDistribution = ({ reviews }) => {
  const rated = reviews.filter((review) => review.rating);
  return (
    <ul className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = rated.filter((review) => review.rating === star).length;
        const share = rated.length ? (count / rated.length) * 100 : 0;
        return (
          <li key={star} className="flex items-center gap-2 text-sm">
            <span className="w-3 text-muted-foreground">{star}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted-strong">
              <span className="block h-full rounded-full bg-warning" style={{ width: `${share}%` }} />
            </span>
            <span className="w-6 text-right text-subtle-foreground">{count}</span>
          </li>
        );
      })}
    </ul>
  );
};

const ReviewForm = ({ productId, onDone }) => {
  const { formatMessage } = useIntl();
  const { createProductReview } = useCreateProductReview();
  const [rating, setRating] = useState(0);

  return (
    <Form
      onSubmit={async ({ title, review }) => {
        await createProductReview({ productId, rating, title, review });
        onDone();
      }}
      onBeforeSubmitValidator={() =>
        rating
          ? null
          : {
              submit: {
                type: 'manual',
                message: formatMessage({ id: 'review_rating_required', defaultMessage: 'Please choose a star rating.' }),
              },
            }
      }
      onSubmitError={null}
      defaultValues={{ title: '', review: '' }}
      className="card space-y-4 p-5 sm:p-6"
    >
      <div>
        <p className="label">{formatMessage({ id: 'your_rating', defaultMessage: 'Your rating' })}</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <TextField
        name="title"
        label={formatMessage({ id: 'review_title', defaultMessage: 'Title' })}
        placeholder={formatMessage({ id: 'review_title_placeholder', defaultMessage: 'Sum it up in a few words' })}
      />
      <TextAreaField
        name="review"
        required
        label={formatMessage({ id: 'review_text', defaultMessage: 'Your review' })}
        placeholder={formatMessage({ id: 'review_text_placeholder', defaultMessage: 'What did you like or dislike?' })}
      />
      <FormErrors />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="btn btn-ghost">
          {formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        </button>
        <SubmitButton className="w-auto">
          {formatMessage({ id: 'submit_review', defaultMessage: 'Submit review' })}
        </SubmitButton>
      </div>
    </Form>
  );
};

const ReviewItem = ({ review }) => {
  const { formatMessage } = useIntl();
  const { formatDateTime } = useFormatDateTime();
  const { user } = useUser();
  const { toggleVote } = useProductReviewVote();
  const upvoted = review.ownVotes?.some((vote) => vote.type === 'UPVOTE');
  // The engine falls back to the user id as name; never show that to shoppers.
  const authorName = review.author?.name;
  const author =
    authorName && authorName !== review.author?._id
      ? authorName
      : formatMessage({ id: 'review_author_fallback', defaultMessage: 'Customer' });

  return (
    <li className="py-6">
      <div className="flex items-center justify-between gap-3">
        <StarRating value={review.rating || 0} size="sm" />
        <time className="text-xs text-subtle-foreground" dateTime={review.created}>
          {formatDateTime(review.created, { dateStyle: 'medium' })}
        </time>
      </div>
      {review.title && <p className="mt-2 font-semibold">{review.title}</p>}
      {review.review && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{review.review}</p>}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-subtle-foreground">{author}</span>
        <button
          type="button"
          disabled={!user}
          aria-pressed={upvoted}
          onClick={() => toggleVote({ productReviewId: review._id, type: 'UPVOTE', active: upvoted })}
          className={classNames(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50',
            upvoted ? 'border-primary bg-accent-soft text-accent-foreground' : 'border-border text-muted-foreground hover:bg-muted',
          )}
        >
          <HandThumbUpIcon className="size-4" />
          {formatMessage({ id: 'review_helpful', defaultMessage: 'Helpful' })}
          {review.upvotes ? <span>({review.upvotes})</span> : null}
        </button>
      </div>
    </li>
  );
};

const ProductReviews = ({ productId }) => {
  const { formatMessage } = useIntl();
  const { user } = useUser();
  const { reviews, reviewsCount, averageRating, loading } = useProductReviews({ productId });
  const [writing, setWriting] = useState(false);

  const writeAction = user ? (
    <button type="button" onClick={() => setWriting(true)} className="btn btn-secondary">
      {formatMessage({ id: 'write_review', defaultMessage: 'Write a review' })}
    </button>
  ) : (
    <Link href="/login" className="btn btn-secondary">
      {formatMessage({ id: 'login_to_review', defaultMessage: 'Log in to write a review' })}
    </Link>
  );

  if (loading) return <div className="skeleton h-48 rounded-xl" />;

  return (
    <section id="reviews" className="scroll-mt-24">
      <h2 className="mb-6 text-xl font-bold tracking-tight">
        {formatMessage({ id: 'customer_reviews', defaultMessage: 'Customer reviews' })}
      </h2>

      {!reviewsCount && !writing ? (
        <EmptyState
          icon={ChatBubbleLeftRightIcon}
          title={formatMessage({ id: 'no_reviews_yet', defaultMessage: 'No reviews yet' })}
          description={formatMessage({ id: 'no_reviews_text', defaultMessage: 'Be the first to share what you think.' })}
        >
          {writeAction}
        </EmptyState>
      ) : (
        <div className="grid items-start gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="card space-y-4 p-5 lg:sticky lg:top-24">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{averageRating ? averageRating.toFixed(1) : '–'}</span>
              <span className="text-sm text-muted-foreground">/ 5</span>
            </div>
            <StarRating value={averageRating || 0} />
            <p className="text-sm text-muted-foreground">
              {formatMessage(
                { id: 'review_count', defaultMessage: '{count, plural, one {# review} other {# reviews}}' },
                { count: reviewsCount },
              )}
            </p>
            <RatingDistribution reviews={reviews} />
            {!writing && <div className="[&>*]:w-full">{writeAction}</div>}
          </aside>
          <div>
            {writing && <ReviewForm productId={productId} onDone={() => setWriting(false)} />}
            <ul className="divide-y divide-border">
              {reviews.map((review) => (
                <ReviewItem key={review._id} review={review} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;
