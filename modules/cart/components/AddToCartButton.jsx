import React from "react";
import { MinusIcon, PlusIcon, CheckIcon, ShoppingBagIcon } from "@heroicons/react/20/solid";
import { useIntl } from "react-intl";
import useUnchainedAddToCartButton from "../hooks/useUnchainedAddToCartButton";
import { useAppContext } from "../../common/components/AppContextWrapper";

const AddToCartButton = ({ productId, disabled = false }) => {
  const { formatMessage } = useIntl();
  const { toggleCart } = useAppContext();
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (await submitForm()) toggleCart(true);
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="flex gap-3" disabled={isAddInProgress || disabled}>
        <div className="inline-flex items-center rounded-full border border-input bg-surface">
          <button
            type="button"
            aria-label={formatMessage({ id: "decrease_quantity", defaultMessage: "Decrease quantity" })}
            onClick={decreaseQuantity}
            className="flex size-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <MinusIcon className="size-4" />
          </button>
          <input
            type="text"
            inputMode="numeric"
            aria-label={formatMessage({ id: "quantity", defaultMessage: "Quantity" })}
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={changeQuantity}
            className="w-10 bg-transparent text-center font-semibold focus:outline-none"
          />
          <button
            type="button"
            aria-label={formatMessage({ id: "increase_quantity", defaultMessage: "Increase quantity" })}
            onClick={increaseQuantity}
            className="flex size-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>

        <button
          type="submit"
          aria-busy={isAddInProgress}
          className={`btn btn-lg flex-1 rounded-full ${isAddedToCart ? "btn-success" : "btn-primary"}`}
        >
          {isAddInProgress ? (
            <span className="size-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
          ) : isAddedToCart ? (
            <>
              <CheckIcon className="size-5" />
              {formatMessage({ id: "added-to-cart", defaultMessage: "Added to cart" })}
            </>
          ) : (
            <>
              <ShoppingBagIcon className="size-5" />
              {formatMessage({ id: "add-to-cart", defaultMessage: "Add to Cart" })}
            </>
          )}
        </button>
      </fieldset>
    </form>
  );
};

export default AddToCartButton;
