import Link from "next/link";
import getConfig from "next/config";
import { useState } from "react";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

import { Bars3Icon } from "@heroicons/react/20/solid";
import Image from "next/image";
import LoginCart from "../../auth/components/LoginCart";
import SideCart from "../../cart/components/SideCart";
import DesktopNavigation from "../../assortment/components/DesktopNavigation";
import MobileNavigation from "../../assortment/components/MobileNavigation";
import defaultNextImageLoader from "../../common/utils/defaultNextImageLoader";

import { useAppContext } from "../../common/components/AppContextWrapper";

const {
  publicRuntimeConfig: { theme },
} = getConfig();

const Header = () => {
  const { isCartOpen } = useAppContext();
  const router = useRouter();
  const [isNavOpen, setNavOpenState] = useState(false);
  const { formatMessage } = useIntl();

  const setNavOpen = (isOpen) => {
    setNavOpenState(isOpen);
  };

  if (router?.events) {
    router.events.on("routeChangeStart", () => setNavOpen(false));
  }
  return (
    <header className="bg-white shadow-sm dark:bg-gray-900 print:hidden">
      <div className="relative">
        <SideCart isOpen={isCartOpen} />

        {/* Desktop navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="relative block h-8 w-32">
                  <Image
                    src={theme.assets.logo}
                    alt={formatMessage({
                      id: "shop_logo",
                      defaultMessage: "Shop logo",
                    })}
                    fill
                    style={{ objectFit: "contain", objectPosition: "left" }}
                    placeholder="blur"
                    blurDataURL="/placeholder.png"
                    className="h-8 w-auto"
                    loader={defaultNextImageLoader}
                  />
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <DesktopNavigation />
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <LoginCart />
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <MobileNavigation
              isNavOpen={isNavOpen}
              doClose={() => setNavOpen(false)}
            />
          </div>
          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center px-5">
              <LoginCart />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
