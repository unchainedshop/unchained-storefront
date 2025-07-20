import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { useState, useEffect } from 'react';

import { Bars3Icon } from '@heroicons/react/20/solid';
import LoginCart from '../../auth/components/LoginCart';
import SideCart from '../../cart/components/SideCart';

import { useAppContext } from '../../common/components/AppContextWrapper';

interface HeaderProps {
  onSidebarToggle: () => void;
  hasHeroSection?: boolean;
  heroSectionId?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSidebarToggle,
  hasHeroSection = false,
  heroSectionId = 'hero-section',
}) => {
  const { isCartOpen } = useAppContext();
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverHero, setIsOverHero] = useState(hasHeroSection);

  useEffect(() => {
    if (!hasHeroSection) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Simple threshold - if scrolled more than 100px, switch to white header
      if (scrollY > 100) {
        setIsScrolled(true);
        setIsOverHero(false);
      } else {
        setIsScrolled(false);
        setIsOverHero(true);
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasHeroSection]);

  // Simplified styling logic
  const isHeroMode = hasHeroSection && isOverHero && !isScrolled;
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
          <div className="flex justify-start">
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

          <div className="flex justify-end">
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
    </header>
  );
};

export default Header;
