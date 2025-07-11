import Link from "next/link";

import { useIntl } from "react-intl";
import classNames from "classnames";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useUser from "../../auth/hooks/useUser";
import CartItem from "./CartItem";
import { useAppContext } from "../../common/components/AppContextWrapper";
import FormattedPrice from "../../common/components/FormattedPrice";

const SideCart = ({ isOpen }) => {
  const { user } = useUser();
  const intl = useIntl();
  const { isCartOpen, toggleCart } = useAppContext();

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[1050] bg-black/50 transition-opacity duration-500 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => toggleCart(false)}
      />
      {!user?.cart?.items.length ? (
        <div
          className={`px-4 fixed top-5 bottom-5 right-5 z-[1060] w-96 transform rounded-lg bg-white/95 backdrop-blur-md shadow-xl transition-all duration-500 ease-out dark:bg-slate-800/95 ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          } flex flex-col gap-4 items-center justify-center text-center`}
        >
          <ShoppingBagIcon className="h-6 w-6" />
          <p>
            {intl.formatMessage({
              id: "no_product_in_cart",
              defaultMessage: "There are no products in your Cart. Browse our",
            })}{" "}
            <Link
              href="/shop"
              onClick={() => toggleCart(false)}
              className="cursor-pointer font-normal underline"
            >
              {intl.formatMessage({ id: "shop", defaultMessage: "Shop" })}
            </Link>
          </p>
        </div>
      ) : (
        <div
          className={`fixed top-5 bottom-5 right-5 z-[1060] w-96 transform rounded-lg bg-white/95 backdrop-blur-md shadow-xl transition-all duration-500 ease-out dark:bg-slate-800/95 ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          } flex flex-col overflow-y-auto`}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {intl.formatMessage({
                id: "in_cart",
                defaultMessage: "Cart",
              })}
            </h3>
            <button
              aria-label={intl.formatMessage({
                id: "close",
                defaultMessage: "Close",
              })}
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-white"
              onClick={() => toggleCart(!isCartOpen)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {user?.cart?.items.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300">
                {intl.formatMessage({
                  id: "no_product_in_cart",
                  defaultMessage:
                    "There are no products in your Cart. Browse our",
                })}{" "}
                <Link
                  href="/shop"
                  onClick={() => toggleCart(false)}
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  {intl.formatMessage({
                    id: "shop",
                    defaultMessage: "Shop",
                  })}
                </Link>
              </p>
            ) : (
              <div className="space-y-4">
                {(user?.cart?.items || []).map((item) => (
                  <CartItem key={item._id} {...item} />
                ))}
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 p-6 dark:border-gray-600">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-base font-medium text-gray-900 dark:text-white">
                {intl.formatMessage({
                  id: "subtotal",
                  defaultMessage: "Subtotal",
                })}
              </span>
              <FormattedPrice price={user?.cart?.itemsTotal} />
            </div>
            <Link
              href={{ pathname: "/checkout" }}
              className="block w-full rounded-md bg-slate-900 py-3 px-4 text-center text-base font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={() => toggleCart(false)}
            >
              {intl.formatMessage({
                id: "to_checkout",
                defaultMessage: "Checkout",
              })}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SideCart;
