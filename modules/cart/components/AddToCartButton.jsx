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
import Button from "../../common/components/Button";

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
    toast.custom(
      (t) => (
        <div className="fixed top-20 left-0 right-0 z-[1060] pointer-events-none">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end">
              <div
                className={`w-full sm:w-96 pointer-events-auto transform rounded-lg bg-white/95 backdrop-blur-md shadow-xl transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] dark:bg-slate-900/95 ${
                  t.visible
                    ? "translate-x-0 opacity-100 scale-100"
                    : "translate-x-16 opacity-0 scale-95"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-md object-cover"
                        src={coverImageSrc}
                        alt={coverImageTitle}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
                        {productTitle}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate">
                        {productSubTitle}
                      </p>
                      <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                        {quantity} x{" "}
                        {formatMessage({
                          id: "added-to-cart",
                          defaultMessage: "Added to cart",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => toast.dismiss(t.id)}
                      className="flex-1 rounded-md border border-slate-200 bg-white py-2 px-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {formatMessage({
                        id: "continue_shopping",
                        defaultMessage: "Continue Shopping",
                      })}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        toast.dismiss(t.id);
                        router.push("/checkout");
                      }}
                      className="flex-1 rounded-md bg-slate-900 py-2 px-3 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                    >
                      {formatMessage({
                        id: "to_checkout",
                        defaultMessage: "Checkout",
                      })}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 4000,
        position: "top-right",
      }
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="flex gap-3" disabled={isAddInProgress}>
        <div className="flex items-center border-slate-300 dark:border-slate-800 border rounded-md">
          <button
            aria-label="decrease"
            type="button"
            onClick={decreaseQuantity}
            className="w-20 h-9 hover:bg-white dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800 rounded-md flex items-center justify-center transition-all duration-200 ease-in-out"
          >
            <span
              aria-label="minus icon"
              className="transition-transform duration-200 ease-in-out"
            >
              <MinusIcon className="h-5 w-5" />
            </span>
          </button>

          <input
            className="rounded-md text-center block w-full py-2 -my-px mx-[2px] border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-800 sm:text-sm bg-white dark:bg-slate-950 dark:text-white transition-all duration-200 ease-in-out"
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
            className="w-20 h-9 hover:bg-white dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-800 rounded-md flex items-center justify-center transition-all duration-200 ease-in-out"
          >
            <span
              aria-label="plus icon"
              className="transition-transform duration-200 ease-in-out"
            >
              <PlusIcon className="h-5 w-5" />
            </span>
          </button>
        </div>

        <Button
          type="submit"
          variant={isAddedToCart ? "success" : "primary"}
          size="small"
          disabled={isAddInProgress}
          className="rounded-b-md shadow-xs transition-all duration-300 ease-in-out"
          aria-label="add-to-cart"
          fullWidth={true}
        >
          {!isAddInProgress && !isAddedToCart && (
            <>
              <ShoppingCartIcon className="h-5 w-5 mr-2" />
              {formatMessage({
                id: "add-to-cart",
                defaultMessage: "Add to Cart",
              })}
            </>
          )}
          {isAddedToCart && !isAddInProgress && (
            <CheckCircleIcon className="h-5 w-5 animate-bounce" />
          )}
          {isAddInProgress && <CogIcon className="h-5 w-5 animate-spin" />}
        </Button>
      </fieldset>
    </form>
  );
};

export default AddToCartButton;
