import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import {
  XMarkIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  GlobeAltIcon,
} from '@heroicons/react/20/solid';
import useAssortments from '../../assortment/hooks/useAssortments';

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isOpen,
  onClose,
}) => {
  const { formatMessage, locale } = useIntl();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentView, setCurrentView] = useState<
    'main' | 'categories' | 'category'
  >('main');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const { assortments, loading: assortmentsLoading } = useAssortments({
    includeLeaves: true,
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to allow initial render before animating in
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      setCurrentView('main');
      setSelectedCategory(null);
      // Delay hiding the component to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const navigationItems = [
    {
      id: 'home',
      label: formatMessage({ id: 'nav_home', defaultMessage: 'Home' }),
      href: '/',
    },
    {
      id: 'store',
      label: formatMessage({ id: 'nav_store', defaultMessage: 'Store' }),
      href: '/shop',
    },
    {
      id: 'categories',
      label: formatMessage({ id: 'categories', defaultMessage: 'Categories' }),
      href: '#',
      isExpandable: true,
      onClick: () => setCurrentView('categories'),
    },
    {
      id: 'bookmarks',
      label: formatMessage({
        id: 'nav_bookmarks',
        defaultMessage: 'Bookmarks',
      }),
      href: '/bookmarks',
    },
    {
      id: 'account',
      label: formatMessage({ id: 'nav_account', defaultMessage: 'Account' }),
      href: '/account',
    },
    {
      id: 'styleguide',
      label: formatMessage({
        id: 'nav_styleguide',
        defaultMessage: 'Styleguide',
      }),
      href: '/styleguide',
    },
  ];

  const rootCategories = assortments.filter((assortment) => assortment.isRoot);

  const getChildCategories = (parentSlug: string) => {
    return assortments.filter(
      (child) => !child.isRoot && child.texts?.slug?.startsWith(parentSlug),
    );
  };

  const handleCategoryClick = (category: any) => {
    const childCategories = getChildCategories(category.texts?.slug);
    if (childCategories.length > 0) {
      setSelectedCategory(category);
      setCurrentView('category');
    } else {
      // Navigate directly if no children
      router.push(`/shop/${category.texts?.slug}`);
      onClose();
    }
  };

  const handleBackClick = () => {
    if (currentView === 'category') {
      setCurrentView('categories');
      setSelectedCategory(null);
    } else if (currentView === 'categories') {
      setCurrentView('main');
    }
  };

  const isCurrentPage = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname.startsWith(href);
  };

  const handleLanguageChange = (newLocale: string) => {
    const { pathname, query, asPath } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop with smooth fade */}
      <div
        className={`fixed inset-0 z-[1030] bg-slate-950/50 backdrop-blur-sm transition-all duration-300 ease-out ${
          isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer - Even higher z-index */}
      <div
        className={`fixed top-5 bottom-5 left-5 z-[1040] w-sm lg:w-md xl:w-lg transform rounded-lg bg-slate-50 backdrop-blur-md shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] dark:bg-slate-900/80 ${
          isAnimating
            ? 'translate-x-0 opacity-100 scale-100'
            : '-translate-x-16 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Header with staggered animation */}
          <div
            className={`flex justify-end mb-8 transition-all duration-300 delay-100 ${
              isAnimating
                ? 'translate-y-0 opacity-100'
                : '-translate-y-4 opacity-0'
            }`}
          >
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Items with staggered animation */}
          <nav
            className={`flex-1 overflow-y-auto transition-all duration-300 delay-200 ${
              isAnimating
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="relative h-full">
              {/* Main Navigation View */}
              <div
                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                  currentView === 'main'
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-full opacity-0 pointer-events-none'
                }`}
              >
                <ul className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <li key={item.id}>
                      {item.isExpandable ? (
                        <button
                          onClick={item.onClick}
                          className={`flex items-center justify-between w-full px-4 py-4 text-2xl font-medium transition-all duration-300 ease-out text-left ${'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                          style={{
                            transitionDelay: isAnimating
                              ? `${300 + index * 50}ms`
                              : '0ms',
                          }}
                        >
                          <span>{item.label}</span>
                          <ChevronRightIcon className="h-6 w-6" />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`block px-4 py-4 text-2xl font-medium transition-all duration-300 ease-out ${
                            isCurrentPage(item.href)
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                          style={{
                            transitionDelay: isAnimating
                              ? `${300 + index * 50}ms`
                              : '0ms',
                          }}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories View */}
              <div
                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                  currentView === 'categories'
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center mb-6">
                  <button
                    onClick={handleBackClick}
                    className="p-2 mr-3 rounded-lg text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {formatMessage({
                      id: 'categories',
                      defaultMessage: 'Categories',
                    })}
                  </h2>
                </div>
                {!assortmentsLoading && (
                  <ul className="space-y-4">
                    {rootCategories.map((category, index) => (
                      <li key={category._id}>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className="flex items-center justify-between w-full px-4 py-4 text-2xl font-medium transition-all duration-300 ease-out text-left text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          <span>{category.texts?.title}</span>
                          {getChildCategories(category.texts?.slug).length >
                            0 && <ChevronRightIcon className="h-6 w-6" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Child Categories View */}
              <div
                className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                  currentView === 'category'
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center mb-6">
                  <button
                    onClick={handleBackClick}
                    className="p-2 mr-3 rounded-lg text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {selectedCategory?.texts?.title}
                  </h2>
                </div>
                {selectedCategory && (
                  <ul className="space-y-4">
                    {/* Parent category link */}
                    <li>
                      <Link
                        href={`/shop/${selectedCategory.texts?.slug}`}
                        onClick={onClose}
                        className="block px-4 py-4 text-2xl font-medium transition-all duration-300 ease-out text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700"
                      >
                        {formatMessage({
                          id: 'view_all',
                          defaultMessage: 'View All',
                        })}{' '}
                        {selectedCategory.texts?.title}
                      </Link>
                    </li>
                    {/* Child categories */}
                    {getChildCategories(selectedCategory.texts?.slug).map(
                      (childCategory, index) => (
                        <li key={childCategory._id}>
                          <Link
                            href={`/shop/${childCategory.texts?.slug}`}
                            onClick={onClose}
                            className="block px-4 py-4 text-xl font-medium transition-all duration-300 ease-out text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                          >
                            {childCategory.texts?.title}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
            </div>
          </nav>

          {/* Footer with staggered animation */}
          <div
            className={`px-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 transition-all duration-300 delay-300 ${
              isAnimating
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            {/* Language Selector */}
            <div className="mb-4 flex flex-wrap justify-between items-center">
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {formatMessage({
                    id: 'language',
                    defaultMessage: 'Language',
                  })}
                </span>
              </div>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      locale === lang.code
                        ? 'bg-slate-200 text-slate-800 dark:bg-slate-100 dark:text-slate-900'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {formatMessage({
                  id: 'shipping_to',
                  defaultMessage: 'Shipping to',
                })}
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center">
                <span className="mr-2">🇨🇭</span>
                {formatMessage({
                  id: 'country_switzerland',
                  defaultMessage: 'Switzerland',
                })}
              </span>
            </div>

            {/* Copyright */}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarNavigation;
