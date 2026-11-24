import { BookmarkIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

const BookmarkButton = ({ filteredBookmark, toggleBookmark }) => (
  <button
    type="button"
    className="rounded-full bg-surface/90 p-3 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg"
    onClick={toggleBookmark}
    aria-label={filteredBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
  >
    <BookmarkIcon
      className={classNames('h-5 w-5 transition-colors', {
        'text-warning hover:text-warning': filteredBookmark,
        'text-muted-foreground hover:text-foreground ':
          !filteredBookmark,
      })}
    />
  </button>
);

export default BookmarkButton;
