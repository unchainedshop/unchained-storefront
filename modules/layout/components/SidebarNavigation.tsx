import React from "react";
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - Higher z-index than header */}
      <div
        className={`fixed inset-0 z-[1030] bg-black/50 transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer - Even higher z-index */}
      <div
        className={`fixed top-5 bottom-5 left-5 z-[1040] w-80 transform rounded-lg bg-slate-50 backdrop-blur-md shadow-2xl transition-all duration-500 ease-out dark:bg-slate-800/80 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Header */}
          <div className="flex justify-end mb-8">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-400 dark:hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1">
            <ul className="space-y-4">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block px-4 py-4 text-2xl font-medium transition-colors ${
                      isCurrentPage(item.href)
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="pt-6 mt-6">
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
