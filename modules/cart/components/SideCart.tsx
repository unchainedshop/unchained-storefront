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

  return (
    <>
      <div
        className={classNames({
          "fixed top-0 right-0 bottom-0 left-0 z-50 cursor-pointer bg-black opacity-0":
            isOpen,
        })}
        onClick={() => toggleCart(false)}
      />
      {!user?.cart?.items.length ? (
        <div
          className={classNames(
            "fixed top-0 -right-80 z-50 flex h-full w-[300px] flex-col items-center justify-center overflow-y-auto bg-white py-3 px-2 text-center opacity-100 shadow-md transition dark:bg-slate-600 lg:-right-[450px] lg:w-[400px]",
            {
              "right-0 lg:right-0": isOpen,
            },
          )}
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
          className={classNames(
            "fixed top-0 -right-80 z-50 flex h-full w-[300px] flex-col overflow-y-auto bg-white  bg-opacity-100 px-1 shadow-md transition dark:bg-slate-600 dark:opacity-100 lg:-right-[450px] lg:w-[400px]",
            {
              "isOpen lg:right-0": isOpen,
            },
          )}
        >
          <div>
            <div className="relative">
              <button
                aria-label={intl.formatMessage({
                  id: "close",
                  defaultMessage: "Close",
                })}
                type="button"
                className="absolute cursor-pointer appearance-none p-2 text-left text-inherit opacity-100"
                onClick={() => toggleCart(!isCartOpen)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <h3 className="m-0 block p-4 text-center text-lg">
              {intl.formatMessage({
                id: "in_cart",
                defaultMessage: "Cart",
              })}
            </h3>
          </div>
          <div className="px-2">
            {user?.cart?.items.length === 0 ? (
              <p>
                {intl.formatMessage({
                  id: "no_product_in_cart",
                  defaultMessage:
                    "There are no products in your Cart. Browse our",
                })}{" "}
                <Link
                  href="/shop"
                  onClick={() => toggleCart(false)}
                  className="cursor-pointer font-normal underline"
                >
                  {intl.formatMessage({
                    id: "shop",
                    defaultMessage: "Shop",
                  })}
                  .
                </Link>
              </p>
            ) : (
              (user?.cart?.items || []).map((item) => (
                <CartItem key={item._id} {...item} />
              ))
            )}
          </div>
          <div className="p-2 text-center text-slate-900 dark:text-slate-100">
            <div className="my-0 mb-4 border-t border-b-0 border-solid py-4">
              <div className="flex flex-wrap items-center justify-between">
                <div className="mr-2">
                  {intl.formatMessage({
                    id: "subtotal",
                    defaultMessage: "Subtotal",
                  })}{" "}
                </div>
                <div>
                  <FormattedPrice price={user?.cart?.itemsTotal} />
                </div>
              </div>
            </div>
            <Link
              href={{ pathname: "/checkout" }}
              type="button"
              className="mb-4 block w-full rounded-md border border-transparent bg-slate-600 py-2 px-4 text-base font-medium uppercase text-white shadow-xs hover:bg-slate-700 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              onClick={() => toggleCart(false)}
            >
              {intl.formatMessage({
                id: "to_checkout",
                defaultMessage: "To checkout",
              })}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default SideCart;
