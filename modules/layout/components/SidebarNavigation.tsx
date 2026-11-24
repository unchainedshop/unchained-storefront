import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useAssortments from '../../assortment/hooks/useAssortments';
import useUser from '../../auth/hooks/useUser';
import LanguageSwitch from '../../common/components/LanguageSwitch';
import CurrencySelector from '../../common/components/CurrencySelector';

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const SectionTitle = ({ children }) => (
  <h3 className="px-3 pb-2 pt-6 text-xs font-semibold uppercase tracking-wider text-subtle-foreground first:pt-0">
    {children}
  </h3>
);

const SidebarNavigation = ({ isOpen, onClose }: SidebarNavigationProps) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { user } = useUser();
  const { assortments } = useAssortments({ includeLeaves: true });
  const [expanded, setExpanded] = useState<string | null>(null);

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.asPath.startsWith(href);

  const itemClass = (href: string) =>
    classNames(
      'flex items-center rounded-lg px-3 py-2.5 text-[0.9375rem] font-medium transition-colors',
      isActive(href)
        ? 'bg-accent-soft text-accent-foreground'
        : 'text-foreground hover:bg-muted',
    );

  const NavLink = ({ href, children }) => (
    <li>
      <Link href={href} onClick={onClose} className={itemClass(href)}>
        {children}
      </Link>
    </li>
  );

  const rootCategories = (assortments || []).filter((a) => a.isRoot);
  const childrenOf = (slug: string) =>
    (assortments || []).filter(
      (a) => !a.isRoot && a.texts?.slug?.startsWith(slug),
    );

  const accountLinks = [
    { href: '/account', label: formatMessage({ id: 'nav_account', defaultMessage: 'Account' }) },
    { href: '/orders', label: formatMessage({ id: 'my_orders', defaultMessage: 'My orders' }) },
    { href: '/subscriptions', label: formatMessage({ id: 'subscriptions', defaultMessage: 'Subscriptions' }) },
    { href: '/quotation', label: formatMessage({ id: 'quotations', defaultMessage: 'Quotations' }) },
    { href: '/tokens', label: formatMessage({ id: 'tokens', defaultMessage: 'Tokens' }) },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-1030">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="fixed inset-y-0 left-0 flex w-full max-w-sm flex-col bg-surface shadow-pop transition duration-300 ease-out data-closed:-translate-x-full"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <span className="font-display text-lg font-bold tracking-tight">
            {formatMessage({ id: 'shop_title', defaultMessage: 'Unchained Store' })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon -mr-2"
            aria-label={formatMessage({ id: 'close', defaultMessage: 'Close' })}
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <SectionTitle>
            {formatMessage({ id: 'nav_store', defaultMessage: 'Shop' })}
          </SectionTitle>
          <ul className="space-y-0.5">
            <NavLink href="/">
              {formatMessage({ id: 'nav_home', defaultMessage: 'Home' })}
            </NavLink>
            <NavLink href="/shop">
              {formatMessage({ id: 'nav_shop_all', defaultMessage: 'All products' })}
            </NavLink>
            {rootCategories.map((category) => {
              const slug = category.texts?.slug;
              const children = childrenOf(slug);
              const open = expanded === category._id;
              if (!children.length)
                return (
                  <NavLink key={category._id} href={`/shop/${slug}`}>
                    {category.texts?.title}
                  </NavLink>
                );
              return (
                <li key={category._id}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setExpanded(open ? null : category._id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[0.9375rem] font-medium text-foreground hover:bg-muted"
                  >
                    {category.texts?.title}
                    <ChevronDownIcon
                      className={classNames(
                        'size-4 text-subtle-foreground transition-transform',
                        { 'rotate-180': open },
                      )}
                    />
                  </button>
                  {open && (
                    <ul className="mb-1 ml-3 space-y-0.5 border-l border-border pl-2">
                      <NavLink href={`/shop/${slug}`}>
                        {formatMessage({ id: 'view_all', defaultMessage: 'View All' })}
                      </NavLink>
                      {children.map((child) => (
                        <NavLink key={child._id} href={`/shop/${child.texts?.slug}`}>
                          {child.texts?.title}
                        </NavLink>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <NavLink href="/bookmarks">
              {formatMessage({ id: 'nav_bookmarks', defaultMessage: 'Wishlist' })}
            </NavLink>
          </ul>

          {user && !user.isGuest ? (
            <>
              <SectionTitle>
                {formatMessage({ id: 'nav_your_account', defaultMessage: 'Your account' })}
              </SectionTitle>
              <ul className="space-y-0.5">
                {accountLinks.map(({ href, label }) => (
                  <NavLink key={href} href={href}>
                    {label}
                  </NavLink>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-2 px-3">
              <Link href="/login" onClick={onClose} className="btn btn-primary">
                {formatMessage({ id: 'log_in', defaultMessage: 'Log In' })}
              </Link>
              <Link href="/sign-up" onClick={onClose} className="btn btn-secondary">
                {formatMessage({ id: 'sign_up', defaultMessage: 'Sign up' })}
              </Link>
            </div>
          )}

          {process.env.NODE_ENV !== 'production' && (
            <ul className="mt-6 border-t border-border pt-4">
              <NavLink href="/styleguide">
                {formatMessage({ id: 'nav_styleguide', defaultMessage: 'Styleguide' })}
              </NavLink>
            </ul>
          )}
        </nav>

        <div className="flex items-center gap-2 border-t border-border px-5 py-4">
          <LanguageSwitch />
          <CurrencySelector />
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default SidebarNavigation;
