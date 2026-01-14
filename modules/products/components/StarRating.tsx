import { StarIcon } from '@heroicons/react/24/solid';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const StarRating = ({
  rating,
  size = 'md',
  showValue = false,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon
            key={`full-${i}`}
            className={`${sizeClasses[size]} text-amber-400`}
          />
        ))}
        {hasHalfStar && (
          <div className={`relative ${sizeClasses[size]}`}>
            <StarIcon className={`${sizeClasses[size]} text-slate-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className={`${sizeClasses[size]} text-amber-400`} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon
            key={`empty-${i}`}
            className={`${sizeClasses[size]} text-slate-300`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-slate-600 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
