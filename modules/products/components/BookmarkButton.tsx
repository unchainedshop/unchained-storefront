import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import useUser from '../../auth/hooks/useUser';
import useConditionalBookmarkProduct from '../../cart/hooks/useConditionalBookmarkProduct';
import useRemoveBookmark from '../../common/hooks/useRemoveBookmark';

const BookmarkButton = ({ productId, className = '' }) => {
  const { formatMessage } = useIntl();
  const { user } = useUser();
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();
  const { removeBookmark } = useRemoveBookmark();
  const bookmark = user?.bookmarks?.find((b) => b?.product?._id === productId);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmark) removeBookmark({ bookmarkId: bookmark._id });
    else conditionalBookmarkProduct({ productId });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!!bookmark}
      aria-label={
        bookmark
          ? formatMessage({ id: 'remove_from_wishlist', defaultMessage: 'Remove from wishlist' })
          : formatMessage({ id: 'add_to_wishlist', defaultMessage: 'Add to wishlist' })
      }
      className={classNames(
        'flex size-10 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur transition hover:scale-105',
        bookmark ? 'text-danger' : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      {bookmark ? <HeartSolid className="size-5" /> : <HeartOutline className="size-5" />}
    </button>
  );
};

export default BookmarkButton;
