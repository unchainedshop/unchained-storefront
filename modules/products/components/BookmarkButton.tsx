import { BookmarkIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

const BookmarkButton = ({ filteredBookmark, toggleBookmark }) => (
  <button
    type="button"
    className="rounded-full bg-white/90 p-3 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-lg dark:bg-slate-900/90"
    onClick={toggleBookmark}
    aria-label={filteredBookmark ? 'Remove from bookmarks' : 'Add to bookmarks'}
  >
    <BookmarkIcon
      className={classNames('h-5 w-5 transition-colors', {
        'text-amber-500 hover:text-amber-600': filteredBookmark,
        'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white':
          !filteredBookmark,
      })}
    />
  </button>
);

export default BookmarkButton;
