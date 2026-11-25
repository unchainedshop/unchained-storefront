import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import {
  ArrowRightStartOnRectangleIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import useUser from '../hooks/useUser';
import useLogout from '../hooks/useLogout';
import { useAppContext } from '../../common/components/AppContextWrapper';
import ThemeToggle from '../../common/components/ThemeToggle';

const menuItemClass =
  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground data-focus:bg-muted';

const LoginCart = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();
  const { isCartOpen, toggleCart } = useAppContext();
  const router = useRouter();
  const { logout } = useLogout();
  const itemCount =
    user?.cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const isRegistered = user && !user.isGuest;

  const onLogout = async () => {
    await logout();
    router.push('/login');
  };

  const accountLinks = [
    { href: '/account', label: formatMessage({ id: 'account', defaultMessage: 'Account' }) },
    { href: '/orders', label: formatMessage({ id: 'orders', defaultMessage: 'Orders' }) },
    { href: '/subscriptions', label: formatMessage({ id: 'subscriptions', defaultMessage: 'Subscriptions' }) },
    { href: '/bookmarks', label: formatMessage({ id: 'bookmarks', defaultMessage: 'Wishlist' }) },
  ];

  return (
    <div className="flex items-center gap-1">
      <ThemeToggle />

      {isRegistered ? (
        <Menu as="div" className="relative">
          <MenuButton
            className="btn-icon"
            aria-label={formatMessage({ id: 'account', defaultMessage: 'Account' })}
          >
            <UserIcon className="size-5" />
          </MenuButton>
          <MenuItems
            anchor="bottom end"
            transition
            className="z-1030 mt-2 w-56 origin-top-right rounded-xl border border-border bg-surface p-1.5 shadow-pop transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
          >
            <div className="truncate px-3 pb-2 pt-1.5 text-xs text-subtle-foreground">
              {user.primaryEmail?.address || user.username || user.name}
            </div>
            {accountLinks.map(({ href, label }) => (
              <MenuItem key={href}>
                <Link href={href} className={menuItemClass}>
                  {label}
                </Link>
              </MenuItem>
            ))}
            <div className="my-1 border-t border-border" />
            <MenuItem>
              <button
                type="button"
                onClick={onLogout}
                className={`${menuItemClass} text-danger`}
              >
                <ArrowRightStartOnRectangleIcon className="size-4" />
                {formatMessage({ id: 'logout', defaultMessage: 'Logout' })}
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      ) : (
        <Link
          href="/login"
          className="btn-icon"
          aria-label={formatMessage({ id: 'log_in', defaultMessage: 'Log In' })}
        >
          <UserIcon className="size-5" />
        </Link>
      )}

      <button
        type="button"
        className="btn-icon relative"
        onClick={() => toggleCart(!isCartOpen)}
        aria-label={formatMessage(
          { id: 'cart_with_count', defaultMessage: 'Cart, {count} items' },
          { count: itemCount },
        )}
      >
        <ShoppingBagIcon className="size-5" />
        {itemCount > 0 && (
          <span className="absolute right-0.5 top-0.5 inline-flex min-w-[1.125rem] items-center justify-center rounded-full bg-primary px-1 text-[0.6875rem] font-semibold leading-[1.125rem] text-primary-foreground">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default LoginCart;
