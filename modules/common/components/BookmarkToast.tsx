import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

interface BookmarkToastProps {
  isVisible: boolean;
  isBookmarked: boolean;
  onClose: () => void;
  message?: string;
}

const BookmarkToast = ({
  isVisible,
  isBookmarked,
  onClose,
  message,
}: BookmarkToastProps) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  const defaultMessage = isBookmarked
    ? 'Added to bookmarks'
    : 'Removed from bookmarks';

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-center space-x-2 rounded-lg bg-surface px-4 py-3 shadow-lg">
        {isBookmarked ? (
          <CheckCircleIcon className="h-5 w-5 text-success" />
        ) : (
          <XCircleIcon className="h-5 w-5 text-danger" />
        )}
        <span className="text-sm font-medium text-foreground">
          {message || defaultMessage}
        </span>
      </div>
    </div>
  );
};

export default BookmarkToast;
