import { BookmarkIcon, PhotoIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import Image from "next/legacy/image";
import Link from "next/link";

import useUser from "../../auth/hooks/useUser";
import useConditionalBookmarkProduct from "../../cart/hooks/useConditionalBookmarkProduct";
import useRemoveBookmark from "../../common/hooks/useRemoveBookmark";
import defaultNextImageLoader from "../../common/utils/defaultNextImageLoader";
import FormattedPrice from "../../common/components/FormattedPrice";

const ProductListItem = ({ product, disableBookmark = false }) => {
  const { conditionalBookmarkProduct } = useConditionalBookmarkProduct();
  const { removeBookmark } = useRemoveBookmark();

  const { user } = useUser();

  const [filteredBookmark] =
    user?.bookmarks?.filter(
      (bookmark) => bookmark?.product?._id === product?._id,
    ) || [];

  const firstMediaUrl = product?.media?.[0]?.file?.url;

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Link href={`/product/${product?.texts?.slug}`}>
          {firstMediaUrl ? (
            <Image
              src={firstMediaUrl}
              alt={product?.texts?.title}
              layout="fill"
              placeholder="blur"
              blurDataURL="placeholder.png"
              objectFit="cover"
              className="h-full w-full object-cover object-center group-hover:opacity-75"
              loader={defaultNextImageLoader}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
              <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </Link>
        {!disableBookmark && (
          <button
            type="button"
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white bg-opacity-75 backdrop-blur backdrop-filter hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() =>
              filteredBookmark
                ? removeBookmark({
                    bookmarkId: filteredBookmark?._id,
                  })
                : conditionalBookmarkProduct({
                    productId: product?._id,
                  })
            }
          >
            <BookmarkIcon
              className={classNames("h-5 w-5", {
                "text-indigo-600": filteredBookmark,
                "text-gray-400 hover:text-gray-500": !filteredBookmark,
              })}
              aria-hidden="true"
            />
            <span className="sr-only">
              {filteredBookmark ? "Remove from wishlist" : "Add to wishlist"}
            </span>
          </button>
        )}
      </div>
      <h3 className="mt-4 text-sm text-gray-700 dark:text-gray-200">
        <Link href={`/product/${product?.texts?.slug}`}>
          <span aria-hidden="true" className="absolute inset-0" />
          {product?.texts?.title}
        </Link>
      </h3>
      {product?.texts?.subtitle && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {product?.texts?.subtitle}
        </p>
      )}
      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
        <FormattedPrice price={product?.simulatedPrice} />
      </p>
    </div>
  );
};

export default ProductListItem;
