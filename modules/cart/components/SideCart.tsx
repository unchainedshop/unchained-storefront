import { Fragment } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { useIntl } from "react-intl";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useUser from "../../auth/hooks/useUser";
import CartItem from "./CartItem";
import { useAppContext } from "../../common/components/AppContextWrapper";
import FormattedPrice from "../../common/components/FormattedPrice";

const SideCart = ({ isOpen }) => {
  const { user } = useUser();
  const intl = useIntl();
  const { toggleCart } = useAppContext();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => toggleCart(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl dark:bg-gray-800">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                          {intl.formatMessage({
                            id: "shopping_cart",
                            defaultMessage: "Shopping cart",
                          })}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => toggleCart(false)}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {!user?.cart?.items.length ? (
                        <div className="mt-8 flex flex-col items-center justify-center">
                          <ShoppingBagIcon
                            className="h-12 w-12 text-gray-400"
                            aria-hidden="true"
                          />
                          <p className="mt-4 text-center text-gray-500">
                            {intl.formatMessage({
                              id: "no_product_in_cart",
                              defaultMessage: "Your cart is empty",
                            })}
                          </p>
                          <Link
                            href="/shop"
                            onClick={() => toggleCart(false)}
                            className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            {intl.formatMessage({
                              id: "continue_shopping",
                              defaultMessage: "Continue Shopping",
                            })}
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200 dark:divide-gray-700"
                            >
                              {(user?.cart?.items || []).map((item) => (
                                <li key={item._id} className="py-6">
                                  <CartItem {...item} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>

                    {user?.cart?.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6 dark:border-gray-700">
                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                          <p>
                            {intl.formatMessage({
                              id: "subtotal",
                              defaultMessage: "Subtotal",
                            })}
                          </p>
                          <p>
                            <FormattedPrice price={user?.cart?.itemsTotal} />
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {intl.formatMessage({
                            id: "shipping_calculated_at_checkout",
                            defaultMessage:
                              "Shipping and taxes calculated at checkout.",
                          })}
                        </p>
                        <div className="mt-6">
                          <Link
                            href="/checkout"
                            onClick={() => toggleCart(false)}
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          >
                            {intl.formatMessage({
                              id: "checkout",
                              defaultMessage: "Checkout",
                            })}
                          </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            {intl.formatMessage({
                              id: "or",
                              defaultMessage: "or",
                            })}
                            <button
                              type="button"
                              className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => toggleCart(false)}
                            >
                              {intl.formatMessage({
                                id: "continue_shopping",
                                defaultMessage: "Continue Shopping",
                              })}
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SideCart;
