import React from 'react';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import useUnchainedAddToCartButton from '../../cart/hooks/useUnchainedAddToCartButton';

interface QuickAddButtonProps {
  productId: string;
  className?: string;
}

const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  productId,
  className = '',
}) => {
  const { submitForm, isAddInProgress, isAddedToCart } =
    useUnchainedAddToCartButton({ productId });

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await submitForm();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isAddInProgress}
      className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 disabled:opacity-50 dark:bg-slate-800/90 dark:hover:bg-slate-800 ${className}`}
      aria-label="Add to cart"
    >
      {isAddInProgress ? (
        <svg
          className="h-5 w-5 animate-spin text-slate-700 dark:text-slate-200"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : isAddedToCart ? (
        <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
      ) : (
        <ShoppingCartIcon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
      )}
    </button>
  );
};

export default QuickAddButton;
