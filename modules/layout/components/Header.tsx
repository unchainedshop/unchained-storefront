import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { useState, useEffect, useRef } from 'react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import LoginCart from '../../auth/components/LoginCart';

interface HeaderProps {
  onSidebarToggle: () => void;
  hasHeroSection?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onSidebarToggle,
  hasHeroSection = false,
}) => {
  const router = useRouter();
  const isOnSearchPage = router.pathname.includes('search');
  console.log(router);
  const { formatMessage } = useIntl();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(hasHeroSection);
  const [searchOpen, setSearchOpen] = useState(false);

  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasHeroSection) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setIsScrolled(true);
        setIsOverHero(false);
      } else {
        setIsScrolled(false);
        setIsOverHero(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasHeroSection]);

  const isHeroMode = hasHeroSection && isOverHero && !isScrolled;

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    const value = input?.value?.trim();
    if (value) {
      router.push(`/search?query=${encodeURIComponent(value)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-[1020] transition-all duration-300 ease-in-out print:hidden ${
        isHeroMode
          ? 'bg-slate-950 backdrop-blur-sm'
          : 'border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-900 dark:bg-slate-950/95'
      }`}
    >
      <div className="relative container mx-auto">
        <div className="grid h-16 grid-cols-3 items-center px-4">
          <div className="flex justify-start items-center gap-2">
            <button
              type="button"
              aria-label="menu"
              className={`rounded-md p-2 transition-all duration-200 ${
                isHeroMode
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
              onClick={onSidebarToggle}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            {!isOnSearchPage ? (
              <button
                type="button"
                aria-label="search"
                className={`rounded-md p-2 transition-all duration-200 sm:hidden ${
                  isHeroMode
                    ? 'text-white/80 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
                onClick={() => setSearchOpen((s) => !s)}
              >
                {searchOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <MagnifyingGlassIcon className="h-6 w-6" />
                )}
              </button>
            ) : null}
          </div>

          <div className="flex justify-center uppercase">
            <Link
              href="/"
              className={`text-md font-semibold tracking-tight transition-colors duration-200 ${
                isHeroMode ? 'text-white' : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatMessage({
                id: 'shop_title',
                defaultMessage: 'Unchained Store',
              })}
            </Link>
          </div>

          <div className="flex justify-end items-center gap-3">
            {!isOnSearchPage ? (
              <form
                onSubmit={handleSearchSubmit}
                className={`hidden sm:flex items-center rounded-full border px-3 py-1 text-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 ease-in-out ${
                  isHeroMode
                    ? 'border-white/30 bg-white/10 text-white placeholder-white/70'
                    : 'border-slate-300 bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-white'
                }`}
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-2 opacity-70 flex-shrink-0" />
                <input
                  ref={desktopSearchRef}
                  type="text"
                  defaultValue=""
                  placeholder={formatMessage({
                    id: 'search_placeholder',
                    defaultMessage: 'Search...',
                  })}
                  className={`bg-transparent outline-none w-32 focus:w-64 transition-all duration-300 ease-in-out ${
                    isHeroMode
                      ? 'placeholder-white/60 text-white'
                      : 'text-slate-900 dark:text-white'
                  }`}
                />
              </form>
            ) : null}
            <div
              className={
                isHeroMode
                  ? 'text-white [&_*]:text-white [&_button]:text-white/80 [&_button:hover]:text-white [&_a]:text-white/80 [&_a:hover]:text-white'
                  : ''
              }
            >
              <LoginCart />
            </div>
          </div>
        </div>
      </div>

      {!isOnSearchPage ? (
        <div
          className={`sm:hidden absolute top-full left-0 w-full px-4 py-3 transition-all duration-300 ease-in-out overflow-hidden ${
            searchOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          } ${
            isHeroMode
              ? 'bg-slate-950 text-white border-t border-white/20'
              : 'bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800'
          }`}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <input
              ref={mobileSearchRef}
              type="text"
              defaultValue=""
              placeholder={formatMessage({
                id: 'search_placeholder',
                defaultMessage: 'Search products...',
              })}
              className="flex-1 bg-transparent outline-none text-sm"
              autoFocus
            />
            <button
              type="submit"
              aria-label="search"
              className={`rounded-md p-2 transition-all duration-200 sm:hidden ${
                isHeroMode
                  ? 'text-white/80 hover:bg-white/10 hover:text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
