import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import {
  ArrowPathRoundedSquareIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HeartIcon,
  KeyIcon,
  ShoppingBagIcon,
  TicketIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import useRedirect from '../hooks/useRedirect';
import useUser from '../hooks/useUser';

const AccountLayout = ({ title, actions = null, children }) => {
  const { formatMessage } = useIntl();
  const { pathname } = useRouter();
  useRedirect({ to: '/login', matchAnonymous: true, matchGuests: true });
  const { user } = useUser();
  const email = user?.primaryEmail?.address;
  const displayName = user?.profile?.address?.firstName || user?.username || email?.split('@')[0] || '';
  const initials = displayName.slice(0, 2).toUpperCase();

  const links = [
    { href: '/account', icon: UserCircleIcon, label: formatMessage({ id: 'profile', defaultMessage: 'Profile' }) },
    { href: '/orders', icon: ShoppingBagIcon, label: formatMessage({ id: 'orders', defaultMessage: 'Orders' }) },
    { href: '/subscriptions', icon: ArrowPathRoundedSquareIcon, label: formatMessage({ id: 'subscriptions', defaultMessage: 'Subscriptions' }) },
    { href: '/bookmarks', icon: HeartIcon, label: formatMessage({ id: 'bookmarks', defaultMessage: 'Wishlist' }) },
    { href: '/quotation', icon: DocumentTextIcon, label: formatMessage({ id: 'quotations', defaultMessage: 'Quotations' }) },
    { href: '/tokens', icon: TicketIcon, label: formatMessage({ id: 'tokens', defaultMessage: 'Tokens' }) },
    { href: '/account/payment-methods', icon: CreditCardIcon, label: formatMessage({ id: 'payment_methods', defaultMessage: 'Payment methods' }) },
    { href: '/account/change-password', icon: KeyIcon, label: formatMessage({ id: 'password', defaultMessage: 'Password' }) },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12">
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      {user && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">
              {formatMessage({ id: 'account_greeting', defaultMessage: 'Hi, {name}' }, { name: displayName })}
            </span>
            {email && <span className="block truncate text-xs text-muted-foreground">{email}</span>}
          </span>
        </div>
      )}
      <nav
        aria-label={formatMessage({ id: 'account', defaultMessage: 'Account' })}
        className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0"
      >
        <ul className="flex gap-1 lg:flex-col">
          {links.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={classNames(
                    'flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent-soft text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      </div>

      <div className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-5">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AccountLayout;
