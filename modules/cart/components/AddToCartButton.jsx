import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import {
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  CogIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import useUnchainedAddToCartButton from "../hooks/useUnchainedAddToCartButton";

const AddToCartButton = ({ productId, ...product }) => {
  const { formatMessage } = useIntl();
  const {
    submitForm,
    increaseQuantity,
    decreaseQuantity,
    changeQuantity,
    isAddInProgress,
    isAddedToCart,
    maxQuantity,
    quantity,
  } = useUnchainedAddToCartButton({ productId });
  const router = useRouter();
  const coverImageSrc = product?.media?.[0]?.file?.url || "/no-image.jpg";
  const coverImageTitle = product?.media?.[0]?.texts?.title || "product image";
  const productTitle = product?.texts?.title;
  const productSubTitle = product?.texts?.subTitle;

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    await submitForm();
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-lg w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 animate-enter`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={coverImageSrc}
                alt={coverImageTitle}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium ">
                {productTitle}
                <div className="mt-2 text-sm font-medium text-green-600">
                  {quantity} x{" "}
                  {formatMessage({
                    id: "added-to-cart",
                    defaultMessage: "Added to cart",
                  })}
                </div>
              </p>
              <p className="mt-1 text-sm text-slate-500">{productSubTitle}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-slate-200">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              router.push("/checkout");
            }}
            className="bg-white border border-transparent rounded-none rounded-r-lg p-4 justify-center flex-col align-middle text-sm font-medium text-slate-600 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800"
          >
            <svg
              className="h-6 w-6 inline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>

            <div className="w-20">
              {formatMessage({
                id: "checkout",
                defaultMessage: "Checkout",
              })}
            </div>
          </button>
        </div>
      </div>
    ));
  };

  return (
    <form onSubmit={onSubmit} className="mt-10">
      {/* Options */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          {formatMessage({ id: "quantity", defaultMessage: "Quantity" })}
        </h3>
        <div className="mt-2 flex items-center">
          <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-l-md border-r border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Decrease quantity</span>
              <MinusIcon className="h-4 w-4" />
            </button>
            <input
              type="text"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={changeQuantity}
              className="h-10 w-16 border-0 text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity}
              className="flex h-10 w-10 items-center justify-center rounded-r-md border-l border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Increase quantity</span>
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isAddInProgress}
        className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAddInProgress ? (
          <CogIcon className="h-5 w-5 animate-spin" />
        ) : isAddedToCart ? (
          <>
            <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
            {formatMessage({ id: "added", defaultMessage: "Added!" })}
          </>
        ) : (
          <>
            <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" />
            {formatMessage({
              id: "add-to-cart",
              defaultMessage: "Add to Cart",
            })}
          </>
        )}
      </button>
    </form>
  );
};

export default AddToCartButton;
