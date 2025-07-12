import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface SidebarNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  isOpen,
  onClose,
}) => {
  const { formatMessage } = useIntl();
  const router = useRouter();
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

  const navigationItems = [
    {
      id: "home",
      label: formatMessage({ id: "nav_home", defaultMessage: "Home" }),
      href: "/",
    },
    {
      id: "store",
      label: formatMessage({ id: "nav_store", defaultMessage: "Store" }),
      href: "/shop",
    },
    {
      id: "styleguide",
      label: formatMessage({
        id: "nav_styleguide",
        defaultMessage: "Styleguide",
      }),
      href: "/styleguide",
    },
    {
      id: "bookmarks",
      label: formatMessage({
        id: "nav_bookmarks",
        defaultMessage: "Bookmarks",
      }),
      href: "/bookmarks",
    },
    {
      id: "account",
      label: formatMessage({ id: "nav_account", defaultMessage: "Account" }),
      href: "/account",
    },
  ];

  const isCurrentPage = (href: string) => {
    if (href === "/") {
      return router.pathname === "/";
    }
    return router.pathname.startsWith(href);
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop with smooth fade */}
      <div
        className={`fixed inset-0 z-[1030] bg-slate-950/50 backdrop-blur-sm transition-all duration-300 ease-out ${
          isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer - Even higher z-index */}
      <div
        className={`fixed top-5 bottom-5 left-5 z-[1040] w-80 lg:w-96 transform rounded-lg bg-slate-50 backdrop-blur-md shadow-2xl transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] dark:bg-slate-900/80 ${
          isAnimating
            ? "translate-x-0 opacity-100 scale-100"
            : "-translate-x-16 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Header with staggered animation */}
          <div
            className={`flex justify-end mb-8 transition-all duration-300 delay-100 ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
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
            className={`flex-1 transition-all duration-300 delay-200 ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <ul className="space-y-4">
              {navigationItems.map((item, index) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block px-4 py-4 text-2xl font-medium transition-all duration-300 ease-out ${
                      isCurrentPage(item.href)
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                    style={{
                      transitionDelay: isAnimating
                        ? `${300 + index * 50}ms`
                        : "0ms",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer with staggered animation */}
          <div
            className={`pt-6 mt-6 transition-all duration-300 delay-300 ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {formatMessage({
                  id: "shipping_to",
                  defaultMessage: "Shipping to:",
                })}
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center">
                <span className="mr-2">🇨🇭</span>
                {formatMessage({
                  id: "country_switzerland",
                  defaultMessage: "Switzerland",
                })}
              </span>
            </div>
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
