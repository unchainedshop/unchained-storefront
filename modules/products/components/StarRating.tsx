import { StarIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'size-4', md: 'size-5', lg: 'size-7' };

const StarRating = ({ value, onChange, size = 'md' }: StarRatingProps) => {
  const { formatMessage } = useIntl();
  const label = formatMessage(
    { id: 'rating_out_of_five', defaultMessage: '{rating} out of 5 stars' },
    { rating: Math.round((value || 0) * 10) / 10 },
  );

  if (!onChange)
    return (
      <span className="inline-flex items-center" role="img" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={classNames(sizes[size], star <= Math.round(value) ? 'text-warning' : 'text-muted-strong')}
          />
        ))}
      </span>
    );

  return (
    <span role="radiogroup" aria-label={formatMessage({ id: 'your_rating', defaultMessage: 'Your rating' })} className="inline-flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={formatMessage({ id: 'rating_stars', defaultMessage: '{rating, plural, one {# star} other {# stars}}' }, { rating: star })}
          onClick={() => onChange(star)}
          className="rounded p-0.5 transition-transform hover:scale-110"
        >
          <StarIcon className={classNames(sizes[size], star <= value ? 'text-warning' : 'text-muted-strong')} />
        </button>
      ))}
    </span>
  );
};

export default StarRating;
