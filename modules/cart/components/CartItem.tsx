import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import {
  MinusIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useIntl } from 'react-intl';
import getMediaUrl from '../../common/utils/getMediaUrl';
import useRemoveCartItem from '../hooks/useRemoveCartItem';
import useUpdateCartItemMutation from '../hooks/useUpdateCartItem';
import defaultNextImageLoader from '../../common/utils/defaultNextImageLoader';
import FormattedPrice from '../../common/components/FormattedPrice';
import getProductHref from '../../common/utils/getProductHref';

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
    if (Number.isNaN(amount) || amount < 0 || e.target.value === '0') {
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
    <li
      className="flex pb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 transition-all duration-200 hover:scale-[1.01]"
      key={_id}
    >
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden shadow-sm">
        {getMediaUrl(product) ? (
          <Image
            src={getMediaUrl(product)}
            alt={product?.texts?.title}
            layout="fill"
            placeholder="blur"
            blurDataURL="/placeholder.png"
            objectFit="cover"
            loader={defaultNextImageLoader}
            className="transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="relative h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950">
            <PhotoIcon className="h-8 w-8 text-slate-300 dark:text-slate-500" />
          </div>
        )}
      </div>

      <div className="ml-6 flex flex-1 flex-col">
        <div className="flex">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm">
              <Link
                href={getProductHref(product?.texts?.slug)}
                className="font-medium text-slate-700 hover:text-slate-800 transition-colors duration-200 dark:text-slate-100 dark:hover:text-slate-300"
              >
                {product?.texts && product?.texts.title}
              </Link>
            </h4>
          </div>
          {enableUpdate ? (
            <div className="ml-4 flow-root flex-shrink-0">
              <button
                type="button"
                className="-m-2.5 flex items-center justify-center p-2.5 text-slate-400 hover:text-red-500 transition-all duration-200 hover:scale-110 hover:bg-red-50 rounded-md dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                onClick={() => removeCartItem({ itemId: _id })}
              >
                <span className="sr-only">
                  {formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
                </span>
                <TrashIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap flex-1 lg:items-end lg:justify-between pt-2">
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
            <FormattedPrice price={unitPrice} />
          </p>

          <div>
            <label htmlFor="quantity" className="sr-only">
              {formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}
            </label>
            {enableUpdate ? (
              <div className="flex flex-wrap items-end justify-between">
                <div className="flex items-end justify-center gap-1">
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 p-1 text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed dark:border-0 dark:text-slate-200"
                    aria-label="Decrease cart item"
                    disabled={currentQuantity === 1}
                    onClick={() =>
                      updateCartItem({
                        itemId: _id,
                        quantity: Math.max(quantity - 1, 1),
                      })
                    }
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <input
                    type="text"
                    pattern="\d+"
                    className="h-8 w-12 border border-slate-300 rounded-md text-center text-sm font-medium transition-all duration-200 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 dark:bg-slate-950 dark:border-0 dark:text-slate-100"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={currentQuantity}
                  />
                  <button
                    className="rounded-md border border-slate-300 p-1 text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-0 dark:text-slate-200 dark:hover:bg-slate-600"
                    aria-label="Increase cart item"
                    type="button"
                    onClick={() =>
                      updateCartItem({
                        itemId: _id,
                        quantity: quantity + 1,
                      })
                    }
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <span>{quantity}</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
