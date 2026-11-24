import Link from 'next/link';
import { useIntl } from 'react-intl';
import {
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import useUser from '../hooks/useUser';
import useLogout from '../hooks/useLogout';
import { useAppContext } from '../../common/components/AppContextWrapper';

const LoginCart = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();
  const { isCartOpen, toggleCart } = useAppContext();
  const router = useRouter();
  const { logout } = useLogout();

  const onLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return user ? (
    <div className="flex items-center gap-x-3">
      {/* Account Link */}
      {!user?.isGuest && (
        <Link
          href="/account"
          className="text-muted-foreground hover:text-foreground transition-colors p-2"
        >
          <UserCircleIcon className="h-6 w-6" />
        </Link>
      )}

      {/* Cart Button */}
      <button
        className="relative text-muted-foreground hover:text-foreground transition-colors p-2"
        onClick={() => toggleCart(!isCartOpen)}
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {user?.cart?.items?.length ? (
          <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {user?.cart?.items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        ) : null}
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        title={formatMessage({ id: 'logout', defaultMessage: 'Logout' })}
        className="text-muted-foreground hover:text-danger transition-colors p-2"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6" />
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-x-3">
      <Link
        href="/login"
        className="text-muted-foreground hover:text-foreground transition-colors p-2"
      >
        <UserCircleIcon className="h-6 w-6" />
      </Link>
      <button
        className="relative text-muted-foreground hover:text-foreground transition-colors p-2"
        onClick={() => toggleCart(!isCartOpen)}
      >
        <ShoppingCartIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default LoginCart;
