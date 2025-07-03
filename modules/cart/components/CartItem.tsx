import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import {
  MinusIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useIntl } from "react-intl";
import getMediaUrl from "../../common/utils/getMediaUrl";
import useRemoveCartItem from "../hooks/useRemoveCartItem";
import useUpdateCartItemMutation from "../hooks/useUpdateCartItem";
import defaultNextImageLoader from "../../common/utils/defaultNextImageLoader";
import FormattedPrice from "../../common/components/FormattedPrice";

const CartItem = ({
  _id,
  quantity,
  product,
  unitPrice,
  enableUpdate = true,
}) => {
  const { updateCartItem } = useUpdateCartItemMutation();
  const { removeCartItem } = useRemoveCartItem();
  const [previousQuantity, setPreviousQuantity] = useState(quantity);
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const { formatMessage } = useIntl();

  const handleChange = (e) => {
    const amount = e.target.value;
    setCurrentQuantity(amount);
  };
  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  const handleBlur = (e) => {
    const amount = parseFloat(currentQuantity);
    let newValue = 0;
    if (Number.isNaN(amount) || amount < 0 || e.target.value === "0") {
      newValue = 1;
      setCurrentQuantity(1);
    } else {
      newValue = 0;
      const difference = Math.abs(amount - previousQuantity);
      if (previousQuantity < amount) {
        newValue = previousQuantity + difference;
      } else {
        newValue = previousQuantity - difference;
      }
    }
    if (previousQuantity !== newValue) {
      updateCartItem({
        itemId: _id,
        quantity: newValue,
      });

      setPreviousQuantity(amount);
    }
  };

  return (
    <div className="flex">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
        {getMediaUrl(product) ? (
          <Image
            src={getMediaUrl(product)}
            alt={product?.texts?.title}
            layout="fill"
            placeholder="blur"
            blurDataURL="/placeholder.png"
            objectFit="cover"
            loader={defaultNextImageLoader}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
            <PhotoIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
            <h3>
              <Link href={`/product/${product?.texts?.slug}`}>
                {product?.texts?.title}
              </Link>
            </h3>
            <p className="ml-4">
              <FormattedPrice price={unitPrice} />
            </p>
          </div>
          {product?.texts?.subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {product?.texts?.subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          {enableUpdate ? (
            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  updateCartItem({
                    itemId: _id,
                    quantity: Math.max(quantity - 1, 1),
                  })
                }
                disabled={currentQuantity === 1}
                className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <span className="sr-only">Decrease quantity</span>
                <MinusIcon className="h-4 w-4" />
              </button>
              <input
                type="text"
                pattern="\d+"
                className="h-8 w-12 border-y border-gray-300 text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                onBlur={handleBlur}
                onChange={handleChange}
                value={currentQuantity}
              />
              <button
                type="button"
                onClick={() =>
                  updateCartItem({
                    itemId: _id,
                    quantity: quantity + 1,
                  })
                }
                className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <span className="sr-only">Increase quantity</span>
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <p className="text-gray-500">
              {formatMessage({ id: "qty", defaultMessage: "Qty" })} {quantity}
            </p>
          )}

          {enableUpdate && (
            <div className="flex">
              <button
                type="button"
                onClick={() => removeCartItem({ itemId: _id })}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {formatMessage({ id: "remove", defaultMessage: "Remove" })}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
