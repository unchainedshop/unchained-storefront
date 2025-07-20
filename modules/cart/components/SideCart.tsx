import Link from 'next/link';
import { useState, useEffect } from 'react';

import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useUser from '../../auth/hooks/useUser';
import CartItem from './CartItem';
import { useAppContext } from '../../common/components/AppContextWrapper';
import FormattedPrice from '../../common/components/FormattedPrice';

const SideCart = ({ isOpen }) => {
  const { user } = useUser();
  const intl = useIntl();
  const { isCartOpen, toggleCart } = useAppContext();
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to allow initial render before animating in
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Delay hiding the component to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop with smooth fade */}
      <div
        className={`fixed inset-0 z-[1050] bg-slate-950/50 backdrop-blur-sm transition-all duration-300 ease-out ${
          isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => toggleCart(false)}
      />
      {!user?.cart?.items.length ? (
        <div
          className={`px-4 fixed top-5 bottom-5 right-5 z-[1060] w-sm lg:w-md xl:w-lg transform rounded-lg bg-white/95 backdrop-blur-md shadow-xl transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] dark:bg-slate-900/95 ${
            isAnimating
              ? 'translate-x-0 opacity-100 scale-100'
              : 'translate-x-16 opacity-0 scale-95 pointer-events-none'
          } flex flex-col gap-4 items-center justify-center text-center`}
        >
          <ShoppingBagIcon
            className={`h-8 w-8 text-slate-400 transition-all duration-500 ${isAnimating ? 'animate-pulse-subtle' : ''}`}
          />
          <p
            className={`transition-all duration-500 delay-100 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            {intl.formatMessage({
              id: 'no_product_in_cart',
              defaultMessage: 'There are no products in your Cart. Browse our',
            })}{' '}
            <Link
              href="/shop"
              onClick={() => toggleCart(false)}
              className="cursor-pointer font-normal underline"
            >
              {intl.formatMessage({ id: 'shop', defaultMessage: 'Shop' })}
            </Link>
          </p>
        </div>
      ) : (
        <div
          className={`fixed top-5 bottom-5 right-5 z-[1060] w-sm lg:w-md xl:w-lg transform rounded-lg bg-white/95 backdrop-blur-md shadow-xl transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] dark:bg-slate-900/95 ${
            isAnimating
              ? 'translate-x-0 opacity-100 scale-100'
              : 'translate-x-16 opacity-0 scale-95 pointer-events-none'
          } flex flex-col overflow-hidden`}
        >
          {/* Header with staggered animation */}
          <div
            className={`flex items-center justify-between p-6 border-b border-slate-200 dark:border-0 transition-all duration-300 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {intl.formatMessage({
                id: 'in_cart',
                defaultMessage: 'Cart',
              })}
            </h3>
            <button
              aria-label={intl.formatMessage({
                id: 'close',
                defaultMessage: 'Close',
              })}
              type="button"
              className="rounded-lg p-2 text-slate-600 hover:text-slate-900 transition-all duration-200 hover:bg-slate-100 hover:scale-110 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700"
              onClick={() => toggleCart(!isCartOpen)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Content area with staggered animation */}
          <div
            className={`flex-1 overflow-y-auto p-6 transition-all duration-300 delay-200 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            {user?.cart?.items.length === 0 ? (
              <p className="text-center text-slate-600 dark:text-slate-300">
                {intl.formatMessage({
                  id: 'no_product_in_cart',
                  defaultMessage:
                    'There are no products in your Cart. Browse our',
                })}{' '}
                <Link
                  href="/shop"
                  onClick={() => toggleCart(false)}
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors duration-200"
                >
                  {intl.formatMessage({
                    id: 'shop',
                    defaultMessage: 'Shop',
                  })}
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {(user?.cart?.items || []).map((item, index) => (
                  <div
                    key={item._id}
                    className={`transition-all duration-300 ease-out ${
                      isOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${300 + index * 50}ms` : '0ms',
                    }}
                  >
                    <CartItem {...item} />
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Footer with checkout button */}
          <div
            className={`border-t border-slate-200 p-6 dark:border-0 transition-all duration-300 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-medium text-slate-900 dark:text-white">
                {intl.formatMessage({
                  id: 'subtotal',
                  defaultMessage: 'Subtotal',
                })}
              </span>
              <div className="font-semibold text-slate-900 dark:text-white">
                <FormattedPrice price={user?.cart?.itemsTotal} />
              </div>
            </div>
            <Link
              href={{ pathname: '/checkout' }}
              className="block w-full rounded-md bg-slate-900 py-3 px-4 text-center text-base font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:scale-[0.98] dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={() => toggleCart(false)}
            >
              {intl.formatMessage({
                id: 'to_checkout',
                defaultMessage: 'Checkout',
              })}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SideCart;
