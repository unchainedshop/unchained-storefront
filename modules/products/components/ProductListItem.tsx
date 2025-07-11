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
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 dark:bg-slate-800">
        <Link href={`/product/${product?.texts?.slug}`}>
          {firstMediaUrl ? (
            <Image
              src={firstMediaUrl}
              alt={product?.texts?.title}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-300 group-hover:opacity-75"
              loader={defaultNextImageLoader}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PhotoIcon className="h-12 w-12 text-gray-400 dark:text-slate-500" />
            </div>
          )}
        </Link>

        {!disableBookmark && (
          <button
            type="button"
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 hover:shadow-md dark:bg-slate-800/90"
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
              className={classNames("h-4 w-4", {
                "text-red-500 hover:text-red-600": filteredBookmark,
                "text-gray-600 hover:text-gray-800 dark:text-slate-300 dark:hover:text-white":
                  !filteredBookmark,
              })}
            />
          </button>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <Link href={`/product/${product?.texts?.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 transition-colors duration-200 hover:text-gray-700 dark:text-white dark:hover:text-gray-200">
            {product?.texts?.title}
          </h3>
        </Link>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <FormattedPrice price={product?.simulatedPrice} />
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
