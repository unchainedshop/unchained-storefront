import Link from 'next/link';
import { useIntl } from 'react-intl';

import {
  BookmarkIcon,
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import OrderButton from '../../orders/components/UserOrderButton';
import useUser from '../hooks/useUser';
import { useApollo } from '../../apollo/apolloClient';
import logOut from '../hooks/logOut';
import { useAppContext } from '../../common/components/AppContextWrapper';

const LoginCart = () => {
  const { user } = useUser();
  const { formatMessage } = useIntl();
  const { isCartOpen, toggleCart } = useAppContext();
  const router = useRouter();
  const apollo = useApollo({ locale: router.locale }, {});

  const onLogout = async () => {
    await logOut(apollo);
    router.push('/login');
  };

  return user ? (
    <div className="flex items-center gap-x-3">
      {/* Account Link */}
      {!user?.isGuest && (
        <Link
          href="/account"
          className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors p-2"
        >
          <UserCircleIcon className="h-6 w-6" />
        </Link>
      )}

      {/* Cart Button */}
      <button
        className="relative text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors p-2"
        onClick={() => toggleCart(!isCartOpen)}
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {user?.cart?.items?.length ? (
          <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
            {user?.cart?.items.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        ) : null}
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-x-3">
      <Link
        href="/login"
        className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors p-2"
      >
        <UserCircleIcon className="h-6 w-6" />
      </Link>
      <button
        className="relative text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors p-2"
        onClick={() => toggleCart(!isCartOpen)}
      >
        <ShoppingCartIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default LoginCart;
