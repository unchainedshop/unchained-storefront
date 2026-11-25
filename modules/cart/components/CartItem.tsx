import Image from 'next/legacy/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MinusIcon, PhotoIcon, PlusIcon } from '@heroicons/react/20/solid';
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
  total = null,
  enableUpdate = true,
}) => {
  const { updateCartItem } = useUpdateCartItemMutation();
  const { removeCartItem } = useRemoveCartItem();
  // Local buffer so the user can type freely; the committed quantity always
  // comes from the `quantity` prop (the Apollo-cached server value).
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const { formatMessage } = useIntl();
  const imageUrl = getMediaUrl(product);
  const href = getProductHref(product?.texts?.slug);

  useEffect(() => {
    setCurrentQuantity(quantity);
  }, [quantity]);

  const commitQuantity = () => {
    const amount = parseInt(currentQuantity, 10);
    const newValue = Number.isNaN(amount) || amount < 1 ? 1 : amount;
    setCurrentQuantity(newValue);
    if (newValue !== quantity) updateCartItem({ itemId: _id, quantity: newValue });
  };

  return (
    <li className="flex gap-4 py-4">
      <Link
        href={href}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product?.texts?.title}
            layout="fill"
            placeholder="blur"
            blurDataURL="/placeholder.png"
            objectFit="cover"
            loader={defaultNextImageLoader}
          />
        ) : (
          <span className="flex size-full items-center justify-center">
            <PhotoIcon className="size-8 text-subtle-foreground" />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={href}
              className="line-clamp-2 text-sm font-medium text-foreground hover:text-accent"
            >
              {product?.texts?.title}
            </Link>
            <p className="mt-0.5 text-sm text-muted-foreground">
              <FormattedPrice price={unitPrice} />
            </p>
          </div>
          {total && (
            <p className="text-sm font-semibold text-foreground">
              <FormattedPrice price={total} />
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          {enableUpdate ? (
            <>
              <div className="inline-flex items-center rounded-full border border-input">
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground disabled:opacity-40"
                  aria-label={formatMessage({ id: 'decrease_quantity', defaultMessage: 'Decrease quantity' })}
                  disabled={quantity <= 1}
                  onClick={() => updateCartItem({ itemId: _id, quantity: Math.max(quantity - 1, 1) })}
                >
                  <MinusIcon className="size-4" />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d+"
                  aria-label={formatMessage({ id: 'quantity', defaultMessage: 'Quantity' })}
                  className="w-8 bg-transparent text-center text-sm font-medium focus:outline-none"
                  onBlur={commitQuantity}
                  onKeyDown={(e) => e.key === 'Enter' && commitQuantity()}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                  value={currentQuantity}
                />
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                  aria-label={formatMessage({ id: 'increase_quantity', defaultMessage: 'Increase quantity' })}
                  onClick={() => updateCartItem({ itemId: _id, quantity: quantity + 1 })}
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:text-danger"
                onClick={() => removeCartItem({ itemId: _id })}
              >
                {formatMessage({ id: 'remove', defaultMessage: 'Remove' })}
              </button>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              {formatMessage(
                { id: 'quantity_short', defaultMessage: 'Qty: {quantity}' },
                { quantity },
              )}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default CartItem;
