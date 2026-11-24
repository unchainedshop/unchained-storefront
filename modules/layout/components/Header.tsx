import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LoginCart from '../../auth/components/LoginCart';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const SearchForm = ({ className = '', autoFocus = false, onDone = null }) => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [value, setValue] = useState((router.query.query as string) || '');

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
    onDone?.();
  };

  return (
    <form role="search" onSubmit={onSubmit} className={`relative ${className}`}>
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        aria-label={formatMessage({ id: 'search', defaultMessage: 'Search' })}
        placeholder={formatMessage({
          id: 'search_products_placeholder',
          defaultMessage: 'Search products…',
        })}
        className="input rounded-full border-transparent bg-muted py-2 pl-10 shadow-none focus:bg-surface"
      />
    </form>
  );
};

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { formatMessage } = useIntl();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-1020 border-b border-border bg-background/80 backdrop-blur-xl print:hidden">
      <div className="container-page flex h-16 items-center gap-3">
        <button
          type="button"
          className="btn-icon -ml-2"
          aria-label={formatMessage({ id: 'menu', defaultMessage: 'Menu' })}
          onClick={onSidebarToggle}
        >
          <Bars3Icon className="size-6" />
        </button>

        <Link
          href="/"
          className="truncate whitespace-nowrap font-display text-lg font-bold tracking-tight text-foreground"
        >
          {formatMessage({
            id: 'shop_title',
            defaultMessage: 'Unchained Store',
          })}
        </Link>

        <SearchForm className="mx-auto hidden w-full max-w-md md:block" />

        <div className="ml-auto flex items-center md:ml-0">
          <button
            type="button"
            className="btn-icon md:hidden"
            aria-label={formatMessage({ id: 'search', defaultMessage: 'Search' })}
            aria-expanded={mobileSearchOpen}
            onClick={() => setMobileSearchOpen((open) => !open)}
          >
            <MagnifyingGlassIcon className="size-5" />
          </button>
          <LoginCart />
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="container-page pb-3 md:hidden">
          <SearchForm autoFocus onDone={() => setMobileSearchOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;
