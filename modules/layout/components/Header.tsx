import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

import { Bars3Icon } from "@heroicons/react/20/solid";
import LoginCart from "../../auth/components/LoginCart";
import SideCart from "../../cart/components/SideCart";

import { useAppContext } from "../../common/components/AppContextWrapper";

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { isCartOpen } = useAppContext();
  const router = useRouter();
  const { formatMessage } = useIntl();
  return (
    <header className="sticky top-0 z-[1020] border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95 print:hidden">
      <div className="relative">
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid h-16 grid-cols-3 items-center">
              <div className="flex justify-start">
                <button
                  type="button"
                  aria-label="menu"
                  className="rounded-md p-2 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  onClick={onSidebarToggle}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/"
                  className="text-xl font-semibold text-slate-900 dark:text-white"
                >
                  {formatMessage({
                    id: "shop_title",
                    defaultMessage: "Unchained Store",
                  })}
                </Link>
              </div>

              <div className="flex justify-end">
                <LoginCart />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="grid h-16 grid-cols-3 items-center px-4">
            <div className="flex justify-start">
              <button
                type="button"
                aria-label="menu"
                className="rounded-md p-2 text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                onClick={onSidebarToggle}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex justify-center">
              <Link
                href="/"
                className="text-md font-semibold text-slate-900 dark:text-white"
              >
                {formatMessage({
                  id: "shop_title",
                  defaultMessage: "Unchained Store",
                })}
              </Link>
            </div>

            <div className="flex justify-end">
              <LoginCart />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
