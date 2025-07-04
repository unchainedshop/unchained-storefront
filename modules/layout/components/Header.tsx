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
    <header className="sticky top-0 z-[1020] overflow-visible bg-white text-black opacity-100 dark:bg-slate-600 dark:text-white print:hidden">
      <div className="relative">
        <SideCart isOpen={isCartOpen} />
        <div className="container relative mx-auto hidden w-full sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:py-2">
          <div className="flex items-center justify-start">
            <DesktopNavigation />
            <Link href="/" className="relative ml-4 h-10 w-36 rounded">
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
                className="rounded"
                loader={defaultNextImageLoader}
              />
            </Link>
          </div>
          <div className="mr-10 flex">
            <LoginCart />
          </div>
        </div>
        <div className="container flex flex-wrap items-center justify-between px-4 py-2 sm:hidden">
          <div className="flex items-center">
            <button
              type="button"
              aria-label="menu"
              className="mr-4 flex cursor-pointer appearance-none items-center border-0 bg-transparent p-0 py-1 text-left text-inherit"
              onClick={() => setNavOpen(true)}
            >
              <Bars3Icon className="h-6 w-6 text-slate-900 dark:text-slate-100" />
            </button>

            <MobileNavigation
              isNavOpen={isNavOpen}
              doClose={() => setNavOpen(false)}
            />

            <Link href="/" className="relative h-7 w-24 rounded">
              <Image
                src={theme.assets.logo}
                alt={formatMessage({
                  id: "shop_logo_mobile",
                  defaultMessage: "Shop logo",
                })}
                fill
                style={{ objectFit: "contain", objectPosition: "left" }}
                placeholder="blur"
                blurDataURL="/placeholder.png"
                className="rounded"
                loader={defaultNextImageLoader}
              />
            </Link>
          </div>

          <div className="mr-8 flex">
            <LoginCart />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
