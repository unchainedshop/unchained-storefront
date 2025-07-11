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
        } max-w-lg w-full bg-white shadow-lg rounded-lg pointer-events-auto flex animate-enter`}
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
        <div className="flex">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              router.push("/checkout");
            }}
            className="bg-white rounded-none rounded-r-lg p-4 justify-center flex-col align-middle text-sm font-medium text-slate-600 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-800"
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
    <form onSubmit={onSubmit}>
      <fieldset disabled={isAddInProgress}>
        <div className="flex items-center border-slate-300 border rounded-t-md">
          <button
            aria-label="decrease"
            type="button"
            onClick={decreaseQuantity}
            className="w-20 h-9 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 rounded-tl-md flex items-center justify-center transition-all duration-200 ease-in-out"
          >
            <span
              aria-label="minus icon"
              className="transition-transform duration-200 ease-in-out"
            >
              <MinusIcon className="h-5 w-5" />
            </span>
          </button>

          <input
            className="text-center block w-full -my-px mx-[2px] border-slate-300 focus:ring-slate-800 sm:text-sm bg-white transition-all duration-200 ease-in-out"
            type="text"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={changeQuantity}
          />
          <button
            aria-label="increase"
            type="button"
            onClick={increaseQuantity}
            className="w-20 h-9 hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 rounded-tr-md flex items-center justify-center transition-all duration-200 ease-in-out"
          >
            <span
              aria-label="plus icon"
              className="transition-transform duration-200 ease-in-out"
            >
              <PlusIcon className="h-5 w-5" />
            </span>
          </button>
        </div>

        <button
          className={`w-full inline-flex items-center rounded-b-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-300 ease-in-out ${
            isAddInProgress
              ? "bg-slate-600"
              : isAddedToCart
                ? "bg-green-600 hover:bg-green-700"
                : "bg-slate-900 hover:bg-slate-800"
          }`}
          aria-label="add-to-cart"
          type="submit"
        >
          {!isAddInProgress && !isAddedToCart && (
            <span
              aria-label="ok icon"
              className="flex justify-center w-full transition-all duration-300 ease-in-out"
            >
              <ShoppingCartIcon className="inline-block -ml-1 mr-2 h-5 w-5 transition-transform duration-200 ease-in-out" />
              {formatMessage({
                id: "add-to-cart",
                defaultMessage: "Add to Cart",
              })}
            </span>
          )}
          {isAddedToCart && !isAddInProgress && (
            <span
              aria-label="success icon"
              className="flex justify-center w-full animate-pulse"
            >
              <CheckCircleIcon className="h-5 w-5 transition-all duration-300 ease-in-out animate-bounce" />
            </span>
          )}
          {isAddInProgress && (
            <span
              aria-label="loading icon"
              className="flex justify-center w-full"
            >
              <CogIcon className="h-5 w-5 animate-spin transition-all duration-300 ease-in-out" />
            </span>
          )}
        </button>
      </fieldset>
    </form>
  );
};

export default AddToCartButton;
